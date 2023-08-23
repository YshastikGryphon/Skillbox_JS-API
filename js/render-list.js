/**
 * Отображает элемент списка
 * @param {array} array - Список элементов для отображения
 */
function renderList(array) {
  // Название
  let title = document.createElement('h2');
  title.classList.add('main__list-title');
  title.textContent = 'Episodes list';

  // Список
  let list = document.createElement('ul');
  list.classList.add('main__list-list');
  list.append(title);

  for (let i = 0; i < array.length; i++) {
    createElement(array[i], i);
  }

  function createElement(elementText, number) {
    let itemList = document.createElement('li');
    itemList.classList.add('main__list-item');

    let itemLink = document.createElement('a');
    itemLink.classList.add('main__list-item-link');
    itemLink.textContent = elementText;
    itemLink.href = elementText;
    itemLink.addEventListener('click', e => {
      e.preventDefault();
      const state = null;
      const title = '';
      const url = 'index.html?=' + number;
      history.pushState(state, title, url);

      // trigger popstate
      let popStateEvent = new PopStateEvent('popstate', { state: state });
      dispatchEvent(popStateEvent);
    })

    itemList.append(itemLink);
    list.append(itemList);
  }

  return list;
}

export { renderList };


