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
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">로그인</h2>

                {error && <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">이메일</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db]/10"
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
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db]/10"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={4}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-4 py-3 rounded-md font-semibold shadow-md disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <div className="text-center mt-4 text-sm text-gray-600">
                    <p>
                        계정이 없으신가요? <Link to="/register" className="text-[#3498db]">환자 등록</Link>{" "}
                        또는 <Link to="/register-doctor" className="text-[#3498db]">의사 등록</Link>
                    </p>
                    <p className="mt-2">
                        비밀번호를 잊으셨나요?{" "}
                        <Link to="/forgot-password" className="text-[#3498db]">비밀번호 재설정</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Login;
