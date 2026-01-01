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
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">비밀번호 재설정</h2>

                {!formData.code && (
                    <div className="alert alert-error">
                        유효하지 않은 재설정 링크입니다. 이메일로 받은 링크를 사용하세요.
                    </div>
                )}

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                {formData.code && (
                    <>
                        <div className="reset-code-info">
                            <p>
                                <strong>재설정 코드:</strong> {formData.code}
                            </p>
                            <small>이 코드는 재설정 링크에서 추출되었습니다</small>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">새 비밀번호</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="form-input"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="새 비밀번호를 입력하세요"
                                    required
                                    minLength={4}
                                />
                                <small className="form-help">최소 4자 이상이어야 합니다</small>
                            </div>

                            <div className="form-group">
                                <label className="form-label">새 비밀번호 확인</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-input"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="새 비밀번호를 다시 입력하세요"
                                    required
                                    minLength={4}
                                />
                            </div>

                            <button
                                type="submit"
                                className="form-btn"
                                disabled={loading}
                            >
                                {loading ? '재설정 중...' : '비밀번호 재설정'}
                            </button>
                        </form>
                    </>
                )}

                <div className="form-link">
                    <p>
                        비밀번호를 기억하시나요? <Link to="/login">로그인으로 돌아가기</Link>
                    </p>
                    <p className="mt-1">
                        새 재설정 링크가 필요하신가요? <Link to="/forgot-password">다시 요청하기</Link>
                    </p>
                </div>

                {/* Password Requirements */}
                <div className="password-requirements">
                    <h4>비밀번호 요구사항:</h4>
                    <ul>
                        <li className={formData.newPassword.length >= 4 ? 'requirement-met' : ''}>
                            최소 4자 이상
                        </li>
                        <li className={formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword ? 'requirement-met' : ''}>
                            비밀번호가 일치함
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default ResetPassword;