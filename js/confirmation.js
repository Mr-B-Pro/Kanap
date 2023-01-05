// // // GERER LES ARTICLES DANS LA PAGE CONFIRMATION // // //
const orderId = getOrderId();
displayOrderId(orderId);
removeAllCache();

// Function recuperation des params
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
