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

let blackjack = false;
let bust = false;

let enemy = null;
let combatStarted = false;

let equippedEchoes = [];

let defeatedEnemies = 0;

let lootReward = 0;
let workshopPending = false;

let replacementEcho = null;

/* Duel state */

let enemyHand = [];
let enemyHidden = true;

let roundLocked = false;
let doubled = false;
let carryClockBonus = 0;
let roundToken = 0;


/* Tuning */

const ENEMY_STAND_ON = 17;
const REVEAL_DELAY = 700;
const NEXT_HAND_DELAY = 1300;


/* =========================
   ECHO DATABASE
   ========================= */

const ECHOES = [

    {
        name: "CLOCKMAKER",
        rarity: "WORN",
        description: "+2 Clock Power every hand."
    },

    {
        name: "BRASS HEART",
        rarity: "WORN",
        description: "+10 maximum Hull."
    },

    {
        name: "PRESSURE VALVE",
        rarity: "WORN",
        description: "Vent removes 40 Pressure instead of 30."
    },

    {
        name: "STEAM CORE",
        rarity: "WORN",
        description: "+3 Base Torque every hand."
    },

    {
        name: "BROKEN GEAR",
        rarity: "WORN",
        description: "After a Bust, gain +8 Clock Power."
    },

    {
        name: "AUTOMATON",
        rarity: "WORN",
        description: "Start every hand with +5 Base Torque."
    },

    {
        name: "BRASS LUNG",
        rarity: "WORN",
        description: "Vent also restores 5 Hull."
    },

    {
        name: "OLD SPRING",
        rarity: "WORN",
        description: "Every 21 gives +5 Clock Power."
    },

    {
        name: "PERFECT GEAR",
        rarity: "FORGED",
        description: "If hand value is exactly 21, +10 Clock Power."
    },

    {
        name: "HIGH PRESSURE PISTON",
        rarity: "FORGED",
        description: "Gain +1 Base Torque for every 10 Pressure."
    },

    {
        name: "COOLING COIL",
        rarity: "FORGED",
        description: "Reduce Pressure by 5 after every hand."
    },

    {
        name: "STEAM VALVE",
        rarity: "FORGED",
        description: "Each Vent gives +4 Clock Power to your current hand (max +8)."
    },

    {
        name: "CHRONO CORE",
        rarity: "FORGED",
        description: "+5 Clock Power every third Cycle."
    },

    {
        name: "RUSTED HEART",
        rarity: "FORGED",
        description: "Start every Cycle with +15 Hull."
    },

    {
        name: "BRASS EYE",
        rarity: "FORGED",
        description: "Gain +5 Base Torque when standing on 18+."
    },

    {
        name: "OVERDRIVE",
        rarity: "FORGED",
        description: "Double gives +5 Clock Power."
    },

    {
        name: "COUNTERWEIGHT",
        rarity: "FORGED",
        description: "Enemy attacks deal 2 less damage."
    },

    {
        name: "TIME SPRING",
        rarity: "FORGED",
        description: "Every 20 gives +8 Clock Power."
    },

    {
        name: "BLACK GEAR",
        rarity: "FORGED",
        description: "After Bust, deal 10 damage to the enemy."
    },

    {
        name: "PRESSURE CHAMBER",
        rarity: "ENGINEERED",
        description: "Maximum Pressure becomes 120."
    },

    {
        name: "MECHANICAL HEART",
        rarity: "ENGINEERED",
        description: "Start each Cycle with +25 Hull."
    },

    {
        name: "LOST ESCAPEMENT",
        rarity: "ENGINEERED",
        description: "Blackjack gives +10 Clock Power."
    },

    {
        name: "GOLDEN PISTON",
        rarity: "ENGINEERED",
        description: "Stand on 20 or 21 gives +10 Base Torque."
    },

    {
        name: "CORVALI LENS",
        rarity: "ENGINEERED",
        description: "Damage ignores 5 enemy Armor."
    },

    {
        name: "AEON GEAR",
        rarity: "ENGINEERED",
        description: "Every 10th Cycle gives +20 Clock Power."
    },

    {
        name: "INFINITE SPRING",
        rarity: "ENGINEERED",
        description: "Natural Blackjack gives +15 Base Torque."
    },

    {
        name: "VOID VALVE",
        rarity: "RELIC",
        description: "Vent removes 45 Pressure."
    },

    {
        name: "MASTER CLOCK",
        rarity: "RELIC",
        description: "+5 Clock Power every hand."
    },

    {
        name: "THE FIRST GEAR",
        rarity: "RELIC",
        description: "Natural Blackjack starts with 35 Base Torque."
    },

    {
        name: "CORVALI ECHO",
        rarity: "RELIC",
        description: "All Clock Power bonuses are increased by 25%."
    },

    /* ---- new echoes ---- */

    {
        name: "SPARE PARTS",
        rarity: "WORN",
        description: "Gain +3 Cogs every time you win a round."
    },

    {
        name: "SALVAGE ENGINE",
        rarity: "WORN",
        description: "Repair 10 extra Hull when you destroy an enemy."
    },

    {
        name: "STEAM BROKER",
        rarity: "WORN",
        description: "Every Vent earns you +2 Cogs."
    },

    {
        name: "IRON LUNG",
        rarity: "FORGED",
        description: "Overheat deals 5 Hull damage instead of 15."
    },

    {
        name: "GLASS PISTON",
        rarity: "FORGED",
        description: "Your damage is +30%, but enemy hits deal +3 damage."
    },

    {
        name: "TICKING BOMB",
        rarity: "FORGED",
        description: "A Push deals 8 damage to the enemy."
    },

    {
        name: "BRASS PERISCOPE",
        rarity: "FORGED",
        description: "You can see the enemy's hidden card."
    },

    {
        name: "LAST STAND",
        rarity: "FORGED",
        description: "Below 30% Hull, you deal +50% damage."
    },

    {
        name: "DOUBLE CRANK",
        rarity: "FORGED",
        description: "Double no longer increases the damage you take."
    },

    {
        name: "AEGIS GEAR",
        rarity: "ENGINEERED",
        description: "Ignore the first enemy hit of every encounter."
    },

    {
        name: "TITAN HAMMER",
        rarity: "ENGINEERED",
        description: "Winning with 20 or more ignores all enemy Armor."
    },

    {
        name: "STEEL NERVES",
        rarity: "ENGINEERED",
        description: "HIT adds no Pressure."
    }

];


/* =========================
   ENEMY DATABASE
   ========================= */

/*
   Enemy types
   - COMMON: every normal fight
   - ELITE : every 5th enemy  (cycle 5, 15, 25...)
   - BOSS  : every 10th enemy (cycle 10, 20, 30...)
   Attack and armor grow slowly with every tier (see getEnemyForCycle).
*/

const ENEMY_TYPES = {

    COMMON: { hull: 50,  attack: 9,  armor: 0, loot: 1,    repair: 10 },
    ELITE:  { hull: 85,  attack: 11, armor: 2, loot: 1.75, repair: 15 },
    BOSS:   { hull: 140, attack: 12, armor: 4, loot: 3,    repair: 30 }
};

const ENEMY_POOLS = {

    COMMON: [
        { name: "BRASS SENTINEL",  ability: "NONE" },
        { name: "GEAR HOUND",      ability: "PRESSURE" },
        { name: "BOILER WASP",     ability: "HEAT" },
        { name: "RUST MAW",        ability: "NONE" },
        { name: "TICKING SPIDER",  ability: "NONE" }
    ],

    ELITE: [
        { name: "CLOCKWORK GUARD", ability: "FORTRESS" },
        { name: "IRON REVENANT",   ability: "BUST" },
        { name: "CHRONOPHAGE",     ability: "TIME" },
        { name: "AETHER GOLEM",    ability: "HEAVY ARMOR" }
    ],

    BOSS: [
        { name: "FURNACE KING",      ability: "OVERHEAT" },
        { name: "ANCIENT AUTOMATON", ability: "REPAIR" },
        { name: "CORVALI ENGINE",    ability: "OVERCLOCK" }
    ]
};


/* =========================
   UTILITY
   ========================= */

function getElement(id) {
    return document.getElementById(id);
}


function logMessage(message) {

    const log = getElement("log");

    if (!log) {
        return;
    }

    const entry = document.createElement("div");

    entry.textContent = message;

    log.prepend(entry);

    while (log.children.length > 12) {
        log.removeChild(log.lastChild);
    }
}


