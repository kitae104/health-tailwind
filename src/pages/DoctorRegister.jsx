import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const DoctorRegister = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        licenseNumber: '',
        specialization: '',
        roles: ['DOCTOR']
    });

    const [specializations, setSpecializations] = useState([]); // 전문 분야 목록
    const [error, setError] = useState(''); // 에러 메시지 상태
    const [success, setSuccess] = useState(''); // 성공 메시지 상태
    const [loading, setLoading] = useState(false); // 폼 제출 로딩 상태
    const [loadingSpecializations, setLoadingSpecializations] = useState(true); // 전문 분야 로딩 상태

    const navigate = useNavigate();

    useEffect(() => {
        fetchSpecializations();
    }, []);

    const fetchSpecializations = async () => {
        try {
            const response = await apiService.getAllDocgetAllSpecializationEnumstors();
            if (response.data.statusCode === 200) {
                setSpecializations(response.data.data);
            }
        } catch (error) {
            setError("진료 전문 분야를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoadingSpecializations(false);
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

        if (!formData.specialization) {
            setError("진료 전문 분야를 선택해주세요.");
            setLoading(false);
            return;
        }

        if (!formData.licenseNumber) {
            setError("의사 면허 번호를 입력해주세요.");
            setLoading(false);
            return;
        }

        try {
            const response = await apiService.register(formData);
            if (response.data.statusCode === 200) {
                setSuccess("의사 등록이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.");
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    licenseNumber: '',
                    specialization: '',
                    roles: ['DOCTOR']
                });
                setTimeout(() => {
                    navigate('/login'); // 5초 후에 로그인 페이지로 이동 
                }, 5000);
            } else {
                setError(response.data.message || "의사 등록 중 오류가 발생했습니다.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "의사 등록 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">의사 등록</h2>

                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded mb-4 text-center">{error}</div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded mb-4 text-center">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">이름</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">이메일</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={4}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">의사 면허 번호</label>
                        <input
                            type="text"
                            name="licenseNumber"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">전문 분야</label>
                        <select
                            name="specialization"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                            disabled={loadingSpecializations}
                        >
                            <option value="">전문 분야 선택</option>
                            {specializations.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                        {loadingSpecializations && (
                            <small className="text-gray-500">전문 분야 불러오는 중...</small>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-4 py-3 rounded-md font-semibold disabled:opacity-60"
                        disabled={loading || loadingSpecializations}
                    >
                        {loading ? '등록 중...' : '의사 등록하기'}
                    </button>
                </form>

                <div className="text-center mt-4 text-sm text-gray-600">
                    <p>
                        이미 계정이 있으신가요? <Link to="/login" className="text-[#3498db]">여기서 로그인</Link>
                    </p>
                    <p className="mt-2">
                        환자로 등록하시겠습니까? <Link to="/register" className="text-[#3498db]">여기를 클릭하세요</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DoctorRegister;