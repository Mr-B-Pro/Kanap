// // // GERER LES ARTICLES DANS LA PAGE PANIER // // //

// Tableau hors localStorage
let articleFromServer = [];
// Tableau localStorage
let cart = [];

// Récupération des données du canapé dans l'API avec fetch, boucle sur les tableaux et affichage des canapés
fetch(`http://localhost:3000/api/products/`)
  .then((response) => response.json())

  .then((res) => {
    articleFromServer = res;

    retrieveItemsFromCache();

    articleFromServer.forEach((articleServer) => {
      cart.forEach((sofaLocal, indx) => {
        if (sofaLocal.id === articleServer._id) {
          cart[indx].price = articleServer.price;
        }
      });
    });

    cart.forEach((item) => displayItem(item));
  });

//Recuperation des caractéritiques du canapé dans le local storage
// storage.lenght = retourne nombre d'items dans le storage
// storage.getItem = renvoie valeur associée à la clé
// storage.key = parcourt clé présente dans storage et affiche valeurs
// JSON.parse = analyse string JSON pour changer en objet
function retrieveItemsFromCache() {
  const numberOfItems = localStorage.length;

  for (let i = 0; i < numberOfItems; i++) {
    const item = localStorage.getItem(localStorage.key(i)) || "";
    const itemObject = JSON.parse(item);
    cart.push(itemObject);
  }
}

// Function hub de créations des canapés et de leurs données dans le DOM
function displayItem(item) {
  const article = makeArticle(item);

  const imageDiv = makeImageDiv(item);
  article.appendChild(imageDiv);

  const cardItemContent = makeCartContent(item);
  article.appendChild(cardItemContent);

  // Appelle des functions qui affiche l'article, Calcul la quantité totale, Calcul le prix total
  displayArticle(article);
  displayTotalQuantity();
  displayTotalPrice();
}

// Function création de la div article
function makeArticle(item) {
  const article = document.createElement("article");
  article.classList.add("card__item");
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}

// Function insertion de l'article dans la section
function displayArticle(article) {
  document.querySelector("#cart__items").appendChild(article);
}

// Function insertion de la div img et l'img
function makeImageDiv(item) {
  const div = document.createElement("div");
  div.classList.add("cart__item__img");

  const image = document.createElement("img");
  image.src = item.imageUrl;
  image.alt = item.altTxt;
  div.appendChild(image);
  return div;
}

// Function insertion de la div parent description
function makeCartContent(item) {
  const cardItemContent = document.createElement("div");
  cardItemContent.classList.add("cart__item__content");

  // Appelle des functions qui crée le contenu de la description, Crée une div container
  const description = makeDescription(item);
  const settings = makeSettings(item);

  cardItemContent.appendChild(description);
  cardItemContent.appendChild(settings);
  return cardItemContent;
}

// Function insertion de la div description et du contenu de la description
function makeDescription(item) {
  const description = document.createElement("div");
  description.classList.add("cart__item__content__description");

  const h2 = document.createElement("h2");
  h2.textContent = item.name;

  const p = document.createElement("p");
  p.textContent = item.color;

  const p2 = document.createElement("p");
  p2.textContent = item.price + " €";

  description.appendChild(h2);
  description.appendChild(p);
  description.appendChild(p2);
  return description;
}

// Function insertion de la div parent quantité et le button supprimé
function makeSettings(item) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  // Appelle des function qui ajoute la quantité, Supprime le canapé
  addQuantityToSettings(settings, item);
  addDeleteToSettings(settings, item);
  return settings;
}

// Function insertion de la div quantité et son contenu
function addQuantityToSettings(settings, item) {
  const quantity = document.createElement("div");
  quantity.classList.add("cart__item__content__settings__quantity");

  const p = document.createElement("p");
  p.textContent = "Qté : ";
  quantity.appendChild(p);

  const input = document.createElement("input");
  input.type = "number";
  input.classList.add("itemQuantity");
  input.name = "itemQuantity";
  input.min = "1";
  input.max = "100";
  input.value = item.quantity;

  input.addEventListener("input", () =>
    updatePriceAndQuantity(item.id, input.value, item)
  );

  quantity.appendChild(input);
  settings.appendChild(quantity);
}

