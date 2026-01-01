import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';

const DoctorAppointments = () => {

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

    const handleCompleteAppointment = async (appointmentId) => {
        if (!window.confirm('정말로 이 예약을 완료 처리하시겠습니까?')) {
            return;
        }

        try {
            const response = await apiService.completeAppointment(appointmentId); // 예약 완료 처리 API 호출

            if (response.data.statusCode === 200) {
                fetchAppointments(); // 예약 목록 갱신
            } else {
                setError('예약 완료 처리에 실패했습니다.');
            }
        } catch (error) {
            setError('예약 완료 처리 중 오류가 발생했습니다.');
        }
    };

    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm('정말로 이 예약을 취소하시겠습니까?')) {
            return;
        }

        try {
            const response = await apiService.cancelAppointment(appointmentId);

            if (response.data.statusCode === 200) {
                fetchAppointments(); // 예약 목록 갱신
            } else {
                setError('예약 취소에 실패했습니다.');
            }
        } catch (error) {
            setError('예약 취소 중 오류가 발생했습니다.');
        }
    };

    const formatPatientInfo = (patient) => {
        return `${patient.lastName} ${patient.firstName} (${patient.user?.email})`;
    };

    if (error) {
        return (
            <div className="container">
                <div className="form-container">
                    <div className="alert alert-error">{error}</div>
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">내 예약</h1>
                    <Link to="/doctor/profile" className="btn btn-secondary">
                        프로필으로 돌아가기
                    </Link>
                </div>

                {
                    appointments.length === 0 ? (
                        <div className="empty-state">
                            <h3>예약 내역이 없습니다</h3>
                            <p>아직 예정된 예약이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="appointments-list">
                            {
                                appointments.map((appointment) => (
                                    <div key={appointment.id} className="appointment-card">
                                        <div className="appointment-header">
                                            <div className="appointment-info">
                                                <h3 className="patient-name">
                                                    환자: {formatPatientInfo(appointment.patient)}
                                                </h3>
                                                <p className="appointment-time">
                                                    {formatDateTime(appointment.startTime)}
                                                </p>
                                            </div>
                                            <div className="appointment-actions">
                                                {getStatusBadge(appointment.status)}
                                                <div className="action-buttons">
                                                    {appointment.status === 'SCHEDULED' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleCompleteAppointment(appointment.id)}
                                                                className="btn btn-success btn-sm"
                                                            >
                                                                완료
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancelAppointment(appointment.id)}
                                                                className="btn btn-danger btn-sm"
                                                            >
                                                                취소
                                                            </button>
                                                            <Link
                                                                to={`/doctor/patient-consultation-history?patientId=${appointment.patient.id}`}
                                                                className="btn btn-info btn-sm"
                                                            >
                                                                진료 기록 보기
                                                            </Link>
                                                        </>
                                                    )}

                                                    {appointment.status === 'COMPLETED' && (
                                                        <Link
                                                            to={`/doctor/create-consultation?appointmentId=${appointment.id}`}
                                                            className="btn btn-primary btn-sm"
                                                        >
                                                            상담 작성
                                                        </Link>
                                                    )}
                                                    {appointment.meetingLink && appointment.status === 'SCHEDULED' && (
                                                        <a
                                                            href={appointment.meetingLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-outline btn-sm"
                                                        >
                                                            회의 참가
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="appointment-details">
                                            <div className="detail-row">
                                                <div className="detail-item">
                                                    <label>목적:</label>
                                                    <span>{appointment.purposeOfConsultation}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>소요 시간:</label>
                                                    <span>1시간</span>
                                                </div>
                                            </div>

                                            <div className="detail-item">
                                                <label>증상:</label>
                                                <span>{appointment.initialSymptoms}</span>
                                            </div>

                                            <div className="detail-item">
                                                <label>환자 정보:</label>
                                                <div className="patient-details">
                                                    <span><strong>생년월일:</strong> {new Date(appointment.patient.dateOfBirth).toLocaleDateString()}</span>
                                                    <span><strong>혈액형:</strong> {appointment.patient.bloodGroup?.replace('_', ' ')}</span>
                                                    <span><strong>유전형:</strong> {appointment.patient.genotype}</span>
                                                    <span><strong>알레르기:</strong> {appointment.patient.knownAllergies || '없음'}</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )
                                )}
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default DoctorAppointments;