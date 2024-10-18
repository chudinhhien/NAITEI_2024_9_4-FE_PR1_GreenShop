const cartHeader = async () => {
  const cartHeaderElement = document.getElementById('cart-header');
  const quantity = cartHeaderElement.querySelector('#quantity-card-header');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContent = document.getElementById('cart-header-content');
  const currentLanguage = localStorage.getItem('userLanguage') || 'vi';
  quantity.innerHTML = cart.length;

  if (cart.length > 0) {
    let totalAmount = 0;
    const productIds = cart.map(item => item.productId).join('&id=');
    let products = await get(`${currentLanguage}/products?id=${productIds}`);
    products = products.map(product => {
      return {
        ...product,
        quantity: cart.find(item => item.productId === product.id).quantity
      }
    })
    cartContent.innerHTML = products.map(item => {
      const productTotal = item.price * item.quantity;
      totalAmount += productTotal;
      return `
      <div class="cart-item flex items-center justify-between border-b border-gray-300 py-4">
        <div class="flex items-center gap-4 mr-3">
          <img src="../../assets/images/${item.images[0]}" alt="${item.name}" class="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-200">
          <div>
            <p class="text-gray-900 text-sm font-semibold">${item.name}</p>
            <p class="text-gray-500 text-xs mt-1">${item.quantity} x ${item.price.toLocaleString()} đ</p>
          </div>
        </div>
        <div class="text-right mr-3">
          <p class="text-sm text-gray-900 font-bold">${productTotal.toLocaleString()} đ</p>
        </div>
        <button class="text-red-500 text-sm font-medium hover:text-red-600 transition-colors duration-200 ease-in-out" data-id="${item.id}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
      `;
    }).join('');

    cartContent.innerHTML += `
      <div class="flex justify-between items-center mt-4">
        <p class="text-sm font-semibold text-gray-700"><span data-i18n="header.total"></span>:</p>
        <p class="text-sm font-semibold text-gray-800">${totalAmount.toLocaleString()} đ</p>
      </div>
      <div class="flex justify-center mt-4">
        <a href="../pages/cart.html" class="bg-main text-white px-4 py-2 rounded-full text-sm font-medium">
          <span data-i18n="header.view_cart"></span>
        </a>
      </div>
    `;

    document.querySelectorAll('.cart-item button').forEach(button => {
      button.addEventListener('click', async (event) => {
        const productId = event.currentTarget.getAttribute('data-id');
        removeFromCart(productId);
        await cartHeader();
        loadTranslations(getLanguage());
      });
    });
  } else {
    cartContent.innerHTML = `
    <div class="flex justify-center mb-[10px]">
      <img src="../../assets/images/shopping-bag.png" alt="cart" class="w-10 h-10">
    </div>
    <div>
      <span class="text-gray-600 text-[14px]" data-i18n="header.empty_cart"></span>
    </div>
    `;
  }
}

const removeFromCart = (id) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  id = parseInt(id);
  cart = cart.filter(item => item.productId !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
}

const calculateTotal = (products) => {
  const total = document.getElementById('total-amount');
  const totalContent = total.querySelector('tbody');
  let subtotal = 0;

  products.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  const tax = subtotal * 0.10;
  const totalToPay = subtotal + tax;

  totalContent.innerHTML = `
    <tr>
      <th class="border border-gray-300 py-4 px-8 uppercase"><span data-i18n="cart.total_amount"></span></th>
      <td class="border border-gray-300 py-4 px-8">${subtotal} đ</td>
    </tr>
    <tr>
      <th class="border border-gray-300 py-4 px-8 uppercase"><span data-i18n="cart.tax"></span></th>
      <td class="border border-gray-300 py-4 px-8">${tax} đ</td>
    </tr>
    <tr class="bg-main text-white font-bold">
      <th class="border border-gray-300 py-4 px-8 uppercase"><span data-i18n="cart.total_to_pay"></span></th>
      <td class="border border-gray-300 py-4 px-8" id="totalToPay">${totalToPay} đ</td>
    </tr>
  `;

  loadTranslations(getLanguage());
}

const updateCart = async (id, newQuantity) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const productIndex = cart.findIndex(item => item.productId === id);
  if (productIndex !== -1) {
    cart[productIndex].quantity = newQuantity;

    localStorage.setItem('cart', JSON.stringify(cart));
    
    await cartHeader();
    loadTranslations(getLanguage());
    await cartPage();
  }
}

const removeFromCartPage = async (id) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  id = parseInt(id);
  cart = cart.filter(item => item.productId !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  await cartHeader();
  loadTranslations(getLanguage());
  await cartPage();
}

const cartPage = async () => {
  const cartTable = document.getElementById('table-cart');
  const cartContent = cartTable.querySelector('tbody');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const productIds = cart.map(item => item.productId).join('&id=');
  const currentLanguage = localStorage.getItem('userLanguage') || 'vi';
  let products = await get(`${currentLanguage}/products?id=${productIds}`);
  products = products.map(product => {
    return {
      ...product,
      quantity: cart.find(item => item.productId === product.id).quantity
    }
  })

  cartContent.innerHTML = products.map(item => {
    const productTotal = item.price * item.quantity;
    return `
      <tr class="text-center">
        <td class="border border-gray-300 py-4 px-2 w-48">
          <a href="#" class="w-full aspect-[3/4]">
            <img class="w-full object-cover" src="../../assets/images/${item.images[0]}" alt="${item.name}">
          </a>
        </td>
        <td class="border border-gray-300 py-4 px-4 uppercase text-main font-bold">${item.name}</td>
        <td class="border border-gray-300 py-4 px-2">${item.price} đ</td>
        <td class="border border-gray-300 py-4 px-2">
          <input 
            class="border border-gray-300 w-12 text-center focus:border-main focus:outline-none" 
            type="number" 
            min="1" 
            value="${item.quantity}" 
            data-id="${item.id}" 
          >
        </td>
        <td class="border border-gray-300 py-4 px-2">${productTotal} đ</td>
        <td class="border border-gray-300 py-4 px-2">
          <button class="text-red-500" onclick="removeFromCartPage(${item.id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  calculateTotal(products);

  cartContent.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('change', async (e) => {
      const newQuantity = parseInt(e.target.value, 10);
      const productId = e.target.dataset.id;

      if (newQuantity >= 1) {
        await updateCart(parseInt(productId), newQuantity);
      } else {
        e.target.value = 1;
      }
    });
  });
}

if(window.location.pathname.includes('cart.html')){
  cartPage();
}
