// ===================================
// 사주마당 - JavaScript
// ===================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initForm();
    initFAQ();
    initModal();
});

// ===================================
// Navigation
// ===================================

function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===================================
// Scroll Effects
// ===================================

function initScrollEffects() {
    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Observe process steps
    document.querySelectorAll('.process-step').forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(step);
    });
}

// ===================================
// Form Handling
// ===================================

function initForm() {
    const form = document.getElementById('applicationForm');
    const totalPriceElement = document.getElementById('totalPrice');
    const person2Section = document.getElementById('person2Section');
    
    // Service radio buttons
    const serviceRadios = document.querySelectorAll('input[type="radio"][data-price]');
    
    // Calculate total price
    function calculateTotal() {
        let total = 0;
        let hasTwoPerson = false;

        serviceRadios.forEach(radio => {
            if (radio.checked && radio.value !== 'none') {
                const price = parseInt(radio.dataset.price);
                total += price;
                
                if (radio.value === '2') {
                    hasTwoPerson = true;
                }
            }
        });

        // Show/hide person 2 section
        if (hasTwoPerson) {
            person2Section.style.display = 'block';
            // Make person 2 fields required
            document.getElementById('name2').required = true;
            document.getElementById('gender2').required = true;
            document.getElementById('birth_date2').required = true;
        } else {
            person2Section.style.display = 'none';
            // Make person 2 fields optional
            document.getElementById('name2').required = false;
            document.getElementById('gender2').required = false;
            document.getElementById('birth_date2').required = false;
        }

        totalPriceElement.textContent = total.toLocaleString('ko-KR') + '원';
    }

    // Add event listeners to all radio buttons
    serviceRadios.forEach(radio => {
        radio.addEventListener('change', calculateTotal);
    });

    // Also add listeners to "none" options
    document.querySelectorAll('input[type="radio"][value="none"]').forEach(radio => {
        radio.addEventListener('change', calculateTotal);
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d]/g, '');
            
            if (value.length <= 3) {
                e.target.value = value;
            } else if (value.length <= 7) {
                e.target.value = value.slice(0, 3) + '-' + value.slice(3);
            } else {
                e.target.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
            }
        });
    }

    // Time unknown checkboxes
    const timeUnknown1 = document.getElementById('time_unknown1');
    const birthTime1 = document.getElementById('birth_time1');
    const timeUnknown2 = document.getElementById('time_unknown2');
    const birthTime2 = document.getElementById('birth_time2');

    if (timeUnknown1 && birthTime1) {
        timeUnknown1.addEventListener('change', function() {
            birthTime1.disabled = this.checked;
            if (this.checked) {
                birthTime1.value = '';
            }
        });
    }

    if (timeUnknown2 && birthTime2) {
        timeUnknown2.addEventListener('change', function() {
            birthTime2.disabled = this.checked;
            if (this.checked) {
                birthTime2.value = '';
            }
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate that at least one service is selected
            const hasSelectedService = Array.from(serviceRadios).some(radio => 
                radio.checked && radio.value !== 'none'
            );

            if (!hasSelectedService) {
                alert('최소 1개 이상의 서비스를 선택해주세요.');
                return;
            }

            // Validate email format
            const email = document.getElementById('email').value;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('올바른 이메일 주소를 입력해주세요.');
                return;
            }

            // Validate phone number
            const phone = document.getElementById('phone').value;
            const phonePattern = /^\d{3}-\d{4}-\d{4}$/;
            if (!phonePattern.test(phone)) {
                alert('올바른 전화번호 형식을 입력해주세요. (예: 010-0000-0000)');
                return;
            }

            // Collect form data
            const formData = collectFormData();
            
            // Show success modal
            showSuccessModal(formData);
            
            // Reset form
            form.reset();
            calculateTotal();
        });
    }

    // Initial calculation
    calculateTotal();
}

function collectFormData() {
    const data = {
        services: [],
        totalPrice: document.getElementById('totalPrice').textContent,
        person1: {
            name: document.getElementById('name1').value,
            gender: document.getElementById('gender1').value === 'male' ? '남성' : '여성',
            birthType: document.getElementById('birth_type1').value === 'solar' ? '양력' : '음력',
            birthDate: document.getElementById('birth_date1').value,
            birthTime: document.getElementById('time_unknown1').checked ? '시간 미상' : (document.getElementById('birth_time1').value || '미입력')
        },
        contact: {
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value
        },
        additionalQuestions: document.getElementById('additional_questions').value || '없음'
    };

    // Collect selected services
    const serviceMapping = {
        'service_lifelong': '평생사주',
        'service_newyear': '2026년 신년운',
        'service_wealth': '재물운',
        'service_health': '건강운',
        'service_career': '직업운',
        'service_compatibility': '궁합'
    };

    Object.keys(serviceMapping).forEach(key => {
        const selected = document.querySelector(`input[name="${key}"]:checked`);
        if (selected && selected.value !== 'none') {
            const personCount = selected.value === '2' ? '2인' : '1인';
            data.services.push(`${serviceMapping[key]} (${personCount})`);
        }
    });

    // Check if person 2 section is visible
    if (document.getElementById('person2Section').style.display === 'block') {
        data.person2 = {
            name: document.getElementById('name2').value,
            gender: document.getElementById('gender2').value === 'male' ? '남성' : '여성',
            birthType: document.getElementById('birth_type2').value === 'solar' ? '양력' : '음력',
            birthDate: document.getElementById('birth_date2').value,
            birthTime: document.getElementById('time_unknown2').checked ? '시간 미상' : (document.getElementById('birth_time2').value || '미입력')
        };
    }

    return data;
}

// ===================================
// FAQ Accordion
// ===================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ===================================
// Modal
// ===================================

