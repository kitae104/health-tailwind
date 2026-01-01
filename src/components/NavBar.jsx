import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const NavBar = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);  // 인증 상태 관리
    const [isPatient, setIsPatient] = useState(false);            // 환자 역할 관리
    const [isDoctor, setIsDoctor] = useState(false);              // 의사 역할 관리
    const [showLogoutModal, setShowLogoutModal] = useState(false); // 로그아웃 모달 상태 관리

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus();  // 컴포넌트 마운트 시 인증 상태 확인
    }, [location]);

    const checkAuthStatus = () => {
        setIsAuthenticated(apiService.isAuthenticated());   // 인증 상태 업데이트
        setIsPatient(apiService.isPatient());   // 환자 역할 업데이트
        setIsDoctor(apiService.isDoctor()); // 의사 역할 업데이트
    }

    const handleLogoutClick = () => {
        setShowLogoutModal(true);  // 로그아웃 모달 표시
    }

    const handleConfirmLogout = () => {
        apiService.logout();  // 로그아웃 처리
        setShowLogoutModal(false);  // 모달 닫기
        navigate('/login');  // 로그인 페이지로 이동
    }

    const handleCancelLogout = () => {
        setShowLogoutModal(false);  // 모달 닫기
    }

    const baseLinkClass = 'text-white no-underline px-3 py-2 rounded transition transform hover:bg-white/20 hover:-translate-y-1 font-medium';
    const activeLinkClass = 'bg-white/30 font-semibold';
    const isActiveLink = (path) => {
        return location.pathname === path ? `${baseLinkClass} ${activeLinkClass}` : baseLinkClass;
    }

    return (
        <>
            <nav className="bg-gradient-to-br from-[#667eea] to-[#764ba2] py-4 shadow-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-5">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
                            <span className="text-2xl">🩺</span>
                            <span>TeleMed</span>
                        </Link>

                        <div className="flex items-center gap-6 flex-wrap">
                            <Link to="/" className={isActiveLink('/')}>
                                홈
                            </Link>

                            {!isAuthenticated ? (
                                <>
                                    <Link to="/login" className={isActiveLink('/login')}>
                                        로그인
                                    </Link>
                                    <Link to="/register" className={isActiveLink('/register')}>
                                        환자로 등록
                                    </Link>
                                    <Link to="/register-doctor" className={isActiveLink('/register-doctor')}>
                                        의사로 등록
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {/* 환자 전용 링크 */}
                                    {isPatient && (
                                        <>
                                            <Link to="/profile" className={isActiveLink('/profile')}>
                                                프로필
                                            </Link>
                                            <Link to="/book-appointment" className={isActiveLink('/book-appointment')}>
                                                예약하기
                                            </Link>
                                            <Link to="/my-appointments" className={isActiveLink('/my-appointments')}>
                                                내 예약
                                            </Link>
                                        </>
                                    )}

                                    {/* 의사 전용 링크 */}
                                    {isDoctor && (
                                        <>
                                            <Link to="/doctor/profile" className={isActiveLink('/doctor/profile')}>
                                                의사 대시보드
                                            </Link>
                                            <Link to="/doctor/appointments" className={isActiveLink('/doctor/appointments')}>
                                                내 예약
                                            </Link>
                                        </>
                                    )}

                                    <button onClick={handleLogoutClick} className="bg-white/20 border border-white text-white px-3 py-2 rounded cursor-pointer font-medium hover:bg-white hover:text-[#667eea] transition transform hover:-translate-y-1">
                                        로그아웃
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* 로그아웃 확인 모달 */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-[90%] animate-[modalSlideIn_0.3s_ease-out]">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg text-[#2c3e50]">로그아웃 확인</h3>
                        </div>
                        <div className="p-6 text-gray-600">
                            <p>정말 로그아웃 하시겠습니까?</p>
                        </div>
                        <div className="p-4 flex gap-4 justify-end border-t border-gray-200">
                            <button
                                onClick={handleCancelLogout}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-4 py-2 rounded font-semibold hover:-translate-y-1"
                            >
                                예, 로그아웃
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default NavBar