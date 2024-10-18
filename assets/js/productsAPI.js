const toast = document.getElementById('cart-toast');
const addToCart = async (productId) => {
  const currentLanguage = localStorage.getItem('userLanguage') || 'vi';
  if (!isLogin()) {
    showToast(await fetch(`../../assets/locales/${currentLanguage}.json`).then(response => response.json()).then(data => data.alert.error_login_to_view_cart));
    setTimeout(() => {
      window.location.href = '../pages/login.html';
    }, 3000);
    return;
  }
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const productIndex = cart.findIndex((item) => item.productId === productId);

  if (productIndex === -1) {
    cart.push({"productId": productId , quantity: 1 });
  } else {
    cart[productIndex].quantity += 1;
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  await cartHeader();
  loadTranslations(currentLanguage);

  toast.classList.remove('hidden');
  toast.classList.add('opacity-100');

  setTimeout(() => {
      toast.classList.remove('opacity-100');
      setTimeout(() => toast.classList.add('hidden'), 500);
  }, 1000);
};

const showProducts = async () => {
  const currentLanguage = localStorage.getItem('userLanguage') || 'vi';
  const outstandingProducts = await get(`${currentLanguage}/products?_limit=6`);
  const outstandingProductsElement = document.getElementById('outstanding-products');
  outstandingProductsElement.querySelector(`#content-left .big-card`).innerHTML = '';
  outstandingProductsElement.querySelector(`#content-left .medium-card`).innerHTML = '';
  outstandingProductsElement.querySelector(`#content-right .big-card`).innerHTML = '';
  outstandingProductsElement.querySelector(`#content-right .medium-card`).innerHTML = '';
  outstandingProducts.map((product,index) => {
    const position = index < 3 ? 'left' : 'right'; 
    const content = outstandingProductsElement.querySelector(`#content-${position}`);
    const bigCard = content.querySelector('.big-card');
    const mediumCard = content.querySelector('.medium-card');
    if(index == 0 || index == 5) {
      bigCard.innerHTML = `
        <div class="relative">
          <a href="#" class="img-product-big-wrapper">
            <img class="img-product" src="../../assets/images/${product.images[0]}" alt="${product.name}"/>
          </a>
          <a href="#" class="img-product-hover group-hover:bg-opacity-50">
          </a>
          <div class="product-card-btn-wrapper">
            <div class="flex justify-center items-center w-full">
              <button class="product-add-btn" onclick="addToCart(${product.id})">
                  <i class="fas fa-shopping-cart me-[5px]"></i>
                  <span data-i18n="outstanding_products.add_to_cart"></span>
              </button>
              <button class="product-detail-btn" onclick="productModal(${product.id})">
                  <i class="fas fa-search text-[20px]"></i>
              </button>
            </div>
          </div>
          ${ product.discountPercentage > 0 ? `<div class="tag-product"><span>-${product.discountPercentage}%</span></div>` : '' }
        </div>
        <div class="product-card-info">
          <h3>
              <a href="#"><span>${product.name}</span></a>
          </h3>
          <div class="flex items-center">
              <img src="../../assets/images/star.svg" class="w-4 h-4 me-1" alt="star">
              <img src="../../assets/images/star.svg" class="w-4 h-4 me-1" alt="star">
              <img src="../../assets/images/star.svg" class="w-4 h-4 me-1" alt="star">
              <img src="../../assets/images/star.svg" class="w-4 h-4 me-1" alt="star">
              <img src="../../assets/images/star_m.svg" class="w-4 h-4 me-1"
                  alt="star">
          </div>
          <div class="product-card-price">
            ${ product.discountPercentage > 0 ? 
              `
                <span class="discount-price">${Math.round(product.price * (1 - product.discountPercentage / 100))}đ</span>
                <span class="line-through-price">${product.price}₫</span>
              ` 
              : 
              `
                <span class="discount-price">${product.price}₫</span>
              ` 
            }
          </div>
        </div>
      `
    }else {
      mediumCard.innerHTML += `
        <div class="product-card group">
          <div class="relative">
            <a href="#" class="img-product-medium-wrapper">
              <img class="img-product" src="../../assets/images/${product.images[0]}" alt="${product.name}" />
            </a>
            <a href="#" class="img-product-hover group-hover:bg-opacity-50">
            </a>
            <div class="product-card-btn-wrapper">
              <div class="flex justify-center items-center w-full">
                <button class="product-add-btn" onclick="addToCart(${product.id})">
                  <i class="fas fa-shopping-cart me-[5px]"></i>
                  <span data-i18n="outstanding_products.add_to_cart"></span>
                </button>
                <button class="product-detail-btn" onclick="productModal(${product.id})">
                  <i class="fas fa-search text-[20px]"></i>
                </button>
              </div>
            </div>
            ${ product.discountPercentage > 0 ? `<div class="tag-product"><span>- ${product.discountPercentage}</span></div>` : '' }
          </div>
          <div class="product-card-info">
            <h3>
              <a href="#"><span>${product.name}</span></a>
            </h3>
            <div class="flex items-center">
              <img src="../../assets/images/star.svg" class="w-3 h-3 me-1"
                  alt="star">
              <img src="../../assets/images/star.svg" class="w-3 h-3 me-1"
                  alt="star">
              <img src="../../assets/images/star.svg" class="w-3 h-3 me-1"
                  alt="star">
              <img src="../../assets/images/star.svg" class="w-3 h-3 me-1"
                  alt="star">
              <img src="../../assets/images/star_m.svg" class="w-3 h-3 me-1"
                  alt="star">
            </div>
            <div class="product-card-price">
              ${ product.discountPercentage > 0 ? 
                `
                  <span class="discount-price">${Math.round(product.price * (1 - product.discountPercentage / 100))}đ</span>
                  <span class="line-through-price">${product.price}₫</span>
                ` 
                : 
                `
                  <span class="discount-price">${product.price}₫</span>
                ` 
              }
            </div>
          </div>
          <input class="hidden" id="${product.id}"></input>
        </div>
      `
    }
  })
  loadTranslations(currentLanguage);
}
