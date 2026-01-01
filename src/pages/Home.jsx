import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">
                                TeleMed <span className="brand">헬스케어</span>에 오신 것을 환영합니다
                            </h1>
                            <p className="hero-subtitle">
                                집에서 편안하게 의료진과 연결하세요. 접근하기 쉽고 편리하며 안전한 양질의 의료서비스.
                            </p>
                            <div className="hero-stats">
                                <div className="stat">
                                    <div className="stat-number">24/7</div>
                                    <div className="stat-label">연중무휴</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-number">50+</div>
                                    <div className="stat-label">전문가</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-number">1000+</div>
                                    <div className="stat-label">환자 수</div>
                                </div>
                            </div>
                            <div className="hero-actions">
                                <Link to="/register" className="btn btn-primary btn-large">
                                    환자 회원가입
                                </Link>
                                <Link to="/register-doctor" className="btn btn-secondary btn-large">
                                    의사 등록
                                </Link>
                            </div>
                        </div>
                        <div className="hero-image">
                            <div className="image-placeholder">
                                <div className="medical-icon">🏥</div>
                                <p>원격의료 일러스트레이션</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2>TeleMed를 선택하는 이유</h2>
                        <p>찾아오는 의료 서비스를 경험하세요</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">⏰</div>
                            <h3>빠른 접근</h3>
                            <p>몇 분 내로 진료 상담을 받을 수 있어 대기실이나 긴 줄이 없습니다.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🏠</div>
                            <h3>어디서나</h3>
                            <p>집이나 사무실 등 인터넷이 연결된 어디서나 의사와 연결하세요.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>안전하고 비공개</h3>
                            <p>의료 정보는 기업 수준의 보안 조치로 안전하게 보호됩니다.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💼</div>
                            <h3>전문 의료진</h3>
                            <p>검증된 경험 많은 의료진과 다양한 전문 분야에서 상담하세요.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>사용하기 쉬움</h3>
                            <p>모든 연령대의 환자가 사용하기 쉽도록 간단하고 직관적으로 설계되었습니다.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💊</div>
                            <h3>처방 서비스</h3>
                            <p>일반적인 건강 문제에 대해 디지털 처방전과 의료 조언을 제공합니다.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header">
                        <h2>이용 방법</h2>
                        <p>의료 서비스를 받는 것이 더 쉬워졌습니다</p>
                    </div>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>계정 만들기</h3>
                                <p>환자로 가입하고 몇 분 만에 의료 프로필을 완성하세요.</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>예약하기</h3>
                                <p>가능한 의사 중에서 선택하고 편한 시간대를 예약하세요.</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>화상 진료</h3>
                                <p>예약된 시간에 안전한 화상 통화로 의사와 상담하세요.</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>진료 받기</h3>
                                <p>진단, 치료 계획 및 필요 시 처방을 받으세요.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Specialties Section */}
            <section className="specialties-section">
                <div className="container">
                    <div className="section-header">
                        <h2>제공 전문 분야</h2>
                        <p>다양한 의료 분야에서 포괄적인 진료를 제공합니다</p>
                    </div>
                    <div className="specialties-grid">
                        <div className="specialty-card">
                            <div className="specialty-icon">❤️</div>
                            <h4>심장내과</h4>
                            <p>심장 및 심혈관 건강</p>
                        </div>
                        <div className="specialty-card">
                            <div className="specialty-icon">🧠</div>
                            <h4>신경과</h4>
                            <p>뇌 및 신경계 질환</p>
                        </div>
                        <div className="specialty-card">
                            <div className="specialty-icon">👶</div>
                            <h4>소아과</h4>
                            <p>아동 건강 및 성장</p>
                        </div>
                        <div className="specialty-card">
                            <div className="specialty-icon">🦴</div>
                            <h4>정형외과</h4>
                            <p>뼈 및 관절 건강</p>
                        </div>
                        <div className="specialty-card">
                            <div className="specialty-icon">😊</div>
                            <h4>정신건강과</h4>
                            <p>정신 건강 및 웰빙</p>
                        </div>
                        <div className="specialty-card">
                            <div className="specialty-icon">👁️</div>
                            <h4>안과</h4>
                            <p>눈 관리 및 시력 건강</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>시작할 준비가 되셨나요?</h2>
                        <p>이미 TeleMed를 사용하는 수천 명의 환자와 의사에 합류하세요</p>
                        <div className="cta-actions">
                            <Link to="/register" className="btn btn-primary btn-large">
                                시작하기
                            </Link>
                            <Link to="/login" className="btn btn-outline btn-large">
                                기존 사용자 로그인
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Home