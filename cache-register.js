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

  // Homepage contact email: purple, matching the phone number.
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

  window.addEventListener('DOMContentLoaded', setupKopersayContactEmail);
  window.addEventListener('load', setupKopersayContactEmail);
  setTimeout(setupKopersayContactEmail, 500);

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
