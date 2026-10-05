"use strict";

/* =========================================================
   CORVALI'S ECHOES
   Steampunk Blackjack Roguelike
   Versione riorganizzata
========================================================= */


/* =========================================================
   STATO DEL GIOCO
========================================================= */

let cycle = 1;
let cogs = 0;

let hull = 100;
let maxHull = 100;

let pressure = 0;
let maxPressure = 100;

let baseTorque = 10;
let clockPower = 10;

let hand = [];
let handValue = 0;
let aceCount = 0;

let blackjack = false;
let bust = false;
let combatStarted = false;
let playerStood = false;
let doubleUsed = false;

let enemy = null;

let equippedEchoes = [];

let shopEchoes = [];

let gameActive = false;


/* =========================================================
   COLORI FUNZIONALI
========================================================= */

const COLORS = {
    SYSTEM: "system-text",
    PLAYER: "player-text",
    ENEMY: "enemy-text"
};


/* =========================================================
   ECHOES
========================================================= */

const ECHOES = [

    {
        name: "CLOCKMAKER",
        description: "aumenta il Clock Power di 2",
        effect: {
            clockPower: 2
        }
    },

    {
        name: "BRASS HEART",
        description: "aumenta lo scafo massimo di 15",
        effect: {
            maxHull: 15
        }
    },

    {
        name: "PRESSURE VALVE",
        description: "riduce di 2 la pressione generata dalle carte",
        effect: {
            pressureReduction: 2
        }
    },

    {
        name: "STEAM CORE",
        description: "aumenta il Base Torque di 3",
        effect: {
            baseTorque: 3
        }
    },

    {
        name: "BROKEN GEAR",
        description: "aumenta il danno del 10%, ma aumenta la pressione",
        effect: {
            damageMultiplier: 1.10,
            pressureGeneration: 2
        }
    },

    {
        name: "AUTOMATON",
        description: "aumenta il Base Torque di 5",
        effect: {
            baseTorque: 5
        }
    },

    {
        name: "BRASS LUNG",
        description: "riduce di 10 la pressione iniziale di ogni scontro",
        effect: {
            startingPressure: -10
        }
    },

    {
        name: "OLD SPRING",
        description: "aumenta il Clock Power di 4",
        effect: {
            clockPower: 4
        }
    },

    {
        name: "PERFECT GEAR",
        description: "aumenta il danno minimo inflitto di 1",
        effect: {
            minimumDamage: 1
        }
    },

    {
        name: "HIGH PRESSURE PISTON",
        description: "aumenta il Base Torque di 8",
        effect: {
            baseTorque: 8
        }
    },

    {
        name: "COOLING COIL",
        description: "riduce di 5 la pressione generata",
        effect: {
            pressureReduction: 5
        }
    },

    {
        name: "STEAM VALVE",
        description: "Vent recupera 5 punti scafo in più",
        effect: {
            ventHull: 5
        }
    },

    {
        name: "CHRONO CORE",
        description: "aumenta il Clock Power di 8",
        effect: {
            clockPower: 8
        }
    },

    {
        name: "RUSTED HEART",
        description: "aumenta lo scafo massimo di 25",
        effect: {
            maxHull: 25
        }
    },

    {
        name: "BRASS EYE",
        description: "riduce l'armatura nemica di 1",
        effect: {
            enemyArmorReduction: 1
        }
    },

    {
        name: "OVERDRIVE",
        description: "aumenta il danno del 20%, ma genera più pressione",
        effect: {
            damageMultiplier: 1.20,
            pressureGeneration: 5
        }
    },

    {
        name: "COUNTERWEIGHT",
        description: "riduce di 10 la pressione massima richiesta per l'Overheat",
        effect: {
            pressureReduction: 3
        }
    },

    {
        name: "TIME SPRING",
        description: "aumenta il Clock Power di 6",
        effect: {
            clockPower: 6
        }
    },

    {
        name: "BLACK GEAR",
        description: "aumenta il Base Torque di 10",
        effect: {
            baseTorque: 10
        }
    },

    {
        name: "PRESSURE CHAMBER",
        description: "aumenta la pressione massima a 120",
        effect: {
            maxPressure: 20
        }
    },

    {
        name: "MECHANICAL HEART",
        description: "recupera 3 scafo dopo ogni vittoria",
        effect: {
            victoryHull: 3
        }
    },

    {
        name: "LOST ESCAPEMENT",
        description: "aumenta il Clock Power di 10",
        effect: {
            clockPower: 10
        }
    },

    {
        name: "GOLDEN PISTON",
        description: "aumenta il Base Torque di 12",
        effect: {
            baseTorque: 12
        }
    },

    {
        name: "CORVALI LENS",
        description: "riduce l'armatura nemica di 2",
        effect: {
            enemyArmorReduction: 2
        }
    },

    {
        name: "AEON GEAR",
        description: "aumenta il danno del 25%",
        effect: {
            damageMultiplier: 1.25
        }
    },

    {
        name: "INFINITE SPRING",
        description: "aumenta il Clock Power di 12",
        effect: {
            clockPower: 12
        }
    },

    {
        name: "VOID VALVE",
        description: "riduce di 8 la pressione generata",
        effect: {
            pressureReduction: 8
        }
    },

    {
        name: "MASTER CLOCK",
        description: "aumenta Base Torque e Clock Power di 5",
        effect: {
            baseTorque: 5,
            clockPower: 5
        }
    },

    {
        name: "THE FIRST GEAR",
        description: "aumenta Base Torque di 15",
        effect: {
            baseTorque: 15
        }
    },

    {
        name: "CORVALI ECHO",
        description: "aumenta tutte le principali capacità della macchina",
        effect: {
            baseTorque: 8,
            clockPower: 8,
            maxHull: 15,
            damageMultiplier: 1.10
        }
    }

];


/* =========================================================
   NEMICI
========================================================= */

const ENEMIES = [

    {
        name: "BRASS SENTINEL",
        description: "nemico corazzato",
        hull: 30,
        armor: 2,
        damage: 8
    },

    {
        name: "GEAR HOUND",
        description: "predatore meccanico veloce",
        hull: 24,
        armor: 1,
        damage: 10
    },

    {
        name: "BOILER WASP",
        description: "macchina volante alimentata a vapore",
        hull: 20,
        armor: 0,
        damage: 12
    },

    {
        name: "CLOCKWORK GUARD",
        description: "guardiano costruito per resistere",
        hull: 42,
        armor: 4,
        damage: 9
    },

    {
        name: "IRON REVENANT",
        description: "relitto meccanico ancora operativo",
        hull: 50,
        armor: 5,
        damage: 12
    },

    {
        name: "FURNACE KING",
        description: "gigantesca macchina alimentata da una fornace",
        hull: 65,
        armor: 6,
        damage: 15
    },

    {
        name: "CHRONOPHAGE",
        description: "entità che divora il tempo",
        hull: 70,
        armor: 5,
        damage: 17
    },

    {
        name: "AETHER GOLEM",
        description: "costrutto alimentato da energia eterica",
        hull: 80,
        armor: 8,
        damage: 18
    },

    {
        name: "RUST MAW",
        description: "enorme macchina divoratrice",
        hull: 90,
        armor: 7,
        damage: 20
    },

    {
        name: "TICKING SPIDER",
        description: "piccolo automa estremamente aggressivo",
        hull: 55,
        armor: 3,
        damage: 22
    },

    {
        name: "ANCIENT AUTOMATON",
        description: "macchina proveniente da un'epoca dimenticata",
        hull: 110,
        armor: 10,
        damage: 24
    },

    {
        name: "CORVALI ENGINE",
        description: "una macchina che sembra conoscere il tuo nome",
        hull: 150,
        armor: 12,
        damage: 28
    }

];


/* =========================================================
   FUNZIONI DOM
========================================================= */

function getElement(id) {

    return document.getElementById(id);

}


function setText(id, value) {

    const element = getElement(id);

    if (element) {
        element.textContent = value;
    }

}


function showElement(id) {

    const element = getElement(id);

    if (element) {
        element.classList.remove("hidden");
    }

}


function hideElement(id) {

    const element = getElement(id);

    if (element) {
        element.classList.add("hidden");
    }

}


/* =========================================================
   MESSAGGI
========================================================= */

function showMessage(text, type = COLORS.SYSTEM) {

    const message = getElement("message");

    if (!message) {
        return;
    }

    message.textContent = text;

    message.className = "";

    message.classList.add(type);

}


/* =========================================================
   CALCOLO ECHOES
========================================================= */

function getEchoBonus(property) {

    let total = 0;

    equippedEchoes.forEach(echo => {

        if (
            echo.effect &&
            echo.effect[property]
        ) {

            total += echo.effect[property];

        }

    });

    return total;

}


function getDamageMultiplier() {

    let multiplier = 1;

    equippedEchoes.forEach(echo => {

        if (
            echo.effect &&
            echo.effect.damageMultiplier
        ) {

            multiplier *=
                echo.effect.damageMultiplier;

        }

    });

    return multiplier;

}


function hasEcho(name) {

    return equippedEchoes.some(
        echo => echo.name === name
    );

}


/* =========================================================
   AVVIO PARTITA
========================================================= */

function startNewRun() {

    hideElement("main-menu");
    showElement("game-screen");

    cycle = 1;
    cogs = 0;

    maxHull =
        100 +
        getEchoBonus("maxHull");

    hull = maxHull;

    maxPressure =
        100 +
        getEchoBonus("maxPressure");

    pressure =
        Math.max(
            0,
            getEchoBonus("startingPressure")
        );

    baseTorque = 10;
    clockPower = 10;

    hand = [];
    handValue = 0;
    aceCount = 0;

    blackjack = false;
    bust = false;
    combatStarted = false;
    playerStood = false;
    doubleUsed = false;

    equippedEchoes = [];

    gameActive = true;

    showMessage(
        "System ready. The descent begins.",
        COLORS.SYSTEM
    );

    newEncounter();

}


/* =========================================================
   NUOVO SCONTRO
========================================================= */

function newEncounter() {

    if (!gameActive) {
        return;
    }

    combatStarted = true;
    playerStood = false;
    doubleUsed = false;
    blackjack = false;
    bust = false;

    const enemyIndex =
        Math.min(
            ENEMIES.length - 1,
            Math.floor(
                (cycle - 1) / 3
            )
        );

    const baseEnemy =
        ENEMIES[
            Math.floor(
                Math.random() *
                (enemyIndex + 1)
            )
        ];

    const scaling =
        Math.max(
            0,
            cycle - 1
        );

    enemy = {

        name:
            baseEnemy.name,

        description:
            baseEnemy.description,

        hull:
            Math.floor(
                baseEnemy.hull *
                (1 + scaling * 0.08)
            ),

        maxHull:
            Math.floor(
                baseEnemy.hull *
                (1 + scaling * 0.08)
            ),

        armor:
            Math.max(
                0,
                baseEnemy.armor +
                Math.floor(
                    scaling / 5
                ) -
                getEchoBonus(
                    "enemyArmorReduction"
                )
            ),

        damage:
            Math.floor(
                baseEnemy.damage *
                (1 + scaling * 0.05)
            )

    };

    dealHand();

    render();

    showMessage(
        `${enemy.name} encountered. (${enemy.description})`,
        COLORS.ENEMY
    );

}


/* =========================================================
   CREAZIONE MANO
========================================================= */

