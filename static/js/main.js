/* RFLV theme — main.js */
'use strict';

/* Mark active nav links based on current path */
(function markActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-list a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href && href !== '/' && path.startsWith(href)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}());

/* Abstract collapsible (optional — if .sc-abstract has a toggle) */
(function abstractToggle() {
  document.querySelectorAll('.sc-abstract__label').forEach(function(label) {
    label.style.cursor = 'pointer';
    label.addEventListener('click', function() {
      const p = label.nextElementSibling;
      if (p) {
        p.style.display = p.style.display === 'none' ? '' : 'none';
      }
    });
  });
}());
