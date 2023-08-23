import { renderLoading } from './loading.js';
import { renderList } from './render-list.js';
import { renderDetailPage } from './render-detail.js';

// При загрузке
document.addEventListener('DOMContentLoaded', async () => {
  let pageUrl = window.location.href;
  const mainList = document.querySelector('.main__list');

  // Взять базовую информацию
  async function takeAllLists() {
    const response = await fetch('https://swapi.dev/api/films');
    const data = await response.json();
    return data;
  }

  const baseInfo = await takeAllLists();
  showList(baseInfo);

  // Перебрать запрос для списка
  function showList(get) {
    const getData = get.results;
    let showArray = [];

    // Взять ключи
    let getDataKeys = Object.keys(getData);
    for (let i = 0; i < getDataKeys.length; i++) {
      showArray.push(getData[i].title);
    }

    // Заменить список
    mainList.innerHTML = '';
    mainList.append(renderList(showArray));
  }


  if (takeEpisodeFromUrl(pageUrl) !== null) {
    showByEpisodeID(baseInfo, takeEpisodeFromUrl(pageUrl));
  } else {
    showDefaultDetail();
  }

  // При изменении ссылки
  window.addEventListener('popstate', () => {
    let pageUrl = window.location.href;

    if (takeEpisodeFromUrl(pageUrl) !== null) {
      showByEpisodeID(baseInfo, takeEpisodeFromUrl(pageUrl));
    } else {
      showDefaultDetail();
    }
  });
})


// Взять эпизод из url
function takeEpisodeFromUrl(url) {
  let str = url.replace(/%20/g, ' ');

  if ( str.indexOf("?=") >= 0 ) {
    return str.substr(str.indexOf('?=') + 2, str.length);
  }
  return null;
}

function showByEpisodeID(get, id) {
  const getData = get.results[id];

  // Массивы для отправки
  let additionalInfo = {};
  let additionalInfoLists = {};

  collectArrayInfo('Director', getData.director);
  collectArrayInfo('Producer', getData.producer);

  collectArrayLists('Planets', getData.planets);
  collectArrayLists('Species', getData.species);
  collectArrayLists('Starships', getData.starships);

  // Проверить если массивы пустые
  if ( additionalInfo.length === 0) {
    additionalInfo = null;
  }
  if ( additionalInfo.length === 0) {
    additionalInfo = null;
  }

  // Показать информацию
  renderDetailPage(getData.title, getData.opening_crawl, additionalInfo, additionalInfoLists)

  function collectArrayInfo(name, info) {
    additionalInfo[name] = info;
  }

  function collectArrayLists(name, array) {
    additionalInfoLists[name] = array;
  }
}

function showDefaultDetail() {
  renderDetailPage('Select', 'Choose an episode', null, null);
}


