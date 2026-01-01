import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const DoctorProfile = () => {

    const [userData, setUserData] = useState(null); // 사용자 데이터 상태
    const [doctorData, setDoctorData] = useState(null); // 의사 데이터 상태
    const [error, setError] = useState(''); // 에러 메시지 상태
    const [uploading, setUploading] = useState(false); // 프로필 사진 업로드 로딩 상태
    const [uploadError, setUploadError] = useState(''); // 업로드 에러 메시지 상태
    const [uploadSuccess, setUploadSuccess] = useState(''); // 업로드 성공 메시지 상태

    const navigate = useNavigate(); // 페이지 이동 훅

    useEffect(() => {
        fetchDoctorData();
    }, []);

    const fetchDoctorData = async () => {
        try {
            
            const userResponse = await apiService.getUserDetails(); // 사용자 정보 가져오기

            if (userResponse.data.statusCode === 200) {
                setUserData(userResponse.data.data); // 사용자 데이터 상태 업데이트

                const doctorResponse = await apiService.getMyDoctorProfile(); // 내 의사 프로필 가져오기
                if (doctorResponse.data.statusCode === 200) {
                    setDoctorData(doctorResponse.data.data); // 의사 데이터 상태 업데이트
                } else {
                    setError('의사 정보를 불러오는 데 실패했습니다.');
                }
            }
        } catch (error) {
            setError('의사 정보를 불러오는 중 오류가 발생했습니다.');
            console.error('Error fetching doctor data:', error);
        }
    };

    const handleUpdateProfile = () => {
        navigate('/doctor/update-profile');
    };

    const handleUpdatePassword = () => {
        navigate('/update-password');
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

        if (file.size > 10 * 1024 * 1024) { // 10MB 제한
            setUploadError('파일 크기는 10MB 이하이어야 합니다');
            return;
        }

        setUploading(true);
        setUploadError('');
        setUploadSuccess('');

        try {
            const response = await apiService.uploadProfilePicture(file); // 프로필 사진 업로드 API 호출
            if (response.data.statusCode === 200) {
                setUploadSuccess('프로필 사진이 성공적으로 업데이트되었습니다!');
                fetchDoctorData(); // 의사 데이터 다시 불러오기
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
    
    const formatSpecialization = (spec) => {
        if (!spec) return '지정되지 않음';
        return spec.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
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
                                    {userData?.name?.charAt(0)?.toUpperCase() || 'D'}
                                </div>
                                <div className="absolute left-0 right-0 bottom-0 bg-black/60 p-1 text-center opacity-0 hover:opacity-100 transition">
                                    <label htmlFor="doctor-profile-picture-upload" className="text-white text-sm cursor-pointer">
                                        {uploading ? '업로드 중...' : '사진 변경'}
                                    </label>
                                    <input
                                        id="doctor-profile-picture-upload"
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
                            <h1 className="text-2xl font-semibold">의사 프로필</h1>
                            <p className="text-white/90">Dr. {userData?.name}</p>
                            {doctorData && (
                                <p className="text-white/90 italic">{formatSpecialization(doctorData.specialization)}</p>
                            )}
                        </div>

                        <div className="flex gap-3 ml-auto flex-wrap">
                            <button onClick={handleUpdateProfile} className="bg-white text-[#667eea] px-4 py-2 rounded-md font-semibold">프로필 수정</button>
                            <button onClick={handleUpdatePassword} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">비밀번호 변경</button>
                            <Link to="/doctor/appointments" className="bg-white text-[#667eea] px-4 py-2 rounded-md font-semibold">내 예약</Link>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* 사용자 정보 섹션 */}
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
                                <div className="text-sm text-gray-600">사용자 ID</div>
                                <div className="mt-1 p-3 bg-gray-50 rounded">{userData?.id || '제공되지 않음'}</div>
                            </div>
                        </div>
                    </div>

                    {doctorData && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 border-l-4 border-[#3498db] pl-4">전문 정보</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600">성</div>
                                    <div className="mt-1 p-3 bg-gray-50 rounded">{doctorData.lastName || '제공되지 않음'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">이름</div>
                                    <div className="mt-1 p-3 bg-gray-50 rounded">{doctorData.firstName || '제공되지 않음'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">전문 분야</div>
                                    <div className="mt-1 p-3 bg-gray-50 rounded">{formatSpecialization(doctorData.specialization)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">의사 ID</div>
                                    <div className="mt-1 p-3 bg-gray-50 rounded">{doctorData.id || '제공되지 않음'}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!doctorData && (
                        <div className="mb-6">
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded">
                                <p className="text-gray-700">의사 프로필이 없습니다. 전문 정보를 추가하려면 프로필을 수정하세요.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default DoctorProfile;