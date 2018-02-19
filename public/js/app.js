/* --------------- jQuery --------------- */
$(document).ready(function () {
  let openShearch = $('.btn-search');
  openShearch.click(function () {
    window.location.href = 'views/search.html';
  });
});
/* --------------- ES6 --------------- */
window.addEventListener('load', function () {
  const searchInput = document.getElementById('search-keyword');
  const resultContainer = document.getElementById('result-container');
  const btnXhr = document.getElementById('submit-btn-xhr');
  const btnFetch = document.getElementById('submit-btn-fetch');
  let textToSearch;
  /* ------------------ btn XHR ------------------ */
  btnXhr.addEventListener('click', function () {
    event.preventDefault();
    resultContainer.innerHTML = '';
    textToSearch = searchInput.value;
    getNews();
  });

  function getNews() {
    const articleRequest = new XMLHttpRequest();

    articleRequest.onreadystatechange = function () {
      if (articleRequest.readyState === 4 && articleRequest.status === 200) {
        const data = JSON.parse(this.responseText);
        const response = data.response;
        articleRequest.onload = addNews(response);
      } else {
        articleRequest.onerror = handleError;
      }
    };
    articleRequest.open('GET', `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${textToSearch}&api-key=1a029f3f61cb46e8850c20e672cf4896`);
    articleRequest.send();
  }

  function handleError() {
    console.log('Se ha presentado un error');
  }

  /* ------------------ btn Fetch ------------------ */
  btnFetch.addEventListener('click', function () {
    event.preventDefault();
    resultContainer.innerHTML = '';
    textToSearch = searchInput.value;
    let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${textToSearch}&api-key=1a029f3f61cb46e8850c20e672cf4896`;
    fetch(url)
      .then(function (response) {
        return response.json();
      }).then(function (data) {
        const response = data.response;
        addNews(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
  /* Card de resultados */
  function addNews(response) {
    let docs = response.docs;
    docs.forEach(function (article) {
      if (article.document_type === 'article') {
        console.log(article);
        const newsDocs =
          `<div class="container justify-content-center mg-cards card" >
          <div class="row card-body">
            <div class = "col-md-4 col-lg-3">
              <img width="100%" src="https://static01.nyt.com/${article.multimedia[0].url}">
            </div>
            <div class = "col-md-8 col-lg-9">
              <h3 class="card-title text-center">${article.headline.main}</h3>
              <p class="card-text text-justify">${article.snippet}</p>
              <div class="text-center">
                <a class="btn btn-primary text-light" href="${article.web_url}">Enterate más</a>
              </div>
            </div>
          </div>
        </div>`;
        resultContainer.innerHTML += newsDocs;
      }
    });
  }
});

