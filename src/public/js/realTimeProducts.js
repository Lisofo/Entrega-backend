const socket = io();

const productForm = document.getElementById('productForm');
const productsList = document.getElementById('productsList');

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  
  socket.emit('addProduct', { title, price });
  productForm.reset();
});

function deleteProduct(id) {
  socket.emit('deleteProduct', id);
}

socket.on('updateProducts', (products) => {
  productsList.innerHTML = products.map(product => `
    <li>
      <h2>${product.title}</h2>
      <p>Precio: $${product.price}</p>
      <p>ID: ${product.id}</p>
      <button onclick="deleteProduct(${product.id})">Eliminar</button>
    </li>
  `).join('');
});