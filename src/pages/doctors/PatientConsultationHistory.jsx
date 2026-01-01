import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../../services/api';

const PatientConsultationHistory = () => {

    const [consultations, setConsultations] = useState([]); // 상담 내역 리스트
    const [patient, setPatient] = useState(null);   // 환자 정보
    const [error, setError] = useState(''); // 에러 메시지 상태
    const [searchParams] = useSearchParams();   // URL 검색 파라미터 훅

    const navigate = useNavigate(); // 페이지 이동

    const patientId = searchParams.get('patientId');    // patientId 파라미터 추출

    useEffect(() => {
        if(patientId) {
            fetchConsultationHistory();
        } else {
            setError("환자 ID가 제공되지 않았습니다.");
        }
    }, [patientId]);

    const fetchConsultationHistory = async() => {
        try {
            const response = await apiService.getConsultationHistoryForPatient(patientId); // 환자 ID로 상담 내역 조회

            if(response.data.statusCode === 200) {
                setConsultations(response.data.data); // 상담 내역 설정
            }
        } catch (error) {
            setError('상담 내역을 불러오는 중 오류가 발생했습니다.');
            console.error('상담 내역 불러오기 오류:', error);
        }
    }

    const formatDateTime = (dateTimeString) => {
        return new Date(dateTimeString).toLocaleString("ko-KR", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeAgo = (dateTimeString) => {
        const now = new Date();
        const consultationDate = new Date(dateTimeString);
        const diffTime = Math.abs(now - consultationDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if(diffDays === 1) return '1일 전';
        if(diffDays < 7) return `${diffDays}일 전`;
        if(diffDays < 30) return `${Math.ceil(diffDays / 7)}주 전`;
        if(diffDays < 365) return `${Math.ceil(diffDays / 30)}개월 전`;
        return `${Math.ceil(diffDays / 365)}년 전`;
    };

    const groupConsultationsByDate  = (consultations) => {
        const grouped = {};

        consultations.forEach(consultation => {
            const date = new Date(consultation.consultationDate).toLocaleDateString("ko-KR", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            if(!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(consultation);
        });
        
        return grouped;
    };

    const calculateStatistics = (consultations) => {
        const totalConsultations = consultations.length;    // 총 상담 수
        const recentConsultations = consultations.filter(consultation => {
            const consultationDate = new Date(consultation.consultationDate); // 상담 날짜
            const thirtyDaysAgo = new Date(); // 30일 전 날짜
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return consultationDate > thirtyDaysAgo;
        }).length; // 최근 30일 내 상담 수

        return { totalConsultations, recentConsultations };
    };

    const groupedConsultations = groupConsultationsByDate(consultations); // 날짜별 상담 내역 그룹화
    const stats = calculateStatistics(consultations); // 상담 통계 계산

    if(error) {
        return (
            <div className="container">
                <div className="form-container">
                    <div className="alert alert-error">{error}</div>
                    <button onClick={() => navigate('/doctor/appointments')} className="btn btn-secondary">
                        예약으로 돌아가기
                    </button>
                </div>
            </div>
        );
    };
    
    return (
        <div className="container">
            <div className="page-container">
                <div className="page-header">
                    <div className="header-content">
                        <div>
                            <h1 className="page-title">환자 상담 기록</h1>
                            <p className="page-subtitle">
                                환자 ID: {patientId}
                            </p>
                        </div>
                        <Link to="/doctor/appointments" className="btn btn-secondary">
                            예약으로 돌아가기
                        </Link>
                    </div>
                </div>

                {/* 통계 요약 */}
                {consultations.length > 0 && (
                    <div className="consultation-stats">
                        <div className="stat-card">
                            <div className="stat-number">{stats.totalConsultations}</div>
                            <div className="stat-label">총 상담 수</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{stats.recentConsultations}</div>
                            <div className="stat-label">최근 30일</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">
                                {consultations.length > 0 ? formatDateTime(consultations[0].consultationDate) : 'N/A'}
                            </div>
                            <div className="stat-label">최신 기록</div>
                        </div>
                    </div>
                )}

                {consultations.length === 0 ? (
                    <div className="empty-state">
                        <h3>상담 기록이 없습니다</h3>
                        <p>이 환자의 상담 기록이 아직 없습니다.</p>
                        <p className="mt-1">첫 내원이거나 상담 내용이 아직 기록되지 않았을 수 있습니다.</p>
                    </div>
                ) : (
                    <div className="consultation-history">
                        {Object.entries(groupedConsultations).map(([date, dayConsultations]) => (
                            <div key={date} className="consultation-day-group">
                                <h3 className="day-header">{date}</h3>
                                <div className="consultations-list">
                                    {dayConsultations.map((consultation) => (
                                        <div key={consultation.id} className="consultation-card detailed">
                                            <div className="consultation-header">
                                                            <div className="consultation-meta">
                                                                <span className="consultation-time">
                                                                    {formatDateTime(consultation.consultationDate)}
                                                                </span>
                                                                <span className="time-ago">
                                                                    ({getTimeAgo(consultation.consultationDate)})
                                                                </span>
                                                            </div>
                                                            <div className="consultation-id">
                                                                예약: #{consultation.appointmentId}
                                                            </div>
                                                        </div>

                                            <div className="consultation-sections">
                                                <div className="consultation-section">
                                                    <h4>📋 주관적 소견</h4>
                                                    <div className="section-content">
                                                        {consultation.subjectiveNotes || '주관적 소견이 없습니다.'}
                                                    </div>
                                                </div>

                                                <div className="consultation-section">
                                                    <h4>🔍 객관적 소견</h4>
                                                    <div className="section-content">
                                                        {consultation.objectiveFindings || '객관적 소견이 없습니다.'}
                                                    </div>
                                                </div>

                                                <div className="consultation-section">
                                                    <h4>💊 평가</h4>
                                                    <div className="section-content">
                                                        {consultation.assessment || '평가가 없습니다.'}
                                                    </div>
                                                </div>

                                                <div className="consultation-section">
                                                    <h4>📝 치료 계획</h4>
                                                    <div className="section-content">
                                                        {consultation.plan || '치료 계획이 없습니다.'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="consultation-actions">
                                                <button className="btn btn-outline btn-sm" onClick={() => {
                                                    // Highlight patterns or important information
                                                    alert('이 정보를 사용하여 환자의 병력 패턴을 식별하세요');
                                                }}>
                                                    패턴 분석
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 진단 보조 섹션 */}
                {consultations.length > 0 && (
                    <div className="diagnostic-assistance">
                        <h3>🩺 진단 인사이트</h3>
                        <div className="insights-grid">
                            <div className="insight-card">
                                <h4>반복되는 증상</h4>
                                <p>여러 상담의 주관적 소견에서 패턴을 찾아보세요</p>
                            </div>
                            <div className="insight-card">
                                <h4>치료 효과</h4>
                                <p>이전 치료 계획과 결과를 검토하세요</p>
                            </div>
                            <div className="insight-card">
                                <h4>경과 추적</h4>
                                <p>시간에 따른 객관적 소견의 변화를 모니터링하세요</p>
                            </div>
                            <div className="insight-card">
                                <h4>만성 질환 징후</h4>
                                <p>평가에서 언급된 지속적 문제를 식별하세요</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PatientConsultationHistory;