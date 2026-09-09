// Kopersay Technologies - site cache registration + Google Analytics
(function () {
  if (!window.__kopersayGA) {
    window.__kopersayGA = true;
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-JTSZSZ29VY';
    document.head.appendChild(gaScript);
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-JTSZSZ29VY', { anonymize_ip: true });
  }

  function setupKopersayContactEmail() {
    if (!(window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname === '')) return;
    var contact = document.getElementById('contact');
    var contactBox = contact && contact.querySelector('.contact-box');
    if (!contactBox) return;
    var phone = contactBox.querySelector('.phone');
    var email = contactBox.querySelector('.kopersay-contact-email') || document.querySelector('.kopersay-contact-email');
    if (!email) {
      email = document.createElement('p');
      email.className = 'kopersay-contact-email';
      email.innerHTML = '<a href="mailto:contact@kopersay.in">Email: contact@kopersay.in</a>';
    }
    email.remove();
    if (phone) phone.insertAdjacentElement('afterend', email);
    else contactBox.appendChild(email);
    var style = document.getElementById('kopersay-contact-email-css');
    if (!style) {
      style = document.createElement('style');
      style.id = 'kopersay-contact-email-css';
      document.head.appendChild(style);
    }
    style.textContent = '.contact-box .kopersay-contact-email,.contact-box .kopersay-contact-email a{display:block!important;margin:8px 0 0!important;padding:0!important;color:#6545ed!important;font-size:13px!important;font-weight:800!important;line-height:1.5!important;text-align:center!important;text-decoration:none!important}.contact-box .kopersay-contact-email a:hover{text-decoration:underline!important}@media(max-width:700px){.contact-box .kopersay-contact-email,.contact-box .kopersay-contact-email a{font-size:12px!important;word-break:break-word!important}}';
  }

  function setupSourceCodeMarketplaceLink() {
    if (!(window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname === '')) return;
    var navLinks = document.querySelector('.nav-links');
    if (!navLinks || navLinks.querySelector('.source-code-marketplace-link')) return;
    var link = document.createElement('a');
    link.className = 'source-code-marketplace-link';
    link.href = 'source-code.html';
    link.textContent = 'Source Code / Marketplace';
    link.setAttribute('aria-label', 'Source Code / Marketplace');
    link.style.order = '3';
    var products = navLinks.querySelector('.our-products-dropdown');
    if (products) navLinks.insertBefore(link, products);
    else navLinks.appendChild(link);
    var style = document.createElement('style');
    style.id = 'source-code-marketplace-nav-css';
    style.textContent = '.navbar{padding-left:16px;padding-right:16px}.nav-links{gap:10px}.nav-links>a{font-size:12px}.nav-links .source-code-marketplace-link{display:inline-flex;align-items:center;justify-content:center;color:#fff!important;font-size:10px;font-weight:700;line-height:1.1;white-space:nowrap;padding:6px 8px;border:1px solid rgba(255,255,255,.72);border-radius:10px;background:linear-gradient(135deg,#6545ef,#19aeea);box-shadow:0 5px 12px rgba(82,85,220,.18);max-width:145px}.nav-links .source-code-marketplace-link:hover{color:#fff!important;transform:translateY(-1px)}.nav-links .nav-contact{padding:7px 10px;font-size:11px;border-radius:11px}.nav-links .our-products-btn{padding:7px 10px;font-size:11px;border-radius:11px}@media(max-width:900px){.navbar{padding-left:12px;padding-right:12px}.nav-links{gap:7px}.nav-links>a{font-size:10px}.nav-links .source-code-marketplace-link{font-size:9px;padding:5px 6px;max-width:118px}.nav-links .nav-contact,.nav-links .our-products-btn{padding:6px 7px;font-size:10px}}@media(max-width:700px){.navbar{padding-left:8px;padding-right:8px}.nav-links{gap:5px}.nav-links .source-code-marketplace-link{font-size:8px;padding:4px 5px;max-width:105px}.nav-links .nav-contact,.nav-links .our-products-btn{padding:5px 6px;font-size:9px}}';
    document.head.appendChild(style);
  }

  // Add the Kopersay wordmark to every existing navbar. Only the A is blue.
  function setupKopersayNavbarBrand() {
    var candidates = document.querySelectorAll('.navbar .logo, .nav .brand, header .logo');
    candidates.forEach(function (brand) {
      var old = brand.querySelector('.kopersay-navbar-name');
      if (old) old.remove();
      var oldSourceText = brand.querySelector('span');
      if (brand.classList.contains('brand') && oldSourceText) oldSourceText.remove();
      var name = document.createElement('span');
      name.className = 'kopersay-navbar-name';
      name.innerHTML = 'Kopers<span class="kopersay-blue-a">a</span>y';
      name.style.cssText = 'margin-left:9px;font-weight:800;white-space:nowrap;vertical-align:middle;color:#111!important;';
      name.querySelector('.kopersay-blue-a').style.cssText = 'color:#1677ff!important;';
      brand.style.display = 'inline-flex';
      brand.style.alignItems = 'center';
      brand.appendChild(name);
    });
  }

  window.addEventListener('DOMContentLoaded', setupKopersayContactEmail);
  window.addEventListener('load', setupKopersayContactEmail);
  setTimeout(setupKopersayContactEmail, 500);
  window.addEventListener('DOMContentLoaded', setupSourceCodeMarketplaceLink);
  window.addEventListener('load', setupSourceCodeMarketplaceLink);
  setTimeout(setupSourceCodeMarketplaceLink, 500);
  window.addEventListener('DOMContentLoaded', setupKopersayNavbarBrand);
  window.addEventListener('load', setupKopersayNavbarBrand);
  setTimeout(setupKopersayNavbarBrand, 500);

  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .then(function (registration) {
        registration.update();
        console.log('Kopersay cache enabled:', registration.scope);
      })
      .catch(function (error) {
        console.warn('Kopersay cache registration failed:', error);
      });
  });
})();