import { movies } from './movies.js';

const movieSections = document.getElementById('movie-sections');
const searchInput = document.getElementById('search');
const genreFilter = document.getElementById('genre-filter');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalYear = document.getElementById('modal-year');
const modalGenre = document.getElementById('modal-genre');
const modalRating = document.getElementById('modal-rating');
const modalAverageRating = document.getElementById('modal-average-rating');
const favoriteButton = document.getElementById('favorite-button');
const closeModal = document.querySelector('.close');

const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const showRegisterLink = document.getElementById('show-register');

const registerModal = document.getElementById('register-modal');
const registerForm = document.getElementById('register-form');
const registerUsernameInput = document.getElementById('register-username');
const registerPasswordInput = document.getElementById('register-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const registerError = document.getElementById('register-error');
const showLoginLink = document.getElementById('show-login');

const mainContent = document.getElementById('main-content');
const logoutButton = document.getElementById('logout-button');
const loadingScreen = document.getElementById('loading-screen');
const welcomeMessage = document.getElementById('welcome-message');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null;

function showLoginModal() {
    loginModal.style.display = 'flex';
    registerModal.style.display = 'none';
    loadingScreen.style.display = 'none';
}

function showRegisterModal() {
    registerModal.style.display = 'flex';
    loginModal.style.display = 'none';
    loadingScreen.style.display = 'none';
}

function hideModals() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
}

function login(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        isLoggedIn = true;
        currentUser = user;
        hideModals();
        showLoadingScreen();
    } else {
        loginError.style.display = 'block';
    }
}

function showLoadingScreen() {
    if (!currentUser) {
        console.error('Usuário não está definido.');
        return;
    }

    welcomeMessage.textContent = `Seja bem-vindo, ${currentUser.username}!`;
    loadingScreen.style.display = 'flex';

    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainContent.style.display = 'block';
        displayMoviesByGenre(movies);
    }, 3000);
}

function register(username, password) {
    if (users.some(u => u.username === username)) {
        registerError.textContent = 'Nome de usuário já existe.';
        registerError.style.display = 'block';
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    registerError.style.display = 'none';
    alert('Registro bem-sucedido!');
    login(username, password);
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    login(username, password);
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = registerUsernameInput.value;
    const password = registerPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
        registerError.textContent = 'As senhas não coincidem.';
        registerError.style.display = 'block';
        return;
    }

    register(username, password);
});

showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterModal();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginModal();
});

logoutButton.addEventListener('click', () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('currentUser');
    isLoggedIn = false;
    currentUser = null;
    mainContent.style.display = 'none';
    showLoginModal();
});

if (isLoggedIn) {
    const username = localStorage.getItem('currentUser');
    currentUser = users.find(u => u.username === username);
    if (currentUser) {
        showLoadingScreen();
    } else {
        localStorage.setItem('isLoggedIn', 'false');
        isLoggedIn = false;
        showLoginModal();
    }
} else {
    showLoginModal();
}

function groupMoviesByGenre(movies) {
    const grouped = {};
    movies.forEach(movie => {
        if (!grouped[movie.genre]) {
            grouped[movie.genre] = [];
        }
        grouped[movie.genre].push(movie);
    });
    return grouped;
}

function displayMoviesByGenre(filteredMovies) {
    const groupedMovies = groupMoviesByGenre(filteredMovies);
    movieSections.innerHTML = '';

    for (const genre in groupedMovies) {
        const section = document.createElement('div');
        section.classList.add('movie-section');

        const title = document.createElement('h2');
        title.textContent = genre;
        section.appendChild(title);

        const movieListWrapper = document.createElement('div');
        movieListWrapper.classList.add('movie-list-wrapper');

        const movieList = document.createElement('div');
        movieList.classList.add('movie-list');

        groupedMovies[genre].forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <button class="favorite-icon ${favorites.includes(movie.title) ? 'active' : ''}" onclick="toggleFavorite('${movie.title}')">
                    &#9733;
                </button>
            `;
            movieCard.addEventListener('click', () => openModal(movie));
            movieList.appendChild(movieCard);
        });

        const scrollArrowRight = document.createElement('div');
        scrollArrowRight.classList.add('scroll-arrow');
        scrollArrowRight.textContent = '→';
        scrollArrowRight.addEventListener('click', () => {
            movieList.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        });

        const scrollArrowLeft = document.createElement('div');
        scrollArrowLeft.classList.add('scroll-arrow-left');
        scrollArrowLeft.textContent = '←';
        scrollArrowLeft.addEventListener('click', () => {
            movieList.scrollBy({
                left: -200,
                behavior: 'smooth'
            });
        });

        movieListWrapper.appendChild(scrollArrowLeft);
        movieListWrapper.appendChild(movieList);
        movieListWrapper.appendChild(scrollArrowRight);
        section.appendChild(movieListWrapper);
        movieSections.appendChild(section);
    }
}

function openModal(movie) {
    modalTitle.textContent = movie.title;
    modalDescription.textContent = movie.description;
    modalYear.textContent = movie.year;
    modalGenre.textContent = movie.genre;
    modal.style.display = 'flex';
    modal.classList.add('active');

    favoriteButton.textContent = favorites.includes(movie.title) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos';
    favoriteButton.onclick = () => toggleFavorite(movie.title);

    updateRating(movie);

    modalRating.querySelectorAll('span').forEach(star => {
        star.addEventListener('click', () => rateMovie(movie, star.dataset.value));
    });
}

function updateRating(movie) {
    modalRating.querySelectorAll('span').forEach(star => {
        star.classList.toggle('active', star.dataset.value <= movie.rating);
    });

    modalAverageRating.textContent = movie.rating ? `${movie.rating}/5` : 'Nenhuma';
}

function rateMovie(movie, rating) {
    movie.rating = parseInt(rating);
    localStorage.setItem('movies', JSON.stringify(movies));
    updateRating(movie);
}

function toggleFavorite(title) {
    if (favorites.includes(title)) {
        favorites = favorites.filter(fav => fav !== title);
    } else {
        favorites.push(title);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayMoviesByGenre(movies);
    if (modal.style.display === 'flex') {
        const movie = movies.find(m => m.title === title);
        openModal(movie);
    }
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modal.classList.remove('active');
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
});

searchInput.addEventListener('input', () => filterMovies());

genreFilter.addEventListener('change', () => filterMovies());

function filterMovies() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;
    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm) &&
        (selectedGenre === '' || movie.genre === selectedGenre)
    );
    displayMoviesByGenre(filteredMovies);
}

if (isLoggedIn) {
    displayMoviesByGenre(movies);
}