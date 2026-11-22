let coins = 0;
let gamesPlayed = 0;
let wishes = 0;

function updateStats() {
    document.getElementById("coins").textContent = coins;
    document.getElementById("heroCoins").textContent = coins;
    document.getElementById("heroGames").textContent = gamesPlayed;

    let level = Math.floor(coins / 100) + 1;

    document.getElementById("level").textContent = level;
    document.getElementById("heroLevel").textContent = level;

    if (gamesPlayed >= 1) unlock("achFirst");
    if (coins >= 100) unlock("achCoins");
    if (gamesPlayed >= 5) unlock("achGames");
    if (wishes >= 1) unlock("achWish");
}

function unlock(id) {
    document.getElementById(id).classList.add("unlocked");
}

function reward(amount) {
    coins += amount;
    updateStats();
}

function completeTask(checkbox, amount) {
    if (checkbox.checked) {
        reward(amount);
    } else {
        coins = Math.max(0, coins - amount);
        updateStats();
    }
}

function openGame(game) {
    const modal = document.getElementById("gameModal");
    const content = document.getElementById("gameContent");

    modal.classList.add("active");

    if (game === "love") {
        content.innerHTML = `
            <h2>💌 Love Tester</h2>
            <p>Enter two names and discover your fun compatibility score!</p>
            <input type="text" id="name1" placeholder="First name...">
            <input type="text" id="name2" placeholder="Second name...">
            <button onclick="testLove()">Check compatibility ♡</button>
            <div id="loveResult" class="result"></div>
        `;
    }

    if (game === "dress") {
        content.innerHTML = `
            <h2>👗 Dress Up Studio</h2>
            <p>Create your dream outfit!</p>
            <div class="outfit" id="outfit">👗</div>
            <p>Choose your clothes:</p>
            <div class="choice-row">
                <button onclick="changeOutfit('👗')">👗</button>
                <button onclick="changeOutfit('👚')">👚</button>
                <button onclick="changeOutfit('👘')">👘</button>
                <button onclick="changeOutfit('👠')">👠</button>
            </div>
            <p>Accessories:</p>
            <div class="choice-row">
                <button onclick="changeAccessory('🎀')">🎀</button>
                <button onclick="changeAccessory('💎')">💎</button>
                <button onclick="changeAccessory('👜')">👜</button>
                <button onclick="changeAccessory('🌷')">🌷</button>
            </div>
            <div id="accessory" class="result">Your style awaits!</div>
            <button onclick="saveOutfit()">Save my outfit ♡</button>
        `;
    }

    if (game === "memory") {
        content.innerHTML = `
            <h2>🧁 Sweet Memory</h2>
            <p>Find all matching pairs!</p>
            <p>Moves: <span id="moves">0</span></p>
            <div class="memory-grid" id="memoryGrid"></div>
        `;
        startMemory();
    }

    if (game === "catch") {
        content.innerHTML = `
            <h2>💗 Catch My Hearts</h2>
            <p>Click the hearts to collect points!</p>
            <p>Score: <span id="catchScore">0</span></p>
            <div class="catch-area" id="catchArea"></div>
            <button onclick="startCatch()">Start game ♡</button>
        `;
    }

    if (game === "wish") {
        content.innerHTML = `
            <h2>🌷 Make a Wish</h2>
            <p>Write a little dream you want to remember.</p>
            <input type="text" id="wishInput" placeholder="My little wish is...">
            <button onclick="addWish()">Save my wish ✨</button>
            <div id="wishList" class="wish-list"></div>
        `;
    }

    if (game === "beauty") {
        content.innerHTML = `
            <h2>🪞 Beauty Room</h2>
            <p>Choose your favourite aesthetic today!</p>
            <div class="outfit" id="beautyIcon">🎀</div>
            <div class="choice-row">
                <button onclick="setBeauty('🎀','Coquette')">🎀</button>
                <button onclick="setBeauty('🦢','Swan Lake')">🦢</button>
                <button onclick="setBeauty('🧸','Soft Girl')">🧸</button>
                <button onclick="setBeauty('🪻','Fairycore')">🪻</button>
                <button onclick="setBeauty('🖤','Dark Romance')">🖤</button>
                <button onclick="setBeauty('🌸','Pink Dream')">🌸</button>
            </div>
            <div class="result" id="beautyName">Choose your vibe ♡</div>
            <button onclick="reward(5)">Save my aesthetic ♡</button>
        `;
    }

    gamesPlayed++;
    updateStats();
}

function closeGame() {
    document.getElementById("gameModal").classList.remove("active");
}

function testLove() {
    let a = document.getElementById("name1").value.trim();
    let b = document.getElementById("name2").value.trim();

    if (!a || !b) {
        document.getElementById("loveResult").textContent = "Enter both names first! ♡";
        return;
    }

    let combined = (a + b).toLowerCase();
    let score = 0;

    for (let i = 0; i < combined.length; i++) {
        score += combined.charCodeAt(i);
    }

    score = score % 101;

    document.getElementById("loveResult").textContent =
        `${score}% compatibility! 💗`;

    reward(10);
}

function changeOutfit(item) {
    document.getElementById("outfit").textContent = item;
}

function changeAccessory(item) {
    document.getElementById("accessory").textContent =
        `Your accessory: ${item}`;
}

function saveOutfit() {
    reward(10);
    document.getElementById("accessory").textContent =
        "Outfit saved! You're a fashion star! ✨";
}

function setBeauty(icon, name) {
    document.getElementById("beautyIcon").textContent = icon;
    document.getElementById("beautyName").textContent = name + " aesthetic ♡";
}

function addWish() {
    let input = document.getElementById("wishInput");
    let value = input.value.trim();

    if (!value) return;

    let list = document.getElementById("wishList");
    let item = document.createElement("div");

    item.className = "wish-item";
    item.textContent = "🌷 " + value;

    list.appendChild(item);

    input.value = "";
    wishes++;

    reward(10);
}

let firstCard = null;
let lockBoard = false;
let matched = 0;
let moves = 0;

function startMemory() {
    const emojis = ["🎀","🌷","💗","🧁","🦢","🍓","💎","🪻"];
    let cards = [...emojis, ...emojis].sort(() => Math.random() - .5);

    firstCard = null;
    lockBoard = false;
    matched = 0;
    moves = 0;

    document.getElementById("moves").textContent = 0;

    const grid = document.getElementById("memoryGrid");
    grid.innerHTML = "";

    cards.forEach(emoji => {
        const card = document.createElement("button");
        card.className = "memory-card";
        card.textContent = "♡";
        card.dataset.emoji = emoji;

        card.onclick = () => flipCard(card);

        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (lockBoard || card.classList.contains("matched") || card === firstCard) return;

    card.textContent = card.dataset.emoji;

    if (!firstCard) {
        firstCard = card;
        return;
    }

    moves++;
    document.getElementById("moves").textContent = moves;

    if (firstCard.dataset.emoji === card.dataset.emoji) {
        firstCard.classList.add("matched");
        card.classList.add("matched");
        firstCard = null;
        matched++;

        if (matched === 8) {
            document.getElementById("memoryGrid").insertAdjacentHTML(
                "afterend",
                '<div class="result">You did it! Sweet genius! 🎀</div>'
            );
            reward(30);
        }
    } else {
        lockBoard = true;
        let previous = firstCard;
        firstCard = null;

        setTimeout(() => {
            previous.textContent = "♡";
            card.textContent = "♡";
            lockBoard = false;
        }, 800);
    }
}

let catchTimer = null;

function startCatch() {
    clearInterval(catchTimer);

    let score = 0;
    let area = document.getElementById("catchArea");

    area.innerHTML = "";

    let scoreDisplay = document.getElementById("catchScore");
    scoreDisplay.textContent = score;

    let remaining = 15;

    catchTimer = setInterval(() => {
        if (remaining <= 0) {
            clearInterval(catchTimer);
            area.innerHTML = "<p>Time's up! You're amazing! 🎀</p>";
            reward(score);
            return;
        }

        let heart = document.createElement("span");
        heart.className = "catch-heart";
        heart.textContent = ["💗","💕","💖","💘"][Math.floor(Math.random() * 4)];

        heart.style.left = Math.random() * 85 + "%";
        heart.style.top = Math.random() * 75 + "%";

        heart.onclick = () => {
            score += 1;
            scoreDisplay.textContent = score;
            heart.remove();
        };

        area.appendChild(heart);
        remaining--;
    }, 700);
}

function createBackgroundHearts() {
    const container = document.getElementById("backgroundHearts");

    for (let i = 0; i < 18; i++) {
        let heart = document.createElement("span");
        heart.className = "heart-bg";
        heart.textContent = ["♡","✧","♥"][i % 3];
        heart.style.left = Math.random() * 100 + "%";
        heart.style.animationDelay = Math.random() * 12 + "s";
        heart.style.fontSize = 15 + Math.random() * 20 + "px";

        container.appendChild(heart);
    }
}

updateStats();
createBackgroundHearts();
