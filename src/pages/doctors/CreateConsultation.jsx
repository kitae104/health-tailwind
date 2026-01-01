import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const CreateConsultation = () => {

    const [formData, setFormData] = useState({
        appointmentId: '',  // 예약 ID
        subjectiveNotes: '', // 주관적 소견
        objectiveFindings: '', // 객관적 소견
        assessment: '', // 평가
        plan: '' // 계획
    });

    const [appointment, setAppointment] = useState(null);   // 예약 정보
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(''); // 에러 메시지
    const [success, setSuccess] = useState(''); // 성공 메시지
    const [searchParams] = useSearchParams(); // URL 검색 매개변수

    const navigate = useNavigate(); // 페이지 이동

    const appointmentId = searchParams.get('appointmentId'); // URL에서 예약 ID 가져오기

    useEffect(() => {
        if(appointmentId) {
            fetchAppointmentDetails();
        } else {
            setError("예약 ID가 제공되지 않았습니다.");
        }
    }, [appointmentId]);

    const fetchAppointmentDetails = async () => {
        try {
            const response = await apiService.getMyAppointments();

            if(response.data.statusCode === 200) {
                const foundAppointment = response.data.data.find(
                    (appt) => appt.id === parseInt(appointmentId)
                );

                if(foundAppointment) {
                    setAppointment(foundAppointment);
                    setFormData((prevData) => ({
                        ...prevData,
                        appointmentId: appointmentId
                    }));
                } else {
                    setError("해당 예약을 찾을 수 없습니다.");
                }
            }
        } catch (error) {
            setError
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // 검증 
        if(!formData.subjectiveNotes || !formData.objectiveFindings || !formData.assessment || !formData.plan) {
            setError('모든 필드를 작성해 주세요.');
            setLoading(false);
            return;
        }

        try {
            const consultationData = {
                ...formData,
                appointmentId: parseInt(formData.appointmentId)
            };
            
            const response = await apiService.createConsultation(consultationData);

            if(response.data.statusCode === 201) {
                setSuccess('상담 기록이 성공적으로 생성되었습니다.');
                setTimeout(() => {
                    navigate('/doctor/appointments');
                }, 5000);
            } else {
                setError(response.data.message || '상담 기록 생성에 실패했습니다.');
            }

        } catch (error) {
            setError(error.response?.data?.message || '상담 기록 생성 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/doctor/appointments');
    };


    const formatDateTime = (dateTimeString) => {
        return new Date(dateTimeString).toLocaleString("ko-KR", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (error && !appointment) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded mb-4">{error}</div>
                    <button onClick={handleCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">예약으로 돌아가기</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-semibold text-center mb-6">상담 기록 생성</h2>
                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded mb-4 text-center">{error}</div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded mb-4 text-center">{success}</div>
                )}

                {appointment && (
                    <div className="mb-4 p-4 bg-gray-50 rounded border-l-4 border-[#3498db]">
                        <h3 className="font-semibold mb-2">예약 정보</h3>
                        <div>
                            <p><strong>환자:</strong> {appointment.patient.lastName} {appointment.patient.firstName}</p>
                            <p><strong>날짜:</strong> {formatDateTime(appointment.startTime)}</p>
                            <p><strong>목적:</strong> {appointment.purposeOfConsultation}</p>
                            <p><strong>증상:</strong> {appointment.initialSymptoms}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">주관적 소견</label>
                        <textarea
                            name="subjectiveNotes"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                            value={formData.subjectiveNotes}
                            onChange={handleChange}
                            placeholder="환자가 호소하는 증상, 병력 및 우려사항을 입력하세요..."
                            rows="4"
                            required
                        />
                        <small className="text-gray-500">환자의 주관적 증상 및 병력</small>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">객관적 소견</label>
                        <textarea
                            name="objectiveFindings"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                            value={formData.objectiveFindings}
                            onChange={handleChange}
                            placeholder="신체검진 소견, 활력징후, 검사 결과 등을 입력하세요..."
                            rows="4"
                            required
                        />
                        <small className="text-gray-500">객관적 관찰 및 검사 소견</small>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">평가</label>
                        <textarea
                            name="assessment"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                            value={formData.assessment}
                            onChange={handleChange}
                            placeholder="진단명, 감별진단, 임상 소견 등을 입력하세요..."
                            rows="3"
                            required
                        />
                        <small className="text-gray-500">임상적 평가 및 진단</small>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">치료 계획</label>
                        <textarea
                            name="plan"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                            value={formData.plan}
                            onChange={handleChange}
                            placeholder="치료 권고사항, 약물, 추적 계획 등을 입력하세요..."
                            rows="3"
                            required
                        />
                        <small className="text-gray-500">치료 계획 및 권고사항</small>
                    </div>

                    <div className="flex gap-3 justify-end mt-4">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            onClick={handleCancel}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-4 py-2 rounded font-semibold disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? '생성 중...' : '상담 생성'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateConsultation;