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
            'SCHEDULED': { class: 'status-scheduled', text: '예약됨' },
            'COMPLETED': { class: 'status-completed', text: '완료' },
            'CANCELLED': { class: 'status-cancelled', text: '취소됨' },
            'IN_PROGRESS': { class: 'status-in-progress', text: '진행 중' }
        };

        const config = statusConfig[status] || { class: 'status-default', text: status };
        return <span className={`status-badge ${config.class}`}>{config.text}</span>;
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
            <div className="container">
                <div className="form-container">
                    <div className="alert alert-error">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">내 예약 정보</h1>
                    <Link to="/book-appointment" className="btn btn-primary">
                        새 예약하기
                    </Link>
                </div>

                {appointments.length === 0 ? (
                    <div className="empty-state">
                        <h3>예약 내역이 없습니다</h3>
                        <p>아직 예약한 내역이 없습니다.</p>
                        <Link to="/book-appointment" className="btn btn-primary">
                            첫 예약하기
                        </Link>
                    </div>
                ) : (
                    <div className="appointments-list">
                        {appointments.map((appointment) => (
                            <div key={appointment.id} className="appointment-card">
                                <div className="appointment-header">
                                    <div className="appointment-info">
                                        <h3 className="doctor-name">
                                            Dr. {appointment.doctor.lastName} {appointment.doctor.firstName}
                                        </h3>
                                        <p className="specialization">
                                            {appointment.doctor.specialization?.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                    <div className="appointment-actions">
                                        {getStatusBadge(appointment.status)}
                                        {appointment.status === 'SCHEDULED' && (
                                            <button
                                                onClick={() => handleCancelAppointment(appointment.id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                취소
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="appointment-details">
                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <label>날짜 및 시간:</label>
                                            <span>{formatDateTime(appointment.startTime)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>소요 시간:</label>
                                            <span>1시간</span>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <label>상담 목적:</label>
                                        <span>{appointment.purposeOfConsultation}</span>
                                    </div>

                                    <div className="detail-item">
                                        <label>증상:</label>
                                        <span>{appointment.initialSymptoms}</span>
                                    </div>

                                    {appointment.meetingLink && appointment.status === 'SCHEDULED' && (
                                        <div className="detail-item">
                                            <label>진료 링크:</label>
                                            <a
                                                href={appointment.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="meeting-link"
                                            >
                                                화상 진료 참여
                                            </a>
                                        </div>
                                    )}

                                    {appointment.status === 'COMPLETED' && (
                                        <div className="detail-item">
                                            <Link
                                                to={`/consultation-history?appointmentId=${appointment.id}`}
                                                className="btn btn-outline btn-sm"
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