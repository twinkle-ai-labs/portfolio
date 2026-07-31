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
                    <ul className="project-points no-margin app-result-list">
                        <li>
                            <strong>자체 하이브리드 앱 정식 출시</strong>
                            <ul>
                                <li>Google Play Store 및 Apple App Store 런칭</li>
                                <li>모바일 서비스 운영·배포 체계 구축</li>
                            </ul>
                        </li>
                        <li>
                            <strong>도서 검색 동선 50% 단축</strong>
                            <ul>
                                <li>불필요한 화면 분기 제거</li>
                                <li>도서 목록 조회 단계를 4단계에서 2단계로 축소</li>
                            </ul>
                        </li>
                        <li>
                            <strong>검색 기반 추천 경험 강화</strong>
                            <ul>
                                <li>인기·연관 도서 추천 엔진 결합</li>
                                <li>검색 컨텍스트 안에서 추천 도서 접근성 개선</li>
                            </ul>
                        </li>
                        <li>
                            <strong>모바일 앱 사용성 최적화</strong>
                            <ul>
                                <li>웹뷰 로딩 중 흰 화면 깜빡임을 스플래시 동기화로 개선</li>
                                <li>하이브리드 제스처 브릿지로 네이티브 앱 수준의 인터랙션 제공</li>
                            </ul>
                        </li>
                        <li>
                            <strong>iOS 환경 대응 강화</strong>
                            <ul>
                                <li>아이폰 노치 영역 대응 풀스크린 최적화</li>
                                <li>뒤로가기 스와이프 제스처 브릿지 연동</li>
                            </ul>
                        </li>
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

                <div className="smart-subtitle-block">
                    <strong>STAR 기반 개선 흐름</strong>
                    <span>기존 미들웨어 병목을 진단하고, 직접 DB 라우팅 구조로 전환한 과정을 정리했습니다.</span>
                </div>
                
                <div className="search-case-layout">
                    {/* Clean, minimalist STAR Outline */}
                    <div className="star-grid">
                        <div className="star-card star-step-card star-step-s">
                            <strong className="platform-flow-title star-step-title">
                                <span className="star-step-badge">S</span>
                                Situation
                            </strong>
                            <ul className="project-points no-margin app-result-list search-result-list">
                                <li>
                                    <strong>분산 기기 도서 목록 통합 조회 필요</strong>
                                    <ul>
                                        <li>관할지별로 물리 분산된 스마트도서관 기기 DB 조회</li>
                                        <li>이용자는 하나의 검색 화면에서 전체 도서 목록 확인 필요</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <div className="star-card star-step-card star-step-t">
                            <strong className="platform-flow-title star-step-title">
                                <span className="star-step-badge">T</span>
                                Task & Problem
                            </strong>
                            <div className="star-section-media">
                                <img
                                    src={SmartLibrarySearchBeforeImg}
                                    alt="Legacy 3-Tier Architecture Diagram"
                                    className="comparison-diagram-img legacy-middleware-img"
                                />
                                <span className="comparison-caption">기존 3-Tier 소켓 미들웨어 구조 (Gandalf / Frodo)</span>
                            </div>
                            <ul className="project-points no-margin app-result-list search-result-list">
                                <li>
                                    <strong>3-Tier 소켓 미들웨어 병목 발생</strong>
                                    <ul>
                                        <li>서버(Gandalf)-장비(Frodo) 간 양방향 통신 의존</li>
                                        <li>연결 유실, 스레드 락킹, 검색 지연 반복</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <div className="star-card star-step-card star-step-a">
                            <strong className="platform-flow-title star-step-title">
                                <span className="star-step-badge">A</span>
                                Action
                            </strong>
                            <div className="star-section-media">
                                <img
                                    src={SmartLibrarySearchAfterImg}
                                    alt="Optimized 1-Tier Architecture Diagram"
                                    className="comparison-diagram-img legacy-middleware-img"
                                />
                                <span className="comparison-caption">개선 후 1-Tier RoutingDataSource 동적 다중 DB 라우팅</span>
                            </div>
                            <ul className="project-points no-margin app-result-list search-result-list">
                                <li>
                                    <strong>기기 DB 직접 라우팅 적용</strong>
                                    <ul>
                                        <li>Spring <strong>RoutingDataSource</strong> 기반 동적 DB 라우팅 구현</li>
                                        <li>미들웨어를 거치지 않고 서버에서 각 기기 DB로 직접 연결</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <div className="star-card star-step-card star-step-r">
                            <strong className="platform-flow-title star-step-title">
                                <span className="star-step-badge">R</span>
                                Result
                            </strong>
                            <ul className="project-points no-margin app-result-list search-result-list">
                                <li>
                                    <strong>운영·배포 구조 단순화</strong>
                                    <ul>
                                        <li>Gandalf/Frodo 양방향 미들웨어 레이어 제거</li>
                                        <li>유지보수 단위를 3개에서 <strong>1개</strong>로 단일화</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>검색 응답 성능 80배 개선</strong>
                                    <ul>
                                        <li>p99 응답시간을 7.5초에서 <strong>93ms</strong>로 단축</li>
                                        <li>부하 조건을 5 vu/s에서 <strong>100 vu/s</strong>까지 확대 검증</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <aside className="search-mockup-panel">
                        <strong className="search-mockup-title">최종 검색 UI</strong>
                        <img
                            src={SmartLibrarySearchImg}
                            alt="도서 검색페이지 UI 목업"
                            className="search-showcase-img"
                        />
                        <span className="search-showcase-caption">
                            다중 기기 DB 연동 도서 검색 웹앱
                        </span>
                    </aside>
                </div>

                <div className="search-evidence-main">
                    <div className="smart-subtitle-block">
                        <strong>성능테스트 지표</strong>
                        <span>Artillery 부하 테스트로 Before/After 응답 성능을 비교했습니다.</span>
                    </div>

                    {/* Architecture & Performance Comparison Grid */}
                    <div className="comparison-grid">
                            {/* Before Column */}
                            <div className="comparison-column">
                                <span className="comparison-header before">
                                    🔴 Before 성능테스트
                                </span>

                                <div className="comparison-image-group">
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
                                    🔵 After 성능테스트
                                </span>

                                <div className="comparison-image-group">
                                    <img
                                        src={SmartLibraryArtilleryAfterImg}
                                        alt="Artillery Load Test After"
                                        className="comparison-artillery-img"
                                    />
                                    <span className="comparison-caption">p99 93ms로 안정 수렴 (동시성 100 vu/s 환경)</span>
                                </div>
                            </div>
                    </div>

                    <div className="performance-metric-strip" aria-label="성능테스트 지표">
                        <span><strong>성능테스트 지표</strong></span>
                        <span>p99 7.5s → <strong>93ms</strong></span>
                        <span>동시성 5 vu/s → <strong>100 vu/s</strong></span>
                        <span>검색 응답 <strong>약 80배 개선</strong></span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SmartLibraryContent;
