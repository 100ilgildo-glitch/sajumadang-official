// ===================================
// 사주마당 - JavaScript
// ===================================

let isSubmitting = false;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
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

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            if (navMenu) navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (navToggle) navToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            if (targetSection && navbar) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// ===================================
// Scroll Effects
// ===================================

function initScrollEffects() {
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

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

    const serviceNames = [
        'service_lifelong',
        'service_newyear',
        'service_wealth',
        'service_health',
        'service_career',
        'service_compatibility'
    ];

    const serviceRadios = document.querySelectorAll('input[type="radio"]');

    function getCalculatedTotal() {
        let total = 0;
        let hasTwoPerson = false;

        serviceNames.forEach(name => {
            const selected = document.querySelector(`input[name="${name}"]:checked`);
            if (!selected || selected.value === 'none') return;

            total += Number(selected.dataset.price || 0);

            if (selected.value === '2') {
                hasTwoPerson = true;
            }
        });

        return { total, hasTwoPerson };
    }

    function calculateTotal() {
        const { total, hasTwoPerson } = getCalculatedTotal();

        if (person2Section) {
            if (hasTwoPerson) {
                person2Section.style.display = 'block';
                const name2 = document.getElementById('name2');
                const gender2 = document.getElementById('gender2');
                const birthDate2 = document.getElementById('birth_date2');
                if (name2) name2.required = true;
                if (gender2) gender2.required = true;
                if (birthDate2) birthDate2.required = true;
            } else {
                person2Section.style.display = 'none';
                const name2 = document.getElementById('name2');
                const gender2 = document.getElementById('gender2');
                const birthDate2 = document.getElementById('birth_date2');
                if (name2) name2.required = false;
                if (gender2) gender2.required = false;
                if (birthDate2) birthDate2.required = false;
            }
        }

        if (totalPriceElement) {
            totalPriceElement.textContent = total.toLocaleString('ko-KR') + '원';
        }
    }

    serviceRadios.forEach(radio => {
        radio.addEventListener('change', calculateTotal);
    });

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
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

    const timeUnknown1 = document.getElementById('time_unknown1');
    const birthTime1 = document.getElementById('birth_time1');
    const timeUnknown2 = document.getElementById('time_unknown2');
    const birthTime2 = document.getElementById('birth_time2');

    if (timeUnknown1 && birthTime1) {
        timeUnknown1.addEventListener('change', function () {
            birthTime1.disabled = this.checked;
            if (this.checked) birthTime1.value = '';
        });
    }

    if (timeUnknown2 && birthTime2) {
        timeUnknown2.addEventListener('change', function () {
            birthTime2.disabled = this.checked;
            if (this.checked) birthTime2.value = '';
        });
    }

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (isSubmitting) return;

            const hasSelectedService = serviceNames.some(name => {
                const selected = document.querySelector(`input[name="${name}"]:checked`);
                return selected && selected.value !== 'none';
            });

            if (!hasSelectedService) {
                alert('최소 1개 이상의 서비스를 선택해주세요.');
                return;
            }

            const emailEl = document.getElementById('email');
            const phoneEl = document.getElementById('phone');

            const email = emailEl ? emailEl.value.trim() : '';
            const phone = phoneEl ? phoneEl.value.trim() : '';

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('올바른 이메일 주소를 입력해주세요.');
                return;
            }

            const phonePattern = /^\d{3}-\d{4}-\d{4}$/;
            if (!phonePattern.test(phone)) {
                alert('올바른 전화번호 형식을 입력해주세요. (예: 010-0000-0000)');
                return;
            }

            const formData = collectFormData();
            const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
            const originalButtonText = submitButton
                ? (submitButton.tagName === 'INPUT' ? submitButton.value : submitButton.textContent)
                : '';

            try {
                isSubmitting = true;

                if (submitButton) {
                    submitButton.disabled = true;
                    if (submitButton.tagName === 'INPUT') {
                        submitButton.value = '접수 처리 중...';
                    } else {
                        submitButton.textContent = '접수 처리 중...';
                    }
                }

                const submitResult = await submitFormData(formData);

                if (!submitResult.success) {
                    alert(submitResult.message || '전송에 실패했습니다. 다시 시도해주세요.');
                    return;
                }

                showDepositOnlyModal(formData, submitResult.message);

            } catch (error) {
                console.error('❌ 제출 처리 중 오류:', error);
                alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
            } finally {
                isSubmitting = false;

                if (submitButton) {
                    submitButton.disabled = false;
                    if (submitButton.tagName === 'INPUT') {
                        submitButton.value = originalButtonText || '신청하기';
                    } else {
                        submitButton.textContent = originalButtonText || '신청하기';
                    }
                }
            }
        });
    }

    calculateTotal();
}

