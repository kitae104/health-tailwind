import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

const MyAppointments = () => {

    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await apiService.getMyAppointments();

            if (response.data.statusCode === 200) {
                setAppointments(response.data.data);
            } else {
                setError('예약 정보를 불러오는 데 실패했습니다.');
            }
        } catch (error) {
            setError('예약 정보를 불러오는 중 오류가 발생했습니다.');
        }
    };

    const formatDateTime = (dateTimeString) => {
        return new Date(dateTimeString).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'SCHEDULED': { class: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: '예약됨' },
            'COMPLETED': { class: 'bg-teal-100 text-teal-800 border-teal-200', text: '완료' },
            'CANCELLED': { class: 'bg-red-100 text-red-800 border-red-200', text: '취소됨' },
            'IN_PROGRESS': { class: 'bg-green-100 text-green-800 border-green-200', text: '진행 중' }
        };

        const config = statusConfig[status] || { class: 'bg-gray-100 text-gray-800 border-gray-200', text: status };
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.class}`}>{config.text}</span>;
    };

    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm('정말로 이 예약을 취소하시겠습니까?')) {
            return;
        }

        try {
            const response = await apiService.cancelAppointment(appointmentId);

            if (response.data.statusCode === 200) {
                alert('예약이 성공적으로 취소되었습니다.');
                fetchAppointments(); // 예약 목록 갱신
            } else {
                setError('예약 취소에 실패했습니다.');
            }
        } catch (error) {
            setError('예약 취소 중 오류가 발생했습니다.');
        }
    };

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-5 py-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-5 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">내 예약 정보</h1>
                    <Link to="/book-appointment" className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-4 py-2 rounded-md font-semibold">새 예약하기</Link>
                </div>

                {appointments.length === 0 ? (
                    <div className="p-8 text-center text-gray-600">
                        <h3 className="text-xl font-semibold">예약 내역이 없습니다</h3>
                        <p className="mt-2">아직 예약한 내역이 없습니다.</p>
                        <Link to="/book-appointment" className="inline-block mt-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-4 py-2 rounded-md">첫 예약하기</Link>
                    </div>
                ) : (
                    <div className="p-6">
                        {appointments.map((appointment) => (
                            <div key={appointment.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                        <h3 className="text-lg font-semibold">Dr. {appointment.doctor.lastName} {appointment.doctor.firstName}</h3>
                                        <p className="text-sm text-gray-600">{appointment.doctor.specialization?.replace(/_/g, ' ')}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(appointment.status)}
                                        {appointment.status === 'SCHEDULED' && (
                                            <button
                                                onClick={() => handleCancelAppointment(appointment.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                            >
                                                취소
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-600">날짜 및 시간</div>
                                        <div className="mt-1">{formatDateTime(appointment.startTime)}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">소요 시간</div>
                                        <div className="mt-1">1시간</div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="text-sm text-gray-600">상담 목적</div>
                                        <div className="mt-1">{appointment.purposeOfConsultation}</div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="text-sm text-gray-600">증상</div>
                                        <div className="mt-1">{appointment.initialSymptoms}</div>
                                    </div>

                                    {appointment.meetingLink && appointment.status === 'SCHEDULED' && (
                                        <div className="md:col-span-2">
                                            <div className="text-sm text-gray-600">진료 링크</div>
                                            <a
                                                href={appointment.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#3498db] font-medium"
                                            >
                                                화상 진료 참여
                                            </a>
                                        </div>
                                    )}

                                    {appointment.status === 'COMPLETED' && (
                                        <div className="md:col-span-2 text-right">
                                            <Link
                                                to={`/consultation-history?appointmentId=${appointment.id}`}
                                                className="inline-block border border-[#3498db] text-[#3498db] px-3 py-1 rounded"
                                            >
                                                진료 메모 보기
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyAppointments;