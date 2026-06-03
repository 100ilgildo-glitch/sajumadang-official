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
    const phoneInput = document.getElementById('tel');
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
            const phone = document.getElementById('tel').value;
            const phonePattern = /^\d{3}-\d{4}-\d{4}$/;
            if (!phonePattern.test(phone)) {
                alert('올바른 전화번호 형식을 입력해주세요. (예: 010-0000-0000)');
                return;
            }

            // Collect form data
const formData = collectFormData();

fetch("https://script.google.com/macros/s/AKfycbw_fkb-c11S_xOqnl0SY1tULevr_FW52TadW--KrHGwa7KTfKkK2PEm7x-CPaak36mg/exec", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        services: formData.services.join(", "),
        name1: formData.person1.name,
        gender1: formData.person1.gender,
        birthDate1: formData.person1.birthDate,
        birthTime1: formData.person1.birthTime,

        name2: formData.person2 ? formData.person2.name : "",
        gender2: formData.person2 ? formData.person2.gender : "",
        birthDate2: formData.person2 ? formData.person2.birthDate : "",
        birthTime2: formData.person2 ? formData.person2.birthTime : "",

        tel: formData.contact.phone,
        email: formData.contact.email,
        additionalQuestions: formData.additionalQuestions
    })
})
.then(response => response.json())
.then(data => {

    showSuccessModal(formData);

    form.reset();
    calculateTotal();

})
.catch(error => {

    alert("상담신청 저장에 실패했습니다.");

    console.error(error);

});

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

