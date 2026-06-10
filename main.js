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
}function collectFormData() {
    // 1. 선택된 서비스들 가져오기 (체크박스 목록)
    const checkedServices = [];
    document.querySelectorAll('input[name="services"]:checked').forEach(cb => {
        checkedServices.push(cb.value);
    });
    const servicesText = checkedServices.join(', ');

    // 2. 합계 금액 가져오기
    const totalPriceEl = document.getElementById('totalPrice');
    const totalPrice = totalPriceEl ? totalPriceEl.textContent : '0원';

    // 3. 오늘 날짜 생성 (접수일용)
    const today = new Date();
    const receptionDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // 4. 입력창 데이터 긁어오기
    const name1 = document.getElementById('name1') ? document.getElementById('name1').value : '';
    const gender1 = document.getElementById('gender1') ? document.getElementById('gender1').value : '';
    const birthDate1 = document.getElementById('birth_date1') ? document.getElementById('birth_date1').value : '';
    const birthTime1 = document.getElementById('birth_time1') ? document.getElementById('birth_time1').value : '';
    const birthType1 = document.getElementById('birth_type1') ? document.getElementById('birth_type1').value : '';

    const phone = document.getElementById('phone') ? document.getElementById('phone').value : '';
    const email = document.getElementById('email') ? document.getElementById('email').value : '';
    const additionalQuestions = document.getElementById('additionalQuestions') ? document.getElementById('additionalQuestions').value : '';

    // [핵심] EmailJS HTML 템플릿의 {{한글이름}}과 100% 일치하도록 주머니를 만듭니다.
    const data = {
        to_name: name1,              // {{to_name}}님 반가워요 용
        접수일: receptionDate,        // {{접수일}}
        전화번호: phone,             // {{전화번호}}
        이메일: email,               // {{이메일}}
        합계금액: totalPrice,          // {{합계금액}}
        
        상담신청서1: servicesText,     // {{상담신청서1}}
        이름1: name1,                // {{이름1}}
        성별1: gender1,              // {{성별1}}
        생년월일1: birthDate1,        // {{생년월일1}}
        양력음력1: birthType1,        // {{양력음력1}}
        시간1: birthTime1,            // {{시간1}}
        
        // 개별 서비스 온/오프 매칭 (혹시 필요할 경우를 대비)
        평생사주: checkedServices.includes('평생사주') ? '선택함' : '미선택',
        신년운: checkedServices.includes('2026신년운') ? '선택함' : '미선택',
        재물운: checkedServices.includes('재물운') ? '선택함' : '미선택',
        건강운: checkedServices.includes('건강운') ? '선택함' : '미선택',
        직업운: checkedServices.includes('직업운') ? '선택함' : '미선택',
        궁합: checkedServices.includes('궁합') ? '선택함' : '미선택',
        
        비고: additionalQuestions || '없음', // {{비고}}
        
        // 모달창 띄우기용 기존 구조 유지
        services: checkedServices,
        totalPrice: totalPrice,
        person1: { name: name1, gender: gender1, birthDate: birthDate1, birthTime: birthTime1, birthType: birthType1 },
        contact: { phone: phone, email: email },
        additionalQuestions: additionalQuestions
    };

    // 5. 신청인 2 정보가 활성화되어 있다면 추가로 긁어오기
    const person2Section = document.getElementById('person2Section');
    if (person2Section && person2Section.style.display !== 'none') {
        const name2 = document.getElementById('name2') ? document.getElementById('name2').value : '';
        const gender2 = document.getElementById('gender2') ? document.getElementById('gender2').value : '';
        const birthDate2 = document.getElementById('birth_date2') ? document.getElementById('birth_date2').value : '';
        const birthTime2 = document.getElementById('birth_time2') ? document.getElementById('birth_time2').value : '';
        const birthType2 = document.getElementById('birth_type2') ? document.getElementById('birth_type2').value : '';

        data.상담신청서2 = "상대방 정보 포함", // {{상담신청서2}}
        data.이름2 = name2,                 // {{이름2}}
        data.성별2 = gender2,               // {{성별2}}
        data.생년월일2 = birthDate2,         // {{생년월일2}}
        data.양력음력2 = birthType2,         // {{양력음력2}}
        data.시간2 = birthTime2,             // {{시간2}}

        data.person2 = { name: name2, gender: gender2, birthDate: birthDate2, birthTime: birthTime2, birthType: birthType2 };
    } else {
        // 2번째 분 정보가 없을 때는 빈칸 처리
        data.상담신청서2 = '없음';
        data.이름2 = '-';
        data.성별2 = '-';
        data.생년월일2 = '-';
        data.양력음력2 = '-';
        data.시간2 = '-';
    }

    return data;
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

