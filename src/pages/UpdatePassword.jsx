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
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">비밀번호 변경</h2>

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
                        <label className="form-label">현재 비밀번호</label>
                        <input
                            type="password"
                            name="oldPassword"
                            className="form-input"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            placeholder="현재 비밀번호를 입력하세요"
                            required
                        />
                    </div>

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
                        />
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
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
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