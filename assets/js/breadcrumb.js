// Function để hiển thị breadcrumb dựa vào URL
function renderBreadcrumb() {
    const breadcrumbContainer = document.getElementById('breadcrumb'); // Lấy thẻ để chèn breadcrumb
    const currentUrl = window.location.pathname; // Lấy URL hiện tại

    let breadcrumbHTML = `<a href="/src/pages/home.html" class="hover:underline"><span data-i18n="header.home"></span></a> / `;

    // Tạo mảng chứa các breadcrumb
    const breadcrumbArray = currentUrl.split('/').filter(item => item !== '');
    breadcrumbHTML += '<a class="text-main">' + `<span data-i18n="${breadcrumbArray.pop().replace(/\.html$/, '')}.title"></span>` + '</a>';

    // Chèn breadcrumb vào HTML
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// Gọi hàm khi tải trang
document.addEventListener('DOMContentLoaded', function () {
    renderBreadcrumb();
});
