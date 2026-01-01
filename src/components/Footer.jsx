import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#2c3e50] text-white py-12 pb-4 mt-auto">
            <div className="max-w-6xl mx-auto px-5">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-[#3498db] text-xl font-semibold mb-2">TeleMed</h3>
                        <p className="text-[#bdc3c7] leading-relaxed">여러분의 건강이 최우선입니다 — 환자와 의료진을 연결합니다</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="text-[#3498db] mb-4 text-lg">빠른 링크</h4>
                            <Link to="/" className="block text-[#ecf0f1] hover:text-[#3498db] mb-2">홈</Link>
                            <Link to="/about" className="block text-[#ecf0f1] hover:text-[#3498db] mb-2">회사 소개</Link>
                            <Link to="/services" className="block text-[#ecf0f1] hover:text-[#3498db] mb-2">서비스</Link>
                            <Link to="/contact" className="block text-[#ecf0f1] hover:text-[#3498db] mb-2">문의하기</Link>
                        </div>

                        <div>
                            <h4 className="text-[#3498db] mb-4 text-lg">환자를 위한 서비스</h4>
                            <Link to="/register" className="block text-[#ecf0f1] hover:text-[#3498db] mb-2">회원가입</Link>
                            <Link to="/book-appointment" className="block text-[#ecf0f1] hover:text-[#3498db] mb-2">예약하기</Link>
                            <Link to="/find-doctors" className="block text-[#ecf0f1] hover:text-[#3498db] mb-2">의사 찾기</Link>
                        </div>

                        <div>
                            <h4 className="text-[#3498db] mb-4 text-lg">의사를 위한 서비스</h4>
                            <Link to="/register-doctor" className="block text-[#ecf0f1] hover:text-[#3498db] mb-2">의사 등록</Link>
                            <Link to="/doctor-benefits" className="block text-[#ecf0f1] hover:text-[#3498db] mb-2">혜택</Link>
                        </div>

                        <div>
                            <h4 className="text-[#3498db] mb-4 text-lg">법적 정보</h4>
                            <Link to="/privacy" className="block text-[#ecf0f1] hover:text-[#3498db] mb-2">개인정보 처리방침</Link>
                            <Link to="/terms" className="block text-[#ecf0f1] hover:text-[#3498db] mb-2">서비스 이용약관</Link>
                            <Link to="/cookies" className="block text-[#ecf0f1] hover:text-[#3498db] mb-2">쿠키 정책</Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#34495e] pt-4">

                    <div className="flex justify-center gap-4 mb-4">
                        <a href="#!" className="text-[#bdc3c7] hover:text-[#3498db]">페이스북</a>
                        <a href="#!" className="text-[#bdc3c7] hover:text-[#3498db]">트위터</a>
                        <a href="#!" className="text-[#bdc3c7] hover:text-[#3498db]">링크드인</a>
                        <a href="#!" className="text-[#bdc3c7] hover:text-[#3498db]">인스타그램</a>
                    </div>

                    <div className="text-center mt-4">
                        <p>© 2026 TeleMed 원격의료 플랫폼.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer