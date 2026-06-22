import React from 'react';
import SmartLibraryAppImg from '@Images/smart_library_app.png';
import SmartLibrarySearchImg from '@Images/smart_library_search.png';
import SmartLibraryArchitecture from '@Images/smart_library_architecture.png';
import SmartLibrarySearchBeforeImg from '@Images/smart_library_search_before.png';
import SmartLibrarySearchAfterImg from '@Images/smart_library_search_after.png';
import SmartLibraryArtilleryBeforeImg from '@Images/smart_library_search_artillery_before.png';
import SmartLibraryArtilleryAfterImg from '@Images/smart_library_search_artillery_after.png';

const SmartLibraryContent = () => {
    return (
        <div className="modal-smart">
            {/* Part 1: 스마트도서관 전체 플랫폼 시스템 구조 (거시적 인프라) */}
            <section className="project-modal-section architecture-section-smart-library section-margin-top-first">
                <h4 className="styled-heading">🏗️ 스마트도서관 전체 시스템 및 데이터 흐름</h4>
                
                <div className="architecture-grid">
                    {/* Left Column: Platform Architecture Image */}
                    <div>
                        <img 
                            src={SmartLibraryArchitecture} 
                            alt="스마트도서관 전체 플랫폼 시스템 아키텍처" 
                            className="platform-arch-image"
                        />
                    </div>

                    {/* Right Column: Numbered Step-by-Step Flow Description */}
                    <div className="platform-flow-container">
                        <strong>
                            ▪︎ 플랫폼 실시간 데이터 동기화 플로우
                        </strong>
                        <ol className="platform-flow-list">
                            <li className="platform-flow-item">
                                <strong className="platform-flow-title">1. [로컬 기기] 대출/반납 발생</strong>
                                <span className="platform-flow-desc">지하철역 등 물리 기기 내 대출 및 반납 발생 시 원격 기기 로컬 DB 즉시 갱신 및 보관.</span>
                            </li>
                            <li className="platform-flow-item">
                                <strong className="platform-flow-title">2. [스케줄러] 중앙 서버 동기화</strong>
                                <span className="platform-flow-desc">기기 내 동기화 데몬 스케줄러가 수집 이벤트를 중앙 API 수신기로 실시간 전송 (HTTPS 통신).</span>
                            </li>
                            <li className="platform-flow-item">
                                <strong className="platform-flow-title">3. [타사 API] 외부 도서 메타 수집</strong>
                                <span className="platform-flow-desc">중앙 서버가 외부 검색 API(카카오, 인터파크, 도서관정보나루 등)를 동기 제어해 실시간 도서 정보를 가공 및 수렴.</span>
                            </li>
                            <li className="platform-flow-item">
                                <strong className="platform-flow-title">4. [웹/앱 서비스] 실시간 표출</strong>
                                <span className="platform-flow-desc">모바일 하이브리드 앱 및 백오피스, 그리고 **도서 검색 페이지(하단 상세사례)**로 도서 실시간 정보 즉시 제공.</span>
                            </li>
                        </ol>
                    </div>
                </div>
            </section>

            {/* Part 2: 고도화 사례 1: 모바일 하이브리드 앱 정식 출시 & UI/UX 개선 */}
            <section className="project-modal-section section-divider">
                <h4 className="styled-heading">📱 고도화 사례 1: 모바일 하이브리드 앱 출시</h4>
                
                <div className="project-modal-split-grid grid-wide">
                    <ul className="project-points no-margin" style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
                        <li><strong>자체 하이브리드 앱 출시:</strong> 구글 Play Store 및 애플 App Store 정식 런칭 및 운영 관리</li>
                        <li><strong>도서 검색 동선 50% 단축:</strong> 불필요한 화면 분기를 제거하여 도서 목록 조회 동선 단축 (기존 4단계 ➔ 2단계)</li>
                        <li><strong>지능형 도서 추천 엔진 결합:</strong> 검색 컨텍스트 내 맞춤형 도서 추천(인기/연관 도서) 기능을 동선에 결합하여 접근성 극대화</li>
                        <li><strong>모바일 앱 사용성 최적화:</strong> 웹뷰 로딩 시 흰 화면 깜빡임 현상을 스플래시 화면 동기화로 해결하고, 하이브리드 제스처 브릿지를 통해 네이티브 앱 수준의 인터랙션 제공</li>
                        <li><strong>iOS 환경 최적화:</strong> 아이폰 노치(Notch) 완벽 대응 풀스크린 및 뒤로가기 스와이처 제스처 브릿지 연동 최적화 완료</li>
                    </ul>
                    
                    {/* Purple App Mockup */}
                    <div className="project-modal-mockup-wrapper">
                        <img 
                            src={SmartLibraryAppImg} 
                            alt="스마트도서관 모바일 플랫폼 UI/UX" 
                            className="project-modal-mockup-image image-wide app-mockup-image"
                        />
                        <span className="project-modal-mockup-caption">모바일 하이브리드 앱 UI 목업</span>
                    </div>
                </div>
            </section>

            {/* Part 3: 핵심 요소 개선: 도서 검색 페이지 구조 혁신 및 성능 개선 */}
            <section className="project-modal-section section-divider">
                <h4 className="styled-heading">⚡ 고도화 사례 2: 도서 검색 페이지 구조 및 성능 혁신 (STAR)</h4>
                
                {/* Clean, minimalist STAR Outline */}
                <div className="star-grid">
                    <div className="star-card">
                        <strong className="platform-flow-title" style={{ color: 'var(--blue)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>📌 S-T (배경 및 문제)</strong>
                        <ul className="star-card-list">
                            <li><strong>상황:</strong> 관할지별로 물리 분산된 수많은 스마트도서관 기기의 실시간 도서 목록을 통합 조회해야 함.</li>
                            <li style={{ marginTop: '4px' }}><strong>문제점:</strong> 장비 DB 조회를 위해 서버(Gandalf)-장비(Frodo) 계층 간 무거운 3-Tier 소켓 양방향 통신을 처리하면서 잦은 연결 유실, 스레드 락킹, 느린 검색 지연 발생.</li>
                        </ul>
                    </div>

                    <div className="star-card">
                        <strong className="platform-flow-title" style={{ color: 'var(--green)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>⚡ A-R (해결 및 성과)</strong>
                        <ul className="star-card-list">
                            <li><strong>해결:</strong> 양방향 미들웨어 레이어를 완전 걷어내고, Spring의 <strong>RoutingDataSource</strong>를 도입해 기기 DB로 직접 원격 다이렉트 커넥션을 동적 라우팅하는 1-Tier 라우팅 솔루션 개발.</li>
                            <li style={{ marginTop: '4px' }}><strong>성과:</strong> 유지보수 단위 단일화(3개 ➔ <strong>1개</strong>) 및 빌드/배포 구조 일원화. 검색 성능을 p99 7.5초에서 <strong>93ms</strong>로 단축 (80배 향상).</li>
                        </ul>
                    </div>
                </div>

                {/* Architecture & Performance Comparison Grid */}
                <div className="comparison-grid">
                    {/* Before Column */}
                    <div className="comparison-column">
                        <span className="comparison-header before">
                            🔴 Before (레거시 3-Tier 소켓 미들웨어)
                        </span>
                        
                        <div className="comparison-image-group">
                            <img 
                                src={SmartLibrarySearchBeforeImg} 
                                alt="Legacy 3-Tier Architecture Diagram" 
                                className="comparison-diagram-img"
                            />
                            <span className="comparison-caption">3-Tier 복잡한 미들웨어 구조 (Gandalf / Frodo)</span>
                        </div>

                        <div className="comparison-image-group-nested">
                            <img 
                                src={SmartLibraryArtilleryBeforeImg} 
                                alt="Artillery Load Test Before" 
                                className="comparison-artillery-img"
                            />
                            <span className="comparison-caption">최대 7.5s 지연 (동시성 5 vu/s 환경)</span>
                        </div>
                    </div>

                    {/* After Column */}
                    <div className="comparison-column">
                        <span className="comparison-header after">
                            🔵 After (1-Tier RoutingDataSource 동적 라우팅)
                        </span>
                        
                        <div className="comparison-image-group">
                            <img 
                                src={SmartLibrarySearchAfterImg} 
                                alt="Optimized 1-Tier Architecture Diagram" 
                                className="comparison-diagram-img"
                            />
                            <span className="comparison-caption">1-Tier 다이렉트 동적 다중 DB 라우팅</span>
                        </div>

                        <div className="comparison-image-group-nested">
                            <img 
                                src={SmartLibraryArtilleryAfterImg} 
                                alt="Artillery Load Test After" 
                                className="comparison-artillery-img"
                            />
                            <span className="comparison-caption">p99 93ms로 안정 수렴 (동시성 100 vu/s 환경)</span>
                        </div>
                    </div>
                </div>

                {/* Blue Book Search Page Webapp UI Mockup */}
                <div className="search-showcase">
                    <h5 className="search-showcase-caption" style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🖥️ 최종 구현 결과: 반응형 모바일 도서 통합 검색페이지 UI (웹앱)
                    </h5>
                    <div className="search-showcase-inner">
                        <img 
                            src={SmartLibrarySearchImg} 
                            alt="도서 검색페이지 UI 목업" 
                            className="search-showcase-img"
                        />
                        <span className="search-showcase-caption">
                            실시간 다중 스마트도서관 기기 DB와 동적 결합되어 검색 결과를 출력하는 반응형 도서 검색 UI (웹앱)
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SmartLibraryContent;