function randomNumber(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function shuffle(array) {

    const copy = array.slice();

    for (let i = copy.length - 1; i > 0; i--) {

        const j = randomNumber(0, i);

        const temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }

    return copy;
}


/* =========================
   ECHO HELPERS
   ========================= */

function hasEcho(name) {

    return equippedEchoes.some(function (echo) {
        return echo.name === name;
    });
}


function getEcho(name) {

    return ECHOES.find(function (echo) {
        return echo.name === name;
    });
}


function recalculateMaxHull() {

    maxHull = 100;

    if (hasEcho("BRASS HEART")) {
        maxHull += 10;
    }

    hull = Math.min(hull, maxHull);
}


function applyCycleEchoes() {

    recalculateMaxHull();

    if (hasEcho("RUSTED HEART")) {
        hull = Math.min(
            maxHull,
            hull + 15
        );
    }

    if (hasEcho("MECHANICAL HEART")) {
        hull = Math.min(
            maxHull,
            hull + 25
        );
    }
}


/* =========================
   NEW RUN
   ========================= */

function resetState() {

    roundToken++;

    cycle = 1;
    cogs = 0;

    maxHull = 100;
    hull = 100;

    pressure = 0;

    baseTorque = 0;
    clockPower = 0;

    hand = [];
    handValue = 0;
    aceCount = 0;

    enemyHand = [];
    enemyHidden = true;

    blackjack = false;
    bust = false;

    doubled = false;
    roundLocked = false;
    carryClockBonus = 0;

    betweenEncounters = false;
    workshopOpen = false;
    runOver = false;
    freePicks = 0;
    aegisUsed = false;
    ventClockBonus = 0;

    enemy = null;
    combatStarted = false;

    equippedEchoes = [];

    defeatedEnemies = 0;

    lootReward = 0;
    workshopPending = false;
    replacementEcho = null;

    setRoundResult("");
}


function startNewRun() {

    const profile = getProfile();

    if (!profile) {
        menuView = "profiles";
        renderMenu();
        return;
    }

    if (profile.run && !confirm("Abandon your saved run and start a new one?")) {
        return;
    }

    resetState();

    profile.run = null;
    profile.stats.runs++;
    runStartBest = profile.stats.bestCycle;

    saveProfiles();

    getElement("startOverlay").style.display = "none";

    getElement("gameOverModal").classList.add("hidden");
    getElement("lootModal").classList.add("hidden");
    getElement("workshopModal").classList.add("hidden");

    startMusic();

    logMessage("NEW RUN INITIALIZED.");

    newEncounter();

    render();
}


/* =========================
   ENCOUNTER
   ========================= */

function getTier() {

    return Math.floor(
        (cycle - 1) / 10
    ) + 1;
}


function getEnemyType(cycleNumber) {

    if (cycleNumber % 10 === 0) {
        return "BOSS";
    }

    if (cycleNumber % 5 === 0) {
        return "ELITE";
    }

    return "COMMON";
}


function getEnemyForCycle() {

    const tier = getTier();

    const typeKey = getEnemyType(cycle);

    const type = ENEMY_TYPES[typeKey];

    const pool = ENEMY_POOLS[typeKey];

    const base =
        typeKey === "BOSS"
            ? pool[(Math.floor(cycle / 10) - 1) % pool.length]
            : pool[randomNumber(0, pool.length - 1)];

    const hullScale = 1 + ((tier - 1) * 0.25);

    const maxEnemyHull = Math.round(type.hull * hullScale);

    return {
        name: base.name,
        type: typeKey,
        maxHull: maxEnemyHull,
        hull: maxEnemyHull,
        attack: type.attack + ((tier - 1) * 2),
        armor: type.armor + (tier - 1),
        ability: base.ability,
        lootMultiplier: type.loot,
        repair: type.repair
    };
}


function newEncounter() {

    betweenEncounters = false;
    aegisUsed = false;

    noteCycleReached();
    saveRun();

    enemy = getEnemyForCycle();

    pressure = 0;

    baseTorque = 0;
    clockPower = 0;

    hand = [];
    handValue = 0;
    aceCount = 0;

    blackjack = false;
    bust = false;

    combatStarted = true;

    applyCycleEchoes();

    logMessage(
        "ENCOUNTER [" + enemy.type + "]: " +
        enemy.name +
        "."
    );

    if (enemy.ability !== "NONE") {

        logMessage(
            "ENEMY ABILITY: " +
            enemy.ability +
            "."
        );
    }

    dealHand();

    render();
}


/* =========================
   CARDS
   ========================= */

function drawCard() {

    const suits = [
        "SPADES",
        "HEARTS",
        "DIAMONDS",
        "CLUBS"
    ];

    const suit =
        suits[
            randomNumber(
                0,
                suits.length - 1
            )
        ];

    const rankNumber =
        randomNumber(1, 13);

    let rank;
    let value;

    if (rankNumber === 1) {
        rank = "A";
        value = 11;
    }
    else if (rankNumber === 11) {
        rank = "J";
        value = 10;
    }
    else if (rankNumber === 12) {
        rank = "Q";
        value = 10;
    }
    else if (rankNumber === 13) {
        rank = "K";
        value = 10;
    }
    else {
        rank = String(rankNumber);
        value = rankNumber;
    }

    return {
        rank,
        suit,
        value
    };
}


function evaluateHand(cards) {

    let total = 0;
    let aces = 0;

    for (const card of cards) {

        total += card.value;

        if (card.rank === "A") {
            aces++;
        }
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return {
        total: total,
        aces: aces,
        blackjack: cards.length === 2 && total === 21,
        bust: total > 21
    };
}


function buildCardElement(card) {

    const element = document.createElement("div");

    if (!card) {
        element.className = "card hidden-card";
        return element;
    }

    const symbols = {
        SPADES: "♠",
        HEARTS: "♥",
        DIAMONDS: "♦",
        CLUBS: "♣"
    };

    const symbol = symbols[card.suit];

    const red =
        card.suit === "HEARTS" ||
        card.suit === "DIAMONDS";

    element.className = red ? "card red" : "card";

    const corner =
        "<b>" + card.rank + "</b><i>" + symbol + "</i>";

    element.innerHTML =
        "<div class=\"corner tl\">" + corner + "</div>" +
        "<div class=\"pip\">" + symbol + "</div>" +
        "<div class=\"corner br\">" + corner + "</div>";

    return element;
}


function syncCardRow(container, cards, hiddenIndex) {

    const keys = cards.map(function (card, index) {
        return index === hiddenIndex ? "?" : card.rank + card.suit;
    });

    let compatible = container.children.length <= keys.length;

    for (let i = 0; compatible && i < container.children.length; i++) {

        const existing = container.children[i].getAttribute("data-key");

        if (existing !== keys[i] && !(existing === "?" && keys[i] !== "?")) {
            compatible = false;
        }
    }

    if (!compatible) {
        container.innerHTML = "";
    }

    /* a hidden card that is now revealed: flip it */
    for (let i = 0; i < container.children.length; i++) {

        const current = container.children[i];

        if (current.getAttribute("data-key") === "?" && keys[i] !== "?") {

            const revealed = buildCardElement(cards[i]);

            revealed.setAttribute("data-key", keys[i]);
            revealed.classList.add("flip");

            container.replaceChild(revealed, current);
        }
    }

    /* new cards: deal them in one after the other */
    const firstNew = container.children.length;

    for (let i = firstNew; i < keys.length; i++) {

        const element = buildCardElement(
            i === hiddenIndex ? null : cards[i]
        );

        element.setAttribute("data-key", keys[i]);
        element.classList.add("deal");
        element.style.animationDelay = ((i - firstNew) * 120) + "ms";

        container.appendChild(element);
    }
}


function renderCards() {

    const container = getElement("cards");

    if (container) {
        syncCardRow(container, hand, -1);
    }

    const enemyContainer = getElement("enemyCards");

    if (enemyContainer) {
        syncCardRow(
            enemyContainer,
            enemyHand,
            enemyHidden && !hasEcho("BRASS PERISCOPE") && enemyHand.length > 1 ? 1 : -1
        );
    }

    const enemyValue = getElement("enemyHandValue");

    if (enemyValue) {

        if (enemyHand.length === 0) {
            enemyValue.textContent = "0";
        }
        else if (enemyHidden && !hasEcho("BRASS PERISCOPE")) {
            enemyValue.textContent =
                evaluateHand([enemyHand[0]]).total + " + ?";
        }
        else {

            const result = evaluateHand(enemyHand);

            enemyValue.textContent =
                result.total + (result.bust ? " BUST" : "");
        }
    }
}


function dealHand() {

    hand = [drawCard(), drawCard()];
    enemyHand = [drawCard(), drawCard()];

    enemyHidden = true;
    doubled = false;
    ventClockBonus = 0;
    roundLocked = false;

    setRoundResult("");

    recomputeHandStats();

    if (blackjack) {

        logMessage("NATURAL BLACKJACK.");

        roundLocked = true;

        schedule(resolveRound, REVEAL_DELAY);
    }

    render();
}


/* =========================
   COMBAT CALCULATIONS
   ========================= */

function applyHandEchoes() {

    if (hasEcho("CLOCKMAKER")) {
        clockPower += 2;
    }

    if (hasEcho("MASTER CLOCK")) {
        clockPower += 5;
    }

    if (hasEcho("STEAM CORE")) {
        baseTorque += 3;
    }

    if (hasEcho("AUTOMATON")) {
        baseTorque += 5;
    }

    if (hasEcho("HIGH PRESSURE PISTON")) {
        baseTorque +=
            Math.floor(
                pressure / 10
            );
    }

    if (
        hasEcho("CHRONO CORE") &&
        cycle % 3 === 0
    ) {
        clockPower += 5;
    }

    if (
        hasEcho("AEON GEAR") &&
        cycle % 10 === 0
    ) {
        clockPower += 20;
    }
}


function applyValueEchoes() {

    if (handValue === 21) {

        if (hasEcho("OLD SPRING")) {
            clockPower += 5;
        }

        if (hasEcho("PERFECT GEAR")) {
            clockPower += 10;
        }
    }

    if (handValue >= 18) {

        if (hasEcho("BRASS EYE")) {
            baseTorque += 5;
        }
    }

    if (handValue >= 20) {

        if (hasEcho("TIME SPRING")) {
            clockPower += 8;
        }

        if (hasEcho("GOLDEN PISTON")) {
            baseTorque += 10;
        }
    }
}


function recomputeHandStats() {

    const result = evaluateHand(hand);

    handValue = result.total;
    aceCount = result.aces;
    blackjack = result.blackjack;
    bust = result.bust;

    baseTorque = 0;
    clockPower = 0;

    if (bust) {
        return;
    }

    if (blackjack) {

        baseTorque = 25;
        clockPower = 15;

        if (hasEcho("LOST ESCAPEMENT")) {
            clockPower += 10;
        }

        if (hasEcho("INFINITE SPRING")) {
            baseTorque += 15;
        }

        if (hasEcho("THE FIRST GEAR")) {
            baseTorque = Math.max(baseTorque, 35);
        }

        applyHandEchoes();
    }
    else {

        baseTorque = handValue;

        if (handValue === 18) { clockPower += 3; }
        if (handValue === 19) { clockPower += 5; }
        if (handValue === 20) { clockPower += 8; }
        if (handValue === 21) { clockPower += 12; }

        applyHandEchoes();
        applyValueEchoes();
    }

    clockPower += carryClockBonus;
    clockPower += ventClockBonus;

    if (doubled && hasEcho("OVERDRIVE")) {
        clockPower += 5;
    }

    if (hasEcho("CORVALI ECHO")) {
        clockPower = Math.round(clockPower * 1.25);
    }
}


/* =========================
   ROUND FLOW
   You vs enemy: compare hands.
   Win  -> you deal damage.
   Lose / bust -> you take damage.
   Tie  -> nothing happens.
   ========================= */

function schedule(fn, delay) {

    const token = roundToken;

    setTimeout(function () {

        if (token === roundToken) {
            fn();
        }

    }, delay);
}


function canAct() {

    return combatStarted &&
        enemy &&
        !roundLocked &&
        !bust;
}


function setRoundResult(text, type) {

    const element = getElement("roundResult");

    if (!element) {
        return;
    }

    element.textContent = text;

    element.className =
        "round-result" +
        (type ? " " + type : "");
}


function hit() {

    if (!canAct()) {
        return;
    }

    hand.push(drawCard());

    if (!hasEcho("STEEL NERVES")) {
        pressure += 5;
    }

    vibrate(15);

    recomputeHandStats();
    renderCards();

    logMessage("HIT: HAND VALUE " + handValue + ".");

    if (bust) {
        resolveRound();
        return;
    }

    checkPressure();

    if (!combatStarted) {
        render();
        return;
    }

    recomputeHandStats();
    render();
}


function stand() {

    if (!canAct()) {
        return;
    }

    logMessage("STAND: HAND VALUE " + handValue + ".");

    resolveRound();
}


function doubleDown() {

    if (!canAct()) {
        return;
    }

    if (hand.length > 2) {

        logMessage(
            "DOUBLE IS ONLY AVAILABLE ON THE INITIAL HAND."
        );

        return;
    }

    hand.push(drawCard());

    pressure += 10;

    vibrate(25);

    doubled = true;

    recomputeHandStats();
    renderCards();

    logMessage(
        "DOUBLE: HAND VALUE " + handValue +
        ". DAMAGE DEALT AND TAKEN IS DOUBLED."
    );

    resolveRound();
}


function resolveRound() {

    if (!combatStarted || !enemy) {
        return;
    }

    roundLocked = true;
    carryClockBonus = 0;
    enemyHidden = false;

    if (!bust) {

        while (
            evaluateHand(enemyHand).total < ENEMY_STAND_ON
        ) {
            enemyHand.push(drawCard());
        }
    }

    const playerResult = evaluateHand(hand);
    const enemyResult = evaluateHand(enemyHand);

    logMessage(
        "ENEMY HAND: " + enemyResult.total +
        (enemyResult.bust ? " (BUST)" : "") + "."
    );

    render();

    schedule(function () {
        applyRoundOutcome(playerResult, enemyResult);
    }, REVEAL_DELAY);
}


function applyRoundOutcome(player, foe) {

    if (!combatStarted || !enemy) {
        return;
    }

    let result = "PUSH";

    if (player.bust) {
        result = "LOSE";
    }
    else if (foe.bust) {
        result = "WIN";
    }
    else if (player.blackjack !== foe.blackjack) {
        result = player.blackjack ? "WIN" : "LOSE";
    }
    else if (player.total > foe.total) {
        result = "WIN";
    }
    else if (player.total < foe.total) {
        result = "LOSE";
    }

    if (result === "WIN") {

        setRoundResult("YOU WIN THE ROUND", "win");

        logMessage(
            foe.bust
                ? "ENEMY OVERLOADED."
                : "YOU WIN: " + player.total + " VS " + foe.total + "."
        );

        if (hasEcho("SPARE PARTS")) {

            cogs += 3;

            logMessage("SPARE PARTS: +3 COGS.");
        }

        playerHitsEnemy();

        if (!combatStarted) {
            return;
        }
    }
    else if (result === "LOSE") {

        if (player.bust) {

            setRoundResult("OVERLOAD — YOU BUST", "lose");

            pressure += 20;

            logMessage("OVERLOAD: HAND BUSTED.");

            if (hasEcho("BROKEN GEAR")) {

                carryClockBonus += 8;

                logMessage(
                    "BROKEN GEAR: +8 CLOCK POWER NEXT HAND."
                );
            }

            if (hasEcho("BLACK GEAR")) {

                enemy.hull = Math.max(0, enemy.hull - 10);

                logMessage("BLACK GEAR DAMAGED THE ENEMY.");

                if (enemy.hull <= 0) {
                    defeatEnemy();
                    return;
                }
            }
        }
        else {

            setRoundResult("YOU LOSE THE ROUND", "lose");

            logMessage(
                "YOU LOSE: " + player.total + " VS " + foe.total + "."
            );
        }

        enemyHitsPlayer();

        if (!combatStarted) {
            return;
        }
    }
    else {

        setRoundResult("PUSH — NO DAMAGE", "push");

        logMessage(
            "PUSH: " + player.total + " VS " + foe.total + "."
        );

        if (hasEcho("TICKING BOMB") && flatDamageEnemy(8, "TICKING BOMB")) {
            return;
        }
    }

    if (!player.bust) {
        pressure += 5;
    }

    if (hasEcho("COOLING COIL")) {
        pressure = Math.max(0, pressure - 5);
    }

    checkPressure();

    render();

    if (!combatStarted) {
        return;
    }

    schedule(dealHand, NEXT_HAND_DELAY);
}


function flatDamageEnemy(amount, source) {

    if (!enemy || enemy.hull <= 0) {
        return false;
    }

    enemy.hull = Math.max(0, enemy.hull - amount);

    logMessage(source + " DEALT " + amount + " DAMAGE.");

    floatNumber("enemyPanel", "-" + amount, "dmg");
    playAnimation("enemyPanel", "shake");

    if (enemy.hull <= 0) {
        defeatEnemy();
        return true;
    }

    return false;
}


function calcPlayerDamage() {

    if (!enemy) {
        return 0;
    }

    let damage = Math.floor(
        baseTorque * (10 + clockPower) / 10
    );

    let armor = enemy.armor;

    if (hasEcho("CORVALI LENS")) {
        armor = Math.max(0, armor - 5);
    }

    if (hasEcho("TITAN HAMMER") && handValue >= 20) {
        armor = 0;
    }

    damage = Math.max(1, damage - armor);

    if (hasEcho("GLASS PISTON")) {
        damage = Math.round(damage * 1.3);
    }

    if (hasEcho("LAST STAND") && hull <= maxHull * 0.3) {
        damage = Math.round(damage * 1.5);
    }

    if (doubled) {
        damage *= 2;
    }

    return damage;
}


function calcEnemyDamage() {

    if (!enemy) {
        return 0;
    }

    let damage = enemy.attack;

    if (hasEcho("COUNTERWEIGHT")) {
        damage -= 2;
    }

    if (hasEcho("GLASS PISTON")) {
        damage += 3;
    }

    if (doubled && !hasEcho("DOUBLE CRANK")) {
        damage *= 2;
    }

    return Math.max(1, damage);
}


function playerHitsEnemy() {

    const damage = calcPlayerDamage();

    enemy.hull = Math.max(0, enemy.hull - damage);

    logMessage("DAMAGE OUTPUT: " + damage + ".");

    floatNumber("enemyPanel", "-" + damage, "dmg");
    playAnimation("enemyPanel", "shake");
    vibrate([30, 30, 70]);

    if (enemy.hull <= 0) {
        defeatEnemy();
    }
}


/* =========================
   ENEMY ATTACK
   ========================= */

function enemyHitsPlayer() {

    if (!enemy || enemy.hull <= 0) {
        return;
    }

    if (hasEcho("AEGIS GEAR") && !aegisUsed) {

        aegisUsed = true;

        logMessage("AEGIS GEAR BLOCKED THE HIT.");

        floatNumber("playerPanel", "BLOCKED", "vent");
        vibrate(40);

        return;
    }

    const damage = calcEnemyDamage();

    if (enemy.ability === "PRESSURE") {
        pressure += 5;
    }

    if (enemy.ability === "HEAT") {
        pressure += 8;
    }

    hull = Math.max(0, hull - damage);

    logMessage(
        enemy.name + " HITS YOU FOR " + damage + "."
    );

    floatNumber("playerPanel", "-" + damage, "dmg");
    playAnimation("playerPanel", "shake");
    flashScreen("red");
    vibrate([90, 50, 140]);

    if (hull <= 0) {
        gameOver();
    }
}


/* =========================
   PRESSURE
   ========================= */

function checkPressure() {

    const limit =
        hasEcho("PRESSURE CHAMBER")
            ? 120
            : 100;

    if (pressure > limit) {

        const overheatDamage =
            hasEcho("IRON LUNG")
                ? 5
                : 15;

        hull = Math.max(0, hull - overheatDamage);

        pressure = 0;

        logMessage(
            "OVERHEAT: " + overheatDamage + " HULL DAMAGE."
        );

        floatNumber("playerPanel", "-" + overheatDamage + " OVERHEAT", "dmg");
        playAnimation("playerPanel", "shake");
        flashScreen("red");
        vibrate(250);

        if (hull <= 0) {
            gameOver();
        }
    }
}


function vent() {

    if (!combatStarted || roundLocked) {
        return;
    }

    if (pressure <= 0) {

        logMessage(
            "PRESSURE IS ALREADY STABLE."
        );

        return;
    }

    let amount = 30;

    if (hasEcho("PRESSURE VALVE")) {
        amount = 40;
    }

    if (hasEcho("VOID VALVE")) {
        amount = Math.max(amount, 45);
    }

    pressure =
        Math.max(
            0,
            pressure - amount
        );

    if (hasEcho("BRASS LUNG")) {

        hull =
            Math.min(
                maxHull,
                hull + 5
            );

        logMessage(
            "BRASS LUNG RESTORED 5 HULL."
        );
    }

    logMessage(
        "VENT: " +
        amount +
        " PRESSURE RELEASED."
    );

    if (hasEcho("STEAM VALVE")) {

        ventClockBonus = Math.min(8, ventClockBonus + 4);

        logMessage("STEAM VALVE: +" + ventClockBonus + " CLOCK POWER THIS HAND.");
    }

    if (hasEcho("STEAM BROKER")) {

        cogs += 2;

        logMessage("STEAM BROKER: +2 COGS.");
    }

    floatNumber("playerPanel", "-" + amount + " PRESSURE", "vent");
    vibrate(25);

    if (hand.length > 0 && !bust) {
        recomputeHandStats();
    }

    render();
}


/* =========================
   LOOT
   ========================= */

function defeatEnemy() {

    if (!enemy) {
        return;
    }

    combatStarted = false;

    defeatedEnemies++;

    lootReward = Math.round(
        (8 + (getTier() * 4)) *
        (enemy.lootMultiplier || 1)
    );

    cogs += lootReward;

    const repairAmount =
        (enemy.repair || 10) +
        (hasEcho("SALVAGE ENGINE") ? 10 : 0);

    if (repairAmount > 0 && hull > 0) {

        const before = hull;

        hull = Math.min(maxHull, hull + repairAmount);

        if (hull > before) {
            logMessage("HULL REPAIRED: +" + (hull - before) + ".");
            floatNumber("playerPanel", "+" + (hull - before), "heal");
        }
    }

    logMessage(
        enemy.name +
        " DESTROYED."
    );

    logMessage(
        "REWARD: " +
        lootReward +
        " COGS."
    );

    workshopPending =
        enemy.type === "BOSS" ||
        defeatedEnemies % 3 === 0;

    if (enemy.type === "BOSS") {
        freePicks = 1;
    }

    onEnemyDefeated();

    const name =
        getElement("lootEnemyName");

    const reward =
        getElement("lootReward");

    if (name) {
        name.textContent =
            enemy.name +
            " DESTROYED";
    }

    if (reward) {
        reward.textContent =
            "+" +
            lootReward +
            " COGS";
    }

    getElement(
        "lootModal"
    ).classList.remove("hidden");

    render();
}


function continueAfterLoot() {

    getElement(
        "lootModal"
    ).classList.add("hidden");

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


/* =========================
   WORKSHOP
   ========================= */

function getPrice(echo) {

    if (echo.rarity === "WORN") {
        return 10;
    }

    if (echo.rarity === "FORGED") {
        return 18;
    }

    if (echo.rarity === "ENGINEERED") {
        return 28;
    }

    return 45;
}


function openWorkshop() {

    const modal =
        getElement("workshopModal");

    if (!modal) {
        return;
    }

    replacementEcho = null;

    hideReplacementPanel();

    generateShop();

    workshopOpen = true;

    modal.classList.remove("hidden");

    render();
}


function closeWorkshop() {

    workshopOpen = false;

    getElement(
        "workshopModal"
    ).classList.add("hidden");
}


function generateShop() {

    const container = getElement("shopItems");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const available =
        shuffle(
            ECHOES.filter(function (echo) {
                return !hasEcho(echo.name) &&
                    (freePicks <= 0 || echo.rarity !== "WORN");
            })
        ).slice(0, 4);

    for (const echo of available) {

        const price = freePicks > 0 ? 0 : getPrice(echo);

        const item = document.createElement("div");

        item.className =
            "shop-item rarity-" + echo.rarity.toLowerCase();

        const label =
            price === 0
                ? "TAKE - FREE"
                : (equippedEchoes.length >= 3 ? "REPLACE - " : "BUY - ") +
                  price + " COGS";

        item.innerHTML =
            "<div class=\"shop-item-head\">" +
            "<div class=\"echo-icon\">" + echoIcon(echo.name) + "</div>" +
            "<div>" +
            "<div class=\"shop-item-name\">" + echo.name + "</div>" +
            "<div class=\"shop-item-rarity\">" + echo.rarity + "</div>" +
            "</div>" +
            "</div>" +
            "<div class=\"shop-item-description\">" + echo.description + "</div>" +
            "<button class=\"small-button\">" + label + "</button>";

        const button = item.querySelector("button");

        if (price > cogs) {
            button.disabled = true;
        }

        button.addEventListener("click", function () {
            buyEcho(echo.name, price);
        });

        container.appendChild(item);
    }

    if (available.length === 0) {

        container.innerHTML =
            "<div class=\"shop-item\">" +
            "<div class=\"shop-item-name\">NO ECHOES AVAILABLE</div>" +
            "</div>";
    }
}


function buyEcho(name, price) {

    const echo =
        getEcho(name);

    if (!echo) {
        return;
    }

    if (hasEcho(name)) {
        return;
    }

    if (cogs < price) {

        logMessage(
            "INSUFFICIENT COGS."
        );

        return;
    }

    /*
       If there is an empty slot,
       equip immediately.
    */

    if (equippedEchoes.length < 3) {

        cogs -= price;

        if (price === 0) {
            freePicks = 0;
        }

        equippedEchoes.push(echo);

        logMessage(
            "ECHO EQUIPPED: " +
            echo.name +
            "."
        );

        recalculateMaxHull();
        saveRun();

        generateShop();
        render();

        return;
    }

    /*
       Three slots are full.
       The Echo can now replace
       one of the three equipped Echoes.
    */

    replacementEcho = {
        echo: echo,
        price: price
    };

    showReplacementPanel();
}


function showReplacementPanel() {

    const panel =
        getElement(
            "replacementPanel"
        );

    const slots =
        getElement(
            "replacementSlots"
        );

    if (!panel || !slots) {
        return;
    }

    slots.innerHTML = "";

    equippedEchoes.forEach(
        function (equipped, index) {

            const button =
                document.createElement("button");

            button.innerHTML =
                "<strong>SLOT " +
                (index + 1) +
                "</strong><br>" +
                equipped.name;

            button.addEventListener(
                "click",
                function () {
                    replaceEcho(index);
                }
            );

            slots.appendChild(button);
        }
    );

    panel.classList.remove("hidden");
}


function hideReplacementPanel() {

    const panel =
        getElement(
            "replacementPanel"
        );

    if (panel) {
        panel.classList.add("hidden");
    }
}


function cancelReplacement() {

    replacementEcho = null;

    hideReplacementPanel();
}


function replaceEcho(index) {

    if (!replacementEcho) {
        return;
    }

    const newEcho =
        replacementEcho.echo;

    const price =
        replacementEcho.price;

    if (cogs < price) {

        logMessage(
            "INSUFFICIENT COGS."
        );

        cancelReplacement();

        return;
    }

    const oldEcho =
        equippedEchoes[index];

    cogs -= price;

    if (price === 0) {
        freePicks = 0;
    }

    equippedEchoes[index] =
        newEcho;

    logMessage(
        "ECHO REPLACED: " +
        oldEcho.name +
        " → " +
        newEcho.name +
        "."
    );

    replacementEcho = null;

    hideReplacementPanel();

    recalculateMaxHull();
    saveRun();

    generateShop();

    render();
}


function continueAfterWorkshop() {

    closeWorkshop();

    continueToNextEncounter();
}


/* =========================
   ECHO DISPLAY
   ========================= */

function renderEchoes() {

    const container = getElement("equippedEchoes");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    for (let i = 0; i < 3; i++) {

        const slot = document.createElement("div");

        if (equippedEchoes[i]) {

            const echo = equippedEchoes[i];

            slot.className =
                "echo-slot rarity-" + echo.rarity.toLowerCase();

            slot.setAttribute("data-echo", echo.name);
            slot.setAttribute("tabindex", "0");

            slot.innerHTML =
                "<div class=\"echo-icon\">" + echoIcon(echo.name) + "</div>" +
                "<div class=\"echo-text\">" +
                "<strong>" + echo.name + "</strong>" +
                "<small>" + echo.rarity + "</small>" +
                "</div>";
        }
        else {

            slot.className = "echo-slot empty";

            slot.innerHTML =
                "<span class=\"slot-plus\">+</span>" +
                "<span>EMPTY SLOT</span>";
        }

        container.appendChild(slot);
    }

    const count = getElement("echoCount");

    if (count) {
        count.textContent = equippedEchoes.length;
    }
}


/* =========================
   RENDER
   ========================= */

function render() {

    const values = {

        cycle: cycle,
        cogs: cogs,

        hull: hull,
        maxHull: maxHull,

        pressure: pressure,

        baseTorque:
            Math.max(
                0,
                Math.floor(
                    baseTorque
                )
            ),

        clockPower:
            Math.max(
                0,
                Math.floor(
                    clockPower
                )
            ),

        handValue: handValue
    };

    for (
        const key in values
    ) {

        const element =
            getElement(key);

        if (element) {
            element.textContent =
                values[key];
        }
    }


    const maxPressure =
        getElement(
            "maxPressure"
        );

    if (maxPressure) {

        maxPressure.textContent =
            hasEcho("PRESSURE CHAMBER")
                ? 120
                : 100;
    }


    if (enemy) {

        const fields = {

            enemyName:
                enemy.name,

            enemyHull:
                enemy.hull,

            enemyMaxHull:
                enemy.maxHull,

            enemyAttack:
                enemy.attack,

            enemyArmor:
                enemy.armor,

            enemyAbility:
                enemy.ability
        };

        for (
            const key in fields
        ) {

            const element =
                getElement(key);

            if (element) {
                element.textContent =
                    fields[key];
            }
        }


        const enemyBar =
            getElement(
                "enemyHullBar"
            );

        if (enemyBar) {

            enemyBar.style.width =
                (
                    enemy.hull /
                    enemy.maxHull *
                    100
                ) +
                "%";
        }
    }


    const pressureBar =
        getElement(
            "pressureBar"
        );

    if (pressureBar) {

        const limit =
            hasEcho("PRESSURE CHAMBER")
                ? 120
                : 100;

        pressureBar.style.width =
            Math.min(
                100,
                (
                    pressure /
                    limit
                ) * 100
            ) +
            "%";
    }


    const hullBar = getElement("hullBar");

    if (hullBar) {

        const hullPercent =
            maxHull > 0 ? (hull / maxHull) * 100 : 0;

        hullBar.style.width = Math.max(0, Math.min(100, hullPercent)) + "%";
        hullBar.classList.toggle("low", hullPercent <= 30);
    }

    const pressureWarning = getElement("pressureBar");

    if (pressureWarning) {

        const warnLimit = hasEcho("PRESSURE CHAMBER") ? 120 : 100;

        pressureWarning.classList.toggle(
            "danger",
            pressure / warnLimit >= 0.8
        );
    }

    const tier =
        getElement(
            "enemyTier"
        );

    if (tier) {

        const roman = [
            "I",
            "II",
            "III",
            "IV",
            "V",
            "VI"
        ];

        const current =
            getTier();

        tier.textContent =
            "TIER " +
            (
                roman[current - 1] ||
                current
            ) +
            (enemy ? " - " + enemy.type : "");
    }


    const panel = getElement("enemyPanel");

    if (panel) {
        panel.classList.toggle("elite", !!enemy && enemy.type === "ELITE");
        panel.classList.toggle("boss", !!enemy && enemy.type === "BOSS");
    }

    renderEchoes();
    renderCards();
    renderExtras();

    updateActionButtons();
}


/* =========================
   ACTION BUTTONS
   ========================= */

function updateActionButtons() {

    const buttons = [
        "hitButton",
        "standButton",
        "doubleButton",
        "ventButton"
    ];

    for (
        const id of buttons
    ) {

        const button =
            getElement(id);

        if (button) {
            button.disabled =
                !combatStarted || roundLocked;
        }
    }
}


/* =========================
   GAME OVER
   ========================= */

function gameOver() {

    if (runOver) {
        return;
    }

    runOver = true;

    combatStarted = false;

    const modal =
        getElement(
            "gameOverModal"
        );

    if (!modal) {
        return;
    }

    const finalCycle =
        getElement(
            "finalCycle"
        );

    const finalCogs =
        getElement(
            "finalCogs"
        );

    if (finalCycle) {
        finalCycle.textContent =
            cycle;
    }

    if (finalCogs) {
        finalCogs.textContent =
            cogs;
    }

    finishRunStats();

    modal.classList.remove(
        "hidden"
    );

    logMessage(
        "ENGINE FAILURE."
    );

    render();
}


/* =========================
   RETURN TO MENU
   ========================= */

function returnToMenu() {

    resetState();

    closeAllOverlays();

    getElement("gameOverModal").classList.add("hidden");
    getElement("lootModal").classList.add("hidden");
    getElement("workshopModal").classList.add("hidden");

    getElement("startOverlay").style.display = "flex";

    menuView = "main";
    renderMenu();

    render();
}


/* =========================
   MUSIC
   Put your track at assets/music/theme.mp3
   (or change MUSIC_FILE below).
   ========================= */

const MUSIC_FILE = "./assets/music/theme.mp3";
let musicVolume = 0.35;
const MUSIC_STORAGE_KEY = "corvaliMusic";

let music = null;
let musicEnabled = true;
let musicWasPlaying = false;
let musicFadeTimer = null;


function loadMusicPreference() {

    try {
        musicEnabled =
            localStorage.getItem(MUSIC_STORAGE_KEY) !== "off";
    }
    catch (error) {
        musicEnabled = true;
    }
}


function saveMusicPreference() {

    try {
        localStorage.setItem(
            MUSIC_STORAGE_KEY,
            musicEnabled ? "on" : "off"
        );
    }
    catch (error) {
        /* storage not available: ignore */
    }
}


function initMusic() {

    if (music) {
        return;
    }

    music = new Audio(MUSIC_FILE);

    music.loop = false;
    music.volume = musicVolume;
    music.preload = "auto";

    /* The track ends with a fade-out, so instead of a hard loop
       we restart it manually with a fade-in. */
    music.addEventListener("ended", function () {

        music.currentTime = 0;

        startMusic();
    });

    music.addEventListener("error", function () {

        logMessage(
            "MUSIC FILE NOT FOUND: " + MUSIC_FILE
        );
    });
}


function fadeMusicIn() {

    const steps = 20;

    let step = 0;

    clearInterval(musicFadeTimer);

    music.volume = 0;

    musicFadeTimer = setInterval(function () {

        step++;

        music.volume = Math.min(
            musicVolume,
            musicVolume * step / steps
        );

        if (step >= steps) {
            clearInterval(musicFadeTimer);
        }

    }, 100);
}


function startMusic() {

    initMusic();

    if (!musicEnabled) {
        return;
    }

    const attempt = music.play();

    fadeMusicIn();

    if (attempt && attempt.catch) {
        attempt.catch(function (error) {

            if (error && error.name === "NotAllowedError") {
                logMessage(
                    "MUSIC BLOCKED BY THE BROWSER. TAP THE ♪ BUTTON."
                );
            }
        });
    }
}


function toggleMusic() {

    musicEnabled = !musicEnabled;

    saveMusicPreference();

    initMusic();

    if (musicEnabled) {
        startMusic();
    }
    else {
        clearInterval(musicFadeTimer);
        music.pause();
    }

    updateMusicButton();
}


function updateMusicButton() {

    const button = getElement("musicButton");

    if (!button) {
        return;
    }

    button.textContent = musicEnabled ? "♪ ON" : "♪ OFF";

    button.classList.toggle("off", !musicEnabled);

    button.setAttribute(
        "aria-pressed",
        musicEnabled ? "true" : "false"
    );
}


document.addEventListener("visibilitychange", function () {

    if (!music) {
        return;
    }

    if (document.hidden) {

        if (!music.paused) {
            musicWasPlaying = true;
            music.pause();
        }
    }
    else if (musicWasPlaying && musicEnabled) {

        musicWasPlaying = false;
        startMusic();
    }
});


/* =========================
   FEEDBACK: VIBRATION + ANIMATION
   (vibration works on Android; iPhone Safari does not support it)
   ========================= */

const VIBRATION_KEY = "corvaliVibration";

let vibrationEnabled = true;


function vibrationSupported() {

    return typeof navigator !== "undefined" &&
        typeof navigator.vibrate === "function";
}


function loadVibrationPreference() {

    try {
        vibrationEnabled =
            localStorage.getItem(VIBRATION_KEY) !== "off";
    }
    catch (error) {
        vibrationEnabled = true;
    }
}


function vibrate(pattern) {

    if (!vibrationEnabled || !vibrationSupported()) {
        return;
    }

    try {
        navigator.vibrate(pattern);
    }
    catch (error) {
        /* ignore */
    }
}


function toggleVibration() {

    vibrationEnabled = !vibrationEnabled;

    try {
        localStorage.setItem(
            VIBRATION_KEY,
            vibrationEnabled ? "on" : "off"
        );
    }
    catch (error) {
        /* ignore */
    }

    updateVibrationButton();

    vibrate(40);
}


function updateVibrationButton() {

    const button = getElement("vibrationButton");

    if (!button) {
        return;
    }

    if (!vibrationSupported()) {
        (button.parentNode || button).style.display = "none";
        return;
    }

    button.textContent = vibrationEnabled ? "VIB ON" : "VIB OFF";

    button.classList.toggle("off", !vibrationEnabled);

    button.setAttribute(
        "aria-pressed",
        vibrationEnabled ? "true" : "false"
    );
}


function playAnimation(id, className) {

    const element = getElement(id);

    if (!element) {
        return;
    }

    element.classList.remove(className);

    void element.offsetWidth;

    element.classList.add(className);
}


function floatNumber(panelId, text, type) {

    const panel = getElement(panelId);

    if (!panel) {
        return;
    }

    const element = document.createElement("div");

    element.className = "float-number " + type;
    element.textContent = text;

    panel.appendChild(element);

    setTimeout(function () {

        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }

    }, 1100);
}


function flashScreen(type) {

    const overlay = getElement("flashOverlay");

    if (!overlay) {
        return;
    }

    overlay.className = "flash-overlay";

    void overlay.offsetWidth;

    overlay.className = "flash-overlay flash-" + type;
}


/* =========================
   PROFILE + SAVE
   Stored on this device only (localStorage).
   ========================= */

const STORE_PROFILES = "corvali.profiles";
const STORE_CURRENT = "corvali.currentProfile";
const MAX_PROFILE_NAME = 14;

let profiles = {};
let currentProfile = null;
let menuView = "main";

let betweenEncounters = false;
let workshopOpen = false;
let runOver = false;
let freePicks = 0;
let aegisUsed = false;
let ventClockBonus = 0;
let runStartBest = 0;


function readJson(key, fallback) {

    try {

        const raw = localStorage.getItem(key);

        return raw ? JSON.parse(raw) : fallback;
    }
    catch (error) {
        return fallback;
    }
}


function writeJson(key, value) {

    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }
    catch (error) {
        return false;
    }
}


function newProfileData(name) {

    return {
        name: name,
        created: Date.now(),
        stats: {
            runs: 0,
            deaths: 0,
            bestCycle: 0,
            kills: 0,
            cogsEarned: 0
        },
        run: null
    };
}


function normalizeProfile(name, data) {

    const base = newProfileData(name);

    if (!data || typeof data !== "object") {
        return base;
    }

    const stats = data.stats || {};

    Object.keys(base.stats).forEach(function (key) {

        const value = Number(stats[key]);

        base.stats[key] = Number.isFinite(value) ? value : 0;
    });

    base.created = Number(data.created) || base.created;
    base.run = data.run && typeof data.run === "object" ? data.run : null;

    return base;
}


function loadProfiles() {

    const stored = readJson(STORE_PROFILES, {});

    profiles = {};

    if (stored && typeof stored === "object") {

        Object.keys(stored).forEach(function (name) {
            profiles[name] = normalizeProfile(name, stored[name]);
        });
    }

    const last = readJson(STORE_CURRENT, null);

    currentProfile = last && profiles[last] ? last : null;
}


function saveProfiles() {

    writeJson(STORE_PROFILES, profiles);
    writeJson(STORE_CURRENT, currentProfile);
}


function sanitizeProfileName(raw) {

    return String(raw || "")
        .toUpperCase()
        .replace(/[^\p{L}\p{N} _-]/gu, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, MAX_PROFILE_NAME);
}


function getProfile() {

    return currentProfile ? profiles[currentProfile] : null;
}


function createProfile(rawName) {

    const name = sanitizeProfileName(rawName);

    if (!name) {
        return null;
    }

    if (!profiles[name]) {
        profiles[name] = newProfileData(name);
    }

    currentProfile = name;

    saveProfiles();

    return name;
}


function selectProfile(name) {

    if (!profiles[name]) {
        return;
    }

    currentProfile = name;

    saveProfiles();

    menuView = "main";

    renderMenu();
}


function deleteProfile(name) {

    if (!profiles[name]) {
        return;
    }

    if (!confirm("Delete profile " + name + " and all its progress?")) {
        return;
    }

    delete profiles[name];

    if (currentProfile === name) {
        currentProfile = null;
    }

    saveProfiles();

    renderMenu();
}


function noteCycleReached() {

    const profile = getProfile();

    if (!profile) {
        return;
    }

    profile.stats.bestCycle = Math.max(profile.stats.bestCycle, cycle);
}


function saveRun() {

    const profile = getProfile();

    if (!profile || runOver) {
        return;
    }

    profile.run = {
        cycle: cycle,
        between: betweenEncounters,
        workshop: workshopPending || workshopOpen,
        free: freePicks,
        cogs: cogs,
        hull: hull,
        defeated: defeatedEnemies,
        echoes: equippedEchoes.map(function (echo) {
            return echo.name;
        }),
        savedAt: Date.now()
    };

    saveProfiles();
}


function onEnemyDefeated() {

    const profile = getProfile();

    if (profile) {
        profile.stats.kills++;
        profile.stats.cogsEarned += lootReward;
    }

    const lootMessage = getElement("lootMessage");

    if (lootMessage && enemy) {

        lootMessage.textContent =
            enemy.type === "BOSS"
                ? "A BOSS HAS FALLEN. A FREE ECHO AWAITS IN THE WORKSHOP."
                : enemy.type === "ELITE"
                    ? "AN ELITE MACHINE HAS BEEN SILENCED. EXTRA LOOT."
                    : "THE MACHINE HAS BEEN SILENCED.";
    }

    betweenEncounters = true;

    saveRun();

    flashScreen("gold");
    vibrate([40, 40, 40, 40, 160]);
}


function finishRunStats() {

    const profile = getProfile();

    let record = false;
    let best = cycle;

    if (profile) {

        profile.stats.deaths++;

        record = cycle > runStartBest;

        profile.stats.bestCycle = Math.max(profile.stats.bestCycle, cycle);

        best = profile.stats.bestCycle;

        profile.run = null;

        saveProfiles();
    }

    const finalBest = getElement("finalBest");

    if (finalBest) {
        finalBest.textContent = best;
    }

    const recordElement = getElement("newRecord");

    if (recordElement) {
        recordElement.textContent = record ? "NEW RECORD" : "";
    }

    flashScreen("red");
    vibrate([300, 120, 300]);
}


function hideMenuAndModals() {

    getElement("startOverlay").style.display = "none";

    getElement("gameOverModal").classList.add("hidden");
    getElement("lootModal").classList.add("hidden");
    getElement("workshopModal").classList.add("hidden");
}


function continueRun() {

    const profile = getProfile();

    if (!profile || !profile.run) {
        return;
    }

    const saved = profile.run;

    resetState();

    cycle = Math.max(1, Math.floor(Number(saved.cycle)) || 1);
    cogs = Math.max(0, Math.floor(Number(saved.cogs)) || 0);
    defeatedEnemies = Math.max(0, Math.floor(Number(saved.defeated)) || 0);

    equippedEchoes = (Array.isArray(saved.echoes) ? saved.echoes : [])
        .map(function (name) {
            return ECHOES.find(function (echo) {
                return echo.name === name;
            });
        })
        .filter(Boolean)
        .slice(0, 3);

    recalculateMaxHull();

    hull = Math.max(
        1,
        Math.min(maxHull, Math.floor(Number(saved.hull)) || maxHull)
    );

    runStartBest = profile.stats.bestCycle;

    hideMenuAndModals();

    startMusic();

    logMessage("RUN RESTORED. CYCLE " + cycle + ".");

    betweenEncounters = !!saved.between;
    freePicks = Math.max(0, Math.floor(Number(saved.free)) || 0);

    if (saved.between) {

        if (saved.workshop) {
            openWorkshop();
        }
        else {
            continueToNextEncounter();
        }
    }
    else {
        newEncounter();
    }

    render();
}


/* =========================
   MENU (profile screen)
   ========================= */

function makeElement(tag, className, text) {

    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}


function makeButton(label, className, handler) {

    const button = makeElement("button", className, label);

    button.addEventListener("click", handler);

    return button;
}


function submitProfile() {

    const input = getElement("profileName");

    const name = createProfile(input ? input.value : "");

    if (!name) {

        const message = getElement("menuMessage");

        if (message) {
            message.textContent = "ENTER A NAME (LETTERS OR NUMBERS)";
        }

        return;
    }

    menuView = "main";

    renderMenu();
}


function renderMenu() {

    const root = getElement("menuProfile");

    if (!root) {
        return;
    }

    root.innerHTML = "";

    const profile = getProfile();

    if (!profile || menuView === "profiles") {
        renderProfilePicker(root);
        return;
    }

    root.appendChild(makeElement("div", "profile-greeting", "ENGINEER"));
    root.appendChild(makeElement("div", "profile-name", profile.name));

    const stats = makeElement("div", "profile-stats");

    [
        ["BEST CYCLE", profile.stats.bestCycle],
        ["RUNS", profile.stats.runs],
        ["DESTROYED", profile.stats.kills]
    ].forEach(function (entry) {

        const box = makeElement("div");

        box.appendChild(makeElement("span", "", entry[0]));
        box.appendChild(makeElement("strong", "", String(entry[1])));

        stats.appendChild(box);
    });

    root.appendChild(stats);

    if (profile.run) {

        root.appendChild(
            makeButton(
                "CONTINUE RUN - CYCLE " + profile.run.cycle,
                "main-button",
                continueRun
            )
        );
    }

    root.appendChild(
        makeButton(
            "DESCEND INTO THE ABYSS",
            profile.run ? "secondary-button" : "main-button",
            startNewRun
        )
    );

    root.appendChild(
        makeButton("HOW TO PLAY", "secondary-button", openHelp)
    );

    root.appendChild(
        makeButton(
            "SWITCH PROFILE",
            "secondary-button",
            function () {
                menuView = "profiles";
                renderMenu();
            }
        )
    );
}


function renderProfilePicker(root) {

    root.appendChild(
        makeElement(
            "div",
            "profile-greeting",
            Object.keys(profiles).length ? "SELECT OR CREATE A PROFILE" : "IDENTIFY YOURSELF"
        )
    );

    const list = makeElement("div", "profile-list");

    Object.keys(profiles).forEach(function (name) {

        const row = makeElement("div", "profile-row");

        const pick = makeElement("button", "profile-pick", name);

        pick.appendChild(
            makeElement(
                "small",
                "",
                "BEST CYCLE " + profiles[name].stats.bestCycle
            )
        );

        pick.addEventListener("click", function () {
            selectProfile(name);
        });

        const remove = makeButton("✕", "profile-delete", function () {
            deleteProfile(name);
        });

        remove.setAttribute("aria-label", "Delete profile " + name);

        row.appendChild(pick);
        row.appendChild(remove);

        list.appendChild(row);
    });

    root.appendChild(list);

    const input = makeElement("input", "profile-input");

    input.id = "profileName";
    input.type = "text";
    input.maxLength = MAX_PROFILE_NAME;
    input.placeholder = "ENGINEER NAME";
    input.setAttribute("autocomplete", "off");

    input.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            submitProfile();
        }
    });

    root.appendChild(input);

    const message = makeElement("div", "menu-message");

    message.id = "menuMessage";

    root.appendChild(message);

    root.appendChild(
        makeButton("CREATE PROFILE", "main-button", submitProfile)
    );

    if (getProfile()) {

        root.appendChild(
            makeButton(
                "BACK",
                "secondary-button",
                function () {
                    menuView = "main";
                    renderMenu();
                }
            )
        );
    }
}


