"use strict";

/* =========================================================
   CORVALI'S ECHOES
   Blackjack Steampunk Roguelike
   ========================================================= */


/* =========================
   GAME STATE
   ========================= */

let cycle = 1;
let cogs = 0;

let hull = 100;
let maxHull = 100;

let pressure = 0;
const maxPressure = 100;

let baseTorque = 0;
let clockPower = 0;

let hand = [];
let handValue = 0;
let aceCount = 0;

// Enemy Hand State
let enemyHand = [];
let enemyHandValue = 0;

let blackjack = false;
let bust = false;

let enemy = null;
let combatStarted = false;

let equippedEchoes = [];

let defeatedEnemies = 0;

let lootReward = 0;
let workshopPending = false;

let replacementEcho = null;


/* =========================
   ECHO DATABASE
   ========================= */

const ECHOES = [
    { name: "CLOCKMAKER", rarity: "WORN", description: "+2 Clock Power every hand." },
    { name: "BRASS HEART", rarity: "WORN", description: "+10 maximum Hull." },
    { name: "PRESSURE VALVE", rarity: "WORN", description: "Vent removes 40 Pressure instead of 30." },
    { name: "STEAM CORE", rarity: "WORN", description: "+3 Base Torque every hand." },
    { name: "BROKEN GEAR", rarity: "WORN", description: "After a Bust, gain +8 Clock Power." },
    { name: "AUTOMATON", rarity: "WORN", description: "Start every hand with +5 Base Torque." },
    { name: "BRASS LUNG", rarity: "WORN", description: "Vent also restores 5 Hull." },
    { name: "OLD SPRING", rarity: "WORN", description: "Every 21 gives +5 Clock Power." },
    { name: "PERFECT GEAR", rarity: "FORGED", description: "If hand value is exactly 21, +10 Clock Power." },
    { name: "HIGH PRESSURE PISTON", rarity: "FORGED", description: "Gain +1 Base Torque for every 10 Pressure." },
    { name: "COOLING COIL", rarity: "FORGED", description: "Reduce Pressure by 5 after every hand." },
    { name: "STEAM VALVE", rarity: "FORGED", description: "Vent removes an additional 10 Pressure." },
    { name: "CHRONO CORE", rarity: "FORGED", description: "+5 Clock Power every third Cycle." },
    { name: "RUSTED HEART", rarity: "FORGED", description: "Start every Cycle with +15 Hull." },
    { name: "BRASS EYE", rarity: "FORGED", description: "Gain +5 Base Torque when standing on 18+." },
    { name: "OVERDRIVE", rarity: "FORGED", description: "Double gives +5 Clock Power." },
    { name: "COUNTERWEIGHT", rarity: "FORGED", description: "Enemy attacks deal 2 less damage." },
    { name: "TIME SPRING", rarity: "FORGED", description: "Every 20 gives +8 Clock Power." },
    { name: "BLACK GEAR", rarity: "FORGED", description: "After Bust, deal 10 damage to the enemy." },
    { name: "PRESSURE CHAMBER", rarity: "ENGINEERED", description: "Maximum Pressure becomes 120." },
    { name: "MECHANICAL HEART", rarity: "ENGINEERED", description: "Start each Cycle with +25 Hull." },
    { name: "LOST ESCAPEMENT", rarity: "ENGINEERED", description: "Blackjack gives +10 Clock Power." },
    { name: "GOLDEN PISTON", rarity: "ENGINEERED", description: "Stand on 20 or 21 gives +10 Base Torque." },
    { name: "CORVALI LENS", rarity: "ENGINEERED", description: "Damage ignores 5 enemy Armor." },
    { name: "AEON GEAR", rarity: "ENGINEERED", description: "Every 10th Cycle gives +20 Clock Power." },
    { name: "INFINITE SPRING", rarity: "ENGINEERED", description: "Natural Blackjack gives +15 Base Torque." },
    { name: "VOID VALVE", rarity: "RELIC", description: "Vent removes 45 Pressure." },
    { name: "MASTER CLOCK", rarity: "RELIC", description: "+5 Clock Power every hand." },
    { name: "THE FIRST GEAR", rarity: "RELIC", description: "Natural Blackjack starts with 35 Base Torque." },
    { name: "CORVALI ECHO", rarity: "RELIC", description: "All Clock Power bonuses are increased by 25%." }
];


/* =========================
   ENEMY DATABASE
   ========================= */

const ENEMIES = [
    { name: "BRASS SENTINEL", hull: 50, attack: 10, armor: 4, ability: "ARMOR" },
    { name: "GEAR HOUND", hull: 60, attack: 12, armor: 1, ability: "PRESSURE" },
    { name: "BOILER WASP", hull: 65, attack: 13, armor: 2, ability: "HEAT" },
    { name: "CLOCKWORK GUARD", hull: 80, attack: 12, armor: 8, ability: "FORTRESS" },
    { name: "IRON REVENANT", hull: 90, attack: 15, armor: 4, ability: "BUST" },
    { name: "FURNACE KING", hull: 100, attack: 17, armor: 5, ability: "OVERHEAT" },
    { name: "CHRONOPHAGE", hull: 110, attack: 18, armor: 6, ability: "TIME" },
    { name: "AETHER GOLEM", hull: 125, attack: 20, armor: 10, ability: "HEAVY ARMOR" },
    { name: "RUST MAW", hull: 140, attack: 21, armor: 7, ability: "CORROSION" },
    { name: "TICKING SPIDER", hull: 150, attack: 22, armor: 5, ability: "SABOTAGE" },
    { name: "ANCIENT AUTOMATON", hull: 175, attack: 24, armor: 10, ability: "REPAIR" },
    { name: "CORVALI ENGINE", hull: 220, attack: 28, armor: 12, ability: "OVERCLOCK" }
];


/* =========================
   UTILITY
   ========================= */

function getElement(id) {
    return document.getElementById(id);
}

