import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // 폼 입력 변경 처리기
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); //  기본적인 폼 제출 동작 방지
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await apiService.register(formData); // 등록 API 호출
            if (response.data.statusCode === 200) {
                setSuccess("등록 성공! 이제 로그인이 가능합니다.");
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                });
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
            } else {
                setError(response.data.message || "등록에 실패했습니다.");
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "등록하는 동안 오류가 발생했습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">환자로 회원 가입</h2>
                {error && <div className="alert alert-error">{error}</div>}

                {success && (
                    <div className="alert alert-success">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">이름</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                        {loading ? "등록 중..." : "환자 등록"}
                    </button>
                </form>

                <div className="form-link">
                    <p>
                        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                    </p>
                    <p className="mt-1">
                        의사로 등록하려면{" "}
                        <Link to="/register-doctor">여기</Link>를 클릭하세요.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
