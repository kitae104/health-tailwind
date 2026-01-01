import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>TeleMed</h3>
                        <p>여러분의 건강이 최우선입니다 — 환자와 의료진을 연결합니다</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-section">
                            <h4>빠른 링크</h4>
                            <Link to="/" className="footer-link">홈</Link>
                            <Link to="/about" className="footer-link">회사 소개</Link>
                            <Link to="/services" className="footer-link">서비스</Link>
                            <Link to="/contact" className="footer-link">문의하기</Link>
                        </div>

                        <div className="footer-section">
                            <h4>환자를 위한 서비스</h4>
                            <Link to="/register" className="footer-link">회원가입</Link>
                            <Link to="/book-appointment" className="footer-link">예약하기</Link>
                            <Link to="/find-doctors" className="footer-link">의사 찾기</Link>
                        </div>

                        <div className="footer-section">
                            <h4>의사를 위한 서비스</h4>
                            <Link to="/register-doctor" className="footer-link">의사 등록</Link>
                            <Link to="/doctor-benefits" className="footer-link">혜택</Link>
                        </div>

                        <div className="footer-section">
                            <h4>법적 정보</h4>
                            <Link to="/privacy" className="footer-link">개인정보 처리방침</Link>
                            <Link to="/terms" className="footer-link">서비스 이용약관</Link>
                            <Link to="/cookies" className="footer-link">쿠키 정책</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">

                    <div className="social-links">
                        <a href="#!" className="social-link">페이스북</a>
                        <a href="#!" className="social-link">트위터</a>
                        <a href="#!" className="social-link">링크드인</a>
                        <a href="#!" className="social-link">인스타그램</a>
                    </div>

                    <div className="text-center mt-1">
                        <p>© 2026 TeleMed 원격의료 플랫폼.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer