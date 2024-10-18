const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const showOrderDetails = async (orderId) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    window.location.href = '../pages/login.html';
    return;
  }

  try {
    const order = await get(`orders/${orderId}`);
    if (order) {
      const modalTitle = document.getElementById('orderModalTitle');
      const modalContent = document.getElementById('orderDetailContent');
      
      modalTitle.innerHTML = `<span data-i18n="order.detail"></span> #${order.id}`;
      let orderItems = '';
      
      for (const item of order.listCart) {
        const product = await getProductById(item.productId);
        orderItems += `
          <div class="flex justify-between items-center border-b border-gray-200 py-3">
            <div>
              <p class="font-semibold text-gray-800">${product.name}</p>
              <p class="text-sm text-gray-600"><span data-i18n="modal.quantity"></span>: ${item.quantity}</p>
            </div>
            <div class="text-right">
              <p class="text-main font-semibold">${(product.price * item.quantity).toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
        `;
      }

      const totalDisplay = order.total.toLocaleString('vi-VN');
      const paymentMethod = order.method;
      let status;
      switch (order.status) {
        case 0:
          status = '<span class="text-blue-500" data-i18n="purchase-history.proccessing"></span>';
          break;
        case 1:
          status = '<span class="text-green-500" data-i18n="purchase-history.completed"></span>';
          break;
        case 2:
          status = '<span class="text-red-500" data-i18n="purchase-history.cancelled"></span>';
          break;
        default:
          status = '<span class="text-gray-500" data-i18n="purchase-history.unknown"></span>';
          break;
      }

      const orderDate = new Date(order.date).toLocaleDateString('vi-VN');

      modalContent.innerHTML = `
        <div class="p-4 bg-gray-50 rounded-md shadow-md">
          <p class="text-gray-700"><strong><span data-i18n="order.order_date"></span>:</strong> ${orderDate}</p>
          <p class="text-gray-700"><strong><span data-i18n="order.method"></span>:</strong> <span data-i18n="cart.${paymentMethod}"></span></p>
          <p class="text-gray-700"><strong><span data-i18n="order.status"></span>:</strong> ${status}</p>
          <div class="mt-4">
            <h3 class="font-bold text-gray-800 text-lg"><span data-i18n="order.product_list"></span>:</h3>
            <div class="mt-2">
              ${orderItems}
            </div>
          </div>
          <p class="mt-4 text-right font-bold text-lg text-gray-800"><span data-i18n="order.total_amount"></span>: <span class="text-main">${totalDisplay} đ</span></p>
        </div>
      `;

      const modal = document.getElementById('orderDetailModal');
      modal.classList.remove('hidden');
      loadTranslations(getLanguage());
    }
  } catch (error) {
    console.error('Error fetching order details:', error);
  }
};


getProductById = async (productId) => {
  const currentLanguage = localStorage.getItem('userLanguage') || 'vi';
  try {
    const product = await get(`${currentLanguage}/products/${productId}`);
    return product;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return { name: 'Unknown product', price: 0 };
  }
}

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('orderDetailModal').classList.add('hidden');
});

document.getElementById('orderDetailModal').addEventListener('click', (e) => {
  if (e.target.id === 'orderDetailModal') {
    document.getElementById('orderDetailModal').classList.add('hidden');
  }
});


const showHistory = async () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    window.location.href = '../pages/login.html';
    return;
  }

  const user = decodeJWT(token);
  const response = await get(`orders?customer=${user.id}`);
  if (response) {
    const history = document.getElementById('history');
    const historyContent = history.querySelector('tbody');
    let content = '';

    response.forEach(order => {
      let statusClass = '';
      let statusText = '';
      switch (order.status) {
        case 0:
          statusText = 'purchase-history.proccessing';
          statusClass = 'text-blue-300';
          break;
        case 1:
          statusText = 'purchase-history.completed';
          statusClass = 'text-main';
          break;
        case 2:
          statusText = 'purchase-history.cancelled';
          statusClass = 'text-red-500';
          break;
      }

      let paymentMethodText = '';
      switch (order.method) {
        case 'cod':
          paymentMethodText = 'cart.cod';
          break;
        case 'paypal':
          paymentMethodText = 'cart.paypal'
          break;
        case 'credit-card':
          paymentMethodText = 'cart.credit_card';
          break;
        default:
          paymentMethodText = 'cart.unknown';
      }

      content += `
        <tr class="text-center">
          <td class="border border-gray-300 py-4 px-2 w-48">#${order.id}</td>
          <td class="border border-gray-300 py-4 px-4">${formatDate(order.date)}</td>
          <td class="border border-gray-300 py-4 px-2"><span data-i18n="${paymentMethodText}"></span></td>
          <td class="border border-gray-300 py-4 px-2">${order.total.toLocaleString('vi-VN')} đ</td>
          <td class="border border-gray-300 py-4 px-2 ${statusClass}"><span data-i18n="${statusText}"></span></td>
          <td class="border border-gray-300 py-4 px-2">
            <button class="text-main" onclick="showOrderDetails(${order.id})">
              <i class="fas fa-clipboard-list mr-1"></i>
              <span class="underline" data-i18n="purchase-history.view_detail"></span>
            </button>
          </td>
        </tr>
      `;
    });

    historyContent.innerHTML = content;
    loadTranslations(getLanguage());
  }
};

showHistory();
