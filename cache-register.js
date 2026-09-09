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
    style.textContent = '.nav-links{gap:16px}.nav-links .source-code-marketplace-link{color:#35445d;font-size:11px;font-weight:700;white-space:nowrap;padding:7px 10px;border:1px solid rgba(255,255,255,.7);border-radius:12px;background:linear-gradient(135deg,#6545ef,#19aeea);color:#fff!important;box-shadow:0 6px 15px rgba(82,85,220,.2)}.nav-links .source-code-marketplace-link:hover{color:#fff!important;transform:translateY(-1px)}@media(max-width:900px){.nav-links{gap:11px}.nav-links .source-code-marketplace-link{font-size:10px;padding:6px 8px;border-radius:10px}}@media(max-width:700px){.nav-links{gap:7px}.nav-links .source-code-marketplace-link{font-size:9px;padding:5px 7px;border-radius:9px}}';
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