function searchPage() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
      clearSearchResults();
      return;
    }
    clearSearchResults();
    const content = document.querySelector('.content');
    if (!content) return;
    if (!content.dataset.originalContent) {
      content.dataset.originalContent = content.innerHTML;
    }
    const regex = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content.dataset.originalContent;
    const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && regex.test(node.nodeValue)) {
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');
        node.parentNode.replaceChild(span, node);
      }
    }
    content.innerHTML = tempDiv.innerHTML;
    const firstMatch = content.querySelector('mark');
    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function clearSearchResults() {
    const content = document.querySelector('.content');
    if (content && content.dataset.originalContent) {
      content.innerHTML = content.dataset.originalContent;
    }
  }

  function clearSearchInput() {
    document.getElementById('searchInput').value = '';
    clearSearchResults();
    document.getElementById('searchInput').focus();
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
