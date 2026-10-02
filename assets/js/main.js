/* MANDEMAND — koncept-interaktion
   Mobilmenu, kurv (drawer), toast, scroll-reveal og tilmeldingsformer.
   Kurven lever kun i browserens hukommelse — ingen backend endnu. */

(function () {
  "use strict";

  const FREE_SHIPPING = 499;
  const fmt = (n) => n.toLocaleString("da-DK") + " kr.";

  /* ---------- Mobilmenu ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Luk menu" : "Åbn menu");
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Toast ---------- */
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  /* ---------- Kurv ---------- */
  const cart = document.getElementById("cart");
  const overlay = document.getElementById("cartOverlay");
  const cartItemsEl = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartHeadCount = document.getElementById("cartHeadCount");
  const cartTotal = document.getElementById("cartTotal");
  const cartShip = document.getElementById("cartShip");

  const items = new Map(); // name -> { price, qty }

  function openCart() {
    cart.classList.add("is-open");
    overlay.classList.add("is-open");
    cart.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cart.classList.remove("is-open");
    overlay.classList.remove("is-open");
    cart.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.getElementById("cartOpen")?.addEventListener("click", openCart);
  document.getElementById("cartClose")?.addEventListener("click", closeCart);
  overlay?.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

  function render() {
    let count = 0, total = 0;
    cartItemsEl.innerHTML = "";

    if (items.size === 0) {
      cartItemsEl.innerHTML = '<p class="cart__empty">Kurven er tom. Det er den slags, der kan fikses.</p>';
    }

    items.forEach((it, name) => {
      count += it.qty;
      total += it.qty * it.price;

      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div class="cart-item__thumb">MM</div>
        <div>
          <div class="cart-item__name">${name}</div>
          <div class="cart-item__qty">
            <button type="button" data-dec aria-label="Én færre">−</button>
            <span>${it.qty} stk.</span>
            <button type="button" data-inc aria-label="Én mere">+</button>
          </div>
        </div>
        <div class="cart-item__price">${fmt(it.qty * it.price)}</div>`;
      row.querySelector("[data-inc]").addEventListener("click", () => { it.qty++; render(); });
      row.querySelector("[data-dec]").addEventListener("click", () => {
        it.qty--;
        if (it.qty <= 0) items.delete(name);
        render();
      });
      cartItemsEl.appendChild(row);
    });

    cartCount.textContent = count;
    cartHeadCount.textContent = `(${count})`;
    cartTotal.textContent = fmt(total);

    const missing = FREE_SHIPPING - total;
    if (total > 0 && missing <= 0) {
      cartShip.innerHTML = "✓ Du har fri fragt.";
      cartShip.classList.add("is-free");
    } else {
      cartShip.innerHTML = `Køb for <strong>${fmt(Math.max(missing, 0))}</strong> mere og få fri fragt.`;
      cartShip.classList.remove("is-free");
    }
  }

  document.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = Number(btn.dataset.price) || 0;
      const existing = items.get(name);
      if (existing) existing.qty++;
      else items.set(name, { price, qty: 1 });
      render();

      cartCount.classList.remove("bump");
      void cartCount.offsetWidth; // genstart animation
      cartCount.classList.add("bump");

      showToast(`${name} lagt i kurven`);
    });
  });

  render();

  /* ---------- Tilmeldingsformer (koncept: ingen afsendelse) ---------- */
  document.querySelectorAll("[data-signup]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      form.classList.add("is-done");
      input.value = "";
      input.placeholder = "Tak. Du hører fra os.";
      showToast("Du er skrevet op. Velkommen i broderskabet.");
    });
  });

  /* ---------- Scroll-reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }
})();