function collectFormData() {
    const serviceNames = [
        'service_lifelong',
        'service_newyear',
        'service_wealth',
        'service_health',
        'service_career',
        'service_compatibility'
    ];

    let computedTotal = 0;

    serviceNames.forEach(name => {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        if (!selected || selected.value === 'none') return;
        computedTotal += Number(selected.dataset.price || 0);
    });

    const gender1El = document.getElementById('gender1');
    const birthType1El = document.getElementById('birth_type1');
    const timeUnknown1El = document.getElementById('time_unknown1');
    const birthTime1El = document.getElementById('birth_time1');

    const data = {
        services: [],
        totalPrice: computedTotal.toLocaleString('ko-KR') + '원',
        person1: {
            name: document.getElementById('name1')?.value || '',
            gender: gender1El && gender1El.value === 'male' ? '남성' : '여성',
            birthType: birthType1El && birthType1El.value === 'solar' ? '양력' : '음력',
            birthDate: document.getElementById('birth_date1')?.value || '',
            birthTime: timeUnknown1El && timeUnknown1El.checked
                ? '시간 미상'
                : (birthTime1El?.value || '미입력')
        },
        contact: {
            phone: document.getElementById('phone')?.value || '',
            email: document.getElementById('email')?.value || ''
        },
        additionalQuestions: document.getElementById('additional_questions')?.value || '없음'
    };

    const serviceMapping = {
        service_lifelong: '평생사주',
        service_newyear: '2026년 신년운',
        service_wealth: '재물운',
        service_health: '건강운',
        service_career: '직업운',
        service_compatibility: '궁합'
    };

    Object.keys(serviceMapping).forEach(key => {
        const selected = document.querySelector(`input[name="${key}"]:checked`);
        if (selected && selected.value !== 'none') {
            const personCount = selected.value === '2' ? '2인' : '1인';
            data.services.push(`${serviceMapping[key]} (${personCount})`);
        }
    });

    const person2Section = document.getElementById('person2Section');
    if (person2Section && person2Section.style.display === 'block') {
        const gender2El = document.getElementById('gender2');
        const birthType2El = document.getElementById('birth_type2');
        const timeUnknown2El = document.getElementById('time_unknown2');
        const birthTime2El = document.getElementById('birth_time2');

        data.person2 = {
            name: document.getElementById('name2')?.value || '',
            gender: gender2El && gender2El.value === 'male' ? '남성' : '여성',
            birthType: birthType2El && birthType2El.value === 'solar' ? '양력' : '음력',
            birthDate: document.getElementById('birth_date2')?.value || '',
            birthTime: timeUnknown2El && timeUnknown2El.checked
                ? '시간 미상'
                : (birthTime2El?.value || '미입력')
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
        if (!question) return;

        question.addEventListener('click', function () {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

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
        modalConfirm.textContent = '확인';
        modalConfirm.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

function showDepositOnlyModal(formData, submitMessage = '') {
    const modal = document.getElementById('successModal');
    const modalBody = document.getElementById('modalBody');
    const modalConfirm = document.getElementById('modalConfirm');

    if (!modal || !modalBody) {
        alert(
            `입금 안내\n\n` +
            `입금 금액: ${formData.totalPrice}\n` +
            `계좌번호: 농협 351-1377-7789-03\n` +
            `예금주: 문광희`
        );
        return;
    }

    if (modalConfirm) {
        modalConfirm.textContent = '확인';
    }

    modalBody.innerHTML = `
        <div style="text-align:left; line-height:1.8;">
            <p style="color:#8B6F47; font-weight:700; font-size:18px; margin-bottom:12px;">
                <i class="fas fa-info-circle"></i> 입금 안내
            </p>

            ${submitMessage ? `<p style="margin-bottom:12px;">${submitMessage}</p>` : ''}

            <p><strong>입금 금액:</strong> ${formData.totalPrice}</p>
            <p><strong>계좌번호:</strong> 농협 351-1377-7789-03</p>
            <p><strong>예금주:</strong> 문광희</p>

            <hr style="margin: 1rem 0; border: none; border-top: 1px solid #E5E1D8;">

            <p>1. 위 계좌로 <strong>${formData.totalPrice}</strong>을 입금해주세요.</p>
            <p>2. 입금 후 <strong>010-9486-4936</strong>으로 연락주시거나 입금자명을 남겨주세요.</p>
            <p>3. 입금 확인 후 24시간 내 <strong>${formData.contact.email}</strong>로 PDF 리포트를 발송해드립니다.</p>

            <p style="margin-top:14px; color:#8B6F47; font-weight:600;">
                ※ 현재 상태는 <strong>입금 대기</strong>입니다.
            </p>
        </div>
    `;

    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('active');
}

// ===================================
// Utility Functions
// ===================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
}

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
// 사주마당 - 구글 시트 & 이메일 연동
// ===================================

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzfn8qtTGi8Jb2-audDE8povF58l1843C6jCgw1PHS9Hg-swK2bXcaH_RsEbGXi_BRb/exec';

const EMAILJS_USER_ID = 'tl5jPJIoiOMEfjMHj';
const EMAILJS_SERVICE_ID = 'service_9oog4dh';
const EMAILJS_TEMPLATE_ID = 'template_3uwin9a';

(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_USER_ID);
    }
})();

// ===================================
// 구글 시트에 데이터 전송
// ===================================

async function sendToGoogleSheet(formData) {
    try {
        const sheetData = {
            접수일: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
            상담신청서1: formData.services.join(', '),
            이름1: formData.person1.name,
            성별1: formData.person1.gender,
            생년월일1: formData.person1.birthDate,
            시간1: formData.person1.birthTime,
            양력음력1: formData.person1.birthType,
            상담신청서2: formData.person2 ? formData.services.join(', ') : '',
            이름2: formData.person2 ? formData.person2.name : '',
            성별2: formData.person2 ? formData.person2.gender : '',
            생년월일2: formData.person2 ? formData.person2.birthDate : '',
            시간2: formData.person2 ? formData.person2.birthTime : '',
            양력음력2: formData.person2 ? formData.person2.birthType : '',
            합계금액: formData.totalPrice,
            전화번호: formData.contact.phone,
            이메일: formData.contact.email,
            비고: formData.additionalQuestions
        };

        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sheetData)
        });

        console.log('✅ 구글 시트 전송 완료');
        return true;
    } catch (error) {
        console.error('❌ 구글 시트 전송 실패:', error);
        return false;
    }
}

