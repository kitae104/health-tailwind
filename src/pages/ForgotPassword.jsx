import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';


const ForgotPassword = () => {

    const [formData, setFormData] = useState({
        email: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

        try {
            const response = await apiService.forgotPassword(formData); // 비밀번호 재설정 요청 API 호출
            if (response.data.statusCode === 200) {
                setSuccess("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
                setFormData({ email: '' }); // 폼 초기화
            } else {
                setError(response.data.message || "비밀번호 재설정 요청에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "비밀번호 재설정 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">비밀번호 재설정</h2>

                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded mb-4 text-center">{error}</div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded mb-4 text-center">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">이메일 주소</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db]/10"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="등록된 이메일 주소를 입력하세요"
                            required
                        />
                        <small className="text-gray-500">이메일 주소를 입력하시면 비밀번호 재설정 방법을 이메일로 보내드립니다.</small>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-4 py-3 rounded-md font-semibold shadow-md disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? '전송 중...' : '재설정 안내 전송'}
                    </button>
                </form>

                <div className="text-center mt-4 text-sm text-gray-600">
                    <p>
                        비밀번호를 기억하시나요? <Link to="/login" className="text-[#3498db]">로그인으로 돌아가기</Link>
                    </p>
                    <p className="mt-2">
                        계정이 없으신가요? <Link to="/register" className="text-[#3498db]">회원가입하기</Link>
                    </p>
                </div>

                {/* Additional Help Information */}
                <div className="mt-6 p-4 bg-gray-50 rounded border-l-4 border-[#3498db] text-gray-600">
                    <h4 className="font-semibold mb-2">다음에는 어떻게 되나요?</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>이메일에서 비밀번호 재설정 링크를 확인하세요</li>
                        <li>재설정 링크는 일정 시간이 지나면 만료됩니다</li>
                        <li>이메일을 못 찾으시면 스팸 폴더를 확인하세요</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;