const socket = io();

const productForm = document.getElementById('productForm');
const productsList = document.getElementById('productsList');
const errorMessage = document.getElementById('errorMessage');

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  errorMessage.textContent = '';
  
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const price = parseFloat(document.getElementById('price').value);
  const code = document.getElementById('code').value;
  const stock = parseInt(document.getElementById('stock').value);
  const category = document.getElementById('category').value;

  if (!title || !description || !price || !code || !stock || !category) {
    errorMessage.textContent = 'Todos los campos son obligatorios';
    return;
  }

  if (isNaN(price) || price <= 0) {
    errorMessage.textContent = 'El precio debe ser un número mayor a 0';
    return;
  }

  if (isNaN(stock) || stock < 0) {
    errorMessage.textContent = 'El stock debe ser un número positivo';
    return;
  }

  socket.emit('addProduct', { 
    title, 
    description, 
    price, 
    code, 
    stock, 
    category 
  });
  
  productForm.reset();
});

function deleteProduct(id) {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    socket.emit('deleteProduct', id);
  }
}

socket.on('updateProducts', (products) => {
  productsList.innerHTML = products.map(product => `
    <li>
      <h2>${product.title}</h2>
      <p>Descripción: ${product.description}</p>
      <p>Precio: $${product.price}</p>
      <p>Código: ${product.code}</p>
      <p>Stock: ${product.stock}</p>
      <p>Categoría: ${product.category}</p>
      <p>ID: ${product.id}</p>
      <button onclick="deleteProduct(${product.id})">Eliminar</button>
    </li>
  `).join('');
});

socket.on('error', (error) => {
  errorMessage.textContent = error;
});