// ===================================
// EmailJS로 이메일 발송
// ===================================

async function sendEmailNotification(formData) {
    try {
        if (typeof emailjs === 'undefined') {
            console.error('❌ emailjs가 로드되지 않았습니다.');
            return false;
        }

        const servicesText = formData.services.join(', ');

        let person2Text = '';
        if (formData.person2) {
            person2Text = `
[두 번째 분 정보]
이름: ${formData.person2.name} (${formData.person2.gender})
생년월일: ${formData.person2.birthDate} (${formData.person2.birthType})
태어난 시간: ${formData.person2.birthTime}
            `.trim();
        }

        const templateParams = {
            to_email: formData.contact.email,
            services: servicesText,
            total_price: formData.totalPrice,
            name1: formData.person1.name,
            gender1: formData.person1.gender,
            birth_date1: formData.person1.birthDate,
            birth_type1: formData.person1.birthType,
            birth_time1: formData.person1.birthTime,
            person2_info: person2Text,
            phone: formData.contact.phone,
            email: formData.contact.email,
            additional_questions: formData.additionalQuestions,
            submission_date: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
        };

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );

        console.log('✅ 이메일 발송 완료:', response.status, response.text);
        return true;
    } catch (error) {
        console.error('❌ 이메일 발송 실패:', error);
        return false;
    }
}

// ===================================
// 통합 전송 함수
// ===================================

async function submitFormData(formData) {
    console.log('📤 데이터 전송 중...');

    const [sheetResult, emailResult] = await Promise.all([
        sendToGoogleSheet(formData),
        sendEmailNotification(formData)
    ]);

    if (sheetResult && emailResult) {
        console.log('✅ 모든 데이터 전송 완료!');
        return { success: true, message: '신청이 접수되었습니다. 아래 입금 안내를 확인해주세요.' };
    } else if (sheetResult) {
        console.log('⚠️ 구글 시트만 전송 완료 (이메일 실패)');
        return { success: true, message: '신청은 접수되었지만 이메일 발송에 실패했습니다. 아래 입금 안내를 확인해주세요.' };
    } else if (emailResult) {
        console.log('⚠️ 이메일만 전송 완료 (구글 시트 실패)');
        return { success: true, message: '신청은 접수되었지만 데이터 저장에 일부 문제가 있습니다. 아래 입금 안내를 확인해주세요.' };
    } else {
        console.log('❌ 전송 실패');
        return { success: false, message: '전송에 실패했습니다. 다시 시도해주세요.' };
    }
}

// ===================================
// 전역으로 내보내기
// ===================================

window.submitFormData = submitFormData;
