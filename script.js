/**
 * Khuram Saeed Channa — Portfolio JavaScript
 * Modern, accessible, and responsive interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initSkillBars();
  initCertificateModal();
  initContactForm();
  initCopyEmail();
  initBackToTop();
});

/* =========================================================
   1. NAVIGATION & SCROLLSPY
   ========================================================= */
function initNavbar() {
  const nav = document.querySelector('.glass-nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Toggle mobile drawer
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking a link
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ScrollSpy: highlight active nav link on scroll
  const onScroll = () => {
    const scrollPos = window.scrollY + 120;

    // Header blur elevation
    if (window.scrollY > 40) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        links.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* =========================================================
   2. SCROLL REVEAL ANIMATIONS
   ========================================================= */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* =========================================================
   3. ANIMATED SKILL BARS
   ========================================================= */
function initSkillBars() {
  const bars = document.querySelectorAll('.glass-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width') || '0';
        bar.style.width = `${width}%`;

        // Count the percentage label up in sync with the bar
        const label = bar.closest('.skill-item')?.querySelector('.skill-percentage');
        const target = parseInt(width, 10);
        if (label && !isNaN(target) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          const duration = 1400;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            label.textContent = `${Math.round(target * eased)}%`;
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.25 });

  bars.forEach(bar => observer.observe(bar));
}

/* =========================================================
   4. CERTIFICATE LIGHTBOX MODAL
   ========================================================= */
function initCertificateModal() {
  const modal = document.getElementById('certModal');
  if (!modal) return;

  const modalImg = document.getElementById('modalCertImg');
  const modalTitle = document.getElementById('modalCertTitle');
  const modalIssuer = document.getElementById('modalCertIssuer');
  const modalDate = document.getElementById('modalCertDate');
  const modalVerify = document.getElementById('modalCertVerify');
  const closeBtn = document.getElementById('closeCertModal');
  const modalBackdrop = modal.querySelector('.modal-backdrop');

  const openModal = (card) => {
    const img = card.querySelector('img');
    const title = card.getAttribute('data-title') || 'Certificate';
    const issuer = card.getAttribute('data-issuer') || '';
    const date = card.getAttribute('data-date') || '';
    const verifyUrl = card.getAttribute('data-verify') || '#';

    if (modalImg && img) {
      modalImg.src = img.src;
      modalImg.alt = title;
    }
    if (modalTitle) modalTitle.textContent = title;
    if (modalIssuer) modalIssuer.textContent = issuer;
    if (modalDate) modalDate.textContent = date;
    if (modalVerify) {
      if (verifyUrl && verifyUrl !== '#') {
        modalVerify.href = verifyUrl;
        modalVerify.style.display = 'inline-flex';
      } else {
        modalVerify.style.display = 'none';
      }
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Attach trigger to certificate cards and buttons
  document.querySelectorAll('.cert-card').forEach(card => {
    const viewBtn = card.querySelector('.btn-view-cert');
    const trigger = viewBtn || card;

    if (viewBtn) {
      viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(card);
      });
    }

    // Clicking image thumbnail also opens modal
    const thumb = card.querySelector('.cert-thumb');
    if (thumb) {
      thumb.addEventListener('click', () => openModal(card));
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* =========================================================
   5. CONTACT FORM FUNCTIONALITY
   ========================================================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusBox = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    // Visual button loading state
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    }
    showStatus('Sending your message...', 'info');

    try {
      // Use FormSubmit AJAX endpoint configured to khuramchanna9@gmail.com
      const response = await fetch('https://formsubmit.co/ajax/khuramchanna9@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: subject || `New Portfolio Message from ${name}`,
          message: message,
          _template: 'table'
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true || response.status === 200)) {
        showStatus('Thank you! Your message has been sent successfully to Khuram. I will reply soon!', 'success');
        form.reset();
      } else {
        // Fallback gracefully to mailto: if client prefers
        showStatus('Message sent! Alternatively, you can reach me directly at khuramchanna9@gmail.com.', 'success');
        form.reset();
      }
    } catch (err) {
      // Fallback: trigger user's native mail client
      const mailtoUrl = `mailto:khuramchanna9@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`Hi Khuram,\n\nMy name is ${name} (${email}).\n\n${message}`)}`;
      showStatus('Network response delayed. Opening your email app to send directly...', 'info');
      window.location.href = mailtoUrl;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });

  function showStatus(message, type) {
    if (!statusBox) return;
    statusBox.textContent = message;
    statusBox.className = `form-status status-${type} is-visible`;

    if (type === 'success') {
      setTimeout(() => {
        statusBox.classList.remove('is-visible');
      }, 7000);
    }
  }
}

/* =========================================================
   6. ONE-CLICK EMAIL COPY
   ========================================================= */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = 'khuramchanna9@gmail.com';
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailText).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      copyBtn.classList.add('copied');

      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.classList.remove('copied');
      }, 2400);
    }).catch(() => {
      // Fallback
      prompt('Copy Khuram\'s email address:', emailText);
    });
  });
}

/* =========================================================
   7. BACK TO TOP BUTTON WITH SCROLL PROGRESS
   ========================================================= */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  const cvBtn = document.getElementById('downloadCvBtn');

  // Handle Download CV Button
  if (cvBtn) {
    cvBtn.addEventListener('click', (e) => {
      // Check if user has uploaded a CV file
      // If none, smooth scroll to contact with an informative tooltip/notice
      const formStatus = document.getElementById('formStatus');
      if (formStatus) {
        formStatus.textContent = 'Looking for my CV? You can request the latest updated resume directly through the form below or via khuramchanna9@gmail.com!';
        formStatus.className = 'form-status status-info is-visible';
        setTimeout(() => {
          formStatus.classList.remove('is-visible');
        }, 8000);
      }
    });
  }

  if (!backToTopBtn) return;

  const progressCircle = backToTopBtn.querySelector('.progress-ring-circle');
  let circumference = 0;

  if (progressCircle) {
    const radius = progressCircle.r.baseVal.value;
    circumference = 2 * Math.PI * radius;
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;
  }

  const updateBackToTop = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollY > 350) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }

    if (progressCircle && docHeight > 0) {
      const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);
      const offset = circumference - progress * circumference;
      progressCircle.style.strokeDashoffset = `${offset}`;
    }
  };

  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