function dealHand() {

    hand = [];

    hand.push(
        drawCard()
    );

    hand.push(
        drawCard()
    );

    calculateHand();

    if (handValue === 21) {

        naturalBlackjack();

    }

}


/* =========================================================
   CARTE
========================================================= */

const SUITS = [
    "♠",
    "♥",
    "♦",
    "♣"
];


const RANKS = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
];


function drawCard() {

    const rank =
        RANKS[
            Math.floor(
                Math.random() *
                RANKS.length
            )
        ];

    const suit =
        SUITS[
            Math.floor(
                Math.random() *
                SUITS.length
            )
        ];

    let value;

    if (rank === "A") {

        value = 11;

    }
    else if (
        rank === "J" ||
        rank === "Q" ||
        rank === "K"
    ) {

        value = 10;

    }
    else {

        value = Number(rank);

    }

    return {
        rank,
        suit,
        value
    };

}


/* =========================================================
   CALCOLO MANO
========================================================= */

function calculateHand() {

    let total = 0;

    let aces = 0;

    hand.forEach(card => {

        total += card.value;

        if (card.rank === "A") {

            aces++;

        }

    });

    while (
        total > 21 &&
        aces > 0
    ) {

        total -= 10;

        aces--;

    }

    handValue = total;

    aceCount = aces;

    blackjack =
        hand.length === 2 &&
        handValue === 21;

    bust =
        handValue > 21;

    return handValue;

}


/* =========================================================
   HIT
========================================================= */

function hit() {

    if (!canPlayerAct()) {
        return;
    }

    hand.push(
        drawCard()
    );

    addPressure(5);

    calculateHand();

    render();

    if (bust) {

        handleBust();

        return;

    }

    if (blackjack) {

        naturalBlackjack();

        return;

    }

    showMessage(
        `Card drawn. (${handValue} total value)`,
        COLORS.PLAYER
    );

}


/* =========================================================
   STAND
========================================================= */

function stand() {

    if (!canPlayerAct()) {
        return;
    }

    playerStood = true;

    calculateHand();

    if (handValue > 21) {

        handleBust();

        return;

    }

    showMessage(
        `Hand locked at ${handValue}. (your turn is over)`,
        COLORS.PLAYER
    );

    resolveDamage();

}


/* =========================================================
   DOUBLE
========================================================= */

function doubleDown() {

    if (!canPlayerAct()) {
        return;
    }

    if (doubleUsed) {

        showMessage(
            "Double unavailable. (you can only double once per hand)",
            COLORS.SYSTEM
        );

        return;

    }

    doubleUsed = true;

    hand.push(
        drawCard()
    );

    addPressure(10);

    calculateHand();

    render();

    if (bust) {

        handleBust();

        return;

    }

    resolveDamage();

}


/* =========================================================
   BLACKJACK NATURALE
========================================================= */

function naturalBlackjack() {

    if (!combatStarted) {
        return;
    }

    blackjack = true;

    playerStood = true;

    showMessage(
        "NATURAL BLACKJACK. (perfect hand)",
        COLORS.PLAYER
    );

    resolveDamage(true);

}


/* =========================================================
   CLOCK POWER
========================================================= */

function calculateClockPower() {

    let power =
        10 +
        getEchoBonus(
            "clockPower"
        );

    power +=
        Math.floor(
            cycle / 10
        ) * 2;

    return power;

}


/* =========================================================
   BASE TORQUE
========================================================= */

function calculateBaseTorque() {

    let torque =
        10 +
        getEchoBonus(
            "baseTorque"
        );

    torque +=
        Math.floor(
            cycle / 10
        ) * 2;

    return torque;

}


/* =========================================================
   PRESSIONE
========================================================= */

function addPressure(amount) {

    const reduction =
        getEchoBonus(
            "pressureReduction"
        );

    const finalAmount =
        Math.max(
            0,
            amount - reduction
        );

    pressure += finalAmount;

    if (
        pressure >
        maxPressure
    ) {

        pressure =
            maxPressure;

        handleOverheat();

    }

}


