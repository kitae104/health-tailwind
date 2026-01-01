import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const BookAppointment = () => {

    const [formData, setFormData] = useState({
        doctorId: '',
        purposeOfConsultation: '',
        initialSymptoms: '',
        startTime: ''
    });

    const [doctors, setDoctors] = useState([]); // 의사 목록 상태
    const [loading, setLoading] = useState(false); // 예약 생성 로딩 상태
    const [loadingDoctors, setLoadingDoctors] = useState(true); // 의사 목록 로딩 상태
    const [error, setError] = useState(''); // 에러 메시지 상태
    const [success, setSuccess] = useState(''); // 성공 메시지 상태

    const navigate = useNavigate(); // 페이지 이동 훅

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await apiService.getAllDoctors(); // 모든 의사 정보 가져오기

            if (response.data.statusCode === 200) {
                setDoctors(response.data.data); // 의사 목록 상태 업데이트
            } else {
                setError('의사 목록을 불러오는 데 실패했습니다.');
            }
        } catch (error) {
            setError('의사 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoadingDoctors(false);
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
        if (!formData.doctorId) {
            setError('의사를 선택해주세요.');
            setLoading(false);
            return;
        }

        if (!formData.startTime) {
            setError('예약 날짜와 시간을 선택해주세요.');
            setLoading(false);
            return;
        }

        // 지역 시간을 ISO Format으로 변환
        const appointmentData = {
            ...formData,
            doctorId: parseInt(formData.doctorId),
            startTime: new Date(formData.startTime).toISOString()
        };

        try {
            const response = await apiService.bookAppointment(appointmentData);

            if (response.data.statusCode === 200) {
                setSuccess('예약이 성공적으로 생성되었습니다.');
                setFormData({
                    doctorId: '',
                    purposeOfConsultation: '',
                    initialSymptoms: '',
                    startTime: ''
                });
                setTimeout(() => {
                    navigate('/my-appointments'); // 예약 목록 페이지로 이동
                }, 5000);
            } else {
                setError(response.data.message || '예약 생성에 실패했습니다.');
            }
        } catch (error) {
            setError(error.response?.data?.message || '예약 생성 중 오류가 발생했습니다.' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    const formatDoctorName = (doctor) => {
        if (doctor.firstName && doctor.lastName) {
            return `Dr. ${doctor.lastName} ${doctor.firstName} - ${doctor.specialization?.replace(/_/g, ' ')}`;
        }
        return `Dr. ${doctor.user?.name} - ${doctor.specialization?.replace(/_/g, ' ') || '일반 진료'}`;
    };

    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // 지역 시간 보정
        return now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM" 형식 반환
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
                <h2 className="text-2xl font-semibold text-center mb-6">예약하기</h2>

                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded mb-4 text-center">{error}</div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded mb-4 text-center">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">의사 선택</label>
                        <select
                            name="doctorId"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                            value={formData.doctorId}
                            onChange={handleChange}
                            required
                            disabled={loadingDoctors}
                        >
                            <option value="">의사 선택</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {formatDoctorName(doctor)}
                                </option>
                            ))}
                        </select>
                        {loadingDoctors && (
                            <small className="text-gray-500">의사 목록을 불러오는 중...</small>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">상담 목적</label>
                        <input
                            type="text"
                            name="purposeOfConsultation"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                            value={formData.purposeOfConsultation}
                            onChange={handleChange}
                            placeholder="상담이 필요한 이유를 간단히 입력하세요"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">초기 증상</label>
                        <textarea
                            name="initialSymptoms"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                            value={formData.initialSymptoms}
                            onChange={handleChange}
                            placeholder="증상을 자세히 입력하세요"
                            rows="4"
                            required
                        />
                        <small className="text-gray-500">증상, 기간 및 심각도를 구체적으로 작성하세요</small>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">희망 날짜 및 시간</label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                            value={formData.startTime}
                            onChange={handleChange}
                            min={getMinDateTime()}
                            required
                        />
                        <small className="text-gray-500">원하시는 예약 날짜와 시간을 선택하세요</small>
                    </div>

                    <div className="flex gap-3 justify-end mt-3">
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
                            disabled={loading || loadingDoctors}
                        >
                            {loading ? '예약 중...' : '예약하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BookAppointment;