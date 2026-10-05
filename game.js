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
const REPAIR_AFTER_KILL = 10;
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
        description: "Vent removes an additional 10 Pressure."
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
    }

];


/* =========================
   ENEMY DATABASE
   ========================= */

const ENEMIES = [

    {
        name: "BRASS SENTINEL",
        hull: 50,
        attack: 10,
        armor: 4,
        ability: "ARMOR"
    },

    {
        name: "GEAR HOUND",
        hull: 60,
        attack: 12,
        armor: 1,
        ability: "PRESSURE"
    },

    {
        name: "BOILER WASP",
        hull: 65,
        attack: 13,
        armor: 2,
        ability: "HEAT"
    },

    {
        name: "CLOCKWORK GUARD",
        hull: 80,
        attack: 12,
        armor: 8,
        ability: "FORTRESS"
    },

    {
        name: "IRON REVENANT",
        hull: 90,
        attack: 15,
        armor: 4,
        ability: "BUST"
    },

    {
        name: "FURNACE KING",
        hull: 100,
        attack: 17,
        armor: 5,
        ability: "OVERHEAT"
    },

    {
        name: "CHRONOPHAGE",
        hull: 110,
        attack: 18,
        armor: 6,
        ability: "TIME"
    },

    {
        name: "AETHER GOLEM",
        hull: 125,
        attack: 20,
        armor: 10,
        ability: "HEAVY ARMOR"
    },

    {
        name: "RUST MAW",
        hull: 140,
        attack: 21,
        armor: 7,
        ability: "CORROSION"
    },

    {
        name: "TICKING SPIDER",
        hull: 150,
        attack: 22,
        armor: 5,
        ability: "SABOTAGE"
    },

    {
        name: "ANCIENT AUTOMATON",
        hull: 175,
        attack: 24,
        armor: 10,
        ability: "REPAIR"
    },

    {
        name: "CORVALI ENGINE",
        hull: 220,
        attack: 28,
        armor: 12,
        ability: "OVERCLOCK"
    }

];


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

    resetState();

    getElement("startOverlay").style.display = "none";

    getElement("gameOverModal").classList.add("hidden");
    getElement("lootModal").classList.add("hidden");
    getElement("workshopModal").classList.add("hidden");

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


function getEnemyForCycle() {

    const tier = getTier();

    const poolSize = Math.min(
        ENEMIES.length,
        Math.max(3, tier * 3)
    );

    const baseEnemy =
        ENEMIES[
            randomNumber(
                0,
                poolSize - 1
            )
        ];

    const scale =
        1 + ((tier - 1) * 0.25);

    return {
        name: baseEnemy.name,
        maxHull: Math.round(
            baseEnemy.hull * scale
        ),
        hull: Math.round(
            baseEnemy.hull * scale
        ),
        attack: Math.round(
            baseEnemy.attack * scale
        ),
        armor: Math.round(
            baseEnemy.armor * scale
        ),
        ability: baseEnemy.ability
    };
}


function newEncounter() {

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
        "ENCOUNTER: " +
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


function renderCards() {

    const container = getElement("cards");

    if (container) {

        container.innerHTML = "";

        for (const card of hand) {
            container.appendChild(buildCardElement(card));
        }
    }

    const enemyContainer = getElement("enemyCards");

    if (enemyContainer) {

        enemyContainer.innerHTML = "";

        enemyHand.forEach(function (card, index) {

            const hiddenCard = enemyHidden && index === 1;

            enemyContainer.appendChild(
                buildCardElement(hiddenCard ? null : card)
            );
        });
    }

    const enemyValue = getElement("enemyHandValue");

    if (enemyValue) {

        if (enemyHand.length === 0) {
            enemyValue.textContent = "0";
        }
        else if (enemyHidden) {
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

    pressure += 5;

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


function playerHitsEnemy() {

    let damage = Math.floor(
        baseTorque * (10 + clockPower) / 10
    );

    let armor = enemy.armor;

    if (hasEcho("CORVALI LENS")) {
        armor = Math.max(0, armor - 5);
    }

    damage = Math.max(1, damage - armor);

    if (doubled) {
        damage *= 2;
    }

    enemy.hull = Math.max(0, enemy.hull - damage);

    logMessage("DAMAGE OUTPUT: " + damage + ".");

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

    let damage = enemy.attack;

    if (hasEcho("COUNTERWEIGHT")) {
        damage -= 2;
    }

    if (enemy.ability === "CORROSION") {
        damage += 3;
    }

    if (enemy.ability === "OVERCLOCK") {
        damage += 5;
    }

    if (enemy.ability === "PRESSURE") {
        pressure += 5;
    }

    if (enemy.ability === "HEAT") {
        pressure += 8;
    }

    if (doubled) {
        damage *= 2;
    }

    damage = Math.max(1, damage);

    hull = Math.max(0, hull - damage);

    logMessage(
        enemy.name + " HITS YOU FOR " + damage + "."
    );

    if (hull <= 0) {
        gameOver();
    }
}


/* =========================
   PRESSURE
   ========================= */

function checkPressure() {

    let limit =
        hasEcho("PRESSURE CHAMBER")
            ? 120
            : 100;

    if (pressure > limit) {

        hull -= 15;

        hull =
            Math.max(
                0,
                hull
            );

        pressure = 0;

        logMessage(
            "OVERHEAT: 15 HULL DAMAGE."
        );

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

    if (hasEcho("STEAM VALVE")) {
        amount += 10;
    }

    if (hasEcho("VOID VALVE")) {
        amount = 45;
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

    lootReward =
        8 +
        (getTier() * 4);

    cogs += lootReward;

    if (REPAIR_AFTER_KILL > 0 && hull > 0) {

        const before = hull;

        hull = Math.min(maxHull, hull + REPAIR_AFTER_KILL);

        if (hull > before) {
            logMessage("HULL REPAIRED: +" + (hull - before) + ".");
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
        defeatedEnemies % 3 === 0;

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

    modal.classList.remove("hidden");

    render();
}


function closeWorkshop() {

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
                return !hasEcho(echo.name);
            })
        ).slice(0, 4);

    for (const echo of available) {

        const price =
            getPrice(echo);

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
                equippedEchoes.length >= 3
                    ? "SELECT"
                    : "BUY " + price + " COGS"
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

        equippedEchoes.push(echo);

        logMessage(
            "ECHO EQUIPPED: " +
            echo.name +
            "."
        );

        recalculateMaxHull();

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
            );
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

    render();
}


/* =========================
   INITIALIZATION
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        render();

        logMessage(
            "CORVALI ENGINE READY."
        );
    }
);