function initModal() {
    const modal = document.getElementById('successModal');
    const modalClose = document.getElementById('modalClose');
    const modalConfirm = document.getElementById('modalConfirm');

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalConfirm) {
        modalConfirm.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

function showSuccessModal(formData) {
    const modal = document.getElementById('successModal');
    const modalBody = document.getElementById('modalBody');

    let html = `
        <p><strong>신청 서비스:</strong><br>${formData.services.join('<br>')}</p>
        <p><strong>합계 금액:</strong> ${formData.totalPrice}</p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #E5E1D8;">
        <p><strong>신청자 정보 (1인):</strong><br>
        이름: ${formData.person1.name} (${formData.person1.gender})<br>
        생년월일: ${formData.person1.birthDate} (${formData.person1.birthType})<br>
        태어난 시간: ${formData.person1.birthTime}</p>
    `;

    if (formData.person2) {
        html += `
            <p><strong>신청자 정보 (2인):</strong><br>
            이름: ${formData.person2.name} (${formData.person2.gender})<br>
            생년월일: ${formData.person2.birthDate} (${formData.person2.birthType})<br>
            태어난 시간: ${formData.person2.birthTime}</p>
        `;
    }

    html += `
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #E5E1D8;">
        <p><strong>연락처:</strong><br>
        전화: ${formData.contact.phone}<br>
        이메일: ${formData.contact.email}</p>
        <p><strong>추가 질문:</strong><br>${formData.additionalQuestions}</p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #E5E1D8;">
        <p style="color: #8B6F47; font-weight: 600;">
        <i class="fas fa-info-circle"></i> 다음 단계:<br>
        <small style="font-weight: normal;">
        1. 농협 351-1377-7789-03 (문광희)로 ${formData.totalPrice}을 입금해주세요<br>
        2. 입금 후 010-9486-4936으로 연락주시거나 입금자명을 남겨주세요<br>
        3. 24시간 내 ${formData.contact.email}로 PDF 리포트를 발송해드립니다
        </small>
        </p>
    `;

    modalBody.innerHTML = html;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
}

// ===================================
// Utility Functions
// ===================================

// Format date to Korean format
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// Form Handling (EmailJS 전송 기능 추가본)
// ===================================

// EmailJS 고유 키 설정 (원장님 계정 정보)
const EMAILJS_SERVICE_ID = "service_9oog4dh";
const EMAILJS_TEMPLATE_ID = "template_3uwin9a";
const EMAILJS_PUBLIC_KEY = "tl5jPJIoiOMEfjMHj";

// 페이지 로드 시 EmailJS 라이브러리 초기화
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

function initForm() {
    const form = document.getElementById('applicationForm');
    const totalPriceElement = document.getElementById('totalPrice');
    const person2Section = document.getElementById('person2Section');
    
    // Service radio buttons
    const serviceRadios = document.querySelectorAll('input[type="radio"][data-price]');
    
    // Calculate total price
    function calculateTotal() {
        let total = 0;
        let hasTwoPerson = false;

        serviceRadios.forEach(radio => {
            if (radio.checked && radio.value !== 'none') {
                const price = parseInt(radio.dataset.price);
                total += price;
                
                if (radio.value === '2') {
                    hasTwoPerson = true;
                }
            }
        });

        // Show/hide person 2 section
        if (hasTwoPerson) {
            person2Section.style.display = 'block';
            document.getElementById('name2').required = true;
            document.getElementById('gender2').required = true;
            document.getElementById('birth_date2').required = true;
        } else {
            person2Section.style.display = 'none';
            document.getElementById('name2').required = false;
            document.getElementById('gender2').required = false;
            document.getElementById('birth_date2').required = false;
        }

        totalPriceElement.textContent = total.toLocaleString('ko-KR') + '원';
    }

    // Add event listeners to all radio buttons
    serviceRadios.forEach(radio => {
        radio.addEventListener('change', calculateTotal);
    });

    // Also add listeners to "none" options
    document.querySelectorAll('input[type="radio"][value="none"]').forEach(radio => {
        radio.addEventListener('change', calculateTotal);
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d]/g, '');
            
            if (value.length <= 3) {
                e.target.value = value;
            } else if (value.length <= 7) {
                e.target.value = value.slice(0, 3) + '-' + value.slice(3);
            } else {
                e.target.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
            }
        });
    }

    // Time unknown checkboxes
    const timeUnknown1 = document.getElementById('time_unknown1');
    const birthTime1 = document.getElementById('birth_time1');
    const timeUnknown2 = document.getElementById('time_unknown2');
    const birthTime2 = document.getElementById('birth_time2');

    if (timeUnknown1 && birthTime1) {
        timeUnknown1.addEventListener('change', function() {
            birthTime1.disabled = this.checked;
            if (this.checked) {
                birthTime1.value = '';
            }
        });
    }

    if (timeUnknown2 && birthTime2) {
        timeUnknown2.addEventListener('change', function() {
            birthTime2.disabled = this.checked;
            if (this.checked) {
                birthTime2.value = '';
            }
        });
    }

    // Form submission (★이메일 발송 기능 결합)
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate that at least one service is selected
            const hasSelectedService = Array.from(serviceRadios).some(radio => 
                radio.checked && radio.value !== 'none'
            );

            if (!hasSelectedService) {
                alert('최소 1개 이상의 서비스를 선택해주세요.');
                return;
            }

            // Validate email format
            const email = document.getElementById('email').value;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('올바른 이메일 주소를 입력해주세요.');
                return;
            }

            // Validate phone number
            const phone = document.getElementById('phone').value;
            const phonePattern = /^\d{3}-\d{4}-\d{4}$/;
            if (!phonePattern.test(phone)) {
                alert('올바른 전화번호 형식을 입력해주세요. (예: 010-0000-0000)');
                return;
            }

            // 1. 화면 모달 및 EmailJS 템플릿에 전달할 데이터 통합 수집
            const formData = collectFormData();
            
            // 중복 클릭 방지를 위해 전송 버튼 잠금
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            // 2. EmailJS 엔진 가동! 설정된 템플릿으로 이메일 발송
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData.emailParams)
                .then(function(response) {
                    console.log('이메일 발송 성공!', response.status, response.text);
                    
                    // 화면에 성공 모달(팝업) 표시
                    showSuccessModal(formData);
                    
                    // 폼 초기화 및 금액 리셋
                    form.reset();
                    calculateTotal();
                }, function(error) {
                    console.error('이메일 발송 실패:', error);
                    alert('이메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                })
                .finally(function() {
                    // 전송이 끝나면 버튼 잠금 해제
                    if (submitBtn) submitBtn.disabled = false;
                });
        });
    }

    // Initial calculation
    calculateTotal();
}