function registerServiceWorker() {

    if (
        typeof navigator !== "undefined" &&
        "serviceWorker" in navigator &&
        location.protocol.indexOf("http") === 0
    ) {
        navigator.serviceWorker.register("./sw.js").catch(function () {
            /* offline support is optional */
        });
    }
}


/* =========================
   UI EXTRAS
   icons, portraits, gauge, tooltips, help, pause menu, shortcuts
   ========================= */

function escapeHtml(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}


function buildGearIcon() {

    const teeth = 8;

    let d = "";

    for (let i = 0; i < teeth; i++) {

        const base = (i * 360) / teeth;

        [[-13, 7.4], [-8, 10.6], [8, 10.6], [13, 7.4]].forEach(
            function (point, index) {

                const angle = (base + point[0]) * Math.PI / 180;

                const x = 12 + point[1] * Math.sin(angle);
                const y = 12 - point[1] * Math.cos(angle);

                d += (i === 0 && index === 0 ? "M" : "L") +
                    x.toFixed(2) + " " + y.toFixed(2);
            }
        );
    }

    d += "Z M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z";

    return "<path fill-rule=\"evenodd\" d=\"" + d + "\"/>";
}


const ICON_SHAPES = {

    gear: buildGearIcon(),

    heart: "<path d=\"M12 21s-7.5-4.6-9.5-9.2C1.2 8.5 3 5 6.5 5c2 0 3.6 1.1 5.5 3 1.9-1.9 3.5-3 5.5-3 3.5 0 5.3 3.5 4 6.8C19.5 16.4 12 21 12 21z\"/>",

    clock: "<path fill-rule=\"evenodd\" d=\"M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20zm0 2.2a7.8 7.8 0 1 1 0 15.6a7.8 7.8 0 0 1 0-15.6zM11 7v5.4l4 2.3l1-1.7l-3-1.7V7z\"/>",

    valve: "<path fill-rule=\"evenodd\" d=\"M10.5 2h3v3.2h4v2h-11v-2h4zM12 8.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 0 0 0-13zm0 2.4a4.1 4.1 0 1 1 0 8.2a4.1 4.1 0 0 1 0-8.2z\"/>",

    bolt: "<path d=\"M13.5 2L4.5 13.5h6L9.5 22l10-12.5h-6.5z\"/>",

    shield: "<path fill-rule=\"evenodd\" d=\"M12 2l8.5 3v6.2c0 5-3.6 8.9-8.5 10.8c-4.9-1.9-8.5-5.800-8.5-10.800V5zM12 4.3L5.7 6.5v4.7c0 3.8 2.6 6.9 6.3 8.6z\"/>",

    eye: "<path fill-rule=\"evenodd\" d=\"M12 5C6.5 5 2.7 9.6 1.5 12c1.2 2.4 5 7 10.5 7s9.3-4.6 10.5-7C21.300 9.600 17.500 5 12 5zm0 2.200a4.800 4.800 0 1 1 0 9.600a4.800 4.800 0 0 1 0-9.600zm0 2.400a2.400 2.400 0 1 0 0 4.800a2.400 2.400 0 0 0 0-4.800z\"/>",

    hammer: "<g transform=\"rotate(45 12 12)\"><rect x=\"3\" y=\"3.5\" width=\"18\" height=\"6\" rx=\"1.2\"/><rect x=\"10.2\" y=\"9\" width=\"3.6\" height=\"13\" rx=\"1\"/></g>",

    coin: "<path fill-rule=\"evenodd\" d=\"M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20zm0 3a7 7 0 1 1 0 14a7 7 0 0 1 0-14z\"/><circle cx=\"12\" cy=\"12\" r=\"3.2\"/>",

    flame: "<path d=\"M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 1.500-4.500 2.800-6C10 6.500 11.500 5 12 2z\"/>",

    drop: "<path d=\"M12 2.500S5 10 5 15a7 7 0 0 0 14 0c0-5-7-12.500-7-12.500z\"/>",

    star: "<path d=\"M12 2l2.400 7.600L22 12l-7.600 2.400L12 22l-2.400-7.600L2 12l7.600-2.400z\"/>"
};


