/*SPA NAVIGATION*/
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/*MOCK API — MENU DATA*/
const menuData = [
  { id: 1, name: "Latte", category: "Drink", price: 9.00, img: "latte.webp" },
  { id: 2, name: "Americano", category: "Drink", price: 7.00, img: "americano.webp" },
  { id: 3, name: "Cappuccino", category: "Drink", price: 9.00, img: "cappuccino.jpg" },
  { id: 4, name: "Hot Chocolate", category: "Drink", price: 12.00, img: "Hot Chocolate.jpg" },
  { id: 5, name: "Matcha Latte", category: "Drink", price: 10.00, img: "matchalatte.jpg" },
  { id: 6, name: "Basque Burnt Cheesecake", category: "Dessert", price: 15.00, img: "bbc.jpg" },
  { id: 7, name: "Strawberry ShortCake", category: "Dessert", price: 16.90, img: "ssc.jpg" },
  { id: 8, name: "Chocolate Indulgent Cake", category: "Dessert", price: 18.90, img: "cic.jpg" },
  { id: 9, name: "Tiramisu Cake", category: "Dessert", price: 14.90, img: "tiramisu.jpg" },
  { id: 10, name: "Almond Croissant", category: "Snack", price: 10.00, img: "ac.jpg" },
  { id: 11, name: "Cinnamon Roll", category: "Snack", price: 10.00, img: "cr.jpg" },
  { id: 12, name: "French Fries", category: "Snack", price: 13.00, img: "fries.jpg" },
  { id: 13, name: "Chicken Nuggets", category: "Snack", price: 13.00, img: "nuggets.jpg" },

];

function fetchMenu() {
  return Promise.resolve(menuData);
}

/*FEATURE 1: SEARCH & FILTER */
let activeCategory = 'All';

function setCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const label = btn.textContent.trim();
    btn.classList.toggle('active',
      (cat === 'All' && label === 'All') ||
      (cat === 'Drink' && label.includes('Drinks')) ||
      (cat === 'Dessert' && label.includes('Desserts')) ||
      (cat === 'Snack' && label.includes('Snacks'))
    );
  });
  renderMenu();
}

function filterMenu() {
  renderMenu();
}

/*FEATURE 2: SORT BY NAME / PRICE*/
let activeSort = 'default';

function setSort(sortVal) {
  activeSort = sortVal;
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sort === sortVal);
  });
  renderMenu();
}

function renderMenu() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const container = document.getElementById('menuContainer');

  let filtered = menuData.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  // Sort
  if (activeSort === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (activeSort === 'name-desc') filtered.sort((a, b) => b.name.localeCompare(a.name));
  if (activeSort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (activeSort === 'price-desc') filtered.sort((a, b) => b.price - a.price);

  if (filtered.length === 0) {
    container.innerHTML = '<div class="no-results">No items found. Try a different search! 🔍</div>';
    return;
  }

  container.innerHTML = '';
  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-item';
    card.innerHTML = `
            <img src="${item.img}" alt="${item.name}" onerror="this.style.display='none'">
            <div class="menu-item-body">
                <span class="cat-badge">${item.category}</span>
                <h3>${item.name}</h3>
                <p class="price">RM ${item.price.toFixed(2)}</p>
                <button class="details-btn" onclick="openModal(${item.id})">View Details</button>
            </div>
        `;
    container.appendChild(card);
  });
}

/* Load menu on startup */
fetchMenu().then(() => renderMenu());

/*FEATURE 3: MENU ITEM POPUP MODAL */
const itemDetails = {
  1: { desc: "Smooth espresso mixed with steamed milk for a creamy coffee drink.", calories: "120 kcal" },
  2: { desc: "Espresso diluted with hot water, giving a rich but lighter coffee taste.", calories: "10 kcal" },
  3: { desc: "Espresso with steamed milk and thick milk foam on top.", calories: "90 kcal" },
  4: { desc: "Warm chocolate drink made with cocoa and steamed milk.", calories: "190 kcal" },
  5: { desc: "Green tea powder blended with milk for a smooth and slightly sweet drink", calories: "150 kcal" },
  6: { desc: "Creamy cheesecake with a caramelized burnt top and soft center.", calories: "320 kcal" },
  7: { desc: "Soft sponge cake layered with fresh strawberries and whipped cream.", calories: "280 kcal" },
  8: { desc: "Rich chocolate cake with smooth chocolate frosting.", calories: "390 kcal" },
  9: { desc: "Coffee-flavored Italian dessert layered with mascarpone cream and cocoa powder.", calories: "300 kcal" },
  10: { desc: "Buttery croissant filled with sweet almond cream and topped with sliced almonds.", calories: "280 kcal" },
  11: { desc: "Soft pastry rolled with cinnamon sugar and topped with icing.", calories: "290 kcal" },
  12: { desc: "Golden crispy fries seasoned with our house blend spices. Great on its own or with a dipping sauce.", calories: "290 kcal" },
  13: { desc: "Crispy bite-sized chicken pieces coated in golden breadcrumbs and fried until crunchy.", calories: "320 kcal" },
};

function openModal(id) {
  const item = menuData.find(m => m.id === id);
  const details = itemDetails[id];
  if (!item) return;

  document.getElementById('modalImg').src = item.img;
  document.getElementById('modalImg').alt = item.name;
  document.getElementById('modalName').textContent = item.name;
  document.getElementById('modalCat').textContent = item.category;
  document.getElementById('modalTag').textContent = details.tag;
  document.getElementById('modalDesc').textContent = details.desc;
  document.getElementById('modalPrice').textContent = `RM ${item.price.toFixed(2)}`;
  document.getElementById('modalCalories').textContent = details.calories;

  document.getElementById('menuModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('menuModal').classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal when clicking backdrop
document.addEventListener('click', (e) => {
  if (e.target.id === 'menuModal') closeModal();
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* FORM VALIDATION*/
function submitForm(e) {
  e.preventDefault();

  const nameInput = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');
  const messageInput = document.getElementById('messageInput');
  const success = document.getElementById('success');

  // Clear previous errors
  document.getElementById('nameError').textContent = '';
  document.getElementById('emailError').textContent = '';
  document.getElementById('messageError').textContent = '';
  [nameInput, emailInput, messageInput].forEach(el => el.classList.remove('error-field'));
  success.style.display = 'none';

  let valid = true;

  if (!nameInput.value.trim()) {
    document.getElementById('nameError').textContent = 'Name is required.';
    nameInput.classList.add('error-field');
    valid = false;
  }

  if (!emailInput.value.trim()) {
    document.getElementById('emailError').textContent = 'Email is required.';
    emailInput.classList.add('error-field');
    valid = false;
  } else if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
    document.getElementById('emailError').textContent = 'Please enter a valid email.';
    emailInput.classList.add('error-field');
    valid = false;
  }

  if (!messageInput.value.trim()) {
    document.getElementById('messageError').textContent = 'Message cannot be empty.';
    messageInput.classList.add('error-field');
    valid = false;
  }

  if (valid) {
    success.style.display = 'block';
    e.target.reset();
  }
}

/*FEATURE 4: BACK TO TOP*/
window.addEventListener('scroll', () => {
  const btn = document.getElementById('backToTop');
  btn.style.display = window.scrollY > 300 ? 'block' : 'none';
});

function scrollToTopFn() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}