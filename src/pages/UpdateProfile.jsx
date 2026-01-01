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
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-semibold text-center mb-6">환자 프로필 수정</h2>

                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded mb-4 text-center">{error}</div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded mb-4 text-center">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#2c3e50] mb-2">이름</label>
                            <input
                                type="text"
                                name="firstName"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db]/10"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="이름을 입력하세요"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#2c3e50] mb-2">성</label>
                            <input
                                type="text"
                                name="lastName"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db]/10"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="성을 입력하세요"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">전화번호</label>
                        <input
                            type="tel"
                            name="phone"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db]/10"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="전화번호를 입력하세요"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">생년월일</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db]/10"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-[#2c3e50] mb-2">혈액형</label>
                            <select
                                name="bloodGroup"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db]/10"
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

                        <div>
                            <label className="block text-sm font-medium text-[#2c3e50] mb-2">유전형</label>
                            <select
                                name="genotype"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db]/10"
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

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">알레르기 정보</label>
                        <textarea
                            name="knownAllergies"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db]/10"
                            value={formData.knownAllergies}
                            onChange={handleChange}
                            placeholder="알레르기가 있다면 쉼표로 구분하여 입력하세요"
                            rows="3"
                        />
                        <small className="text-gray-500">여러 알레르기는 쉼표로 구분하세요</small>
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            onClick={handleCancel}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-4 py-2 rounded font-semibold disabled:opacity-60"
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