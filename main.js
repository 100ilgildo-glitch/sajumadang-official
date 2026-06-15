// ===================================
// 사주마당 - 통합 자바스크립트 (오류 검수 완료)
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initForm();
    initFAQ();
    initModal();
});

// ===================================
// 1. Navigation (네비게이션)
// ===================================
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if(navToggle) navToggle.classList.remove('active');
            if(navMenu) navMenu.classList.remove('active');
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
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

    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

// ===================================
// 2. Scroll Effects (스크롤 효과)
// ===================================
function initScrollEffects() {
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

    document.querySelectorAll('.service-card, .process-step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===================================
// 3. Form Handling (폼 기능 및 전송)
// ===================================
function initForm() {
    const form = document.getElementById('applicationForm');
    const totalPriceElement = document.getElementById('totalPrice');
    const person2Section = document.getElementById('person2Section');
    const serviceRadios = document.querySelectorAll('input[type="radio"][data-price]');
    
    // 드롭다운 생성 함수
    function fillSelect(elementId, start, end, suffix, pad) {
        const el = document.getElementById(elementId);
        if (!el) return;
        let html = '';
        if (start > end) { // 년도 역순
            for (let i = start; i >= end; i--) {
                html += `<option value="${i}">${i}${suffix}</option>`;
            }
        } else { // 월, 일, 시, 분
            for (let i = start; i <= end; i++) {
                const val = pad ? String(i).padStart(2, '0') : String(i);
                html += `<option value="${val}">${i}${suffix}</option>`;
            }
        }
        el.innerHTML += html;
    }

    // 신청인1 드롭다운 채우기
    fillSelect('birth_year1', new Date().getFullYear(), 1900, '년', false);
    fillSelect('birth_month1', 1, 12, '월', true);
    fillSelect('birth_day1', 1, 31, '일', true);
    fillSelect('birth_hour1', 0, 23, '시', true);
    fillSelect('birth_minute1', 0, 59, '분', true);

    // 신청인2 드롭다운 채우기
    fillSelect('birth_year2', new Date().getFullYear(), 1900, '년', false);
    fillSelect('birth_month2', 1, 12, '월', true);
    fillSelect('birth_day2', 1, 31, '일', true);
    fillSelect('birth_hour2', 0, 23, '시', true);
    fillSelect('birth_minute2', 0, 59, '분', true);

    // 금액 계산 함수
    function calculateTotal() {
        let total = 0;
        let hasTwoPerson = false;

        serviceRadios.forEach(radio => {
            if (radio.checked && radio.value !== 'none') {
                total += parseInt(radio.dataset.price || '0');
                if (radio.value === '2') hasTwoPerson = true;
            }
        });

        if (person2Section) {
            if (hasTwoPerson) {
                person2Section.style.display = 'block';
                ['name2', 'gender2', 'birth_year2', 'birth_month2', 'birth_day2'].forEach(id => {
                    const el = document.getElementById(id);
                    if(el) el.required = true;
                });
            } else {
                person2Section.style.display = 'none';
                ['name2', 'gender2', 'birth_year2', 'birth_month2', 'birth_day2'].forEach(id => {
                    const el = document.getElementById(id);
                    if(el) el.required = false;
                });
            }
        }

        if (totalPriceElement) {
            totalPriceElement.textContent = total.toLocaleString('ko-KR') + '원';
        }
    }

    // 라디오 버튼 이벤트 바인딩
    serviceRadios.forEach(radio => radio.addEventListener('change', calculateTotal));
    document.querySelectorAll('input[type="radio"][value="none"]').forEach(radio => radio.addEventListener('change', calculateTotal));

    // 시간미상 체크박스 제어 함수
    function setupTimeUnknown(chkId, hourId, minId) {
        const chk = document.getElementById(chkId);
        const hour = document.getElementById(hourId);
        const min = document.getElementById(minId);
        if (chk && hour && min) {
            chk.addEventListener('change', function() {
                hour.disabled = this.checked;
                min.disabled = this.checked;
                if (this.checked) { hour.value = ''; min.value = ''; }
            });
        }
    }
    setupTimeUnknown('time_unknown1', 'birth_hour1', 'birth_minute1');
    setupTimeUnknown('time_unknown2', 'birth_hour2', 'birth_minute2');

    // 전화번호 포맷팅
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d]/g, '');
            if (value.length <= 3) e.target.value = value;
            else if (value.length <= 7) e.target.value = value.slice(0, 3) + '-' + value.slice(3);
            else e.target.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        });
    }

    // 신청 버튼 클릭 시 (제출)
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const hasSelectedService = Array.from(serviceRadios).some(radio => radio.checked && radio.value !== 'none');
            if (!hasSelectedService) { alert('최소 1개 이상의 서비스를 선택해주세요.'); return; }

            const emailValue = document.getElementById('email').value;
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) { alert('올바른 이메일 주소를 입력해주세요.'); return; }

            const phoneValue = document.getElementById('phone').value;
            if (!/^\d{3}-\d{4}-\d{4}$/.test(phoneValue)) { alert('올바른 전화번호 형식을 입력해주세요.'); return; }

            // 데이터 수집
            const formData = collectFormData();
            
            // 구글 시트용 평면 데이터 조립
            const finalSheetData = {
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

            // 구글 전송
            fetch("https://script.google.com/macros/s/AKfycbxSM3QDNkY1iCHOreFvlHxt6WvaFZJwcTx0WlpHGB5m3G05uv9_GcZHopMK9W3mz__N/exec", {
                method: "POST",
                body: JSON.stringify(finalSheetData)
            })
            .then(res => res.json())
            .then(data => console.log("✅ 구글 시트 저장 완료:", data))
            .catch(err => console.error("❌ 구글 시트 저장 실패:", err));
            
            showSuccessModal(formData);
            form.reset();
            calculateTotal();
        });
    }
    calculateTotal();
}