function handleOverheat() {

    hull -= 15;

    pressure = 0;

    showMessage(
        "OVERHEAT. (the boiler vents violently and damages the hull)",
        COLORS.SYSTEM
    );

    if (hull <= 0) {

        gameOver();

    }

}


/* =========================================================
   VENT
========================================================= */

function vent() {

    if (!gameActive) {
        return;
    }

    if (pressure <= 0) {

        showMessage(
            "No pressure to vent. (the boiler is already calm)",
            COLORS.SYSTEM
        );

        return;

    }

    const oldPressure =
        pressure;

    pressure =
        Math.max(
            0,
            pressure - 25
        );

    const hullRecovery =
        getEchoBonus(
            "ventHull"
        );

    if (
        hullRecovery >
        0
    ) {

        hull =
            Math.min(
                maxHull,
                hull + hullRecovery
            );

    }

    render();

    showMessage(
        `Vent complete. (${oldPressure - pressure} pressure released)`,
        COLORS.PLAYER
    );

}


/* =========================================================
   DANNO
========================================================= */

function resolveDamage(
    isBlackjack = false
) {

    if (
        !enemy ||
        !gameActive
    ) {

        return;

    }

    baseTorque =
        calculateBaseTorque();

    clockPower =
        calculateClockPower();

    let damage;

    if (
        isBlackjack ||
        blackjack
    ) {

        baseTorque += 15;
        clockPower += 5;

    }

    damage =
        Math.floor(
            baseTorque *
            clockPower /
            10
        );

    damage =
        Math.floor(
            damage *
            getDamageMultiplier()
        );

    damage -=
        enemy.armor;

    damage +=
        getEchoBonus(
            "minimumDamage"
        );

    damage =
        Math.max(
            1,
            damage
        );

    enemy.hull -=
        damage;

    render();

    showMessage(
        `DIRECT HIT. (${damage} damage dealt)`,
        COLORS.PLAYER
    );

    if (
        enemy.hull <= 0
    ) {

        defeatEnemy();

        return;

    }

    enemyAttack();

}


/* =========================================================
   ATTACCO NEMICO
========================================================= */

function enemyAttack() {

    if (
        !enemy ||
        !gameActive
    ) {

        return;

    }

    hull -=
        enemy.damage;

    render();

    showMessage(
        `${enemy.name} attacks. (${enemy.damage} hull damage)`,
        COLORS.ENEMY
    );

    if (
        hull <= 0
    ) {

        gameOver();

        return;

    }

    /*
       IMPORTANTE:

       Dopo che il giocatore ha fatto STAND,
       playerStood era rimasto TRUE.

       Se non lo resettiamo qui,
       updateActionButtons() continuerà
       a disabilitare tutti i pulsanti.

       Questo era il motivo per cui il gioco
       sembrava bloccarsi dopo l'attacco.
    */

    hand = [];

    handValue = 0;
    aceCount = 0;

    blackjack = false;
    bust = false;

    setTimeout(
        function () {

            if (!gameActive) {
                return;
            }

            /*
               Nuovo turno del giocatore.
            */

            playerStood = false;
            doubleUsed = false;

            dealHand();

            render();

            /*
               Se la nuova mano è automaticamente
               diventata Blackjack, naturalBlackjack()
               ha già gestito il turno.
            */

            if (!blackjack) {

                showMessage(
                    "Your turn. (draw cards or stop)",
                    COLORS.PLAYER
                );

            }

        },
        500
    );

}


/* =========================================================
   BUST
========================================================= */

function handleBust() {

    bust = true;

    addPressure(15);

    render();

    showMessage(
        `BUST. (${handValue} exceeds 21)`,
        COLORS.SYSTEM
    );

    setTimeout(
        function () {

            if (gameActive) {

                enemyAttack();

            }

        },
        600
    );

}


/* =========================================================
   SCONFITTA NEMICO
========================================================= */

function defeatEnemy() {

    const reward =
        10 +
        cycle * 3;

    cogs += reward;

    const recovery =
        getEchoBonus(
            "victoryHull"
        );

    if (
        recovery >
        0
    ) {

        hull =
            Math.min(
                maxHull,
                hull + recovery
            );

    }

    render();

    showMessage(
        `${enemy.name} destroyed. (+${reward} COGS)`,
        COLORS.PLAYER
    );

    combatStarted = false;

    setTimeout(
        function () {

            if (!gameActive) {
                return;
            }

            cycle++;

            generateShop();

            newEncounter();

        },
        1000
    );

}


/* =========================================================
   SHOP
========================================================= */

function generateShop() {

    const available =
        ECHOES.filter(
            echo =>
                !equippedEchoes.some(
                    owned =>
                        owned.name ===
                        echo.name
                )
        );

    shopEchoes = [];

    const shuffled =
        [...available].sort(
            () =>
                Math.random() - 0.5
        );

    shopEchoes =
        shuffled.slice(
            0,
            4
        );

}


function openWorkshop() {

    generateShop();

    const workshop =
        getElement(
            "workshop"
        );

    if (!workshop) {
        return;
    }

    renderWorkshop();

    workshop.classList.remove(
        "hidden"
    );

}


function closeWorkshop() {

    hideElement(
        "workshop"
    );

}


function renderWorkshop() {

    const shop =
        getElement(
            "shop"
        );

    if (!shop) {
        return;
    }

    shop.innerHTML = "";

    if (
        shopEchoes.length === 0
    ) {

        shop.innerHTML =
            "<p class='system-text'>No Echoes available. (all current Echoes have been acquired)</p>";

        return;

    }

    shopEchoes.forEach(
        (
            echo,
            index
        ) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "echo-card";

            card.innerHTML = `
                <h3 class="player-text">
                    ${echo.name}
                </h3>

                <p class="player-text">
                    (${echo.description})
                </p>

                <button
                    class="game-button player-action"
                    onclick="buyEcho(${index})"
                >
                    INSTALL
                    <span>(install this Echo)</span>
                </button>
            `;

            shop.appendChild(
                card
            );

        }
    );

}


function buyEcho(index) {

    const echo =
        shopEchoes[index];

    if (!echo) {
        return;
    }

    if (
        equippedEchoes.length >= 3
    ) {

        showMessage(
            "Echo slots full. (maximum 3 equipped Echoes)",
            COLORS.SYSTEM
        );

        return;

    }

    equippedEchoes.push(
        echo
    );

    applyEchoImmediately(
        echo
    );

    showMessage(
        `${echo.name} installed. (${echo.description})`,
        COLORS.PLAYER
    );

    renderWorkshop();

    render();

}


/* =========================================================
   APPLICA ECHO
========================================================= */

function applyEchoImmediately(
    echo
) {

    if (
        !echo ||
        !echo.effect
    ) {

        return;

    }

    const effect =
        echo.effect;

    if (
        effect.maxHull
    ) {

        maxHull +=
            effect.maxHull;

        hull +=
            effect.maxHull;

    }

    if (
        effect.maxPressure
    ) {

        maxPressure +=
            effect.maxPressure;

    }

}


/* =========================================================
   RENDER
========================================================= */

function render() {

    setText(
        "cycle",
        cycle
    );

    setText(
        "cogs",
        cogs
    );

    setText(
        "hull",
        Math.max(
            0,
            hull
        )
    );

    setText(
        "max-hull",
        maxHull
    );

    setText(
        "pressure",
        pressure
    );

    setText(
        "max-pressure",
        maxPressure
    );


    if (enemy) {

        setText(
            "enemy-name",
            enemy.name
        );

        setText(
            "enemy-description",
            `(${enemy.description})`
        );

        setText(
            "enemy-hull",
            Math.max(
                0,
                enemy.hull
            )
        );

        setText(
            "enemy-armor",
            enemy.armor
        );

    }


    renderHand();

    updateActionButtons();

}


