// // // GERER LES ARTICLES DANS LA PAGE CONFIRMATION // // //
const orderId = getOrderId();
displayOrderId(orderId);
removeAllCache();

// Recupération de l'orderId dans l'url de la page produit
// window.location.search = récupére l’url à partir du “?”
// new URLSearchParams = fabrique une nouvelle chaîne de requête
// get = renvoir la premiere valeur associée au param de recherche
function getOrderId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("orderId");
}

// Function affichage du numéro de commande
function displayOrderId(orderId) {
  const orderIdElement = document.getElementById("orderId");
  orderIdElement.textContent = orderId;
}

// Function supprimer le local storage
function removeAllCache() {
  const cache = window.localStorage;
  cache.clear();
}
