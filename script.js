document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // 1. كود صفحة المتجر (store.html)
    // ==========================================
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener("click", function () {
                const name = this.getAttribute("data-name");
                const price = parseFloat(this.getAttribute("data-price"));
                const img = this.getAttribute("data-img");

                // سحب العربة الحالية من ذاكرة المتصفح أو إنشاء واحدة جديدة
                let cart = JSON.parse(localStorage.getItem("mosiqatiCart")) || [];

                // إضافة المنتج الفعلي للمصفوفة
                cart.push({ name: name, price: price, img: img });

                // حفظ التغيير بشكل دائم في الـ localStorage
                localStorage.setItem("mosiqatiCart", JSON.stringify(cart));

                alert(`تم إضافة (${name}) إلى سلة الطلبات الخاصة بك!`);
            });
        });
    }

    // ==========================================
    // 2. كود صفحة العربة (cart.html)
    // ==========================================
    const tbody = document.getElementById("cart-items-tbody");
    const finalPriceDisplay = document.getElementById("final-price-display");
    const clearCartBtn = document.getElementById("clear-cart-btn");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (tbody) {
        function displayCart() {
            // قراءة المنتجات المخزنة بذاكرة المتصفح
            let cart = JSON.parse(localStorage.getItem("mosiqatiCart")) || [];
            tbody.innerHTML = ""; 
            let total = 0;

            if (cart.length === 0) {
                finalPriceDisplay.textContent = "0 د.أ";
                tbody.innerHTML = `<tr><td colspan="4" style="padding: 30px; color: #7f8c8d; font-weight: bold;">العربة فارغة حاليا!.</td></tr>`;
                return;
            }

            // تكرار الحلقات وبناء صفوف الجدول من الذاكرة المحفوظة
            cart.forEach((item, index) => {
                total += item.price;
                
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><img src="${item.img}" alt="${item.name}" class="cart-item-img"></td>
                    <td class="product-name">${item.name}</td>
                    <td class="cart-price">${item.price} د.أ</td>
                    <td><button class="delete-item-btn" data-index="${index}">حذف</button></td>
                `;
                tbody.appendChild(row);
            });

            finalPriceDisplay.textContent = total + " د.أ";
        }

        // حدث حذف منتج محدد وإعادة حساب المجموع
        tbody.addEventListener("click", function (event) {
            if (event.target.classList.contains("delete-item-btn")) {
                const index = parseInt(event.target.getAttribute("data-index"));
                let cart = JSON.parse(localStorage.getItem("mosiqatiCart")) || [];
                
                cart.splice(index, 1); // حذف المنتج من المصفوفة بالاعتماد على الـ index
                localStorage.setItem("mosiqatiCart", JSON.stringify(cart)); // حفظ المصفوفة المحدثة
                displayCart(); // إعادة التحديث التلقائي الفوري للشاشة
            }
        });

        // تفريغ السلة بالكامل
        if (clearCartBtn) {
            clearCartBtn.addEventListener("click", function () {
                if (confirm("هل تريد تفريغ العربة؟")) {
                    localStorage.removeItem("mosiqatiCart");
                    displayCart();
                }
            });
        }

        // إتمام الشراء
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", function () {
                let cart = JSON.parse(localStorage.getItem("mosiqatiCart")) || [];
                if (cart.length === 0) {
                    alert("عربتك فارغة! قم بإضافة بعض المنتجات من المتجر أولا.");
                } else {
                    alert("شكرا لتسوقك من متجر موسيقاتي!.");
                    localStorage.removeItem("mosiqatiCart");
                    displayCart();
                }
            });
        }

        // تشغيل الدالة فور فتح صفحة العربة لقراءة المشتريات
        displayCart();
    }
});