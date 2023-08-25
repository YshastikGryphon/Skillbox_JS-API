import { renderLoading } from "./loading.js";

const mainDetail = document.querySelector('.main__detail');

// Найти инфо по запросу
async function getByUrl(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

/** Отображает информацию на странице
  * @param {string} title - Название
  * @param {string} text - Текст
  * @param {array | null} additionalInfo - Доп.инфо текст:текст
  * @param {array | null} additionalList - Доп.инфо текст:список
*/
async function renderDetailPage(title, text, additionalInfo, additionalLists) {
  mainDetail.innerHTML = '';

  // Название
  let titleRender = document.createElement('h2');
  titleRender.classList.add('main__detail-title');
  titleRender.textContent = title;

  // Текст
  let textRender = document.createElement('p');
  textRender.classList.add('main__detail-text');
  textRender.textContent = text;

  // Доп.инфо
  let additionalInfoList = '';
  if (additionalInfo !== null) {
    // Главный список
    additionalInfoList = document.createElement('ul');
    additionalInfoList.classList.add('main__detail-list');

    // Взять ключи
    let additionalInfoKeys = Object.keys(additionalInfo);

    // Создать список
    for (let i = 0; i < additionalInfoKeys.length; i++) {
      let takeThis = additionalInfoKeys[i];
      let elem = createAddInfoElement(takeThis, additionalInfo[takeThis]);

      additionalInfoList.append(elem);
    }

    // Создать элемент списка
    function createAddInfoElement(name, text) {
      let renderThis = document.createElement('li');
      renderThis.classList.add('main__detail-item');
      renderThis.textContent = `${name}: ${text}`;
      return renderThis;
    }
  }

  // Рендеринг
  mainDetail.append(titleRender);
  mainDetail.append(textRender);
  mainDetail.append(additionalInfoList);

  let renderAddInfoList = '';

  // Доп.списки
  let additionalDiv = '';
  if (additionalLists !== null) {
    const loading = renderLoading();
    mainDetail.append(loading);

    // Подгрузить css
    let isStyleLoaded = false;
    let cssPromise = null;

    function loadCss() {
      if (isStyleLoaded === true) {
        return;
      }
      cssPromise = new Promise(resolve => {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/add-js-styles.css';
        document.head.append(link);
        link.addEventListener('load', () => {
          resolve();
        });
        return cssPromise;
      })
      isStyleLoaded = true;
    }

    loadCss();

    // Инициализация
    additionalDiv = initRenderDetailLists();

    // Создать список
    let mainList = document.createElement('ul');
    mainList.classList.add('main__detail-lists-list');

    // Взять ключи
    let additionalListsKeys = Object.keys(additionalLists);
    async function fetchByUrl(url) {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    async function fetchByUrlArray(array) {
      let renderArrList = [];
      let promise = await Promise.all(array.map(async (array) => {
        let renderArr = await fetchByUrl(array);
        return renderArr;
      })).then(
          (array) => {
            for (let i = 0; i < array.length; i++) {
              let addThis = array[i].name;
              renderArrList.push(addThis);
            }
            return renderArrList;
          });
      return promise;
    }

    // Добавить к списку
    for(let i = 0; i < additionalListsKeys.length; i++) {
      let listName = additionalListsKeys[i];
      let array = additionalLists[listName];
      let showThis = await fetchByUrlArray(array);
      mainList.append(await renderDetailLists(listName, showThis));
    }

    additionalDiv.append(mainList);
    const loadingParent = loading.parentNode;
    loadingParent.removeChild(loading);
  }
  mainDetail.append(additionalDiv);
}

// Инициализировать список деталей
function initRenderDetailLists() {
  // Глав.блок
  let mainBlock = document.createElement('div');
  mainBlock.classList.add('main__detail-lists');

  // Название
  let title = document.createElement('h3');
  title.classList.add('main__detail-lists-title');
  title.textContent = 'See also:';

  mainBlock.append(title);

  return mainBlock;
}

// Создать элементы списка
async function renderDetailLists(name, array) {
  // Глав блок
  let mainBlock = document.createElement('li');
  mainBlock.classList.add('main__detail-lists-item');

  // Название
  let title = document.createElement('h4');
  title.classList.add('main__detail-lists-list-name');
  title.textContent = name;

  // Список
  let list = document.createElement('ul');
  list.classList.add('main__detail-lists-list-list');

  for (let i = 0; i < array.length; i++) {
    let item = document.createElement('li');
    item.classList.add('main__detail-lists-list-item');
    item.textContent = array[i];
    list.append(item);
  };

  mainBlock.append(title);
  mainBlock.append(list);
  return mainBlock;
}

export { renderDetailPage };
