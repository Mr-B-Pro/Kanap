// // // RECUPERER LES ARTICLES DANS LA PAGE D'ACCUEIL // // //
// Function async qui s'auto appelle pour apppeler fetch, boucle sur le tableau et affichage des canapés
(async function () {
  const articles = await getArticles();

  for (article of articles) {
    displayArticle(article);
  }
})();

// Function fetch récupération des canapés dans l'API
function getArticles() {
  return fetch("http://localhost:3000/api/products")
    .then(function (httpBodyResponse) {
      return httpBodyResponse.json();
    })

    .then(function (articles) {
      return articles;
    })
    .catch(function (error) {
      alert(error);
    });
}

// // // AFFICHER LES ARTICLES DANS LA PAGE D'ACCUEIL // // //
// Function créations des canapés et de leurs données dans le DOM
function displayArticle(article) {
  // Insertion de l'élément "a" et de l'url de la page produit + l'id du canapé
  let productLink = document.createElement("a");
  productLink.href = `product.html?id=${article._id}`;
  document.querySelector("#items").appendChild(productLink);

  // Insertion de l'élément "article"
  let productArticle = document.createElement("article");
  productLink.appendChild(productArticle);

  // Insertion de l'"img"
  let productImg = document.createElement("img");
  productArticle.appendChild(productImg);
  productImg.src = article.imageUrl;
  productImg.alt = article.altTxt;

  // Insertion du nom "h3"
  let productName = document.createElement("h3");
  productArticle.appendChild(productName);
  productName.classList.add("productName");
  productName.textContent = article.name;

  // Insertion de la description "p"
  let productDescription = document.createElement("p");
  productArticle.appendChild(productDescription);
  productDescription.classList.add("productDescription");
  productDescription.textContent = article.description;
}
