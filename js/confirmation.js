// // // GERER LES ARTICLES DANS LA PAGE CONFIRMATION // // //

// Appelle des function
const orderId = getOrderId();
displayOrderId(orderId);
removeAllCache();

// Recupération et affichage de l'orderId dans l'url de la page confirmation
// window.location.search = récupére l’url à partir du “?”
// URLSearchParams = pour travailler avec la chaîne de requête
// new URLSearchParams = fabrique une nouvelle chaîne de requête
// get = renvoi la premiere valeur associée au param de recherche
function getOrderId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("orderId");
}

// Function affichage du numéro de commande
// getElementById = récupére les informations d'une balise identifiée par son id.
function displayOrderId(orderId) {
  const orderIdElement = document.getElementById("orderId");
  orderIdElement.textContent = orderId;
}

// Function supprimer les données du local storage
function removeAllCache() {
  const cache = window.localStorage;
  cache.clear();
}