// 데이터 수집 서브 함수
function collectFormData() {
    const commentsEl = document.getElementById('comments') || document.getElementById('additional_questions');
    const data = {
        services: [],
        totalPrice: document.getElementById('totalPrice')?.textContent || '0원',
        person1: {
            name: document.getElementById('name1')?.value || '',
            gender: document.getElementById('gender1')?.value === 'male' ? '남성' : '여성',
            birthType: document.getElementById('birth_type1')?.value === 'solar' ? '양력' : '음력',
            birthDate: (document.getElementById('birth_year1')?.value || '') + '년 ' +
                       (document.getElementById('birth_month1')?.value || '') + '월 ' +
                       (document.getElementById('birth_day1')?.value || '') + '일',
            birthTime: document.getElementById('time_unknown1')?.checked
                ? '시간 미상'
                : (document.getElementById('birth_hour1')?.value && document.getElementById('birth_minute1')?.value)
                    ? document.getElementById('birth_hour1').value + '시 ' + document.getElementById('birth_minute1').value + '분'
                    : '미입력'
        },
        contact: {
            phone: document.getElementById('phone')?.value || '',
            email: document.getElementById('email')?.value || ''
        },
        additionalQuestions: commentsEl ? commentsEl.value : ''
    };

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
            const count = selected.value === '2' ? '2인' : '1인';
            data.services.push(`${serviceMapping[key]} (${count})`);
        }
    });

    const p2Sect = document.getElementById('person2Section');
    if (p2Sect && p2Sect.style.display === 'block') {
        data.person2 = {
            name: document.getElementById('name2')?.value || '',
            gender: document.getElementById('gender2')?.value === 'male' ? '남성' : '여성',
            birthType: document.getElementById('birth_type2')?.value === 'solar' ? '양력' : '음력',
            birthDate: (document.getElementById('birth_year2')?.value || '') + '년 ' +
                       (document.getElementById('birth_month2')?.value || '') + '월 ' +
                       (document.getElementById('birth_day2')?.value || '') + '일',
            birthTime: document.getElementById('time_unknown2')?.checked
                ? '시간 미상'
                : (document.getElementById('birth_hour2')?.value && document.getElementById('birth_minute2')?.value)
                    ? document.getElementById('birth_hour2').value + '시 ' + document.getElementById('birth_minute2').value + '분'
                    : '미입력'
        };
    }
    return data;
}

// ===================================
// 4. FAQ Accordion (자주 묻는 질문)
// ===================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const q = item.querySelector('.faq-question');
        if(q) {
            q.addEventListener('click', function() {
                faqItems.forEach(other => {
                    if (other !== item && other.classList.contains('active')) {
                        other.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        }
    });
}

// ===================================
// 5. Modal (결과 팝업창)
// ===================================
function initModal() {
    const modal = document.getElementById('successModal');
    const closeBtn = document.getElementById('modalClose');
    const confirmBtn = document.getElementById('modalConfirm');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (confirmBtn) confirmBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
    }
}

function showSuccessModal(formData) {
    const modal = document.getElementById('successModal');
    const body = document.getElementById('modalBody');
    if (!modal || !body) return;

    let html = `
        <p><strong>신청 서비스:</strong><br>${formData.services.join('<br>')}</p>
        <p><strong>합계 금액:</strong> ${formData.totalPrice}</p>
        <hr style="margin:1rem 0; border:none; border-top:1px solid #E5E1D8;">
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
        <hr style="margin:1rem 0; border:none; border-top:1px solid #E5E1D8;">
        <p><strong>연락처:</strong><br>
        전화: ${formData.contact.phone}<br>
        이메일: ${formData.contact.email}</p>
        <p><strong>추가 질문:</strong><br>${formData.additionalQuestions}</p>
        <hr style="margin:1rem 0; border:none; border-top:1px solid #E5E1D8;">
        <p style="color:#8B6F47; font-weight:600;">
        <i class="fas fa-info-circle"></i> 다음 단계:<br>
        <small style="font-weight:normal;">
        1. 농협 351-1377-7789-03 (문광희)로 ${formData.totalPrice}을 입금해주세요<br>
        2. 입금 후 010-9486-4936으로 연락주시거나 입금자명을 남겨주세요<br>
        3. 24시간 내 ${formData.contact.email}로 PDF 리포트를 발송해드립니다
        </small>
        </p>
    `;
    body.innerHTML = html;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('active');
}
