/**
 * Отображает загрузочный элемент
 * @param {HTMLElement} element - Место добавления
 */
function renderLoading() {
  const loader =  document.createElement('div');
  loader.classList.add('loading');
  return loader;
}

export { renderLoading }