/* =========================================================
   RENDER CARTE
========================================================= */

function renderHand() {

    const container =
        getElement(
            "hand"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    hand.forEach(
        card => {

            const cardElement =
                document.createElement(
                    "div"
                );

            cardElement.className =
                "card";

            cardElement.textContent =
                `${card.rank}${card.suit}`;

            container.appendChild(
                cardElement
            );

        }
    );

    setText(
        "hand-value",
        handValue
    );

}


/* =========================================================
   BOTTONI
========================================================= */

function canPlayerAct() {

    if (!gameActive) {

        showMessage(
            "The run has ended. (start a new run)",
            COLORS.SYSTEM
        );

        return false;

    }

    if (!combatStarted) {

        showMessage(
            "No active encounter. (wait for the next encounter)",
            COLORS.SYSTEM
        );

        return false;

    }

    if (playerStood) {

        showMessage(
            "Your hand is already locked. (wait for the enemy)",
            COLORS.SYSTEM
        );

        return false;

    }

    return true;

}


function updateActionButtons() {

    const buttons =
        document.querySelectorAll(
            ".actions button"
        );

    buttons.forEach(
        button => {

            button.disabled =
                !gameActive ||
                !combatStarted ||
                playerStood;

        }
    );

}


/* =========================================================
   GAME OVER
========================================================= */

function gameOver() {

    gameActive = false;

    combatStarted = false;

    hull = 0;

    render();

    showMessage(
        `SYSTEM FAILURE. (your descent ends at Cycle ${cycle})`,
        COLORS.SYSTEM
    );

    showGameOverScreen();

}


/* =========================================================
   GAME OVER SCREEN
========================================================= */

function showGameOverScreen() {

    const existing =
        document.getElementById(
            "game-over-screen"
        );

    if (existing) {
        existing.remove();
    }

    const overlay =
        document.createElement(
            "div"
        );

    overlay.id =
        "game-over-screen";

    overlay.className =
        "modal";

    overlay.innerHTML = `

        <div class="modal-content">

            <h2 class="system-text">
                SYSTEM FAILURE
            </h2>

            <p class="system-text">
                (la macchina Corvali non può più proseguire)
            </p>

            <p class="system-text">
                CYCLE REACHED:
                <strong>${cycle}</strong>
            </p>

            <p class="system-text">
                COGS COLLECTED:
                <strong>${cogs}</strong>
            </p>

            <button
                class="menu-button player-action"
                onclick="returnToMenu()"
            >
                RETURN
                <span>(torna al menu principale)</span>
            </button>

        </div>

    `;

    document.body.appendChild(
        overlay
    );

}


/* =========================================================
   RITORNO AL MENU
========================================================= */

function returnToMenu() {

    const gameOver =
        document.getElementById(
            "game-over-screen"
        );

    if (gameOver) {
        gameOver.remove();
    }

    hideElement(
        "game-screen"
    );

    showElement(
        "main-menu"
    );

    gameActive = false;

    combatStarted = false;

    cycle = 1;

    cogs = 0;

    maxHull = 100;

    hull = 100;

    pressure = 0;

    maxPressure = 100;

    hand = [];

    handValue = 0;

    aceCount = 0;

    blackjack = false;

    bust = false;

    playerStood = false;

    doubleUsed = false;

    enemy = null;

    equippedEchoes = [];

    shopEchoes = [];

    showMessage(
        "System ready.",
        COLORS.SYSTEM
    );

}


/* =========================================================
   INIZIALIZZAZIONE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        hideElement(
            "game-screen"
        );

        hideElement(
            "workshop"
        );

        showElement(
            "main-menu"
        );

        console.log(
            "CORVALI'S ECHOES initialized."
        );

    }
);