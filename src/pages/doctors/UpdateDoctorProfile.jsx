import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const UpdateDoctorProfile = () => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        specialization: ''
    });

    const [specializations, setSpecializations] = useState([]); // 의사 전문 분야 목록
    const [loading, setLoading] = useState(false); // 폼 제출 로딩 상태
    const [loadingEnums, setLoadingEnums] = useState(true); // 전문 분야 로딩 상태
    const [error, setError] = useState(''); // 에러 메시지
    const [success, setSuccess] = useState(''); // 성공 메시지
    const navigate = useNavigate(); // 페이지 이동 훅

    useEffect(() => {
        fetchProfileData();
        fetchSpecializations();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await apiService.getMyDoctorProfile();

            if (response.data.statusCode === 200) {
                const doctorData = response.data.data;

                setFormData({
                    firstName: doctorData.firstName || '',
                    lastName: doctorData.lastName || '',
                    specialization: doctorData.specialization || ''
                });
            }
        } catch (error) {
            setError('프로필 데이터를 불러오는 중 오류가 발생했습니다.');
        }
    };

    const fetchSpecializations = async () => {
        try {
            const response = await apiService.getAllDocgetAllSpecializationEnumstors();

            if (response.data.statusCode === 200) {
                setSpecializations(response.data.data);
            }
        } catch (error) {
            setError('전문 분야 데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoadingEnums(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCancel = () => {
        navigate('/doctor/profile');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apiService.updateMyDoctorProfile(formData);

            if (response.data.statusCode === 200) {
                setSuccess('프로필이 성공적으로 업데이트되었습니다.');
                setTimeout(() => {
                    navigate('/doctor/profile');
                }, 5000);
            } else {
                setError(response.data.message || '프로필 업데이트에 실패했습니다.');
            }
        } catch (error) {
            setError(error.response?.data?.message || '프로필 업데이트 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">의사 프로필 수정</h2>
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
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">성</label>
                            <input
                                type="text"
                                name="lastName"
                                className="form-input"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="성을 입력하세요"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">이름</label>
                            <input
                                type="text"
                                name="firstName"
                                className="form-input"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="이름을 입력하세요"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">전문 분야</label>
                        <select
                            name="specialization"
                            className="form-select"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                            disabled={loadingEnums}
                        >
                            <option value="">전문 분야 선택</option>
                            {specializations.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                </option>
                            ))}
                        </select>
                        {loadingEnums && (
                            <small className="form-help">전문 분야를 불러오는 중...</small>
                        )}
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
                            {loading ? '업데이트 중...' : '프로필 업데이트'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default UpdateDoctorProfile;