function collectFormData() {
    const totalPriceText = document.getElementById('totalPrice').textContent;
    const name1 = document.getElementById('name1').value;
    const gender1 = document.getElementById('gender1').value === 'male' ? '남성' : '여성';
    const birthType1 = document.getElementById('birth_type1').value === 'solar' ? '양력' : '음력';
    const birthDate1 = document.getElementById('birth_date1').value;
    const birthTime1 = document.getElementById('time_unknown1').checked ? '시간 미상' : (document.getElementById('birth_time1').value || '미입력');
    
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const additionalQuestions = document.getElementById('additional_questions').value || '없음';

    const services = [];
    const onePersonList = [];
    const twoPersonList = [];

    // 서비스 맵핑 레이블
    const serviceMapping = {
        'service_lifelong': '평생사주',
        'service_newyear': '2026년 신년운',
        'service_wealth': '재물운',
        'service_health': '건강운',
        'service_career': '직업운',
        'service_compatibility': '궁합'
    };

    // EmailJS 템플릿의 중괄호 {{ }} 변수들과 100% 일치시킬 매개변수 객체
    const emailParams = {
        to_name: name1,
        접수일일시: formatDateWithTime(new Date()),
        전화번호: phone,
        이메일: email,
        비고: additionalQuestions,
        "합계 금액": totalPriceText,
        
        // 개별 서비스 안내칸 초기화 (선택 시 체크 표시 가시화)
        평생사주: "",
        신년운: "",
        재물운: "",
        건강운: "",
        직업운: "",
        궁합: "",
        
        // 인원별 분류 칸 초기화
        상담신청서1: "없음",
        상담신청서2: "없음"
    };

    // 선택된 서비스 분류 및 체크 처리
    Object.keys(serviceMapping).forEach(key => {
        const selected = document.querySelector(`input[name="${key}"]:checked`);
        if (selected && selected.value !== 'none') {
            const serviceName = serviceMapping[key];
            const personCount = selected.value === '2' ? '2인' : '1인';
            services.push(`${serviceName} (${personCount})`);

            // EmailJS 템플릿 개별 행에 선택 표시 (예: {{평생사주}} 자리에 "✔ 신청함" 입력)
            if (key === 'service_newyear') {
                emailParams['신년운'] = "✔ 신청함";
            } else {
                emailParams[serviceName] = "✔ 신청함";
            }

            // 인원별 시트 구조 매칭용 리스트 생성
            if (selected.value === '1') {
                onePersonList.push(serviceName);
            } else if (selected.value === '2') {
                twoPersonList.push(serviceName);
            }
        }
    });

    // 구글 시트 양식 구조처럼 1인 서비스와 2인 서비스를 콤마(,)로 정렬하여 대입
    if (onePersonList.length > 0) emailParams.상담신청서1 = onePersonList.join(', ');
    if (twoPersonList.length > 0) emailParams.상담신청서2 = twoPersonList.join(', ');

    // 1번째 분 정보 매칭
    emailParams.이름1 = name1;
    emailParams.성별1 = gender1;
    emailParams.생년월일1 = birthDate1;
    emailParams.양력음력1 = birthType1;
    emailParams.시간1 = birthTime1;

    // 2번째 분 정보 처리 (2인 서비스가 켜졌을 때만)
    let person2Data = null;
    if (document.getElementById('person2Section').style.display === 'block') {
        const name2 = document.getElementById('name2').value;
        const gender2 = document.getElementById('gender2').value === 'male' ? '남성' : '여성';
        const birthType2 = document.getElementById('birth_type2').value === 'solar' ? '양력' : '음력';
        const birthDate2 = document.getElementById('birth_date2').value;
        const birthTime2 = document.getElementById('time_unknown2').checked ? '시간 미상' : (document.getElementById('birth_time2').value || '미입력');

        person2Data = {
            name: name2,
            gender: gender2,
            birthType: birthType2,
            birthDate: birthDate2,
            birthTime: birthTime2
        };

        emailParams.이름2 = name2;
        emailParams.성별2 = gender2;
        emailParams.생년월일2 = birthDate2;
        emailParams.양력음력2 = birthType2;
        emailParams.시간2 = birthTime2;
    } else {
        // 2인이 없을 땐 하이픈(-)이나 빈칸 처리
        emailParams.이름2 = "-";
        emailParams.성별2 = "-";
        emailParams.생년월일2 = "-";
        emailParams.양력음력2 = "-";
        emailParams.시간2 = "-";
    }

    return {
        services: services,
        totalPrice: totalPriceText,
        person1: { name: name1, gender: gender1, birthType: birthType1, birthDate: birthDate1, birthTime: birthTime1 },
        person2: person2Data,
        contact: { phone: phone, email: email },
        additionalQuestions: additionalQuestions,
        emailParams: emailParams // 이 데이터 통째로 EmailJS 템플릿으로 날아갑니다.
    };
}

// 이메일 상단 접수일시용 시간 포맷 함수
function formatDateWithTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
}

// ===================================================================
// 구글 시트(장부) 자동 전송 독립 추가 코드 (최초 원본 유지용)
// ===================================================================

