// // // AFFICHER LES ARTICLES DANS LA PAGE PRODUITS // // //
// Recupération de l'ID
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

// Récupération des articles de l'API
fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((res) => handleData(res));

// Function creation de variables
function handleData(sofa) {
  const { altTxt, colors, description, imageUrl, name, price } = sofa;
  altText = altTxt;
  imgUrl = imageUrl;
  articleName = name;
  itemPrice = price;

  // Appelle des functions
  makeImage(altTxt, imageUrl);
  makeTitle(name);
  makePrice(price);
  makeDescription(description);
  makeColors(colors);
}

// Function insertion des options de couleurs
function makeColors(colors) {
  const select = document.querySelector("#colors");

  colors.forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    select.appendChild(option);
  });
}

// Function insertion du name "H1"
function makeTitle(name) {
  const h1 = document.querySelector("#title");
  h1.textContent = name;
}

// Function insertion du prix "span"
function makePrice(price) {
  const span = document.querySelector("#price");
  span.textContent = price;
}

// Function insertion de l'image et du "altTxt"
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
// Ecoute du panier
const button = document.querySelector("#addToCart");
button.addEventListener("click", handleClick);

// Function recupération du choix de la couleur et de la quantité
function handleClick() {
  const color = document.querySelector("#colors").value;
  const quantity = document.querySelector("#quantity").value;

  // Appelle des functions
  if (isOrderInvalid(color, quantity)) return;
  saveOrder(color, quantity);
  redirectToCart();
}

// Function fenêtre pop-up non selection de couleur et quantité
function isOrderInvalid(color, quantity) {
  if (color == null || color == "" || quantity == null || quantity == 0) {
    alert(
      "Veuillez s'il vous plait séléctionner une couleur et une quantité au produit."
    );
    return true;
  }
}

// Function récupération des options de l'article à ajouter au panier
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
  localStorage.setItem(key, JSON.stringify(data));
}

// Function redirection vers la page panier
function redirectToCart() {
  window.location.href = "cart.html";
}
