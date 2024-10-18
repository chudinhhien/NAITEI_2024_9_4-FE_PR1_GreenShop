const closeProductModal = () => {
  const close = document.getElementById('close');
  close.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
};

const productModal = async (id) => {
  const currentLanguage = localStorage.getItem('userLanguage') || 'vi';
  const product = await get(`${currentLanguage}/products/${id}`);
  const modal = document.getElementById('modal');
  const toast = document.getElementById('cart-toast');

  let currentImageIndex = 0;
  const images = product.images;
  
  modal.innerHTML = `
    <div class="bg-white p-4 rounded-lg shadow-lg w-[900px] relative">
      <div class="flex">
        <div class="basis-2/5 mr-[30px]">
            <img id="mainImage" src="../../assets/images/${images[currentImageIndex]}" alt="${product.name}"
                class="w-full h-auto object-cover rounded-lg border border-gray-300">
        </div>
        <div class="basis-3/5">
          <h3 class="text-[24px] font-medium mb-[10px]">${product.name}</h3>
          <div class="flex items-center mb-[10px]">
            <img src="../../assets/images/star.svg" class="w-3 h-3 me-1" alt="star">
            <img src="../../assets/images/star.svg" class="w-3 h-3 me-1" alt="star">
            <img src="../../assets/images/star.svg" class="w-3 h-3 me-1" alt="star">
            <img src="../../assets/images/star.svg" class="w-3 h-3 me-1" alt="star">
            <img src="../../assets/images/star_m.svg" class="w-3 h-3 me-1" alt="star">
          </div>
          <div class="text-[20px] text-red-500">
              <span>${product.price}</span>
          </div>
          <div class="description">
            <p class="mt-[10px]">${product.description}</p>
          </div>
          <div class="quantity">
            <label for="quantity" class="text-sm font-medium text-gray-700"><span data-i18n="modal.quantity"></span>:</label>
            <div class="flex items-center space-x-2 mt-2">
              <button id="down" class="w-[30px] h-[30px] bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 focus:outline-none">
                  -
              </button>
              <input type="number" id="quantity" name="quantity" value="1" min="1"
                  class="w-[60px] h-[35px] text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
              <button id="up" class="w-[30px] h-[30px] bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 focus:outline-none">
                  +
              </button>
            </div>
          </div>                    
          <div class="mt-4">
            <button class="btn-add-to-cart bg-main text-white px-4 py-2 rounded-[20px] hover:bg-white hover:text-main border-main border">
              <i class="fas fa-shopping-cart me-[5px]"></i>
              <span data-i18n="outstanding_products.add_to_cart"></span>
            </button>
          </div>
        </div>
      </div>
      <div class="flex items-center mt-4">
        <button id="prevImage" class="text-gray-500 hover:text-gray-700 focus:outline-none">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="flex space-x-2 mx-4" id="previewImg">
          ${images.map((img, index) => `
            <img class="h-16 w-16 border ${index === currentImageIndex ? 'border-main' : 'border-gray-300'} object-cover cursor-pointer hover:opacity-75 transition duration-300 ease-in-out border-2" src="../../assets/images/${img}" alt="image${index}" data-index="${index}">
          `).join('')}
        </div>
        <button id="nextImage" class="text-gray-500 hover:text-gray-700 focus:outline-none">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <div class="cursor-pointer absolute top-[-14px] right-[-14px] text-white h-[28px] w-[28px] rounded-full bg-red-500 flex justify-center items-center" id="close">
          <i class="fas fa-times"></i>
      </div>
    </div>
  `;

  loadTranslations(currentLanguage);
  modal.classList.remove('hidden');

  closeProductModal();

  document.getElementById('prevImage').addEventListener('click', () => {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      updateImage();
    }
  });

  document.getElementById('nextImage').addEventListener('click', () => {
    if (currentImageIndex < images.length - 1) {
      currentImageIndex++;
      updateImage();
    }
  });

  document.querySelectorAll('#previewImg img').forEach((thumbnail) => {
    thumbnail.addEventListener('click', (event) => {
      currentImageIndex = parseInt(event.target.getAttribute('data-index'));
      updateImage();
    });
  });

  const updateImage = () => {
    document.getElementById('mainImage').src = `../../assets/images/${images[currentImageIndex]}`;
    const thumbnails = document.querySelectorAll('#previewImg img');
    thumbnails.forEach((thumbnail, index) => {
      if (index === currentImageIndex) {
        thumbnail.classList.add('border-main');
        thumbnail.classList.remove('border-gray-300');
      } else {
        thumbnail.classList.remove('border-main');
        thumbnail.classList.add('border-gray-300');
      }
    });
  };

  document.getElementById('down').addEventListener('click', () => {
    const quantity = document.getElementById('quantity');
    if (quantity.value > 1) {
      quantity.value = parseInt(quantity.value) - 1;
    }
  });

  document.getElementById('up').addEventListener('click', () => {
    const quantity = document.getElementById('quantity');
    quantity.value = parseInt(quantity.value) + 1;
  });

  document.querySelector('.btn-add-to-cart').addEventListener('click', async () => {
    if (!isLogin()) {
      showToast(await fetch(`../../assets/locales/${currentLanguage}.json`).then(response => response.json()).then(data => data.alert.error_login_to_view_cart));
      setTimeout(() => {
        window.location.href = '../pages/login.html';
      }, 3000);
      return;
    }
    const quantity = document.getElementById('quantity').value;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex((item) => item.productId === product.id);


    if (productIndex === -1) {
        cart.push({"productId": id, quantity: parseInt(quantity) });
    } else {
        cart[productIndex].quantity += parseInt(quantity);
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
  });
};
