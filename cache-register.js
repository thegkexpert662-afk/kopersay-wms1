// Kopersay Technologies - site cache registration + Google Analytics
(function () {
  // Google Analytics 4
  if (!window.__kopersayGA) {
    window.__kopersayGA = true;

    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-JTSZSZ29VY';
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-JTSZSZ29VY', {
      anonymize_ip: true
    });
  }

  // Contact email: keep it inside the contact box, directly below the phone number.
  window.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname === '') {
      var contact = document.getElementById('contact');
      if (contact) {
        var contactBox = contact.querySelector('.contact-box');
        var email = contact.querySelector('.kopersay-contact-email');

        if (!email) {
          email = document.createElement('p');
          email.className = 'kopersay-contact-email';
          email.innerHTML = '<span class="email-label">Email:</span> <a href="mailto:contact@kopersay.in">contact@kopersay.in</a>';
        }

        if (contactBox) {
          var phone = contactBox.querySelector('.phone');
          if (phone) {
            phone.insertAdjacentElement('afterend', email);
          } else {
            contactBox.appendChild(email);
          }
        } else {
          contact.appendChild(email);
        }

        // Dedicated email styling so it matches the glass Contact card.
        if (!document.getElementById('kopersay-contact-email-style')) {
          var style = document.createElement('style');
          style.id = 'kopersay-contact-email-style';
          style.textContent = '\n            .contact-box .kopersay-contact-email {\n              display: block !important;\n              width: 100%;\n              margin: 10px 0 0 !important;\n              padding: 0 !important;\n              text-align: center;\n              color: #60728a;\n              font-size: 13px;\n              line-height: 1.5;\n              font-weight: 600;\n              position: relative;\n              z-index: 2;\n            }\n            .contact-box .kopersay-contact-email .email-label {\n              color: #60728a;\n            }\n            .contact-box .kopersay-contact-email a {\n              color: #6545ed;\n              font-weight: 800;\n              text-decoration: none;\n            }\n            .contact-box .kopersay-contact-email a:hover {\n              color: #15afe9;\n              text-decoration: underline;\n            }\n            @media (max-width: 700px) {\n              .contact-box .kopersay-contact-email {\n                font-size: 12px;\n                margin-top: 9px !important;\n              }\n            }\n          ';
          document.head.appendChild(style);
        }
      }
    }
  });

  // Service worker cache
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .then(function (registration) {
        console.log('Kopersay cache enabled:', registration.scope);
      })
      .catch(function (error) {
        console.warn('Kopersay cache registration failed:', error);
      });
  });
})();
