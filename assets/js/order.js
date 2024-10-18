const order = async () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const token = sessionStorage.getItem('token');
  if (!token) {
    window.location.href = '../pages/login.html';
    return;
  }
  
  const user = decodeJWT(token);
  const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
  const total = document.getElementById('totalToPay').innerHTML;
  const totalAmount = parseFloat(total.replace(/[^\d]/g, ''));
  let data = {
    customer: user.id,
    status: 0,
    listCart: cart,
    method: paymentMethod,
    total: totalAmount,
    date: new Date().toISOString()
  };

  try {
    const response = await post('orders', data);
    if (response) {
      localStorage.removeItem('cart');
      window.location.href = '../pages/purchase-history.html';
    }
  } catch (error) {
    console.error('Error placing order:', error);
  }
};

document.getElementById('payment').addEventListener('click', async () => {
  await order();
});