const ECHO_ICON_KEYS = {
    "CLOCKMAKER": "clock", "BRASS HEART": "heart", "PRESSURE VALVE": "valve",
    "STEAM CORE": "gear", "BROKEN GEAR": "gear", "AUTOMATON": "gear",
    "BRASS LUNG": "drop", "OLD SPRING": "clock", "PERFECT GEAR": "gear",
    "HIGH PRESSURE PISTON": "bolt", "COOLING COIL": "drop", "STEAM VALVE": "valve",
    "CHRONO CORE": "clock", "RUSTED HEART": "heart", "BRASS EYE": "eye",
    "OVERDRIVE": "bolt", "COUNTERWEIGHT": "shield", "TIME SPRING": "clock",
    "BLACK GEAR": "gear", "PRESSURE CHAMBER": "valve", "MECHANICAL HEART": "heart",
    "LOST ESCAPEMENT": "clock", "GOLDEN PISTON": "bolt", "CORVALI LENS": "eye",
    "AEON GEAR": "clock", "INFINITE SPRING": "clock", "VOID VALVE": "valve",
    "MASTER CLOCK": "clock", "THE FIRST GEAR": "gear", "CORVALI ECHO": "star",
    "SPARE PARTS": "coin", "SALVAGE ENGINE": "gear", "STEAM BROKER": "coin",
    "IRON LUNG": "drop", "GLASS PISTON": "bolt", "TICKING BOMB": "flame",
    "BRASS PERISCOPE": "eye", "LAST STAND": "flame", "DOUBLE CRANK": "gear",
    "AEGIS GEAR": "shield", "TITAN HAMMER": "hammer", "STEEL NERVES": "shield"
};


function echoIcon(name) {

    const key = ECHO_ICON_KEYS[name] || "gear";

    return "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">" +
        ICON_SHAPES[key] + "</svg>";
}


/* ---------- enemy portraits ---------- */

const ABILITY_EYES = {
    NONE: "#f2c14e", PRESSURE: "#6fd3ff", HEAT: "#ff7a2f",
    FORTRESS: "#9fb4c7", BUST: "#e04a3f", TIME: "#7ee0a1",
    "HEAVY ARMOR": "#c8c8c8", OVERHEAT: "#ff4d2d", REPAIR: "#66e08a",
    OVERCLOCK: "#ff3b30"
};

const ABILITY_INFO = {
    NONE: "A plain machine with no special ability.",
    PRESSURE: "Each time it hits you, your Pressure rises by 5.",
    HEAT: "Each time it hits you, your Pressure rises by 8."
};

let lastPortraitKey = "";


function enemyPortraitSVG(type, ability) {

    const eye = ABILITY_EYES[ability] || "#f2c14e";

    const defs =
        "<defs><linearGradient id=\"pg\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">" +
        "<stop offset=\"0\" stop-color=\"#c9973f\"/>" +
        "<stop offset=\"1\" stop-color=\"#5a3d18\"/>" +
        "</linearGradient></defs>";

    if (type === "BOSS") {

        return "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\">" + defs +
            "<rect x=\"28\" y=\"6\" width=\"10\" height=\"24\" fill=\"#2a1a0a\"/>" +
            "<rect x=\"26\" y=\"4\" width=\"14\" height=\"5\" fill=\"#6f4f1e\"/>" +
            "<path d=\"M16 42L26 18l13 16 11-24 11 24 13-16 10 24z\" fill=\"#c9973f\" stroke=\"#1a0f06\" stroke-width=\"3\" stroke-linejoin=\"round\"/>" +
            "<rect x=\"12\" y=\"40\" width=\"76\" height=\"50\" rx=\"10\" fill=\"url(#pg)\" stroke=\"#1a0f06\" stroke-width=\"3\"/>" +
            "<circle cx=\"50\" cy=\"64\" r=\"16\" fill=\"#0e0805\" stroke=\"#1a0f06\" stroke-width=\"3\"/>" +
            "<circle class=\"eye\" cx=\"50\" cy=\"64\" r=\"12\" fill=\"" + eye + "\"/>" +
            "<circle cx=\"50\" cy=\"64\" r=\"5\" fill=\"#000\"/>" +
            "<circle cx=\"24\" cy=\"54\" r=\"3.5\" fill=\"#efc872\"/><circle cx=\"76\" cy=\"54\" r=\"3.5\" fill=\"#efc872\"/>" +
            "<circle cx=\"24\" cy=\"78\" r=\"3.5\" fill=\"#efc872\"/><circle cx=\"76\" cy=\"78\" r=\"3.5\" fill=\"#efc872\"/>" +
            "</svg>";
    }

    if (type === "ELITE") {

        return "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\">" + defs +
            "<path d=\"M18 36L8 22M82 36l10-14\" stroke=\"#efc872\" stroke-width=\"3\" stroke-linecap=\"round\"/>" +
            "<circle cx=\"8\" cy=\"22\" r=\"3.5\" fill=\"#efc872\"/><circle cx=\"92\" cy=\"22\" r=\"3.5\" fill=\"#efc872\"/>" +
            "<polygon points=\"50,10 83,29 83,69 50,90 17,69 17,29\" fill=\"url(#pg)\" stroke=\"#1a0f06\" stroke-width=\"3\"/>" +
            "<polygon points=\"50,19 75,33 75,65 50,80 25,65 25,33\" fill=\"none\" stroke=\"#efc872\" stroke-width=\"1.5\"/>" +
            "<rect x=\"28\" y=\"40\" width=\"44\" height=\"16\" rx=\"4\" fill=\"#0e0805\"/>" +
            "<circle class=\"eye\" cx=\"38\" cy=\"48\" r=\"5\" fill=\"" + eye + "\"/>" +
            "<circle class=\"eye\" cx=\"62\" cy=\"48\" r=\"5\" fill=\"" + eye + "\"/>" +
            "<circle class=\"eye\" cx=\"50\" cy=\"48\" r=\"3\" fill=\"" + eye + "\"/>" +
            "<path d=\"M38 68h24M42 73h16\" stroke=\"#1a0f06\" stroke-width=\"3\" stroke-linecap=\"round\"/>" +
            "</svg>";
    }

    return "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\">" + defs +
        "<line x1=\"50\" y1=\"14\" x2=\"50\" y2=\"26\" stroke=\"#2a1a0a\" stroke-width=\"3\"/>" +
        "<circle class=\"eye\" cx=\"50\" cy=\"12\" r=\"4\" fill=\"" + eye + "\"/>" +
        "<circle cx=\"50\" cy=\"54\" r=\"32\" fill=\"url(#pg)\" stroke=\"#1a0f06\" stroke-width=\"3\"/>" +
        "<circle cx=\"50\" cy=\"54\" r=\"26\" fill=\"none\" stroke=\"#efc872\" stroke-width=\"1\" stroke-dasharray=\"2 4\" opacity=\".6\"/>" +
        "<rect x=\"26\" y=\"42\" width=\"48\" height=\"20\" rx=\"10\" fill=\"#0e0805\" stroke=\"#1a0f06\" stroke-width=\"2\"/>" +
        "<circle class=\"eye\" cx=\"39\" cy=\"52\" r=\"6\" fill=\"" + eye + "\"/>" +
        "<circle class=\"eye\" cx=\"61\" cy=\"52\" r=\"6\" fill=\"" + eye + "\"/>" +
        "<circle cx=\"39\" cy=\"52\" r=\"2.2\" fill=\"#000\"/><circle cx=\"61\" cy=\"52\" r=\"2.2\" fill=\"#000\"/>" +
        "<rect x=\"38\" y=\"70\" width=\"24\" height=\"7\" rx=\"2\" fill=\"#1a0f06\"/>" +
        "<path d=\"M44 70v7M50 70v7M56 70v7\" stroke=\"#6f4f1e\" stroke-width=\"1.5\"/>" +
        "<circle cx=\"21\" cy=\"54\" r=\"4\" fill=\"#7a5a22\"/><circle cx=\"79\" cy=\"54\" r=\"4\" fill=\"#7a5a22\"/>" +
        "</svg>";
}


