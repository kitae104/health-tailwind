import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';



const ResetPassword = () => {

    const [formData, setFormData] = useState({
        newPassword: '',    // 새 비밀번호
        confirmPassword: '', // 비밀번호 확인
        code: ''            // 비밀번호 재설정 코드
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {
        const codeFromUrl = searchParams.get('code'); // URL에서 코드 추출
        if (codeFromUrl) {
            setFormData(prev => ({
                ...prev,
                code: codeFromUrl
            }));
        }
    }, [searchParams]);

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

        // 검증 로직
        if(!formData.code) {
            setError("재설정 코드가 없습니다. 이메일에 있는 링크를 사용하세요.");
            setLoading(false);
            return;
        }

        if(formData.newPassword !== formData.confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            setLoading(false);
            return;
        }

        if(formData.newPassword.length < 4) {
            setError("비밀번호는 최소 4자 이상이어야 합니다.");
            setLoading(false);
            return;
        }

        try {
            const resetData = {
                newPassword: formData.newPassword,
                code: formData.code
            };

            const response = await apiService.resetPassword(resetData);

            if(response.data.statusCode === 200) {
                setSuccess("비밀번호 재설정이 완료되었습니다! 이제 새 비밀번호로 로그인하실 수 있습니다.");
                
                setFormData({
                    newPassword: '',
                    confirmPassword: '',
                    code: formData.code // 코드는 유지
                });

                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } else {
                setError(response.data.message || "비밀번호 재설정에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "비밀번호를 재설정하는 동안 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">비밀번호 재설정</h2>

                {!formData.code && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded mb-4 text-center">유효하지 않은 재설정 링크입니다. 이메일로 받은 링크를 사용하세요.</div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded mb-4 text-center">{error}</div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded mb-4 text-center">{success}</div>
                )}

                {formData.code && (
                    <>
                        <div className="bg-blue-50 border border-blue-100 rounded p-3 mb-4">
                            <p><strong>재설정 코드:</strong> {formData.code}</p>
                            <small className="text-gray-600">이 코드는 재설정 링크에서 추출되었습니다</small>
                        </div>

                        <form onSubmit={handleSubmit}>
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
                                    minLength={4}
                                />
                                <small className="text-gray-500">최소 4자 이상이어야 합니다</small>
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
                                    minLength={4}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-4 py-3 rounded-md font-semibold shadow-md disabled:opacity-60"
                                disabled={loading}
                            >
                                {loading ? '재설정 중...' : '비밀번호 재설정'}
                            </button>
                        </form>
                    </>
                )}

                <div className="text-center mt-4 text-sm text-gray-600">
                    <p>
                        비밀번호를 기억하시나요? <Link to="/login" className="text-[#3498db]">로그인으로 돌아가기</Link>
                    </p>
                    <p className="mt-2">
                        새 재설정 링크가 필요하신가요? <Link to="/forgot-password" className="text-[#3498db]">다시 요청하기</Link>
                    </p>
                </div>

                {/* Password Requirements */}
                <div className="mt-6 p-4 bg-gray-50 rounded">
                    <h4 className="font-semibold mb-2">비밀번호 요구사항:</h4>
                    <ul className="list-none p-0 m-0">
                        <li className={formData.newPassword.length >= 4 ? 'text-green-600 font-medium mb-1' : 'text-gray-600 mb-1'}>최소 4자 이상</li>
                        <li className={formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword ? 'text-green-600 font-medium' : 'text-gray-600'}>비밀번호가 일치함</li>
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default ResetPassword;