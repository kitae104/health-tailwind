import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white py-16 md:py-24">
                <div className="max-w-6xl mx-auto px-5">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                                TeleMed <span className="text-white font-extrabold">헬스케어</span>에 오신 것을 환영합니다
                            </h1>
                            <p className="text-lg md:text-xl opacity-90 mt-4 max-w-xl">
                                집에서 편안하게 의료진과 연결하세요. 접근하기 쉽고 편리하며 안전한 양질의 의료서비스.
                            </p>
                            <div className="flex gap-8 mt-6">
                                <div className="flex gap-8 mt-6">
                                    <div className="text-center">
                                        <div className="text-2xl md:text-3xl font-bold">24/7</div>
                                        <div className="text-sm opacity-80">연중무휴</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl md:text-3xl font-bold">50+</div>
                                        <div className="text-sm opacity-80">전문가</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl md:text-3xl font-bold">1000+</div>
                                        <div className="text-sm opacity-80">환자 수</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <Link to="/register" className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:-translate-y-1 transition">
                                    환자 회원가입
                                </Link>
                                <Link to="/register-doctor" className="bg-white/20 text-white border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#667eea] transition">
                                    의사 등록
                                </Link>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="bg-white/10 rounded-2xl p-12 text-center backdrop-blur-md border border-white/20">
                                <div className="text-4xl mb-4">🏥</div>
                                <p>원격의료 일러스트레이션</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Features Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-6xl mx-auto px-5">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl text-[#2c3e50] font-semibold">TeleMed를 선택하는 이유</h2>
                        <p className="text-gray-600">찾아오는 의료 서비스를 경험하세요</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition">
                            <div className="text-3xl mb-3">⏰</div>
                            <h3 className="text-lg font-semibold">빠른 접근</h3>
                            <p className="text-gray-600 mt-2">몇 분 내로 진료 상담을 받을 수 있어 대기실이나 긴 줄이 없습니다.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition">
                            <div className="text-3xl mb-3">🏠</div>
                            <h3 className="text-lg font-semibold">어디서나</h3>
                            <p className="text-gray-600 mt-2">집이나 사무실 등 인터넷이 연결된 어디서나 의사와 연결하세요.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition">
                            <div className="text-3xl mb-3">🔒</div>
                            <h3 className="text-lg font-semibold">안전하고 비공개</h3>
                            <p className="text-gray-600 mt-2">의료 정보는 기업 수준의 보안 조치로 안전하게 보호됩니다.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition">
                            <div className="text-3xl mb-3">💼</div>
                            <h3 className="text-lg font-semibold">전문 의료진</h3>
                            <p className="text-gray-600 mt-2">검증된 경험 많은 의료진과 다양한 전문 분야에서 상담하세요.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition">
                            <div className="text-3xl mb-3">📱</div>
                            <h3 className="text-lg font-semibold">사용하기 쉬움</h3>
                            <p className="text-gray-600 mt-2">모든 연령대의 환자가 사용하기 쉽도록 간단하고 직관적으로 설계되었습니다.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition">
                            <div className="text-3xl mb-3">💊</div>
                            <h3 className="text-lg font-semibold">처방 서비스</h3>
                            <p className="text-gray-600 mt-2">일반적인 건강 문제에 대해 디지털 처방전과 의료 조언을 제공합니다.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-12 bg-white">
                <div className="max-w-6xl mx-auto px-5">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl text-[#2c3e50] font-semibold">이용 방법</h2>
                        <p className="text-gray-600">의료 서비스를 받는 것이 더 쉬워졌습니다</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center font-bold">1</div>
                            <div>
                                <h3 className="text-lg font-semibold">계정 만들기</h3>
                                <p className="text-gray-600 mt-1">환자로 가입하고 몇 분 만에 의료 프로필을 완성하세요.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center font-bold">2</div>
                            <div>
                                <h3 className="text-lg font-semibold">예약하기</h3>
                                <p className="text-gray-600 mt-1">가능한 의사 중에서 선택하고 편한 시간대를 예약하세요.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center font-bold">3</div>
                            <div>
                                <h3 className="text-lg font-semibold">화상 진료</h3>
                                <p className="text-gray-600 mt-1">예약된 시간에 안전한 화상 통화로 의사와 상담하세요.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center font-bold">4</div>
                            <div>
                                <h3 className="text-lg font-semibold">진료 받기</h3>
                                <p className="text-gray-600 mt-1">진단, 치료 계획 및 필요 시 처방을 받으세요.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Specialties Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-6xl mx-auto px-5">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl text-[#2c3e50] font-semibold">제공 전문 분야</h2>
                        <p className="text-gray-600">다양한 의료 분야에서 포괄적인 진료를 제공합니다</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <div className="text-3xl mb-3">❤️</div>
                            <h4 className="font-semibold">심장내과</h4>
                            <p className="text-gray-600">심장 및 심혈관 건강</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <div className="text-3xl mb-3">🧠</div>
                            <h4 className="font-semibold">신경과</h4>
                            <p className="text-gray-600">뇌 및 신경계 질환</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <div className="text-3xl mb-3">👶</div>
                            <h4 className="font-semibold">소아과</h4>
                            <p className="text-gray-600">아동 건강 및 성장</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <div className="text-3xl mb-3">🦴</div>
                            <h4 className="font-semibold">정형외과</h4>
                            <p className="text-gray-600">뼈 및 관절 건강</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <div className="text-3xl mb-3">😊</div>
                            <h4 className="font-semibold">정신건강과</h4>
                            <p className="text-gray-600">정신 건강 및 웰빙</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <div className="text-3xl mb-3">👁️</div>
                            <h4 className="font-semibold">안과</h4>
                            <p className="text-gray-600">눈 관리 및 시력 건강</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-[#2c3e50] to-[#3498db] text-white py-12">
                <div className="max-w-6xl mx-auto px-5 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl font-semibold mb-2">시작할 준비가 되셨나요?</h2>
                        <p className="opacity-90 mb-6">이미 TeleMed를 사용하는 수천 명의 환자와 의사에 합류하세요</p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link to="/register" className="bg-white text-[#667eea] px-6 py-3 rounded-lg font-semibold">시작하기</Link>
                            <Link to="/login" className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#2c3e50] transition">기존 사용자 로그인</Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Home