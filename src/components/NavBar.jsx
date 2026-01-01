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

    const isActiveLink = (path) => {
        return location.pathname === path ? 'nav-link active' : 'nav-link';
    }

    return (
        <>
            <nav className="navbar">
                <div className="container">
                    <div className="navbar-content">
                        <Link to="/" className="logo">
                            TeleMed
                        </Link>

                        <div className="nav-links">
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

                                    <button onClick={handleLogoutClick} className="logout-btn">
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
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>로그아웃 확인</h3>
                        </div>
                        <div className="modal-body">
                            <p>정말 로그아웃 하시겠습니까?</p>
                        </div>
                        <div className="modal-actions">
                            <button
                                onClick={handleCancelLogout}
                                className="btn btn-secondary"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                className="btn btn-primary"
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