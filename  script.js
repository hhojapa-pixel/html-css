const cart = [];

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const orderForm = document.getElementById("order-form");

// Дүкөндүн WhatsApp номерин өзгөртүңүз.
// Өлкө коду менен, + белгисиз жазыңыз.
const WHATSAPP_NUMBER = "996700123456";

function updateCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = count;
    cartTotal.textContent = total.toLocaleString("ru-RU") + " сом";

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty">Себетиңиз азырынча бош.</p>';
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-row">
            <div>
                <strong>${item.name}</strong>
                <p>${item.price.toLocaleString("ru-RU")} сом × ${item.quantity}</p>
                <strong>${(item.price * item.quantity).toLocaleString("ru-RU")} сом</strong>
            </div>

            <div class="cart-controls">
                <button type="button" data-action="minus" data-index="${index}"
                    aria-label="Санын азайтуу">−</button>

                <span>${item.quantity}</span>

                <button type="button" data-action="plus" data-index="${index}"
                    aria-label="Санын көбөйтүү">+</button>

                <button type="button" class="remove"
                    data-action="remove" data-index="${index}">
                    ✕
                </button>
            </div>
        </div>
    `).join("");
}

// Букетти себетке кошуу
document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", () => {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existing = cart.find(item => item.name === name);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                name,
                price,
                quantity: 1
            });
        }

        updateCart();

        // Кардарды себетке алып барат
        document.getElementById("order").scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    });
});

// Себеттеги сандарды башкаруу
cartItems.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const index = Number(button.dataset.index);
    const item = cart[index];

    if (!item) return;

    switch (button.dataset.action) {
        case "plus":
            item.quantity++;
            break;

        case "minus":
            item.quantity--;

            if (item.quantity <= 0) {
                cart.splice(index, 1);
            }
            break;

        case "remove":
            cart.splice(index, 1);
            break;
    }

    updateCart();
});

// Баасы боюнча сорттоо
document.getElementById("sort").addEventListener("change", event => {
    const grid = document.getElementById("product-grid");
    const cards = [...grid.querySelectorAll(".product-card")];

    if (event.target.value === "low") {
        cards.sort((a, b) =>
            Number(a.dataset.price) - Number(b.dataset.price)
        );
    } else if (event.target.value === "high") {
        cards.sort((a, b) =>
            Number(b.dataset.price) - Number(a.dataset.price)
        );
    }

    cards.forEach(card => grid.appendChild(card));
});

// Заказды WhatsApp аркылуу жөнөтүүгө даярдоо
orderForm.addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Алгач каталогдон букет тандаңыз! 🌷");
        document.getElementById("catalog").scrollIntoView({
            behavior: "smooth"
        });
        return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const date = document.getElementById("delivery-date").value;
    const comment = document.getElementById("comment").value.trim();

    if (!name || !phone || !address || !date) {
        alert("Бардык керектүү талааларды толтуруңуз.");
        return;
    }

    if (WHATSAPP_NUMBER === "996700123456") {
        alert(
            "Заказды жөнөтүүдөн мурун script.js файлындагы " +
            "WHATSAPP_NUMBER номерин дүкөндүн чыныгы номерине алмаштырыңыз."
        );
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const bouquetList = cart.map(item =>
        `• ${item.name} — ${item.quantity} даана × ${item.price} сом`
    ).join("\n");

    const message =
        "🌸 FLOWERSHOP — ЖАҢЫ ЗАКАЗ\n\n" +
        `Кардар: ${name}\n` +
        `Телефон: ${phone}\n` +
        `Дарек: ${address}\n` +
        `Жеткирүү күнү: ${date}\n\n` +
        "Букеттер:\n" + bouquetList + "\n\n" +
        `Жалпы сумма: ${total} сом\n` +
        `Комментарий: ${comment || "Жок"}`;

    const whatsappURL =
        "https://wa.me/" + WHATSAPP_NUMBER +
        "?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
});

// Календарда өткөн күндөрдү тандабоо
const dateInput = document.getElementById("delivery-date");
const today = new Date();
const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

dateInput.min = localToday;

updateCart();