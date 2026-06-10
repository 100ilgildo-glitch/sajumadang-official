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

        totalPriceElement.textContent = total.toLocaleString("합계 금액") + '원';
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

   function calculateTotal() {
  let total = 0;
  const parts = [];

  // 선택된 서비스 항목 합산
  document.querySelectorAll('input[name="services"]:checked').forEach(service => {
    const price = parseInt(service.dataset.price, 10);
    total += price;
    parts.push(service.value);
  });

  // 결과 표시
  const totalPriceElement = document.getElementById("totalPrice");
  totalPriceElement.textContent = "합계 금액: " + total.toLocaleString() + "원";

  // formData에 저장할 경우
  return {
    totalPrice: total,
    services: parts
  };
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

function showSuccessModal(formData, receiptNumber) {
    const modal = document.getElementById('successModal');
    const modalBody = document.getElementById('modalBody');

let html = `
    <p><strong>접수일:</strong> ${formData.receiptDate}</p>
    <p><strong>신청 서비스:</strong><br>${formData.services.join('<br>')}</p>
    <p><strong>합계 금액:</strong> ${formData.totalPrice}</p>
    <hr style="margin: 1rem 0; border: none; border-top: 1px solid #E5E1D8;">
    <p><strong>신청자 정보 (1인):</strong><br>
    이름: ${formData.person1.name}<br>
    성별: ${formData.person1.gender} (남/여)<br>
    생년월일: ${formData.person1.birthDate}<br>
    양력/음력: ${formData.person1.birthType}<br>
    태어난 시간: ${formData.person1.birthTime}<br>
    비고: ${formData.person1.note || ''}</p>
`;

if (formData.person2) {
    html += `
        <p><strong>신청자 정보 (2인):</strong><br>
        이름: ${formData.person2.name}<br>
        성별: ${formData.person2.gender} (남/여)<br>
        생년월일: ${formData.person2.birthDate}<br>
        양력/음력: ${formData.person2.birthType}<br>
        태어난 시간: ${formData.person2.birthTime}<br>
        비고: ${formData.person2.note || ''}</p>
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
        <i class="fas fa-info-circle"></i> 현재 상태: 접수 완료<br>
        <small style="font-weight: normal;">
        신청이 정상적으로 접수되었습니다.<br>
        접수 번호를 꼭 메모해두세요: ${receiptNumber}<br><br>
        다음 단계:<br>
        1. 농협 351-1377-7789-03 (문광희)로 ${formData.totalPrice}을 입금해주세요<br>
        2. 입금 후 010-9486-4936으로 연락주시거나 입금자명을 남겨주세요<br>
        3. 입금 확인 후 24시간 내 ${formData.contact.email}로 PDF 리포트를 발송해드립니다
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

/* ── EmailJS 초기화 ── */
emailjs.init("tl5jPJIoiOMEfjMHj");

/* ── 상수 ── */
                  
const GAS_URL    =                  
"https://script.google.com/macros/s/AKfycbzfn8qtTGi8Jb2-audDE8povF58l1843C6jCgw1PHS9Hg-swK2bXcaH_RsEbGXi_BRb/exec";
 const EJS_SVC    = "service_9oog4dh";
const EJS_TMPL   = "template_3uwin9a";

/* ── 서비스 가격표 ── */
const PRICE = {
  svc_paengSaju:  { "선택안함": 0, "1인": 26600, "2인": 42000 },
  svc_sinnyeonun: { "선택안함": 0, "1인": 17500, "2인": 26600 },
  svc_jaemurun:   { "선택안함": 0, "1인": 17500, "2인": 26600 },
  svc_geongangun: { "선택안함": 0, "1인": 14000, "2인": 21000 },
  svc_jikeopun:   { "선택안함": 0, "1인": 14000, "2인": 21000 },
  svc_gunghap:    { "선택안함": 0, "2인": 35000 }
};

/* ── 서비스 한국어 이름 ── */
const SVC_LABEL = {
  svc_paengSaju:  "평생사주",
  svc_sinnyeonun: "신년운",
  svc_jaemurun:   "재물운",
  svc_geongangun: "건강운",
  svc_jikeopun:   "직업운",
  svc_gunghap:    "궁합"
};

/* =====================================================
   유틸: 오늘 날짜 문자열 (YYYY-MM-DD HH:mm:ss)
===================================================== */
function getNowStr() {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} `
       + `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/* =====================================================
   선택된 라디오 값 가져오기
===================================================== */
function getRadioValue(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : "";
}

/* =====================================================
   합계 계산 함수
===================================================== */


  // 선택된 서비스 항목 합산
  document.querySelectorAll('input[name="services"]:checked').forEach(service => {
    const price = parseInt(service.dataset.price, 10);
    total += price;
    parts.push(service.value);
  });

  // 결과 표시
  const totalPriceElement = document.getElementById("totalPrice");
  totalPriceElement.textContent = "합계 금액: " + total.toLocaleString() + "원";

  // formData에 활용할 수 있도록 반환
  return {
    totalPrice: total,
    services: parts
  };
}

/* =====================================================
   페이지 로드 시 초기화 + 이벤트 바인딩
===================================================== */
document.addEventListener("DOMContentLoaded", function () {
  // 합계 초기 계산
  calculateTotal();

  // 서비스 라디오 변경 → 합계 자동 계산
  document.getElementById("serviceList").addEventListener("change", function (e) {
    if (e.target.type === "radio") {
      calculateTotal();
    }
  });

  // 폼 제출
  document.getElementById("consultForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    hideError();

    if (!validateForm()) return;

    // 데이터 수집
    const data = collectData();
    setLoading(true);

    try {
      // 1. Google Sheet 저장
      await sendToGoogleSheet(data);

      // 2. EmailJS 확인 메일 발송
      await sendEmail(data);

      // 3. 성공 메시지 표시
      document.getElementById("consultForm").style.display = "none";
      document.getElementById("successMsg").style.display = "block";
      document.getElementById("successMsg").scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (error) {
      console.error("오류 발생:", error);
      alert("접수 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  });
});

  /* 서비스 요약 (1인 / 2인 항목 분리) */
  const sel1 = []; // 1인 서비스
  const sel2 = []; // 2인 서비스
  Object.keys(PRICE).forEach(name => {
    const val = getRadioValue(name);
    if (!val || val === "선택안함") return;
    const line = `${SVC_LABEL[name]} ${val}`;
    if (val === "1인") sel1.push(line);
    else sel2.push(line);
  });
  document.getElementById("hidden_상담신청서1").value = sel1.join(", ") || "없음";
  document.getElementById("hidden_상담신청서2").value = sel2.join(", ") || "없음";

    /* 2인 섹션 표시 여부 */
  const has2Person = Object.keys(PRICE).some(name => getRadioValue(name) === "2인");
  const sec2 = document.getElementById("section-person2");
  if (has2Person) {
    sec2.classList.remove("hidden");
    sec2.style.animation = "fadeUp .35s ease";
  } else {
    sec2.classList.add("hidden");
  }

  /* 선택된 서비스 항목 하이라이트 */
  document.querySelectorAll(".service-item").forEach(item => {
    const svcName = "svc_" + item.dataset.service;
    const val = getRadioValue(svcName);
    if (val && val !== "선택안함") {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  return total;
}

/* =====================================================
   오류 메시지 표시 / 숨기기
===================================================== */
function showError(msg) {
  const el = document.getElementById("errorMsg");
  document.getElementById("errorText").textContent = msg;
  el.style.display = "block";
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}
function hideError() {
  document.getElementById("errorMsg").style.display = "none";
}

/* =====================================================
   폼 유효성 검사
===================================================== */
function validateForm() {
  /* 1) 서비스 하나 이상 선택 */
  const hasService = Object.keys(PRICE).some(name => {
    const v = getRadioValue(name);
    return v && v !== "선택안함";
  });
  if (!hasService) {
    showError("서비스를 하나 이상 선택해 주세요.");
    return false;
  }

  /* 2) 1번째 분 이름 */
  const name1 = document.getElementById("name1").value.trim();
  if (!name1) {
    showError("1번째 분의 이름을 입력해 주세요.");
    document.getElementById("name1").focus();
    return false;
  }

  /* 3) 1번째 분 성별 */
  if (!getRadioValue("성별1")) {
    showError("1번째 분의 성별을 선택해 주세요.");
    return false;
  }

  /* 4) 1번째 분 생년월일 */
  const birth1 = document.getElementById("birth1").value;
  if (!birth1) {
    showError("1번째 분의 생년월일을 입력해 주세요.");
    document.getElementById("birth1").focus();
    return false;
  }

  /* 5) 2인 서비스 선택 시 → 2번째 분 정보 체크 */
  const has2Person = Object.keys(PRICE).some(name => getRadioValue(name) === "2인");
  if (has2Person) {
    const name2 = document.getElementById("name2").value.trim();
    if (!name2) {
      showError("2인 서비스를 선택하셨습니다. 2번째 분의 이름을 입력해 주세요.");
      document.getElementById("name2").focus();
      return false;
    }
    if (!getRadioValue("성별2")) {
      showError("2번째 분의 성별을 선택해 주세요.");
      return false;
    }
    const birth2 = document.getElementById("birth2").value;
    if (!birth2) {
      showError("2번째 분의 생년월일을 입력해 주세요.");
      document.getElementById("birth2").focus();
      return false;
    }
  } 

/* =====================================================
   데이터 수집 (구글 시트 열 순서에 맞게)
===================================================== */
function collectData() {
  const has2Person = Object.keys(PRICE).some(name => getRadioValue(name) === "2인");

  return {
    접수일:       getNowStr(),                                        // A열
    상담신청서1:  document.getElementById("상담신청서1").value,    // B열
    이름1:        document.getElementById("name1").value.trim(),      // C열
    성별1:        getRadioValue("성별1"),                             // D열
    생년월일1:    document.getElementById("birth1").value,            // E열
    시간1:        document.getElementById("time1").value,             // F열
    양력음력1:    getRadioValue("양력음력1"),                         // G열
    상담신청서2:  document.getElementById("상담신청서2").value,    // H열
    이름2:        has2Person ? document.getElementById("name2").value.trim() : "",  // I열
    성별2:        has2Person ? getRadioValue("성별2") : "",           // J열
    생년월일2:    has2Person ? document.getElementById("birth2").value : "",        // K열
    시간2:        has2Person ? document.getElementById("time2").value : "",         // L열
    양력음력2:    has2Person ? getRadioValue("양력음력2") : "",       // M열
    합계금액:     document.getElementById("합계금액").value,       // N열
    전화번호:     document.getElementById("phone").value.trim(),      // O열
    이메일:       document.getElementById("email").value.trim(),      // P열
    비고:         document.getElementById("remark").value.trim()      // Q열
  };
}

/* =====================================================
   ① Google Apps Script (구글 시트 저장)
===================================================== */
async function sendToGoogleSheet(data) {
  const response = await fetch(GAS_URL, {
    method:  "POST",
    mode:    "no-cors",   /* GAS는 no-cors 필수 */
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data)
  });
  /* no-cors 모드에서는 response.ok 확인 불가 → 전송 완료로 간주 */
  return true;
}

/* =====================================================
   ② EmailJS (신청자 확인 이메일 발송)
===================================================== */
 // 각 서비스별 선택값 (선택안함이면 "선택안함" 표시)
    function svcVal(radioName) {
      var val   = getRadio(radioName);
      if (!val || val === "선택안함") return "선택안함";
      var price = PRICE[radioName][val] || 0;
      return val + " (" + price.toLocaleString() + "원)";
    }

    return emailjs.send(EJS_SVC, EJS_TMPL, {
      to_name:     data["이름1"],
      to_email:    data["이메일"],
      접수일:      data["접수일"],
      합계금액:    data["합계금액"],
      전화번호:    data["전화번호"],
      이메일:      data["이메일"],
      상담신청서1: data["상담신청서1"],
      상담신청서2: data["상담신청서2"],

      // 서비스별 개별 선택값 → EmailJS 템플릿 {{변수명}} 과 일치
      평생사주:    svcVal("svc_paengSaju"),
      신년운:      svcVal("svc_sinnyeonun"),
      재물운:      svcVal("svc_jaemurun"),
      건강운:      svcVal("svc_geongangun"),
      직업운:      svcVal("svc_jikeopun"),
      궁합:        svcVal("svc_gunghap"),

      이름1:       data["이름1"],
      성별1:       data["성별1"],
      생년월일1:   data["생년월일1"],
      시간1:       data["시간1"],
      양력음력1:   data["양력/음력1"],
      이름2:       data["이름2"]     || "해당없음",
      성별2:       data["성별2"]     || "해당없음",
      생년월일2:   data["생년월일2"] || "해당없음",
      시간2:       data["시간2"]     || "해당없음",
      양력음력2:   data["양력/음력2"]|| "해당없음",
      비고:        data["비고"]      || "없음"
    });



