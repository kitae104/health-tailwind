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
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">환자로 회원 가입</h2>
                {error && <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}

                {success && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded mb-4 text-center">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">이름</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db]/10"
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
                        {loading ? "등록 중..." : "환자 등록"}
                    </button>
                </form>

                <div className="text-center mt-4 text-sm text-gray-600">
                    <p>
                        이미 계정이 있으신가요? <Link to="/login" className="text-[#3498db]">로그인</Link>
                    </p>
                    <p className="mt-2">
                        의사로 등록하려면 <Link to="/register-doctor" className="text-[#3498db]">여기</Link>를 클릭하세요.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
