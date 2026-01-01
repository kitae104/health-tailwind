import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const UpdateProfile = () => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        dateOfBirth: '',
        knownAllergies: '',
        bloodGroup: '',
        genotype: ''
    });

    const [bloodGroups, setBloodGroups] = useState([]); // 혈액형 목록
    const [genotypes, setGenotypes] = useState([]); // 유전자형 목록
    const [loading, setLoading] = useState(false); // 폼 제출 로딩 상태
    const [loadingEnums, setLoadingEnums] = useState(true); // 열거형 로딩 상태
    const [error, setError] = useState(''); // 에러 메시지 상태
    const [success, setSuccess] = useState(''); // 성공 메시지 상태
    
    const navigate = useNavigate(); // 네비게이션 훅

    useEffect(() => {
        fetchProfileData();
        fetchEnums();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await apiService.getMyPatientProfile();    // 내 환자 프로필 조회 API 호출

            if (response.data.statusCode === 200) {
                const patientData = response.data.data;
                setFormData({
                    firstName: patientData.firstName || '',
                    lastName: patientData.lastName || '',
                    phone: patientData.phone || '',
                    dateOfBirth: patientData.dateOfBirth || '',
                    knownAllergies: patientData.knownAllergies || '',
                    bloodGroup: patientData.bloodGroup || '',
                    genotype: patientData.genotype || ''
                });
            }
        } catch (error) {
            setError("프로필 데이터를 불러오는 중 오류가 발생했습니다.");
        }
    };

    const fetchEnums = async () => {
        try {
            const [bloodGroupResponse, genotypeResponse] = await Promise.all([
                apiService.getAllBloodGroupEnums(),
                apiService.getAllGenotypeEnums()
            ]);

            if (bloodGroupResponse.data.statusCode === 200) {
                setBloodGroups(bloodGroupResponse.data.data);   // 혈액형 열거형 설정
            }

            if (genotypeResponse.data.statusCode === 200) {
                setGenotypes(genotypeResponse.data.data); // 유전자형 열거형 설정
            }
        } catch (error) {
            setError("열거형 데이터를 불러오는 중 오류가 발생했습니다.");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apiService.updateMyPatientProfile(formData);

            if (response.data.statusCode === 200) {
                setSuccess("프로필이 성공적으로 업데이트되었습니다.");
                setTimeout(() => {
                    navigate('/profile'); // 프로필 페이지로 이동
                }, 5000);
            } else {
                setError(response.data.message || "프로필 업데이트에 실패했습니다.");
            }
        } catch (error) {
            setError("프로필 업데이트 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/profile'); // 프로필 페이지로 이동
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2 className="form-title">환자 프로필 수정</h2>

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
                    </div>

                    <div className="form-group">
                        <label className="form-label">전화번호</label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-input"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="전화번호를 입력하세요"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">생년월일</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            className="form-input"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">혈액형</label>
                            <select
                                name="bloodGroup"
                                className="form-select"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                disabled={loadingEnums}
                            >
                                <option value="">혈액형 선택</option>
                                {bloodGroups.map((group) => (
                                    <option key={group} value={group}>
                                        {group.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">유전형</label>
                            <select
                                name="genotype"
                                className="form-select"
                                value={formData.genotype}
                                onChange={handleChange}
                                disabled={loadingEnums}
                            >
                                <option value="">유전형 선택</option>
                                {genotypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">알레르기 정보</label>
                        <textarea
                            name="knownAllergies"
                            className="form-input"
                            value={formData.knownAllergies}
                            onChange={handleChange}
                            placeholder="알레르기가 있다면 쉼표로 구분하여 입력하세요"
                            rows="3"
                        />
                        <small className="form-help">여러 알레르기는 쉼표로 구분하세요</small>
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
    );
}

export default UpdateProfile;