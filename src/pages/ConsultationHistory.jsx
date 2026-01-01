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
                    <h1 className="page-title">
                        {appointmentId ? '진료 메모' : '상담 기록'}
                    </h1>
                    <Link to="/my-appointments" className="btn btn-secondary">
                        예약으로 돌아가기
                    </Link>
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
                            <div key={consultation.id} className="consultation-card">
                                <div className="consultation-header">
                                    <h3>진료 메모</h3>
                                    <span className="consultation-date">
                                        {formatDateTime(consultation.consultationDate)}
                                    </span>
                                </div>

                                <div className="consultation-section">
                                    <h4>주관적 소견</h4>
                                    <p>{consultation.subjectiveNotes || '주관적 소견이 없습니다.'}</p>
                                </div>

                                <div className="consultation-section">
                                    <h4>객관적 소견</h4>
                                    <p>{consultation.objectiveFindings || '객관적 소견이 없습니다.'}</p>
                                </div>

                                <div className="consultation-section">
                                    <h4>평가</h4>
                                    <p>{consultation.assessment || '평가가 없습니다.'}</p>
                                </div>

                                <div className="consultation-section">
                                    <h4>치료 계획</h4>
                                    <p>{consultation.plan || '치료 계획이 없습니다.'}</p>
                                </div>

                                {consultation.appointmentId && (
                                    <div className="consultation-footer">
                                        <Link
                                            to={`/my-appointments`}
                                            className="btn btn-outline btn-sm"
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