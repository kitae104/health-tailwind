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
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-md">
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded mb-4">{error}</div>
                    <button onClick={() => navigate('/doctor/appointments')} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">예약으로 돌아가기</button>
                </div>
            </div>
        );
    };
    
    return (
        <div className="max-w-6xl mx-auto px-5 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">환자 상담 기록</h1>
                        <p className="text-gray-600">환자 ID: {patientId}</p>
                    </div>
                    <Link to="/doctor/appointments" className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">예약으로 돌아가기</Link>
                </div>

                {/* 통계 요약 */}
                {consultations.length > 0 && (
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded shadow-sm border-l-4 border-[#3498db] text-center">
                                <div className="text-2xl font-bold">{stats.totalConsultations}</div>
                                <div className="text-sm text-gray-600">총 상담 수</div>
                            </div>
                            <div className="bg-white p-4 rounded shadow-sm border-l-4 border-[#3498db] text-center">
                                <div className="text-2xl font-bold">{stats.recentConsultations}</div>
                                <div className="text-sm text-gray-600">최근 30일</div>
                            </div>
                            <div className="bg-white p-4 rounded shadow-sm border-l-4 border-[#3498db] text-center">
                                <div className="text-2xl font-bold">{consultations.length > 0 ? formatDateTime(consultations[0].consultationDate) : 'N/A'}</div>
                                <div className="text-sm text-gray-600">최신 기록</div>
                            </div>
                        </div>
                    </div>
                )}

                {consultations.length === 0 ? (
                    <div className="p-8 text-center text-gray-600">
                        <h3 className="text-xl font-semibold">상담 기록이 없습니다</h3>
                        <p className="mt-2">이 환자의 상담 기록이 아직 없습니다.</p>
                        <p className="mt-1">첫 내원이거나 상담 내용이 아직 기록되지 않았을 수 있습니다.</p>
                    </div>
                ) : (
                    <div className="p-6">
                        {Object.entries(groupedConsultations).map(([date, dayConsultations]) => (
                            <div key={date} className="mb-6">
                                <h3 className="text-xl font-semibold mb-3">{date}</h3>
                                <div className="space-y-4">
                                    {dayConsultations.map((consultation) => (
                                        <div key={consultation.id} className="bg-white border rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <div className="text-sm text-gray-600">{formatDateTime(consultation.consultationDate)}</div>
                                                        <div className="text-xs text-gray-500">({getTimeAgo(consultation.consultationDate)})</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600">예약: #{consultation.appointmentId}</div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 gap-4">
                                                <div>
                                                    <h4 className="font-semibold mb-1">📋 주관적 소견</h4>
                                                    <div className="bg-gray-50 p-3 rounded">{consultation.subjectiveNotes || '주관적 소견이 없습니다.'}</div>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold mb-1">🔍 객관적 소견</h4>
                                                    <div className="bg-gray-50 p-3 rounded">{consultation.objectiveFindings || '객관적 소견이 없습니다.'}</div>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold mb-1">💊 평가</h4>
                                                    <div className="bg-gray-50 p-3 rounded">{consultation.assessment || '평가가 없습니다.'}</div>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold mb-1">📝 치료 계획</h4>
                                                    <div className="bg-gray-50 p-3 rounded">{consultation.plan || '치료 계획이 없습니다.'}</div>
                                                </div>
                                            </div>

                                            <div className="mt-4 text-right">
                                                <button className="inline-block border border-[#3498db] text-[#3498db] px-3 py-1 rounded" onClick={() => {
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
                    <div className="p-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-b-lg">
                        <h3 className="text-lg font-semibold mb-4 text-center">🩺 진단 인사이트</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white/10 p-4 rounded">
                                <h4 className="font-semibold">반복되는 증상</h4>
                                <p className="mt-2 text-sm opacity-90">여러 상담의 주관적 소견에서 패턴을 찾아보세요</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded">
                                <h4 className="font-semibold">치료 효과</h4>
                                <p className="mt-2 text-sm opacity-90">이전 치료 계획과 결과를 검토하세요</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded">
                                <h4 className="font-semibold">경과 추적</h4>
                                <p className="mt-2 text-sm opacity-90">시간에 따른 객관적 소견의 변화를 모니터링하세요</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded">
                                <h4 className="font-semibold">만성 질환 징후</h4>
                                <p className="mt-2 text-sm opacity-90">평가에서 언급된 지속적 문제를 식별하세요</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PatientConsultationHistory;