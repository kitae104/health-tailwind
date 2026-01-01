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
            <div className="container">
                <div className="form-container">
                    <div className="alert alert-error">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-header-main">
                        <div className="profile-picture-section">
                            <div className="profile-picture-container">
                                {getProfilePictureUrl() ? (
                                    <img
                                        src={getProfilePictureUrl()}
                                        alt="Profile"
                                        className="profile-picture"
                                        onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                    />
                                ) : null}
                                <div className={`profile-picture-placeholder ${getProfilePictureUrl() ? 'hidden' : ''}`}>
                                    {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="profile-picture-overlay">
                                    <label htmlFor="profile-picture-upload" className="upload-label">
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
                                <div className="alert alert-error mt-1">
                                    {uploadError}
                                </div>
                            )}
                            {uploadSuccess && (
                                <div className="alert alert-success mt-1">
                                    {uploadSuccess}
                                </div>
                            )}
                        </div>
                        <div className="profile-title-section">
                            <h1 className="profile-title">내 프로필</h1>
                            <p className="profile-subtitle">{userData?.name}</p>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button onClick={handleUpdateProfile} className="btn btn-primary">
                            프로필 수정
                        </button>
                        <button onClick={handleUpdatePassword} className="btn btn-secondary">
                            비밀번호 변경
                        </button>
                        <Link to="/book-appointment" className="btn btn-primary">
                            상담 예약 하기
                        </Link>
                        <Link to="/my-appointments" className="btn btn-secondary">
                            예약 정보 확인
                        </Link>
                        <Link to="/consultation-history" className="btn btn-outline">
                            진료 기록
                        </Link>
                    </div>
                    <div className="profile-actions">
                        
                    </div>
                </div>

                <div className="profile-content">
                    {/* User Information Section */}
                    <div className="profile-section">
                        <h2 className="section-title">계정 정보</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <label className="info-label">이름</label>
                                <div className="info-value">{userData?.name || '제공되지 않음'}</div>
                            </div>
                            <div className="info-item">
                                <label className="info-label">이메일</label>
                                <div className="info-value">{userData?.email || '제공되지 않음'}</div>
                            </div>
                            {/* <div className="info-item">
                                <label className="info-label">User ID</label>
                                <div className="info-value">{userData?.id || 'Not provided'}</div>
                            </div> */}
                            <div className="info-item">
                                <label className="info-label">역할</label>
                                <div className="info-value">
                                    {userData?.roles?.map(role => role.name).join(', ') || '제공되지 않음'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Patient Information Section */}
                    {patientData && (
                        <div className="profile-section">
                            <h2 className="section-title">의료 정보</h2>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label className="info-label">이름</label>
                                    <div className="info-value">{patientData.firstName || '제공되지 않음'}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">성</label>
                                    <div className="info-value">{patientData.lastName || '제공되지 않음'}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">전화번호</label>
                                    <div className="info-value">{patientData.phone || '제공되지 않음'}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">생년월일</label>
                                    <div className="info-value">{formatDate(patientData.dateOfBirth)}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">혈액형</label>
                                    <div className="info-value">{formatBloodGroup(patientData.bloodGroup)}</div>
                                </div>
                                <div className="info-item">
                                    <label className="info-label">유전형(겐타입)</label>
                                    <div className="info-value">{patientData.genotype || '제공되지 않음'}</div>
                                </div>
                                <div className="info-item full-width">
                                    <label className="info-label">알레르기 정보</label>
                                    <div className="info-value">
                                        {patientData.knownAllergies || '알레르기 정보 없음'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!patientData && (
                        <div className="profile-section">
                            <div className="alert alert-info">
                                <p>환자 프로필이 없습니다. 의료 정보를 추가하려면 프로필을 업데이트하세요.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default Profile;