import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const UpdatePassword = () => {

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);  // 폼 제출 로딩 상태
    const [error, setError] = useState(''); // 에러 메시지 상태
    const [success, setSuccess] = useState(''); // 성공 메시지 상태

    const navigate = useNavigate(); // 네비게이션 훅

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 제출 기본 동작 방지
        setLoading(true);
        setError('');
        setSuccess('');

        // 비밀번호 일치 여부 검증
        if (formData.newPassword !== formData.confirmPassword) {
            setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
            setLoading(false);
            return;
        }

        if (formData.newPassword.length < 4) {
            setError("비밀번호는 최소 4자 이상이어야 합니다.");
            setLoading(false);
            return;
        }

        try {
            const updatePasswordRequest = {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            };

            const response = await apiService.updatePassword(updatePasswordRequest);

            if (response.data.statusCode === 200) {
                setSuccess("비밀번호가 성공적으로 업데이트되었습니다.");
                setFormData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setTimeout(() => {
                    apiService.logout(); // 로그아웃 처리
                    navigate('/login'); // 로그인 페이지로 이동
                }, 5000);
            } else {
                setError(response.data.message || "비밀번호 업데이트에 실패했습니다.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "비밀번호 업데이트 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">비밀번호 변경</h2>

                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded mb-4 text-center">{error}</div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded mb-4 text-center">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">현재 비밀번호</label>
                        <input
                            type="password"
                            name="oldPassword"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db]/10"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            placeholder="현재 비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">새 비밀번호</label>
                        <input
                            type="password"
                            name="newPassword"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db]/10"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="새 비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">새 비밀번호 확인</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db]/10"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="새 비밀번호를 다시 입력하세요"
                            required
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
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
                            {loading ? '업데이트 중...' : '비밀번호 변경'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdatePassword;