let games = [];
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const category = document.getElementById("category");
const frame = document.getElementById("frame");
const player = document.getElementById("player");

async function init() {
    const res = await fetch("games.json");
    games = await res.json();

    loadCategories();
    render();
}

function loadCategories() {
    const cats = [...new Set(games.map(g => g.category))];

    cats.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        category.appendChild(opt);
    });
}

function render() {
    const term = search.value.toLowerCase();
    const cat = category.value;

    grid.innerHTML = "";

    games
        .filter(g =>
            g.name.toLowerCase().includes(term) &&
            (cat === "all" || g.category === cat)
        )
        .forEach(game => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${game.thumbnail}">
                <div class="card-content">
                    <h3>${game.name}</h3>
                    <p>${game.category}</p>
                </div>
                <div class="fav">${favorites.includes(game.file) ? "★" : "☆"}</div>
            `;

            card.onclick = () => openGame(game.file);

            card.querySelector(".fav").onclick = (e) => {
                e.stopPropagation();
                toggleFav(game.file);
            };

            grid.appendChild(card);
        });
}

function toggleFav(file) {
    if (favorites.includes(file)) {
        favorites = favorites.filter(f => f !== file);
    } else {
        favorites.push(file);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    render();
}

function openGame(file) {
    frame.src = file;
    player.style.display = "block";
    grid.style.display = "none";
}

document.getElementById("backBtn").onclick = () => {
    player.style.display = "none";
    grid.style.display = "grid";
    frame.src = "";
};

document.getElementById("fullBtn").onclick = () => {
    frame.requestFullscreen();
};

search.oninput = render;
category.onchange = render;

init();
