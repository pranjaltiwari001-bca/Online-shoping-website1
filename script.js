const products = [
  {id:1,name:"The Everyday Linen Shirt",category:"Clothing",price:1499,oldPrice:1999,rating:4.8,badge:"Bestseller",image:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=85"},
  {id:2,name:"Cloud Nine Sneakers",category:"Shoes",price:2499,oldPrice:3199,rating:4.9,badge:"-22%",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"},
  {id:3,name:"The Minimalist Watch",category:"Watches",price:3299,oldPrice:null,rating:4.7,badge:"Just in",image:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85"},
  {id:4,name:"Santal No. 04 Eau de Parfum",category:"Beauty",price:1899,oldPrice:2299,rating:4.8,badge:"Loved",image:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=85"},
  {id:5,name:"Weekend Carryall Tote",category:"Accessories",price:1799,oldPrice:null,rating:4.6,badge:"Everyday pick",image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85"},
  {id:6,name:"Soft Knit Weekend Set",category:"Clothing",price:2199,oldPrice:2799,rating:4.7,badge:"-21%",image:"https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=700&q=85"},
  {id:7,name:"Retro Court Trainers",category:"Shoes",price:2899,oldPrice:null,rating:4.8,badge:"New colour",image:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=85"},
  {id:8,name:"Golden Hour Hoops",category:"Accessories",price:799,oldPrice:999,rating:4.5,badge:"-20%",image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85"},
  {id:9,name:"Midnight Oud Fragrance",category:"Beauty",price:2599,oldPrice:null,rating:4.9,badge:"Staff pick",image:"https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=700&q=85"},
  {id:10,name:"Classic Leather Timepiece",category:"Watches",price:4599,oldPrice:5499,rating:4.8,badge:"-16%",image:"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=700&q=85"},
  {id:11,name:"The Daily Crossbody",category:"Accessories",price:2299,oldPrice:null,rating:4.6,badge:"Bestseller",image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85"},
  {id:12,name:"Relaxed Cotton Tee",category:"Clothing",price:699,oldPrice:899,rating:4.4,badge:"-22%",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85"},
  {id:13,name:"Sculptural Table Vase",category:"Home",price:1199,oldPrice:null,rating:4.6,badge:"Home edit",image:"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=85"},
  {id:14,name:"Wireless Everyday Buds",category:"Tech",price:1999,oldPrice:2499,rating:4.5,badge:"-20%",image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=700&q=85"},
  {id:15,name:"Weekend Slip-On Loafers",category:"Shoes",price:2699,oldPrice:null,rating:4.7,badge:"Easy favourite",image:"https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=700&q=85"},
  {id:16,name:"Dew Drop Face Serum",category:"Beauty",price:999,oldPrice:1299,rating:4.6,badge:"-23%",image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85"}
];

const $ = (selector) => document.querySelector(selector);
const productGrid = $("#productGrid");
const searchInput = $("#searchInput");
const sortSelect = $("#sortSelect");
let activeCategory = "All";
let wishlist = new Set(readStorage("velora-wishlist", []));
let cart = readStorage("velora-cart", {});
let toastTimer;

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch { return fallback; }
}
function saveStorage() {
  try {
    localStorage.setItem("velora-cart", JSON.stringify(cart));
    localStorage.setItem("velora-wishlist", JSON.stringify([...wishlist]));
  } catch {}
}
function money(value) {
  return new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
function visibleProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let list = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesQuery = !query || `${p.name} ${p.category} ${p.badge}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
  if (sortSelect.value === "low") list.sort((a,b) => a.price-b.price);
  if (sortSelect.value === "high") list.sort((a,b) => b.price-a.price);
  if (sortSelect.value === "rating") list.sort((a,b) => b.rating-a.rating);
  return list;
}
function renderProducts() {
  const list = visibleProducts();
  productGrid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image-wrap">
        <span class="product-badge ${p.oldPrice ? "sale" : ""}">${escapeHtml(p.badge)}</span>
        <button class="wish-btn ${wishlist.has(p.id) ? "active" : ""}" data-wish="${p.id}" aria-label="${wishlist.has(p.id) ? "Remove from" : "Add to"} wishlist">${wishlist.has(p.id) ? "♥" : "♡"}</button>
        <img class="product-image" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.style.opacity='.15';this.alt='Image unavailable';">
        <button class="quick-add" data-add="${p.id}">＋ Add to bag</button>
      </div>
      <div class="product-info">
        <div class="product-meta"><h3 class="product-name">${escapeHtml(p.name)}</h3><span class="rating">★ ${p.rating.toFixed(1)}</span></div>
        <p class="product-category">${escapeHtml(p.category)}</p>
        <div><span class="product-price">${money(p.price)}</span>${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ""}</div>
      </div>
    </article>`).join("");
  $("#resultCount").textContent = `Showing ${list.length} ${list.length === 1 ? "find" : "finds"}`;
  $("#emptyState").classList.toggle("hidden", list.length !== 0);
  productGrid.classList.toggle("hidden", list.length === 0);
  $("#showAllProducts").textContent = activeCategory === "All" && !searchInput.value ? "You're all caught up ✳" : "Clear filters ↗";
  $("#productsHeading").innerHTML = activeCategory === "All" ? "The good <em>stuff.</em>" : `${escapeHtml(activeCategory)} <em>edit.</em>`;
  $("#productSubtitle").textContent = searchInput.value.trim() ? `Results for “${searchInput.value.trim()}”` : "Fresh finds for your own kind of style.";
}
function setCategory(category) {
  activeCategory = category;
  document.querySelectorAll("[data-category]").forEach(el => el.classList.toggle("active", el.dataset.category === category));
  renderProducts();
}
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveStorage(); updateCart(); showToast(`${products.find(p=>p.id===id).name} added to your bag.`);
}
function toggleWishlist(id) {
  const product = products.find(p => p.id === id);
  if (wishlist.has(id)) { wishlist.delete(id); showToast("Removed from your wishlist."); }
  else { wishlist.add(id); showToast(`${product.name} saved to your wishlist.`); }
  saveStorage(); updateCounts(); renderProducts();
}
function updateCounts() {
  const count = Object.values(cart).reduce((sum,qty) => sum + qty, 0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#wishlistCount").textContent = wishlist.size;
}
function updateCart() {
  const entries = Object.entries(cart).filter(([id,qty]) => products.some(p=>p.id===Number(id)) && qty > 0);
  const count = entries.reduce((sum,[,qty]) => sum+qty,0);
  const subtotal = entries.reduce((sum,[id,qty]) => sum+products.find(p=>p.id===Number(id)).price*qty,0);
  $("#cartItems").innerHTML = entries.map(([id,qty]) => {
    const p = products.find(item=>item.id===Number(id));
    return `<div class="cart-item"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}"><div><p class="cart-item-name">${escapeHtml(p.name)}</p><p class="cart-item-category">${escapeHtml(p.category)}</p><span class="cart-item-price">${money(p.price)}</span><div class="qty-control"><button data-qty="${id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="${id}" data-delta="1" aria-label="Increase quantity">＋</button></div></div><button class="remove-item" data-remove="${id}" aria-label="Remove ${escapeHtml(p.name)}">×</button></div>`;
  }).join("");
  $("#cartEmpty").classList.toggle("hidden", count > 0);
  $("#cartFooter").classList.toggle("hidden", count === 0);
  $("#cartSubtotal").textContent = money(subtotal);
  const remaining = Math.max(0,1999-subtotal);
  $("#shippingText").textContent = remaining === 0 ? "Lovely! Your order qualifies for free shipping." : `You're ${money(remaining)} away from free shipping.`;
  $("#shippingProgress").style.width = `${Math.min(100,subtotal/1999*100)}%`;
  updateCounts();
}
function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden","false");
  $("#overlay").classList.add("visible");
  document.body.style.overflow = "hidden";
  $("#closeCart").focus();
}
function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden","true");
  $("#overlay").classList.remove("visible");
  document.body.style.overflow = "";
}
function showWishlist() {
  const saved = products.filter(p => wishlist.has(p.id));
  searchInput.value = "";
  activeCategory = "All";
  document.querySelectorAll("[data-category]").forEach(el=>el.classList.toggle("active",el.dataset.category==="All"));
  productGrid.innerHTML = saved.map(p=>`
    <article class="product-card"><div class="product-image-wrap"><span class="product-badge">Your wishlist</span><button class="wish-btn active" data-wish="${p.id}" aria-label="Remove from wishlist">♥</button><img class="product-image" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy"><button class="quick-add" data-add="${p.id}">＋ Add to bag</button></div><div class="product-info"><div class="product-meta"><h3 class="product-name">${escapeHtml(p.name)}</h3><span class="rating">★ ${p.rating}</span></div><p class="product-category">${p.category}</p><span class="product-price">${money(p.price)}</span></div></article>`).join("");
  $("#productsHeading").innerHTML = "Your <em>wishlist.</em>";
  $("#productSubtitle").textContent = saved.length ? "All the things you have your eye on." : "Your wishlist is waiting for its first favourite.";
  $("#resultCount").textContent = `${saved.length} saved ${saved.length===1?"find":"finds"}`;
  $("#emptyState").classList.toggle("hidden", saved.length !== 0);
  productGrid.classList.toggle("hidden", saved.length === 0);
  $("#showAllProducts").textContent = "Back to all finds ↗";
  $("#shop").scrollIntoView({behavior:"smooth"});
}
productGrid.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  const wish = e.target.closest("[data-wish]");
  if (add) addToCart(Number(add.dataset.add));
  if (wish) toggleWishlist(Number(wish.dataset.wish));
});
$("#cartItems").addEventListener("click", e => {
  const qty = e.target.closest("[data-qty]");
  const remove = e.target.closest("[data-remove]");
  if (qty) {
    const id = qty.dataset.qty;
    cart[id] = (cart[id] || 0) + Number(qty.dataset.delta);
    if (cart[id] <= 0) delete cart[id];
    saveStorage(); updateCart();
  }
  if (remove) { delete cart[remove.dataset.remove]; saveStorage(); updateCart(); }
});
document.querySelectorAll("[data-category]").forEach(el => el.addEventListener("click", () => {
  setCategory(el.dataset.category);
  if (el.closest(".main-nav")) $("#mainNav").classList.remove("open");
  if (el.closest(".category-grid") || el.closest(".main-nav")) $("#shop").scrollIntoView({behavior:"smooth"});
}));
document.querySelectorAll("[data-nav-category]").forEach(el => el.addEventListener("click", () => {
  setCategory(el.dataset.navCategory);
  $("#mainNav").classList.remove("open");
}));
searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);
$("#showAllProducts").addEventListener("click", () => {
  searchInput.value = ""; sortSelect.value = "featured"; setCategory("All"); renderProducts();
});
$("#resetFilters").addEventListener("click", () => {
  searchInput.value = ""; setCategory("All"); renderProducts();
});
$("#focusSearch").addEventListener("click", () => { $("#shop").scrollIntoView({behavior:"smooth"}); setTimeout(()=>searchInput.focus(),350); });
$("#showWishlist").addEventListener("click", showWishlist);
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$("#continueShopping").addEventListener("click", () => { closeCart(); $("#shop").scrollIntoView({behavior:"smooth"}); });
$("#mobileMenu").addEventListener("click", () => {
  const nav = $("#mainNav");
  nav.classList.toggle("open");
  $("#mobileMenu").setAttribute("aria-label", nav.classList.contains("open") ? "Close menu" : "Open menu");
});
document.addEventListener("keydown", e => { if(e.key==="Escape") { closeCart(); $("#mainNav").classList.remove("open"); } });
$("#checkoutBtn").addEventListener("click", () => {
  const entries = Object.entries(cart).filter(([,qty])=>qty>0);
  const subtotal = entries.reduce((sum,[id,qty])=>sum+products.find(p=>p.id===Number(id)).price*qty,0);
  $("#checkoutSummary").innerHTML = `${entries.reduce((sum,[,qty])=>sum+qty,0)} item(s) in your bag<br><strong>Demo subtotal: ${money(subtotal)}</strong>`;
  $("#checkoutModal").showModal();
});
$("#demoOrderBtn").addEventListener("click", () => {
  $("#checkoutModal").close();
  closeCart();
  cart = {};
  saveStorage(); updateCart();
  showToast("Demo order complete! No payment was taken.");
});
$("#newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = $("#newsletterEmail").value.trim();
  if (email) {
    $("#newsletterMessage").textContent = "You're on the list (demo only) — thanks for stopping by!";
    $("#newsletterEmail").value = "";
  }
});

renderProducts();
updateCart();
