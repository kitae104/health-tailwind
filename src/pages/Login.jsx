import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await apiService.login(formData); // 로그인 API 호출

            if (response.data.statusCode === 200) {
                const { token, roles } = response.data.data; // 토큰과 역할 추출
                apiService.saveAuthData(token, roles);  // 인증 데이터 저장
                
                navigate("/home");

            } else {
                setError(response.data.message || "로그인에 실패했습니다.");
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "로그인 중 오류가 발생했습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">로그인</h2>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">이메일</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={4}
                        />
                    </div>

                    <button
                        type="submit"
                        className="form-btn"
                        disabled={loading}
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <div className="form-link">
                    <p>
                        계정이 없으신가요? <Link to="/register">환자 등록</Link>{" "}
                        또는 <Link to="/register-doctor">의사 등록</Link>
                    </p>
                    <p>
                        비밀번호를 잊으셨나요?{" "}
                        <Link to="/forgot-password">비밀번호 재설정</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Login;
