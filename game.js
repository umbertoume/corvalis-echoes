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

    logMessage(
        "SYSTEM: " +
        enemy.ability +
        "."
    );

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

    const red =
        card.suit === "HEARTS" ||
        card.suit === "DIAMONDS";

    element.className = red ? "card red" : "card";

    element.innerHTML =
        "<span>" + card.rank + "</span>" +
        "<small>" + symbols[card.suit] + "</small>";

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


function playerHitsEnemy() {

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

    let damage = enemy.attack;

    if (hasEcho("COUNTERWEIGHT")) {
        damage -= 2;
    }

    if (hasEcho("GLASS PISTON")) {
        damage += 3;
    }

    if (enemy.ability === "PRESSURE") {
        pressure += 5;
    }

    if (enemy.ability === "HEAT") {
        pressure += 8;
    }

    if (doubled && !hasEcho("DOUBLE CRANK")) {
        damage *= 2;
    }

    damage = Math.max(1, damage);

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

    const container =
        getElement("shopItems");

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

        const price =
            freePicks > 0 ? 0 : getPrice(echo);

        const item =
            document.createElement("div");

        item.className =
            "shop-item";

        item.innerHTML =
            "<div class=\"shop-item-name\">" +
            echo.name +
            "</div>" +

            "<div class=\"shop-item-rarity\">" +
            echo.rarity +
            "</div>" +

            "<div class=\"shop-item-description\">" +
            echo.description +
            "</div>" +

            "<button class=\"small-button\">" +
            (
                price === 0
                    ? "TAKE - FREE"
                    : (equippedEchoes.length >= 3 ? "REPLACE - " : "BUY - ") +
                      price + " COGS"
            ) +
            "</button>";

        const button =
            item.querySelector("button");

        button.addEventListener(
            "click",
            function () {
                buyEcho(
                    echo.name,
                    price
                );
            }
        );

        container.appendChild(item);
    }

    if (available.length === 0) {

        container.innerHTML =
            "<div class=\"shop-item\">" +
            "<div class=\"shop-item-name\">" +
            "NO ECHOES AVAILABLE" +
            "</div>" +
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

    const container =
        getElement(
            "equippedEchoes"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    for (let i = 0; i < 3; i++) {

        const slot =
            document.createElement("div");

        if (equippedEchoes[i]) {

            const echo =
                equippedEchoes[i];

            slot.className =
                "echo-slot";

            slot.innerHTML =
                "<strong>" +
                echo.name +
                "</strong>" +

                "<small>" +
                echo.rarity +
                "</small>";
        }
        else {

            slot.className =
                "echo-slot empty";

            slot.textContent =
                "SLOT " +
                (i + 1) +
                " — EMPTY";
        }

        container.appendChild(slot);
    }

    const count =
        getElement("echoCount");

    if (count) {
        count.textContent =
            equippedEchoes.length;
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
const MUSIC_VOLUME = 0.35;
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
    music.volume = MUSIC_VOLUME;
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
            MUSIC_VOLUME,
            MUSIC_VOLUME * step / steps
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
        button.style.display = "none";
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

        registerServiceWorker();

        render();

        logMessage(
            "CORVALI ENGINE READY."
        );
    }
);