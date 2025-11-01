document.addEventListener('DOMContentLoaded', function () {
    const contentArea = document.querySelector('.content');
    const links = document.querySelectorAll('.nav-sublink[data-src]');
  
    // Загрузка контента из внешнего HTML-файла
    async function loadContent(link) {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
  
      const src = link.getAttribute('data-src');
      try {
        const response = await fetch(src);
        const html = await response.text();
        contentArea.innerHTML = html;
        history.pushState(null, '', link.getAttribute('href'));
      } catch (err) {
        contentArea.innerHTML = `<p style="color: #c00;">Ошибка загрузки: ${src}</p>`;
      }
    }
  
    // Обработчики кликов по пунктам меню
    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        loadContent(link);
      });
    });
  
    Object.entries(specialHandlers).forEach(([id, html]) => {
      const summary = document.querySelector(`#${id} summary`);
      if (summary) {
        summary.addEventListener('click', e => {
          e.preventDefault();
          contentArea.innerHTML = html;
        });
      }
    });
  
    // Поддержка прямых ссылок (#1.1 и т.д.)
    const hash = window.location.hash;
    if (hash) {
      const link = document.querySelector(`a[href="${hash}"]`);
      if (link && link.hasAttribute('data-src')) {
        loadContent(link);
        // Раскрыть все родительские details
        let parent = link.closest('details');
        while (parent) {
          parent.open = true;
          parent = parent.parentElement ? parent.parentElement.closest('details') : null;
        }
      }
    }
  });
