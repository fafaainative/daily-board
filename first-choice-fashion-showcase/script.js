// FIRST CHOICE — edit the WhatsApp number and product prices below.
const WHATSAPP_NUMBER = "2348116965084"; // Replace with your business WhatsApp number; country code, no + or spaces.
const products = Array.from({ length: 30 }, (_, index) => {
  const n = index + 1;
  // Ten supplied image slots are reused across the 30 catalogue entries.
  const imageNumber = ((index % 10) + 1);
  return {
    name: `Cloth ${n}`,
    price: `₦${(25000 + index * 2500).toLocaleString("en-NG")}`,
    image: `assets/images/cloth${imageNumber}.jpg`,
    number: String(n).padStart(2, "0")
  };
});

const track = document.getElementById("productTrack");
products.forEach((product) => {
  const card = document.createElement("article");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy"
        onerror="this.style.opacity='.15'; this.parentElement.style.background='linear-gradient(145deg,#c9bba7,#e9dfd1)';">
      <span class="product-number">FC / ${product.number}</span>
    </div>
    <div class="product-info">
      <div><h3>${product.name}</h3><p>${product.price}</p></div>
      <button type="button" class="order-product" data-product="${product.name}" data-price="${product.price}">ENQUIRE ↗</button>
    </div>`;
  track.appendChild(card);
});

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.href = whatsappLink("Hello First Choice Fashion Designer. I would like to make an enquiry.");
  link.target = "_blank";
  link.rel = "noopener";
});
track.addEventListener("click", event => {
  const button = event.target.closest(".order-product");
  if (!button) return;
  const message = `Hello First Choice, I'm interested in ${button.dataset.product} (${button.dataset.price}). Please share more details.`;
  window.open(whatsappLink(message), "_blank", "noopener");
});

let slideIndex = 0;
function visibleCards() {
  if (window.innerWidth <= 650) return 1;
  if (window.innerWidth <= 900) return 2;
  return 4;
}
function moveCarousel(direction) {
  const count = visibleCards();
  const max = Math.max(0, products.length - count);
  slideIndex = Math.min(max, Math.max(0, slideIndex + direction));
  const card = track.querySelector(".product-card");
  if (!card) return;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  track.style.transform = `translateX(-${slideIndex * (card.getBoundingClientRect().width + gap)}px)`;
}
document.querySelector(".carousel-next").addEventListener("click", () => moveCarousel(1));
document.querySelector(".carousel-prev").addEventListener("click", () => moveCarousel(-1));
window.addEventListener("resize", () => { slideIndex = 0; moveCarousel(0); });

document.getElementById("year").textContent = new Date().getFullYear();
document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector(".nav").classList.toggle("open");
});
document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => document.querySelector(".nav").classList.remove("open")));

// jQuery-powered reveal, staggered entrance and subtle hero motion.
$(function () {
  $(".hero .reveal").each(function (i) {
    $(this).delay(180 + i * 220).animate({ opacity: 1 }, 650).addClass("visible");
  });
  function revealOnScroll() {
    $(".section-kicker, .intro h2, .intro-copy, .feature-line > div, .product-card, .steps article, .statement-inner > *")
      .each(function (i) {
        const top = $(this).offset().top;
        if (top < $(window).scrollTop() + $(window).height() - 65) {
          $(this).stop(true).delay(Math.min(i * 35, 250)).animate({ opacity: 1 }, 450);
          $(this).css({ transform: "translateY(0)" });
        }
      });
  }
  $(".section-kicker, .intro h2, .intro-copy, .feature-line > div, .product-card, .steps article, .statement-inner > *")
    .css({ opacity: 0, transform: "translateY(18px)" });
  $(window).on("scroll", revealOnScroll);
  revealOnScroll();

  // Gentle automatic carousel movement; pauses while the visitor interacts.
  let autoSlide = setInterval(() => {
    const max = products.length - visibleCards();
    slideIndex = slideIndex >= max ? 0 : slideIndex + 1;
    moveCarousel(0);
  }, 4200);
  $(".product-viewport, .carousel-controls").on("mouseenter touchstart", () => clearInterval(autoSlide));
});
