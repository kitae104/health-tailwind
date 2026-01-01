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
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">비밀번호 재설정</h2>

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

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">이메일 주소</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="등록된 이메일 주소를 입력하세요"
                            required
                        />
                        <small className="form-help">
                            이메일 주소를 입력하시면 비밀번호 재설정 방법을 이메일로 보내드립니다.
                        </small>
                    </div>

                    <button
                        type="submit"
                        className="form-btn"
                        disabled={loading}
                    >
                        {loading ? '전송 중...' : '재설정 안내 전송'}
                    </button>
                </form>

                <div className="form-link">
                    <p>
                        비밀번호를 기억하시나요? <Link to="/login">로그인으로 돌아가기</Link>
                    </p>
                    <p className="mt-1">
                        계정이 없으신가요? <Link to="/register">회원가입하기</Link>
                    </p>
                </div>

                {/* Additional Help Information */}
                <div className="forgot-password-help">
                    <h4>다음에는 어떻게 되나요?</h4>
                    <ul>
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