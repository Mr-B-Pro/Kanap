// // // AFFICHER LES ARTICLES DANS LA PAGE PRODUITS // // //

// Recupération et affichage de l'id dans l'url de la page produit
// window.location.search = récupére l’url à partir du “?”
// new URLSearchParams = fabrique une nouvelle chaîne de requête
// get = renvoir la premiere valeur associée au param de recherche
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

// Récupération des données du canapé dans l'API avec fetch url + id
fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((res) => handleData(res));

// Function creation de variables pour les données de l'API
function handleData(sofa) {
  const { altTxt, colors, description, imageUrl, name, price } = sofa;
  altText = altTxt;
  imgUrl = imageUrl;
  articleName = name;
  itemPrice = price;

  // Appelle des functions qui affichent les caractéristiques du canapé
  makeImage(altTxt, imageUrl);
  makeTitle(name);
  makePrice(price);
  makeDescription(description);
  makeColors(colors);
}

// Function création et insertion du select et des options de couleurs
function makeColors(colors) {
  const select = document.querySelector("#colors");

  colors.forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    select.appendChild(option);
  });
}

// Function insertion du name "h1"
function makeTitle(name) {
  const h1 = document.querySelector("#title");
  h1.textContent = name;
}

// Function insertion du prix "span"
function makePrice(price) {
  const span = document.querySelector("#price");
  span.textContent = price;
}

// Function création et insertion de l'"img"
function makeImage(altTxt, imageUrl) {
  const image = document.createElement("img");
  image.alt = altTxt;
  image.src = imageUrl;
  const parent = document.querySelector(".item__img");
  parent.appendChild(image);
}

// Function insertion de la description "p"
function makeDescription(description) {
  const p = document.querySelector("#description");
  p.textContent = description;
}

// // // GERER LES ARTICLES DANS LA PAGE PRODUITS // // //

// Sélection et écoute du button pour la vérification de la couleur et la quantité à ajouter au panier
const button = document.querySelector("#addToCart");
button.addEventListener("click", handleClick);

// Function vérification et recupération de la couleur et de la quantité
function handleClick() {
  const color = document.querySelector("#colors").value;
  const quantity = document.querySelector("#quantity").value;

  // Appelle des functions vérification et alert de couleur et quantité, Clef et objets pour le localStorage, Redirection vers la page panier
  if (isOrderInvalid(color, quantity)) return;
  saveOrder(color, quantity);
  redirectToCart();
}

// Function fenêtre alert si il n'y a pas de couleur et de quantité selectionnées
function isOrderInvalid(color, quantity) {
  if (color == null || color == "" || quantity == null || quantity == 0) {
    alert(
      "Veuillez s'il vous plait séléctionner une couleur et une quantité au produit."
    );
    return true;
  }
}

// Function créer clef et objets pour le localStorage et prévoir si on a deux fois le meme canapé
// JSON.parse = analyse string JSON pour changer en objet
// getItem = renvoie la valeur associée à la clé
function saveOrder(color, quantity) {
  const key = `${id}-${color}`;
  const sofaLocal = JSON.parse(localStorage.getItem(key));
  let data = null;

  if (sofaLocal) {
    data = {
      id: id,
      color: color,
      quantity: Number(quantity) + sofaLocal.quantity,
      imageUrl: imgUrl,
      altTxt: altText,
      name: articleName,
    };
  } else {
    data = {
      id: id,
      color: color,
      quantity: Number(quantity),
      imageUrl: imgUrl,
      altTxt: altText,
      name: articleName,
    };
  }

  //Initialisation du local storage
  // setItem = duo clé valeur sont ajoutés
  localStorage.setItem(key, JSON.stringify(data));
}

// Function redirection vers la page panier
function redirectToCart() {
  window.location.href = "cart.html";
}
