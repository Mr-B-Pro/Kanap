// // // GERER LES ARTICLES DANS LA PAGE CART // // //
//Recuperation des articles dans le local storage
const cart = [];

retrieveItemsFromCache();
cart.forEach((item) => displayItem(item));

function retrieveItemsFromCache() {
  const numberOfItems = localStorage.length;

  for (let i = 0; i < numberOfItems; i++) {
    const item = localStorage.getItem(localStorage.key(i)) || "";
    const itemObject = JSON.parse(item);
    cart.push(itemObject);
  }
}

// Function affichage des articles
function displayItem(item) {
  const article = makeArticle(item);

  const imageDiv = makeImageDiv(item);
  article.appendChild(imageDiv);

  const cardItemContent = makeCartContent(item);
  article.appendChild(cardItemContent);

  // Appelle des functions
  displayArticle(article);
  displayTotalQuantity();
  displayTotalPrice();
}

// Function insertion de la div parent section
function displayArticle(article) {
  document.querySelector("#cart__items").appendChild(article);
}

// Function insertion de la div parent article
function makeArticle(item) {
  const article = document.createElement("article");
  article.classList.add("card__item");
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}

// Function insertion de la div image et l'image
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

  const description = makeDescription(item);
  const settings = makeSettings(item);

  cardItemContent.appendChild(description);
  cardItemContent.appendChild(settings);
  return cardItemContent;
}

// Function insertion du contenu de la description
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

// Function insertion de la div parent quantité
function makeSettings(item) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  addQuantityToSettings(settings, item);
  addDeleteToSettings(settings, item);
  return settings;
}

// Function insertion du contenu de la quantité
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
function displayTotalPrice() {
  const totalPrice = document.querySelector("#totalPrice");
  const total = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  totalPrice.textContent = total;
}

// Function insertion de la quantité totale d'articles
function displayTotalQuantity() {
  const totalQuantity = document.querySelector("#totalQuantity");
  const total = cart.reduce((total, item) => total + item.quantity, 0);
  totalQuantity.textContent = total;
}

// Function insertion du prix et de la quantité totale
function updatePriceAndQuantity(id, newValue, item) {
  const itemToUpdate = cart.find((item) => item.id === id);
  itemToUpdate.quantity = Number(newValue);
  item.quantity = itemToUpdate.quantity;

  // Appelle des functions
  displayTotalQuantity();
  displayTotalPrice();
  saveNewDataToCache(item);
}

// Function sauvegarder dans le cache
function saveNewDataToCache(item) {
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

// Function pour supprimer un article
function deleteItem(item) {
  const itemToDelete = cart.findIndex(
    (product) => product.id === item.id && product.color === item.color
  );
  cart.splice(itemToDelete, 1);

  // Appelle des functions
  displayTotalPrice();
  displayTotalQuantity();
  deleteDataFromCache(item);
  deleteArticleFromPage(item);
}

// Function supprimer dans le cache
function deleteDataFromCache(item) {
  const key = `${item.id}-${item.color}`;
  localStorage.removeItem(key);
}

// Function supprimer article de la page
function deleteArticleFromPage(item) {
  const articleToDelete = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`
  );
  articleToDelete.remove();
}

// // // GERER LES ARTICLES DANS LA PAGE CART // // //
// Button confirmation du form pour commander les articles
const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", (e) => submitForm(e));

// Function alert selectionner des articles avant d'acheter
function submitForm(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Veuillez s'il vous plait séléctionner les articles à acheter.");
    return;
  }

  if (isEmailInvalid()) return;

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

// Function recup de coordonnées client et construction d'un array depuis local storage
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

// Function recup de l'id et split de la color
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

// Function alert email mal rempli
function isEmailInvalid() {
  const email = document.querySelector("#email").value;
  const regex = /^[A-Za-z0-9+_.-]+@(.+)$/;
  if (regex.test(email) === false) {
    alert("Veuillez s'il vous plait remplir le champ de l'email correctement.");
    return true;
  }
  return false;
}
