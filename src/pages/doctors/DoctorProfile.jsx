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
                                    {userData?.name?.charAt(0)?.toUpperCase() || 'D'}
                                </div>

                                <div className="profile-picture-overlay">
                                    <label htmlFor="doctor-profile-picture-upload" className="upload-label">
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
                            <h1 className="profile-title">의사 프로필</h1>
                            <p className="profile-subtitle">Dr. {userData?.name}</p>
                            {doctorData && (
                                <p className="profile-specialization">
                                    {formatSpecialization(doctorData.specialization)}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <div className="profile-actions">
                        <button onClick={handleUpdateProfile} className="btn btn-primary">
                            프로필 수정
                        </button>
                        <button onClick={handleUpdatePassword} className="btn btn-secondary">
                            비밀번호 변경
                        </button>
                        <Link to="/doctor/appointments" className="btn btn-primary">
                            내 예약
                        </Link>
                    </div>
                </div>

                <div className="profile-content">
                    {/* 사용자 정보 섹션 */}
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
                            <div className="info-item">
                                <label className="info-label">사용자 ID</label>
                                <div className="info-value">{userData?.id || '제공되지 않음'}</div>
                            </div>
                            <div className="info-item">
                                <label className="info-label">역할</label>
                                <div className="info-value">
                                    {userData?.roles?.map(role => role.name).join(', ') || '제공되지 않음'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 의사 정보 섹션 */}
                    {doctorData && (
                        <div className="profile-section">
                            <h2 className="section-title">전문 정보</h2>
                            <div className="info-grid">
                                <div className="info-item">
                                        <label className="info-label">성</label>
                                        <div className="info-value">{doctorData.lastName || '제공되지 않음'}</div>
                                </div>
                                <div className="info-item">
                                        <label className="info-label">이름</label>
                                        <div className="info-value">{doctorData.firstName || '제공되지 않음'}</div>
                                </div>
                                <div className="info-item">
                                        <label className="info-label">전문 분야</label>
                                        <div className="info-value">{formatSpecialization(doctorData.specialization)}</div>
                                </div>
                                <div className="info-item">
                                        <label className="info-label">의사 ID</label>
                                        <div className="info-value">{doctorData.id || '제공되지 않음'}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!doctorData && (
                        <div className="profile-section">
                            <div className="alert alert-info">
                                <p>의사 프로필이 없습니다. 전문 정보를 추가하려면 프로필을 수정하세요.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default DoctorProfile;