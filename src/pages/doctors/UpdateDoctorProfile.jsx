import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const UpdateDoctorProfile = () => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        specialization: ''
    });

    const [specializations, setSpecializations] = useState([]); // 의사 전문 분야 목록
    const [loading, setLoading] = useState(false); // 폼 제출 로딩 상태
    const [loadingEnums, setLoadingEnums] = useState(true); // 전문 분야 로딩 상태
    const [error, setError] = useState(''); // 에러 메시지
    const [success, setSuccess] = useState(''); // 성공 메시지
    const navigate = useNavigate(); // 페이지 이동 훅

    useEffect(() => {
        fetchProfileData();
        fetchSpecializations();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await apiService.getMyDoctorProfile();

            if (response.data.statusCode === 200) {
                const doctorData = response.data.data;

                setFormData({
                    firstName: doctorData.firstName || '',
                    lastName: doctorData.lastName || '',
                    specialization: doctorData.specialization || ''
                });
            }
        } catch (error) {
            setError('프로필 데이터를 불러오는 중 오류가 발생했습니다.');
        }
    };

    const fetchSpecializations = async () => {
        try {
            const response = await apiService.getAllDocgetAllSpecializationEnumstors();

            if (response.data.statusCode === 200) {
                setSpecializations(response.data.data);
            }
        } catch (error) {
            setError('전문 분야 데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoadingEnums(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCancel = () => {
        navigate('/doctor/profile');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apiService.updateMyDoctorProfile(formData);

            if (response.data.statusCode === 200) {
                setSuccess('프로필이 성공적으로 업데이트되었습니다.');
                setTimeout(() => {
                    navigate('/doctor/profile');
                }, 5000);
            } else {
                setError(response.data.message || '프로필 업데이트에 실패했습니다.');
            }
        } catch (error) {
            setError(error.response?.data?.message || '프로필 업데이트 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-semibold text-center mb-6">의사 프로필 수정</h2>
                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded mb-4 text-center">{error}</div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded mb-4 text-center">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#2c3e50] mb-2">성</label>
                            <input
                                type="text"
                                name="lastName"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="성을 입력하세요"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#2c3e50] mb-2">이름</label>
                            <input
                                type="text"
                                name="firstName"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="이름을 입력하세요"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">전문 분야</label>
                        <select
                            name="specialization"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                            disabled={loadingEnums}
                        >
                            <option value="">전문 분야 선택</option>
                            {specializations.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                </option>
                            ))}
                        </select>
                        {loadingEnums && (
                            <small className="text-gray-500">전문 분야를 불러오는 중...</small>
                        )}
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
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
                            {loading ? '업데이트 중...' : '프로필 업데이트'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default UpdateDoctorProfile;