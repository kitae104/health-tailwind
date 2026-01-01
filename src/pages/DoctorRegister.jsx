import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const DoctorRegister = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        licenseNumber: '',
        specialization: '',
        roles: ['DOCTOR']
    });

    const [specializations, setSpecializations] = useState([]); // 전문 분야 목록
    const [error, setError] = useState(''); // 에러 메시지 상태
    const [success, setSuccess] = useState(''); // 성공 메시지 상태
    const [loading, setLoading] = useState(false); // 폼 제출 로딩 상태
    const [loadingSpecializations, setLoadingSpecializations] = useState(true); // 전문 분야 로딩 상태

    const navigate = useNavigate();

    useEffect(() => {
        fetchSpecializations();
    }, []);

    const fetchSpecializations = async () => {
        try {
            const response = await apiService.getAllDocgetAllSpecializationEnumstors();
            if (response.data.statusCode === 200) {
                setSpecializations(response.data.data);
            }
        } catch (error) {
            setError("진료 전문 분야를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoadingSpecializations(false);
        }
    };

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

        if (!formData.specialization) {
            setError("진료 전문 분야를 선택해주세요.");
            setLoading(false);
            return;
        }

        if (!formData.licenseNumber) {
            setError("의사 면허 번호를 입력해주세요.");
            setLoading(false);
            return;
        }

        try {
            const response = await apiService.register(formData);
            if (response.data.statusCode === 200) {
                setSuccess("의사 등록이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.");
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    licenseNumber: '',
                    specialization: '',
                    roles: ['DOCTOR']
                });
                setTimeout(() => {
                    navigate('/login'); // 5초 후에 로그인 페이지로 이동 
                }, 5000);
            } else {
                setError(response.data.message || "의사 등록 중 오류가 발생했습니다.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "의사 등록 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">의사 등록</h2>

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

                    <div className="form-group">
                        <label className="form-label">의사 면허 번호</label>
                        <input
                            type="text"
                            name="licenseNumber"
                            className="form-input"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">전문 분야</label>
                        <select
                            name="specialization"
                            className="form-select"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                            disabled={loadingSpecializations}
                        >
                            <option value="">전문 분야 선택</option>
                            {specializations.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                        {loadingSpecializations && (
                            <small>전문 분야 불러오는 중...</small>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="form-btn"
                        disabled={loading || loadingSpecializations}
                    >
                        {loading ? '등록 중...' : '의사 등록하기'}
                    </button>
                </form>

                <div className="form-link">
                    <p>
                        이미 계정이 있으신가요? <Link to="/login">여기서 로그인</Link>
                    </p>
                    <p className="mt-1">
                        환자로 등록하시겠습니까? <Link to="/register">여기를 클릭하세요</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DoctorRegister;