function logMessage(message) {
    const log = getElement("log");
    if (!log) return;

    const entry = document.createElement("div");
    entry.textContent = message;
    log.prepend(entry);

    while (log.children.length > 12) {
        log.removeChild(log.lastChild);
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* =========================
   ECHO HELPERS
   ========================= */

function hasEcho(name) {
    return equippedEchoes.some(echo => echo.name === name);
}

function getEcho(name) {
    return ECHOES.find(echo => echo.name === name);
}

function recalculateMaxHull() {
    maxHull = 100;
    if (hasEcho("BRASS HEART")) maxHull += 10;
}

function applyCycleEchoes() {
    recalculateMaxHull();
    if (hasEcho("RUSTED HEART")) {
        hull = Math.min(maxHull, hull + 15);
    }
    if (hasEcho("MECHANICAL HEART")) {
        hull = Math.min(maxHull, hull + 25);
    }
}


/* =========================
   NEW RUN & ENCOUNTER
   ========================= */

function startNewRun() {
    cycle = 1;
    cogs = 0;
    maxHull = 100;
    hull = 100;
    pressure = 0;
    baseTorque = 0;
    clockPower = 0;
    hand = [];
    enemyHand = [];
    handValue = 0;
    enemyHandValue = 0;
    aceCount = 0;
    blackjack = false;
    bust = false;
    enemy = null;
    combatStarted = false;
    equippedEchoes = [];
    defeatedEnemies = 0;
    lootReward = 0;
    workshopPending = false;
    replacementEcho = null;

    if (getElement("startOverlay")) getElement("startOverlay").style.display = "none";
    if (getElement("gameOverModal")) getElement("gameOverModal").classList.add("hidden");
    if (getElement("lootModal")) getElement("lootModal").classList.add("hidden");
    if (getElement("workshopModal")) getElement("workshopModal").classList.add("hidden");

    logMessage("NEW RUN INITIALIZED.");
    newEncounter();
    render();
}

function getTier() {
    return Math.floor((cycle - 1) / 10) + 1;
}

function getEnemyForCycle() {
    const tier = getTier();
    const poolSize = Math.min(ENEMIES.length, Math.max(3, tier * 3));
    const baseEnemy = ENEMIES[randomNumber(0, poolSize - 1)];
    const scale = 1 + ((tier - 1) * 0.25);

    return {
        name: baseEnemy.name,
        maxHull: Math.round(baseEnemy.hull * scale),
        hull: Math.round(baseEnemy.hull * scale),
        attack: Math.round(baseEnemy.attack * scale),
        armor: Math.round(baseEnemy.armor * scale),
        ability: baseEnemy.ability
    };
}

function newEncounter() {
    enemy = getEnemyForCycle();
    pressure = 0;
    baseTorque = 0;
    clockPower = 0;
    hand = [];
    enemyHand = [];
    handValue = 0;
    enemyHandValue = 0;
    aceCount = 0;
    blackjack = false;
    bust = false;
    combatStarted = true;

    applyCycleEchoes();

    logMessage("ENCOUNTER: " + enemy.name + ".");
    logMessage("SYSTEM: " + enemy.ability + ".");

    dealHand();
    render();
}


/* =========================
   CARDS & HAND LOGIC
   ========================= */

function drawCard() {
    const suits = ["SPADES", "HEARTS", "DIAMONDS", "CLUBS"];
    const suit = suits[randomNumber(0, suits.length - 1)];
    const rankNumber = randomNumber(1, 13);

    let rank;
    let value;

    if (rankNumber === 1) {
        rank = "A";
        value = 11;
    } else if (rankNumber === 11) {
        rank = "J";
        value = 10;
    } else if (rankNumber === 12) {
        rank = "Q";
        value = 10;
    } else if (rankNumber === 13) {
        rank = "K";
        value = 10;
    } else {
        rank = String(rankNumber);
        value = rankNumber;
    }

    return { rank, suit, value };
}

function evalHand(cards) {
    let total = 0;
    let aces = 0;

    for (const card of cards) {
        total += card.value;
        if (card.rank === "A") aces++;
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

function calculateHand() {
    handValue = evalHand(hand);
    blackjack = (hand.length === 2 && handValue === 21);
    bust = handValue > 21;
}

function renderCards() {
    const container = getElement("cards");
    if (!container) return;

    container.innerHTML = "";

    for (const card of hand) {
        const element = document.createElement("div");
        element.className = "card";
        const symbol = { SPADES: "♠", HEARTS: "♥", DIAMONDS: "♦", CLUBS: "♣" }[card.suit] || card.suit[0];
        element.innerHTML = "<span>" + card.rank + "</span><small>" + symbol + "</small>";
        container.appendChild(element);
    }
}

function dealHand() {
    hand = [drawCard(), drawCard()];
    enemyHand = [drawCard()]; // Il nemico inizia con una carta visibile
    enemyHandValue = evalHand(enemyHand);

    baseTorque = 0;
    clockPower = 0;

    calculateHand();

    if (blackjack) {
        naturalBlackjack();
    } else {
        baseTorque = handValue;
        applyHandEchoes();
        applyValueEchoes();
        calculateClockPower();
    }

    renderCards();
}


/* =========================
   COMBAT CALCULATIONS
   ========================= */

function applyHandEchoes() {
    if (hasEcho("CLOCKMAKER")) clockPower += 2;
    if (hasEcho("MASTER CLOCK")) clockPower += 5;
    if (hasEcho("STEAM CORE")) baseTorque += 3;
    if (hasEcho("AUTOMATON")) baseTorque += 5;
    if (hasEcho("HIGH PRESSURE PISTON")) baseTorque += Math.floor(pressure / 10);
    if (hasEcho("CHRONO CORE") && cycle % 3 === 0) clockPower += 5;
    if (hasEcho("AEON GEAR") && cycle % 10 === 0) clockPower += 20;
}

function applyValueEchoes() {
    if (handValue === 21) {
        if (hasEcho("OLD SPRING")) clockPower += 5;
        if (hasEcho("PERFECT GEAR")) clockPower += 10;
    }
    if (handValue >= 18) {
        if (hasEcho("BRASS EYE")) baseTorque += 5;
    }
    if (handValue >= 20) {
        if (hasEcho("TIME SPRING")) clockPower += 8;
        if (hasEcho("GOLDEN PISTON")) baseTorque += 10;
    }
}

function calculateClockPower() {
    if (blackjack) return;

    if (handValue === 18) clockPower += 3;
    if (handValue === 19) clockPower += 5;
    if (handValue === 20) clockPower += 8;
    if (handValue === 21) clockPower += 12;

    applyValueEchoes();

    if (hasEcho("CORVALI ECHO")) {
        clockPower = Math.round(clockPower * 1.25);
    }
}

function naturalBlackjack() {
    blackjack = true;
    baseTorque = 25;
    clockPower = 15;

    if (hasEcho("LOST ESCAPEMENT")) clockPower += 10;
    if (hasEcho("INFINITE SPRING")) baseTorque += 15;
    if (hasEcho("THE FIRST GEAR")) baseTorque = Math.max(baseTorque, 35);

    applyHandEchoes();

    if (hasEcho("CORVALI ECHO")) {
        clockPower = Math.round(clockPower * 1.25);
    }

    logMessage("NATURAL BLACKJACK!");
}


/* =========================
   ACTIONS: HIT / STAND / DOUBLE
   ========================= */

function hit() {
    if (!combatStarted || !enemy || bust) return;

    hand.push(drawCard());
    pressure += 5;

    calculateHand();
    renderCards();

    if (bust) {
        handleBust();
        return;
    }

    baseTorque = handValue;
    clockPower = 0;

    applyHandEchoes();
    calculateClockPower();

    logMessage("HIT: Your hand value is now " + handValue + ".");
    checkPressure();
    render();
}

function playEnemyTurn() {
    // Il nemico pesca carte finché non ha almeno 17 punti
    while (evalHand(enemyHand) < 17) {
        enemyHand.push(drawCard());
    }
    enemyHandValue = evalHand(enemyHand);
    logMessage(enemy.name + " stands with hand value: " + enemyHandValue + ".");
}

function stand() {
    if (!combatStarted || !enemy || bust) return;

    calculateHand();
    if (handValue > 21) {
        handleBust();
        return;
    }

    baseTorque = handValue;
    applyHandEchoes();
    calculateClockPower();
    applyValueEchoes();

    logMessage("STAND at " + handValue + ".");

    // Il nemico gioca la sua mano
    playEnemyTurn();

    // Confronto
    if (enemyHandValue > 21) {
        logMessage(enemy.name + " BUSTED with " + enemyHandValue + "!");
        resolveDamage();
    } else if (handValue > enemyHandValue) {
        logMessage("YOU BEAT THE ENEMY! (" + handValue + " vs " + enemyHandValue + ")");
        resolveDamage();
    } else {
        logMessage("ENEMY WINS THE HAND! (" + enemyHandValue + " vs " + handValue + ")");
        enemyAttack();
        nextHandAfterTurn();
    }
}

function doubleDown() {
    if (!combatStarted || !enemy) return;

    if (hand.length > 2) {
        logMessage("DOUBLE IS ONLY AVAILABLE ON THE INITIAL HAND.");
        return;
    }

    hand.push(drawCard());
    pressure += 10;

    calculateHand();
    renderCards();

    if (bust) {
        handleBust();
        return;
    }

    baseTorque = handValue;
    clockPower = 0;

    applyHandEchoes();
    calculateClockPower();

    if (hasEcho("OVERDRIVE")) {
        clockPower += 5;
    }

    logMessage("DOUBLE: Hand Value " + handValue + ".");

    playEnemyTurn();

    if (enemyHandValue > 21 || handValue > enemyHandValue) {
        logMessage("DOUBLE SUCCESSFUL!");
        resolveDamage();
    } else {
        logMessage("DOUBLE FAILED!");
        enemyAttack();
        nextHandAfterTurn();
    }
}


/* =========================
   BUST & DAMAGE RESOLUTION
   ========================= */

function handleBust() {
    bust = true;
    pressure += 20;

    logMessage("OVERLOAD: YOU BUSTED (" + handValue + ").");

    if (hasEcho("BROKEN GEAR")) {
        clockPower += 8;
        logMessage("BROKEN GEAR ACTIVATED.");
    }

    if (hasEcho("BLACK GEAR") && enemy) {
        enemy.hull = Math.max(0, enemy.hull - 10);
        logMessage("BLACK GEAR DAMAGED THE ENEMY.");
        if (enemy.hull <= 0) {
            defeatEnemy();
            return;
        }
    }

    checkPressure();

    if (combatStarted && enemy && enemy.hull > 0) {
        enemyAttack();
    }

    nextHandAfterTurn();
}

function resolveDamage() {
    if (!enemy) return;

    let damage = Math.floor((baseTorque * clockPower) / 10);
    damage = Math.max(1, damage);

    let armor = enemy.armor;
    if (hasEcho("CORVALI LENS")) {
        armor = Math.max(0, armor - 5);
    }

    damage = Math.max(1, damage - armor);
    enemy.hull = Math.max(0, enemy.hull - damage);

    logMessage("YOU INFLICTED " + damage + " DAMAGE!");

    if (enemy.hull <= 0) {
        defeatEnemy();
        return;
    }

    pressure += 5;
    checkPressure();
    nextHandAfterTurn();
}

function nextHandAfterTurn() {
    if (hasEcho("COOLING COIL")) {
        pressure = Math.max(0, pressure - 5);
    }

    setTimeout(function () {
        if (combatStarted && enemy && enemy.hull > 0) {
            dealHand();
            render();
        }
    }, 1000);

    render();
}


/* =========================
   ENEMY ATTACK & PRESSURE
   ========================= */

function enemyAttack() {
    if (!enemy || enemy.hull <= 0) return;

    let damage = enemy.attack;
    if (hasEcho("COUNTERWEIGHT")) damage -= 2;
    damage = Math.max(1, damage);

    if (enemy.ability === "PRESSURE") pressure += 5;
    if (enemy.ability === "HEAT") pressure += 8;
    if (enemy.ability === "CORROSION") damage += 3;
    if (enemy.ability === "OVERCLOCK") damage += 5;

    hull = Math.max(0, hull - damage);

    logMessage(enemy.name + " ATTACKS FOR " + damage + " DAMAGE.");

    checkPressure();

    if (hull <= 0) {
        gameOver();
    }

    render();
}

function checkPressure() {
    let limit = hasEcho("PRESSURE CHAMBER") ? 120 : 100;

    if (pressure > limit) {
        hull = Math.max(0, hull - 15);
        pressure = 0;
        logMessage("OVERHEAT: 15 HULL DAMAGE TAKEN.");

        if (hull <= 0) {
            gameOver();
        }
    }
}

function vent() {
    if (!combatStarted) return;

    if (pressure <= 0) {
        logMessage("PRESSURE IS ALREADY STABLE.");
        return;
    }

    let amount = 30;
    if (hasEcho("PRESSURE VALVE")) amount = 40;
    if (hasEcho("STEAM VALVE")) amount += 10;
    if (hasEcho("VOID VALVE")) amount = 45;

    pressure = Math.max(0, pressure - amount);

    if (hasEcho("BRASS LUNG")) {
        hull = Math.min(maxHull, hull + 5);
        logMessage("BRASS LUNG RESTORED 5 HULL.");
    }

    logMessage("VENT: " + amount + " PRESSURE RELEASED.");
    render();
}


/* =========================
   LOOT & WORKSHOP
   ========================= */

function defeatEnemy() {
    if (!enemy) return;

    combatStarted = false;
    defeatedEnemies++;
    lootReward = 8 + (getTier() * 4);
    cogs += lootReward;

    logMessage(enemy.name + " DESTROYED!");
    logMessage("REWARD: " + lootReward + " COGS.");

    workshopPending = (defeatedEnemies % 3 === 0);

    const name = getElement("lootEnemyName");
    const reward = getElement("lootReward");

    if (name) name.textContent = enemy.name + " DESTROYED";
    if (reward) reward.textContent = "+" + lootReward + " COGS";

    if (getElement("lootModal")) getElement("lootModal").classList.remove("hidden");
    render();
}

function continueAfterLoot() {
    if (getElement("lootModal")) getElement("lootModal").classList.add("hidden");

    if (workshopPending) {
        workshopPending = false;
        openWorkshop();
        return;
    }

    continueToNextEncounter();
}

function continueToNextEncounter() {
    cycle++;
    newEncounter();
    render();
}

function getPrice(echo) {
    if (echo.rarity === "WORN") return 10;
    if (echo.rarity === "FORGED") return 18;
    if (echo.rarity === "ENGINEERED") return 28;
    return 45;
}

function openWorkshop() {
    const modal = getElement("workshopModal");
    if (!modal) return;

    replacementEcho = null;
    hideReplacementPanel();
    generateShop();
    modal.classList.remove("hidden");
    render();
}

function closeWorkshop() {
    if (getElement("workshopModal")) getElement("workshopModal").classList.add("hidden");
}

function generateShop() {
    const container = getElement("shopItems");
    if (!container) return;

    container.innerHTML = "";

    const available = ECHOES
        .filter(echo => !hasEcho(echo.name))
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    for (const echo of available) {
        const price = getPrice(echo);
        const item = document.createElement("div");
        item.className = "shop-item";

        item.innerHTML =
            '<div class="shop-item-name">' + echo.name + '</div>' +
            '<div class="shop-item-rarity">' + echo.rarity + '</div>' +
            '<div class="shop-item-description">' + echo.description + '</div>' +
            '<button class="small-button">' +
            (equippedEchoes.length >= 3 ? "SELECT" : "BUY " + price + " COGS") +
            '</button>';

        const button = item.querySelector("button");
        button.addEventListener("click", function () {
            buyEcho(echo.name, price);
        });

        container.appendChild(item);
    }

    if (available.length === 0) {
        container.innerHTML = '<div class="shop-item"><div class="shop-item-name">NO ECHOES AVAILABLE</div></div>';
    }
}

function buyEcho(name, price) {
    const echo = getEcho(name);
    if (!echo || hasEcho(name)) return;

    if (cogs < price) {
        logMessage("INSUFFICIENT COGS.");
        return;
    }

    if (equippedEchoes.length < 3) {
        cogs -= price;
        equippedEchoes.push(echo);
        logMessage("ECHO EQUIPPED: " + echo.name + ".");
        recalculateMaxHull();
        generateShop();
        render();
        return;
    }

    replacementEcho = { echo, price };
    showReplacementPanel();
}

function showReplacementPanel() {
    const panel = getElement("replacementPanel");
    const slots = getElement("replacementSlots");
    if (!panel || !slots) return;

    slots.innerHTML = "";

    equippedEchoes.forEach((