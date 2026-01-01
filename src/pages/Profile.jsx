import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Profile = () => {

    const [userData, setUserData] = useState(null);  // 사용자 기본 정보
    const [patientData, setPatientData] = useState(null); // 환자 정보

    const [error, setError] = useState(''); // 에러 메시지
    const [uploading, setUploading] = useState(false); // 업로드 상태
    const [uploadError, setUploadError] = useState(''); // 업로드 에러 메시지
    const [uploadSuccess, setUploadSuccess] = useState(''); // 업로드 성공 메시지

    const navigate = useNavigate(); // 페이지 이동 훅

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const userResponse = await apiService.getUserDetails(); // 사용자 기본 정보 API 호출

            if (userResponse.data.statusCode === 200) {
                setUserData(userResponse.data.data); // 사용자 기본 정보 설정

                if (userResponse.data.data.roles.some(role => role.name === 'PATIENT')) {
                    const patientResponse = await apiService.getMyPatientProfile(); // 환자 정보 API 호출
                    if (patientResponse.data.statusCode === 200) {                        
                        setPatientData(patientResponse.data.data); // 환자 정보 설정
                    } else {
                        setError('환자 정보를 불러오는 데 실패했습니다.');
                    }
                }
            }
        } catch (error) {
            setError('사용자 정보를 불러오는 데 실패했습니다.');
            console.error('사용자 정보를 가져오는데 실패했습니다.', error);
        }
    };

    const handleUpdateProfile = () => {
        navigate('/update-profile');    // 프로필 수정 페이지로 이동
    };

    const handleUpdatePassword = () => {
        navigate('/update-password'); // 비밀번호 수정 페이지로 이동
    };


    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0]; // 선택된 파일 가져오기
        if (!file) return;

        // 파일 타입 및 크기 검증
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (!validTypes.includes(file.type)) {
            setUploadError('유효한 이미지 파일을 선택하세요 (JPEG, PNG, GIF)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB 제한
            setUploadError('파일 크기는 5MB 이하이어야 합니다');
            return;
        }

        setUploading(true);
        setUploadError('');
        setUploadSuccess('');

        try {
            const response = await apiService.uploadProfilePicture(file); // 프로필 사진 업로드 API 호출
            if (response.data.statusCode === 200) {
                setUploadSuccess('프로필 사진이 성공적으로 업데이트되었습니다!');
                fetchUserData(); // 사용자 데이터 다시 불러오기
                event.target.value = ''; // 파일 입력 초기화
            } else {
                setUploadError(response.data.message || '프로필 사진 업로드에 실패했습니다.');
            }
        } catch (error) {
            setUploadError(error.response?.data?.message || '프로필 사진 업로드 중 오류가 발생했습니다.');
            console.error('프로필 사진 업로드 실패:', error);
        } finally {
            setUploading(false);
        }
    };

    const formatDate = (dataString) => {
        if (!dataString) return "Not provided";
        return new Date(dataString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatBloodGroup = (bloodGroup) => {
        if (!bloodGroup) return "Not provided";
        return bloodGroup.replace('_', ' ');
    };

    const getProfilePictureUrl = () => {        
        if (!userData?.profilePictureUrl) {
            return null;
        }        
        return userData.profilePictureUrl;
    };

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-5 py-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-5 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-6">
                    <div className="flex items-start gap-6 flex-wrap">
                        <div className="flex-shrink-0">
                            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                {getProfilePictureUrl() ? (
                                    <img
                                        src={getProfilePictureUrl()}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                    />
                                ) : null}
                                <div className={`w-full h-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white text-2xl font-bold ${getProfilePictureUrl() ? 'hidden' : ''}`}>
                                    {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="absolute left-0 right-0 bottom-0 bg-black/60 p-1 text-center opacity-0 hover:opacity-100 transition">
                                    <label htmlFor="profile-picture-upload" className="text-white text-sm cursor-pointer">
                                        {uploading ? '업로드 중...' : '사진 변경'}
                                    </label>
                                    <input
                                        id="profile-picture-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        disabled={uploading}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                            {uploadError && (
                                <div className="bg-red-100 border border-red-200 text-red-700 p-2 rounded mt-3 text-sm">
                                    {uploadError}
                                </div>
                            )}
                            {uploadSuccess && (
                                <div className="bg-green-100 border border-green-200 text-green-700 p-2 rounded mt-3 text-sm">
                                    {uploadSuccess}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-semibold">내 프로필</h1>
                            <p className="text-white/90">{userData?.name}</p>
                        </div>

                        <div className="flex gap-3 ml-auto flex-wrap">
                            <button onClick={handleUpdateProfile} className="bg-white text-[#667eea] px-4 py-2 rounded-md font-semibold">프로필 수정</button>
                            <button onClick={handleUpdatePassword} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">비밀번호 변경</button>
                            <Link to="/book-appointment" className="bg-white text-[#667eea] px-4 py-2 rounded-md font-semibold">상담 예약 하기</Link>
                            <Link to="/my-appointments" className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">예약 정보 확인</Link>
                            <Link to="/consultation-history" className="border border-white text-white px-4 py-2 rounded-md">진료 기록</Link>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4 border-l-4 border-[#3498db] pl-4">계정 정보</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <div className="text-sm text-gray-600">이름</div>
                                <div className="mt-1 p-3 bg-gray-50 rounded">{userData?.name || '제공되지 않음'}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">이메일</div>
                                <div className="mt-1 p-3 bg-gray-50 rounded">{userData?.email || '제공되지 않음'}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">역할</div>
                                <div className="mt-1 p-3 bg-gray-50 rounded">{userData?.roles?.map(role => role.name).join(', ') || '제공되지 않음'}</div>
                            </div>
                        </div>
                    </div>

                    {patientData && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 border-l-4 border-[#3498db] pl-4">의료 정보</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600">이름</div>
                                    <div className="mt-1 p-3 bg-gray-50 rounded">{patientData.firstName || '제공되지 않음'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">성</div>
                                    <div className="mt-1 p-3 bg-gray-50 rounded">{patientData.lastName || '제공되지 않음'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">전화번호</div>
                                    <div className="mt-1 p-3 bg-gray-50 rounded">{patientData.phone || '제공되지 않음'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">생년월일</div>
                                    <div className="mt-1 p-3 bg-gray-50 rounded">{formatDate(patientData.dateOfBirth)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">혈액형</div>
                                    <div className="mt-1 p-3 bg-gray-50 rounded">{formatBloodGroup(patientData.bloodGroup)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">유전형(겐타입)</div>
                                    <div className="mt-1 p-3 bg-gray-50 rounded">{patientData.genotype || '제공되지 않음'}</div>
                                </div>
                                <div className="md:col-span-3">
                                    <div className="text-sm text-gray-600">알레르기 정보</div>
                                    <div className="mt-1 p-3 bg-gray-50 rounded">{patientData.knownAllergies || '알레르기 정보 없음'}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!patientData && (
                        <div className="mb-6">
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded">
                                <p className="text-gray-700">환자 프로필이 없습니다. 의료 정보를 추가하려면 프로필을 업데이트하세요.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default Profile;