// Function insertion du prix total
// Reduce = réduit plusieurs valeurs en une seule
function displayTotalPrice() {
  getPrice();
  const totalPrice = document.querySelector("#totalPrice");
  const total = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  totalPrice.textContent = total;
}

// Function boucle sur les tableaux pour préparer l'affichage du prix hors localStorage
function getPrice() {
  articleFromServer.forEach((articleServer) => {
    cart.forEach((sofaLocal, indx) => {
      if (sofaLocal.id === articleServer._id) {
        cart[indx].price = articleServer.price;
      }
    });
  });
}

// Function insertion de la quantité totale d'articles
// Reduce = réduit plusieurs valeurs en une seule
function displayTotalQuantity() {
  getPrice();
  const totalQuantity = document.querySelector("#totalQuantity");
  const total = cart.reduce((total, item) => total + item.quantity, 0);
  totalQuantity.textContent = total;
}

// Function insertion du prix et de la quantité totale
// Find = renvoie la valeur de l'élement qui respecte les conditions
function updatePriceAndQuantity(id, newValue, item) {
  const itemToUpdate = cart.find((item) => item.id === id);
  itemToUpdate.quantity = Number(newValue);
  item.quantity = itemToUpdate.quantity;

  // Appelle des functions pour la quantité totale, Le prix total, Sauvegarde des nouvelles valeurs
  displayTotalQuantity();
  displayTotalPrice();
  saveNewDataToCache(item);
}

// Function sauvegarder dans le cache
// setItem = duo clé valeur sont ajoutés
function saveNewDataToCache(item) {
  delete item.price;
  const dataToSave = JSON.stringify(item);
  const key = `${item.id}-${item.color}`;
  localStorage.setItem(key, dataToSave);
}

// Function insertion de la div parent suprimmer
function addDeleteToSettings(settings, item) {
  const div = document.createElement("div");
  div.classList.add("cart__item__content__settings__delete");
  div.addEventListener("click", () => deleteItem(item));

  const p = document.createElement("p");
  p.textContent = "Supprimer";
  div.appendChild(p);
  settings.appendChild(div);
}

// Function pour choisir l'article à supprimer
// findIndex = renvoie l'index du premier élement du tableau qui satisfait la condition d'une function, si la function renvoie false le résultat vaut -1
// splice = modifie le contenu d'un tableau
function deleteItem(item) {
  const itemToDelete = cart.findIndex(
    (product) => product.id === item.id && product.color === item.color
  );
  cart.splice(itemToDelete, 1);

  // Appelle les functions pour le prix total, Quantité totale, Supprime la key, Supprime les datas de la page
  displayTotalPrice();
  displayTotalQuantity();
  deleteDataFromCache(item);
  deleteArticleFromPage(item);
}

// Function supprimer dans le cache
// RemoveItem = passe une clé en argument supprime la ressource avec le nom de la clé qui correspond au storage
function deleteDataFromCache(item) {
  const key = `${item.id}-${item.color}`;
  localStorage.removeItem(key);
}