function renderExtras() {

    /* pressure gauge */
    const limit = hasEcho("PRESSURE CHAMBER") ? 120 : 100;

    const fraction = Math.max(0, Math.min(1, pressure / limit));

    const needle = getElement("gaugeNeedle");

    if (needle) {
        needle.style.transform =
            "rotate(" + (-90 + 180 * fraction) + "deg)";
    }

    const gauge = getElement("gauge");

    if (gauge) {
        gauge.classList.toggle("danger", fraction >= 0.8);
    }

    /* enemy portrait + ability tooltip */
    if (enemy) {

        const key = enemy.name + "|" + enemy.type;

        const portrait = getElement("enemyPortrait");

        if (portrait && key !== lastPortraitKey) {

            portrait.innerHTML =
                enemyPortraitSVG(enemy.type, enemy.ability);

            lastPortraitKey = key;
        }

        const box = getElement("enemyAbilityBox");

        if (box) {

            box.setAttribute(
                "data-tip",
                enemy.ability + "|" +
                (ABILITY_INFO[enemy.ability] ||
                    "A special trait of this machine. Its effect is still being calibrated.")
            );
        }
    }

    /* damage preview */
    const win = getElement("previewWin");
    const lose = getElement("previewLose");

    if (win && lose) {

        if (!enemy || !combatStarted || hand.length === 0) {

            win.textContent = "";
            lose.textContent = "";
        }
        else if (bust) {

            win.textContent = "BUST";
            lose.textContent = "YOU TAKE " + calcEnemyDamage();
        }
        else {

            win.textContent = "IF YOU WIN: " + calcPlayerDamage() + " DMG";

            lose.textContent =
                hasEcho("AEGIS GEAR") && !aegisUsed
                    ? "IF YOU LOSE: BLOCKED"
                    : "IF YOU LOSE: " + calcEnemyDamage() + " DMG";
        }
    }

    /* workshop cogs */
    const workshopCogs = getElement("workshopCogs");

    if (workshopCogs) {
        workshopCogs.textContent = cogs;
    }
}


