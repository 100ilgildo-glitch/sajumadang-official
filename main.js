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

function doPost(e) {
  try {
    // 🔗 진짜 연결고리: 사장님의 진짜 시트 이름 "사주마당 상담서비스 신청"으로 딱 고정합니다!
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("사주마당 상담서비스 신청");
    
    // 만약 시트 이름을 못 찾으면 첫 번째 시트라도 강제로 가져오는 안전장치
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    }
    
    // HTML에서 보낸 한글 주머니 데이터를 풀어줍니다.
    var data = JSON.parse(e.postData.contents);
    
    // 사장님의 구글 시트 열 순서(A열부터 Q열까지)에 한치의 오차도 없이 일치시켜 적습니다.
    sheet.appendRow([
      data["접수일"],       // A열
      data["상담신청서1"],   // B열
      data["이름1"],       // C열
      data["성별1"],       // D열
      data["생년월일1"],    // E열
      data["시간1"],       // F열
      data["양력/음력1"],    // G열
      data["상담신청서2"],   // H열
      data["이름2"],       // I열
      data["성별2"],       // J열
      data["생년월일2"],    // K열
      data["시간2"],       // L열
      data["양력/음력2"],    // M열
      data["합계금액"],     // N열
      data["전화번호"],     // O열
      data["이메일"],       // P열
      data["비고"]         // Q열
    ]);
    
    // 전송 성공 신호 반환
    return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "message": error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

            // // --------------------------------------------------
            // [4] 구글 스프레드시트 릴레이 연동 시작!
            // --------------------------------------------------
            console.log("구글 시트로 데이터 적는 중...");
            
            // 🔗 원장님의 '진짜 새 주소(AKfycbzBxo...)'를 한 글자의 오차도 없이 완벽하게 고정했습니다!
            fetch("https://script.google.com/macros/s/AKfycbzBxoQ20L1bRdvs5Z4j_7oDx8NZigz6fPZn_LQctUxbnrv0T0MRQj7OCgFxJKsuoarx/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain" // CORS 차단 에러 원천 봉쇄용 보안 세팅
                },
                body: JSON.stringify(googlePayload)
            })
            .then(function(response) {
                console.log("구글 시트 전송 완료 신호 수신. 이어서 메일을 발송합니다.");

                // --------------------------------------------------
                // [5] 구글 시트 저장이 완벽히 끝나면 원래 잘 되던 EmailJS 릴레이 작동!
                // --------------------------------------------------
                if (typeof emailjs !== 'undefined') {
                    // ★ 원장님의 EmailJS 서비스ID와 템플릿ID를 따옴표 안에 정확히 적어주세요!
                    return emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form);
                } else {
                    throw new Error("EmailJS가 로드되지 않았습니다.");
                }
            })
            .then(function() {
                // --------------------------------------------------
                // [6] 둘 다 한 방에 성공했을 때 최종 성공 팝업
                // --------------------------------------------------
                alert('상담 신청서가 구글시트에 안전하게 저장되었으며, 메일 발송도 완료되었습니다!');
                form.reset(); // 입력칸 초기화
                if (typeof calculateTotal === 'function') calculateTotal(); // 합계 금액 원상복구
            })
            .catch(function(error) {
                console.error("통합 전송 중 오류 발생:", error);
                alert("접수 중 오류가 발생했습니다. 하지만 입력하신 소중한 정보와 금액 계산 기능은 안전하게 유지됩니다.");
            });