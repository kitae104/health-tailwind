import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';

const ConsultationHistory = () => {

    const [consultations, setConsultations] = useState([]); // 상담 내역 리스트
    const [error, setError] = useState(''); // 에러 메시지 상태
    const [searchParams] = useSearchParams(); // URL 검색 파라미터 훅

    const appointmentId = searchParams.get('appointmentId'); // appointmentId 파라미터 추출

    useEffect(() => {
        fetchConsultationHistory();
    }, []);

    const fetchConsultationHistory = async () => {
        try {
            let response;
            if (appointmentId) {
                response = await apiService.getConsultationByAppointmentId(appointmentId);

                if (response.data.statusCode === 200) {
                    setConsultations([response.data.data]); // 단일 상담 내역을 배열로 설정
                }
            } else {
                response = await apiService.getConsultationHistoryForPatient();

                if (response.data.statusCode === 200) {
                    setConsultations(response.data.data); // 전체 상담 내역 설정
                }
            }
        } catch (err) {
            setError('상담 내역을 불러오는 중 오류가 발생했습니다.');
        }
    };

    const formatDateTime = (dateTimeString) => {
        return new Date(dateTimeString).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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
                    <h1 className="text-2xl font-semibold">{appointmentId ? '진료 메모' : '상담 기록'}</h1>
                    <Link to="/my-appointments" className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">예약으로 돌아가기</Link>
                </div>
                {
                    consultations.length === 0 ? (
                        <div className="empty-state">
                            <h3>상담 기록이 없습니다</h3>
                            <p>아직 상담 기록이 없습니다.</p>
                            <Link to="/book-appointment" className="btn btn-primary">
                                예약하기
                            </Link>
                        </div>
                    ) : (
                        consultations.map((consultation) => (
                            <div key={consultation.id} className="p-6 border-b last:border-b-0">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">진료 메모</h3>
                                    <span className="text-sm text-gray-600">{formatDateTime(consultation.consultationDate)}</span>
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-semibold text-sm mb-1">주관적 소견</h4>
                                    <p className="bg-gray-50 p-3 rounded">{consultation.subjectiveNotes || '주관적 소견이 없습니다.'}</p>
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-semibold text-sm mb-1">객관적 소견</h4>
                                    <p className="bg-gray-50 p-3 rounded">{consultation.objectiveFindings || '객관적 소견이 없습니다.'}</p>
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-semibold text-sm mb-1">평가</h4>
                                    <p className="bg-gray-50 p-3 rounded">{consultation.assessment || '평가가 없습니다.'}</p>
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-semibold text-sm mb-1">치료 계획</h4>
                                    <p className="bg-gray-50 p-3 rounded">{consultation.plan || '치료 계획이 없습니다.'}</p>
                                </div>

                                {consultation.appointmentId && (
                                    <div className="mt-4 text-right">
                                        <Link
                                            to={`/my-appointments`}
                                            className="inline-block border border-[#3498db] text-[#3498db] px-3 py-1 rounded"
                                        >
                                            예약 상세보기
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    )
}

export default ConsultationHistory;