/* ---------- tooltips ---------- */

let tipTarget = null;
let tipTimer = null;


function buildTip(target) {

    const echoName = target.getAttribute("data-echo");

    if (echoName) {

        const echo = getEcho(echoName);

        if (!echo) {
            return "";
        }

        return "<b>" + echo.name + "</b>" +
            "<div class=\"tip-rarity rarity-" + echo.rarity.toLowerCase() + "\">" +
            echo.rarity + "</div>" +
            "<div>" + echo.description + "</div>";
    }

    const raw = target.getAttribute("data-tip");

    if (!raw) {
        return "";
    }

    const parts = raw.split("|");

    return parts.length > 1
        ? "<b>" + escapeHtml(parts[0]) + "</b>" + escapeHtml(parts.slice(1).join("|"))
        : escapeHtml(raw);
}


function positionTip(target) {

    const tooltip = getElement("tooltip");

    const box = target.getBoundingClientRect();
    const tip = tooltip.getBoundingClientRect();

    let x = box.left + box.width / 2 - tip.width / 2;

    x = Math.max(8, Math.min(window.innerWidth - tip.width - 8, x));

    let y = box.top - tip.height - 10;

    if (y < 8) {
        y = box.bottom + 10;
    }

    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
}


function showTip(target) {

    const html = buildTip(target);

    if (!html) {
        return;
    }

    const tooltip = getElement("tooltip");

    tooltip.innerHTML = html;

    tooltip.classList.add("visible");

    positionTip(target);

    tipTarget = target;
}


function hideTip() {

    const tooltip = getElement("tooltip");

    if (tooltip) {
        tooltip.classList.remove("visible");
    }

    tipTarget = null;

    clearTimeout(tipTimer);
}


function initTooltips() {

    const selector = "[data-echo], [data-tip]";

    const touchMode =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(hover: none)").matches;

    if (touchMode) {

        document.addEventListener("click", function (event) {

            const target = event.target.closest(selector);

            if (!target || target.closest("button")) {
                hideTip();
                return;
            }

            if (target === tipTarget) {
                hideTip();
                return;
            }

            showTip(target);

            clearTimeout(tipTimer);

            tipTimer = setTimeout(hideTip, 4500);
        });

        return;
    }

    document.addEventListener("mouseover", function (event) {

        const target = event.target.closest(selector);

        if (target && target !== tipTarget) {
            showTip(target);
        }
    });

    document.addEventListener("mouseout", function (event) {

        if (tipTarget && !tipTarget.contains(event.relatedTarget)) {
            hideTip();
        }
    });

    document.addEventListener("focusin", function (event) {

        const target = event.target.closest(selector);

        if (target) {
            showTip(target);
        }
    });

    document.addEventListener("focusout", hideTip);

    document.addEventListener("click", function (event) {

        if (event.target.closest("button")) {
            hideTip();
        }
    });

    window.addEventListener("scroll", hideTip, true);
}


/* ---------- help + codex ---------- */

const HELP_TABS = ["BASICS", "STATS", "ENEMIES", "ECHOES"];

let helpTab = "BASICS";
let codexFilter = "ALL";