document.addEventListener('DOMContentLoaded', function() {
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            // 기존 모달 창이나 이메일이 정상 작동한 '직후'에 구글 시트로 배달을 시작합니다.
            sendDataToGoogleSheet();
        });
    }
});

function sendDataToGoogleSheet() {
    // 1. 구글 시트 1번 줄 제목 (image_023281.png 구조와 100% 일치)
    const googleSheetUrl = "https://script.google.com/macros/s/AKfycbzfn8qtTGi8Jb2-audDE8povF58l1843C6jCgw1PHS9Hg-swK2bXcaH_RsEbGXi_BRb/exec";
    
    // 2. 현재 날짜 및 시간 생성 (접수일 칸용)
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 3. 1인/2인 서비스 분류 로직 (상담서비스 종목 기준)
    const serviceMapping = {
        'service_lifelong': '평생사주',
        'service_newyear': '2026신년운',
        'service_wealth': '재물운',
        'service_health': '건강운',
        'service_career': '직업운',
        'service_compatibility': '궁합'
    };

    let onePersonServices = [];
    let twoPersonServices = [];

    Object.keys(serviceMapping).forEach(key => {
        const selected = document.querySelector(`input[name="${key}"]:checked`);
        if (selected && selected.value !== 'none') {
            if (selected.value === '1') {
                onePersonServices.push(serviceMapping[key]);
            } else if (selected.value === '2') {
                twoPersonServices.push(serviceMapping[key]);
            }
        }
    });

    // 4. 입력 폼에서 1인 및 2인 데이터 추출
    const gender1Select = document.getElementById('gender1');
    const birthType1Select = document.getElementById('birth_type1');
    const timeUnknown1Check = document.getElementById('time_unknown1');
    
    const name1 = document.getElementById('name1').value;
    const gender1 = gender1Select ? (gender1Select.value === 'male' ? '남성' : '여성') : '';
    const birthDate1 = document.getElementById('birth_date1').value;
    const time1 = (timeUnknown1Check && timeUnknown1Check.checked) ? '시간미상' : (document.getElementById('birth_time1').value || '미입력');
    const birthType1 = birthType1Select ? (birthType1Select.value === 'solar' ? '양력' : '음력') : '';

    let name2 = '', gender2 = '', birthDate2 = '', time2 = '', birthType2 = '';
    const person2Section = document.getElementById('person2Section');
    
    // 2인 섹션이 활성화되어 있을 때만 데이터 수집
    if (person2Section && person2Section.style.display === 'block') {
        const gender2Select = document.getElementById('gender2');
        const birthType2Select = document.getElementById('birth_type2');
        const timeUnknown2Check = document.getElementById('time_unknown2');

        name2 = document.getElementById('name2').value;
        gender2 = gender2Select ? (gender2Select.value === 'male' ? '남성' : '여성') : '';
        birthDate2 = document.getElementById('birth_date2').value;
        time2 = (timeUnknown2Check && timeUnknown2Check.checked) ? '시간미상' : (document.getElementById('birth_time2').value || '미입력');
        birthType2 = birthType2Select ? (birthType2Select.value === 'solar' ? '양력' : '음력') : '';
    }

    const totalPrice = document.getElementById('totalPrice').textContent;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const additional = document.getElementById('additional_questions').value || '';

    // 5. 구글 시트(image_023281.png) 가로 1번 줄 컬럼명과 키값을 완벽하게 매칭
    const payload = {
        "접수일": formattedDate,
        "상담신청서1": onePersonServices.join(', ') || '없음',
        "이름1": name1,
        "성별1": gender1,
        "생년월일1": birthDate1,
        "시간1": time1,
        "양력/음력1": birthType1,
        "상담신청서2": twoPersonServices.join(', ') || '없음',
        "이름2": name2 || '-',
        "성별2": gender2 || '-',
        "생년월일2": birthDate2 || '-',
        "시간2": time2 || '-',
        "양력/음력2": birthType2 || '-',
        "합계금액": totalPrice,
        "전화번호": phone,
        "이메일": email,
        "비고": additional
    };

    // 6. 원장님의 구글 앱스 스크립트로 데이터 비동기(Fetch) 전송
    fetch(googleSheetUrl, {
        method: 'POST',
        mode: 'no-cors', // 크로스 오리진 제한 우회
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => console.log('장부 기록 배달 완료!'))
    .catch(error => console.error('장부 배달 중 오류 발생:', error));
}