// Function supprimer article de la page
//  Remove retire l'élement du DOM
function deleteArticleFromPage(item) {
  const articleToDelete = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`
  );
  articleToDelete.remove();
}

// // // GERER LE FORMULAIRE DANS LA PAGE PANIER // // //

// Button confirmation du form pour commander les articles
const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", (e) => submitForm(e));

// Création variables et déclenchement des message sous les input du form
const firstName = document.querySelector("#firstName");
firstName.addEventListener("input", () => {
  isFirstNameInvalid();
});
const lastName = document.querySelector("#lastName");
lastName.addEventListener("input", () => {
  isLastNameInvalid();
});
const address = document.querySelector("#address");
address.addEventListener("input", () => {
  isAddressInvalid();
});
const city = document.querySelector("#city");
city.addEventListener("input", () => {
  isCityInvalid();
});
const email = document.querySelector("#email");
email.addEventListener("input", () => {
  isEmailInvalid();
});

// Function alert pour selectionner des articles avant d'acheter, fetch, et orderId dans l'url
function submitForm(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Veuillez s'il vous plait séléctionner les articles à acheter.");
    return;
  }

  if (isFirstNameInvalid()) return;
  if (isLastNameInvalid()) return;
  if (isAddressInvalid()) return;
  if (isCityInvalid()) return;
  if (isEmailInvalid()) return;

  // POST = envoi des données le body est stringify
  // header Content-Type application/json = précise le type de données qu’on va envoyer
  const body = makeRequestBody();
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const orderId = data.orderId;
      window.location.href = "/html/confirmation.html" + "?orderId=" + orderId;
    })
    .catch((err) => console.error(err));
}

// Function création variable pour recup de coordonnées client et construction d'un objet pour le form
function makeRequestBody() {
  const form = document.querySelector(".cart__order__form");
  const firstName = form.elements.firstName.value;
  const lastName = form.elements.lastName.value;
  const address = form.elements.address.value;
  const city = form.elements.city.value;
  const email = form.elements.email.value;

  const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: getIdsFromCache(),
  };
  return body;
}

// Function recup de l'id et split la color de la clef
// storage.key = retourne la clé contenue dans storage.
// split() = divise une chaîne de caractères
function getIdsFromCache() {
  const numberOfProducts = localStorage.length;
  const ids = [];
  for (let i = 0; i < numberOfProducts; i++) {
    const key = localStorage.key(i);
    const id = key.split("-")[0];
    ids.push(id);
  }
  return ids;
}

// Function envoi message si prénom mal rempli
function isFirstNameInvalid() {
  const firstName = document.querySelector("#firstName").value;
  const regex = /^[a-z ,.'-]+$/i;
  if (regex.test(firstName) === false) {
    document.querySelector("#firstNameErrorMsg").textContent =
      "Veuillez s'il vous plait remplir le champ du prénom correctement.";
    return true;
  } else {
    document.querySelector("#firstNameErrorMsg").textContent = "";
  }
  return false;
}

// Function envoi message si nom mal rempli
function isLastNameInvalid() {
  const lastName = document.querySelector("#lastName").value;
  const regex = /^[a-z ,.'-]+$/i;
  if (regex.test(lastName) === false) {
    document.querySelector("#lastNameErrorMsg").textContent =
      "Veuillez s'il vous plait remplir le champ du nom correctement.";
    return true;
  } else {
    document.querySelector("#lastNameErrorMsg").textContent = "";
  }
  return false;
}

// Function envoi message si adresse mal rempli
function isAddressInvalid() {
  const address = document.querySelector("#address").value;
  const regex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
  if (regex.test(address) === false) {
    document.querySelector("#addressErrorMsg").textContent =
      "Veuillez s'il vous plait remplir le champ de l'adresse correctement.";
    return true;
  } else {
    document.querySelector("#addressErrorMsg").textContent = "";
  }
  return false;
}

// Function envoi message si ville mal rempli
function isCityInvalid() {
  const city = document.querySelector("#city").value;
  const regex = /^[a-z ,.'-]+$/i;
  if (regex.test(city) === false) {
    document.querySelector("#cityErrorMsg").textContent =
      "Veuillez s'il vous plait remplir le champ de la ville correctement.";
    return true;
  } else {
    document.querySelector("#cityErrorMsg").textContent = "";
  }
  return false;
}

// Function envoi message si email mal rempli
function isEmailInvalid() {
  const email = document.querySelector("#email").value;
  const regex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regex.test(email) === false) {
    document.querySelector("#emailErrorMsg").textContent =
      "Veuillez s'il vous plait remplir le champ de l'email correctement.";
    return true;
  } else {
    document.querySelector("#emailErrorMsg").textContent = "";
  }
  return false;
}