function helpHtml(tab) {

    if (tab === "BASICS") {

        return "<h3>THE DUEL</h3>" +
            "<p>Every cycle is a Blackjack duel against a machine. You and the enemy each get two cards, and one of the enemy's cards stays hidden.</p>" +
            "<h3>YOUR TURN</h3>" +
            "<p><b>HIT</b> draws a card. <b>STAND</b> keeps your hand: the enemy reveals its card and draws until it reaches 17. <b>DOUBLE</b> (first two cards only) draws one card and stands, doubling the damage dealt and taken. <b>VENT</b> releases Pressure for free.</p>" +
            "<h3>WINNING A ROUND</h3>" +
            "<p>The higher total (21 max) wins. <b>If you win, you hit the enemy. If you lose or bust, the enemy hits you.</b> A tie is a push: nobody takes damage. A natural Blackjack (Ace + a 10-value card) beats any other hand.</p>" +
            "<h3>THE RUN</h3>" +
            "<p>Destroy machines to earn Cogs. Every 3rd kill opens the Workshop, where you can buy Echoes (3 equipped at most). Bosses always open it and give you one Echo for free. If your Hull reaches 0 the run ends; your best cycle is saved on your profile.</p>" +
            "<h3>KEYBOARD SHORTCUTS</h3>" +
            "<p><kbd>H</kbd> Hit &nbsp; <kbd>S</kbd> Stand &nbsp; <kbd>D</kbd> Double &nbsp; <kbd>V</kbd> Vent &nbsp; <kbd>M</kbd> Music &nbsp; <kbd>?</kbd> Help &nbsp; <kbd>Esc</kbd> Menu</p>" +
            "<h3>TIP</h3>" +
            "<p>Hover (or tap) stats, enemy values, buttons and Echoes to see what they do. The two chips above your cards show the damage you would deal or take right now.</p>";
    }

    if (tab === "STATS") {

        return "<h3>HULL</h3><p>Your health. At 0 the run is over. Destroying enemies repairs some Hull, and so do certain Echoes.</p>" +
            "<h3>PRESSURE</h3><p>HIT adds 5, DOUBLE adds 10, a bust adds 20. Above the limit (100, or 120 with Pressure Chamber) the engine overheats: you lose Hull and Pressure resets. VENT releases 30.</p>" +
            "<h3>BASE TORQUE &amp; CLOCK POWER</h3>" +
            "<p>Base Torque is your hand value plus Echo bonuses. Clock Power is a multiplier that grows with strong hands:</p>" +
            "<table class=\"help-table\"><tr><th>HAND</th><th>CLOCK POWER</th></tr>" +
            "<tr><td>17 or less</td><td>+0</td></tr><tr><td>18</td><td>+3</td></tr><tr><td>19</td><td>+5</td></tr><tr><td>20</td><td>+8</td></tr><tr><td>21</td><td>+12</td></tr>" +
            "<tr><td>Natural Blackjack</td><td>25 Torque, +15 Clock Power</td></tr></table>" +
            "<h3>DAMAGE</h3>" +
            "<span class=\"formula\">damage = Torque x (1 + Clock Power / 10) - enemy Armor</span>" +
            "<p>Minimum 1 damage. DOUBLE doubles it, in both directions.</p>";
    }

    if (tab === "ENEMIES") {

        const rows = ["COMMON", "ELITE", "BOSS"].map(function (key) {

            const type = ENEMY_TYPES[key];

            return "<tr><td><b>" + key + "</b></td><td>" + type.attack +
                "</td><td>" + type.armor + "</td><td>" + type.hull +
                "</td><td>x" + type.loot + "</td><td>+" + type.repair + "</td></tr>";
        }).join("");

        return "<h3>THREE KINDS OF MACHINES</h3>" +
            "<p>Most fights are against common machines. Every 5th enemy is an <b>Elite</b> and every 10th is a <b>Boss</b>.</p>" +
            "<table class=\"help-table\"><tr><th>TYPE</th><th>ATTACK</th><th>ARMOR</th><th>HULL</th><th>LOOT</th><th>REPAIR</th></tr>" +
            rows + "</table>" +
            "<p>Values shown are for Tier I. Every 10 cycles a new tier begins: enemies gain +2 Attack, +1 Armor and 25% more Hull.</p>" +
            "<h3>BOSS REWARD</h3>" +
            "<p>A fallen Boss opens the Workshop and lets you take one Echo (Forged or better) for free.</p>";
    }

    return "<h3>RARITY</h3>" +
        "<p><b>WORN</b> 10 cogs, <b>FORGED</b> 18, <b>ENGINEERED</b> 28, <b>RELIC</b> 45. You can equip three at a time and swap them in the Workshop.</p>";
}


function renderHelp() {

    const tabs = getElement("helpTabs");
    const content = getElement("helpContent");

    if (!tabs || !content) {
        return;
    }

    tabs.innerHTML = "";

    HELP_TABS.forEach(function (name) {

        const button = makeElement(
            "button",
            "tab" + (name === helpTab ? " active" : ""),
            name
        );

        button.addEventListener("click", function () {
            helpTab = name;
            renderHelp();
        });

        tabs.appendChild(button);
    });

    content.innerHTML = helpHtml(helpTab);

    if (helpTab === "ECHOES") {
        renderCodex(content);
    }
}


function renderCodex(content) {

    const filters = makeElement("div", "filters");

    ["ALL", "WORN", "FORGED", "ENGINEERED", "RELIC"].forEach(function (name) {

        const button = makeElement(
            "button",
            "tab" + (name === codexFilter ? " active" : ""),
            name
        );

        button.addEventListener("click", function () {
            codexFilter = name;
            renderHelp();
        });

        filters.appendChild(button);
    });

    content.appendChild(filters);

    const grid = makeElement("div", "codex-grid");

    ECHOES.filter(function (echo) {
        return codexFilter === "ALL" || echo.rarity === codexFilter;
    }).forEach(function (echo) {

        const item = makeElement(
            "div",
            "codex-item rarity-" + echo.rarity.toLowerCase() +
            (hasEcho(echo.name) ? " equipped" : "")
        );

        item.innerHTML =
            "<div class=\"echo-icon\">" + echoIcon(echo.name) + "</div>" +
            "<div><strong>" + echo.name + "</strong>" +
            "<small>" + echo.rarity + " - " + getPrice(echo) + " COGS" +
            (hasEcho(echo.name) ? " - EQUIPPED" : "") + "</small>" +
            "<p>" + echo.description + "</p></div>";

        grid.appendChild(item);
    });

    content.appendChild(grid);
}


function openHelp() {

    hideTip();

    getElement("helpModal").classList.remove("hidden");

    renderHelp();
}


function closeHelp(event) {

    if (event && event.target !== event.currentTarget) {
        return;
    }

    getElement("helpModal").classList.add("hidden");
}


/* ---------- pause menu + settings ---------- */

const MOTION_KEY = "corvaliMotion";
const VOLUME_KEY = "corvaliVolume";

let motionReduced = false;


function menuIsVisible() {

    return getElement("startOverlay").style.display !== "none";
}


function anyModalOpen() {

    return ["lootModal", "workshopModal", "gameOverModal", "pauseModal", "helpModal"]
        .some(function (id) {
            return !getElement(id).classList.contains("hidden");
        });
}


function openPause() {

    if (menuIsVisible()) {
        return;
    }

    hideTip();

    getElement("pauseModal").classList.remove("hidden");
}


function closePause() {

    getElement("pauseModal").classList.add("hidden");
}


function closeAllOverlays() {

    closePause();
    closeHelp();
    hideTip();
}


function exitToMenu() {

    returnToMenu();
}


function applyMotion() {

    if (document.body) {
        document.body.classList.toggle("reduce-motion", motionReduced);
    }

    const button = getElement("motionButton");

    if (button) {

        button.textContent = motionReduced ? "ON" : "OFF";
        button.classList.toggle("off", !motionReduced);
        button.setAttribute("aria-pressed", motionReduced ? "true" : "false");
    }
}


function toggleMotion() {

    motionReduced = !motionReduced;

    try {
        localStorage.setItem(MOTION_KEY, motionReduced ? "on" : "off");
    }
    catch (error) {
        /* ignore */
    }

    applyMotion();
}


function loadSettings() {

    let stored = null;

    try {
        stored = localStorage.getItem(MOTION_KEY);
    }
    catch (error) {
        stored = null;
    }

    if (stored === null) {

        motionReduced =
            typeof window !== "undefined" &&
            !!window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    else {
        motionReduced = stored === "on";
    }

    try {

        const volume = parseFloat(localStorage.getItem(VOLUME_KEY));

        if (Number.isFinite(volume)) {
            musicVolume = Math.max(0, Math.min(1, volume));
        }
    }
    catch (error) {
        /* ignore */
    }

    applyMotion();

    const slider = getElement("volumeSlider");

    if (slider) {

        slider.value = Math.round(musicVolume * 100);

        slider.addEventListener("input", function () {

            musicVolume = slider.value / 100;

            try {
                localStorage.setItem(VOLUME_KEY, String(musicVolume));
            }
            catch (error) {
                /* ignore */
            }

            if (music) {
                clearInterval(musicFadeTimer);
                music.volume = musicVolume;
            }
        });
    }
}


/* ---------- keyboard ---------- */

function initKeyboard() {

    document.addEventListener("keydown", function (event) {

        const tag = event.target && event.target.tagName;

        if (tag === "INPUT" || tag === "TEXTAREA") {
            return;
        }

        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }

        const key = event.key;

        if (key === "Escape") {

            if (!getElement("helpModal").classList.contains("hidden")) {
                closeHelp();
            }
            else if (!getElement("pauseModal").classList.contains("hidden")) {
                closePause();
            }
            else if (!menuIsVisible() && !anyModalOpen()) {
                openPause();
            }

            return;
        }

        if (key === "?") {

            if (getElement("helpModal").classList.contains("hidden")) {
                openHelp();
            }
            else {
                closeHelp();
            }

            return;
        }

        if (menuIsVisible() || anyModalOpen()) {
            return;
        }

        const lower = key.toLowerCase();

        if (lower === "h") { hit(); }
        else if (lower === "s") { stand(); }
        else if (lower === "d") { doubleDown(); }
        else if (lower === "v") { vent(); }
        else if (lower === "m") { toggleMusic(); }
    });
}


/* ---------- log toggle ---------- */

function initLogToggle() {

    const toggle = getElement("logToggle");
    const panel = getElement("logPanel");

    if (!toggle || !panel) {
        return;
    }

    function setCollapsed(collapsed) {

        panel.classList.toggle("collapsed", collapsed);

        toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }

    toggle.addEventListener("click", function () {
        setCollapsed(!panel.classList.contains("collapsed"));
    });

    toggle.addEventListener("keydown", function (event) {

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setCollapsed(!panel.classList.contains("collapsed"));
        }
    });

    if (typeof window !== "undefined" && window.innerWidth <= 700) {
        setCollapsed(true);
    }
}


/* ---------- background steam ---------- */

function initSteam() {

    const canvas = getElement("steam");

    if (!canvas || !canvas.getContext || typeof window === "undefined") {
        return;
    }

    const context = canvas.getContext("2d");

    let width = 0;
    let height = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function puff(initial) {

        return {
            x: Math.random() * width,
            y: initial ? Math.random() * height : height + 100,
            r: 70 + Math.random() * 130,
            vy: 0.12 + Math.random() * 0.3,
            vx: (Math.random() - 0.5) * 0.18,
            a: 0.03 + Math.random() * 0.04
        };
    }

    resize();

    window.addEventListener("resize", resize);

    const puffs = [];

    for (let i = 0; i < 20; i++) {
        puffs.push(puff(true));
    }

    let last = 0;

    function frame(time) {

        requestAnimationFrame(frame);

        if (document.hidden || time - last < 45) {
            return;
        }

        last = time;

        context.clearRect(0, 0, width, height);

        if (motionReduced) {
            return;
        }

        puffs.forEach(function (p, index) {

            p.y -= p.vy * 2.2;
            p.x += p.vx;

            if (p.y < -p.r) {
                puffs[index] = puff(false);
                return;
            }

            const gradient = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);

            gradient.addColorStop(0, "rgba(255,236,200," + p.a + ")");
            gradient.addColorStop(1, "rgba(255,236,200,0)");

            context.fillStyle = gradient;

            context.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        });
    }

    requestAnimationFrame(frame);
}


function initUI() {

    loadSettings();

    initTooltips();
    initKeyboard();
    initLogToggle();
    initSteam();
}


/* =========================
   INITIALIZATION
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadMusicPreference();
        updateMusicButton();

        loadVibrationPreference();
        updateVibrationButton();

        loadProfiles();
        renderMenu();

        initUI();

        registerServiceWorker();

        render();

        logMessage(
            "CORVALI ENGINE READY."
        );
    }
);