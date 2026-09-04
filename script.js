// -------------------------------------------------------------
// Amir Al Mohymin Razin - Portfolio JavaScript
// Lightweight, accessible, zero-dependency
// -------------------------------------------------------------

(function () {
  'use strict';

  // 1. Theme Management (System aware + local storage persistence)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    // Default to dark, or check OS preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Initialize theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const current = htmlRoot.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // Keyboard shortcut 't' to toggle theme
  window.addEventListener('keydown', function (e) {
    if (e.key === 't' || e.key === 'T') {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag !== 'input' && activeTag !== 'textarea') {
        const current = htmlRoot.getAttribute('data-theme') || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      }
    }
  });

  // 2. Color Palette Management (Neutral / Orange / Purple)
  const paletteButtons = document.querySelectorAll('.palette-btn');

  function getPreferredPalette() {
    const stored = localStorage.getItem('palette');
    if (stored === 'neutral' || stored === 'orange' || stored === 'purple') {
      return stored;
    }
    // Backward compatibility: migrate 'emerald' to 'neutral'
    if (stored === 'emerald') {
      return 'neutral';
    }
    return 'neutral';
  }

  function applyPalette(palette) {
    htmlRoot.setAttribute('data-palette', palette);
    localStorage.setItem('palette', palette);

    paletteButtons.forEach(function (btn) {
      if (btn.getAttribute('data-palette') === palette) {
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-checked', 'false');
      }
    });
  }

  applyPalette(getPreferredPalette());

  paletteButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const selected = this.getAttribute('data-palette');
      if (selected) {
        applyPalette(selected);
      }
    });
  });

  // 3. Email Copy Button
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-text');
  const toast = document.getElementById('toast');
  const emailAddress = 'amiralmohyminrazin@gmail.com';

  if (copyBtn) {
    copyBtn.addEventListener('click', async function () {
      let succeeded = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailAddress);
          succeeded = true;
        }
      } catch (err) {
        // Handled by execCommand fallback below
      }

      if (!succeeded) {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = emailAddress;
          textarea.style.position = 'fixed';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          succeeded = true;
        } catch (e) {
          console.warn('Fallback copy failed', e);
        }
      }

      if (copyText) {
        const originalText = copyText.textContent;
        copyText.textContent = 'Copied!';
        setTimeout(function () {
          copyText.textContent = originalText;
        }, 2000);
      }

      if (toast) {
        toast.classList.add('show');
        setTimeout(function () {
          toast.classList.remove('show');
        }, 2500);
      }
    });
  }

  // 3. Smooth scrolling for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 4. Mobile Menu Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('is-open');
      mobileMenuBtn.classList.toggle('is-open', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        mobileMenuBtn.classList.remove('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

})();
