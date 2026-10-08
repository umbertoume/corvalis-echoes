/* =========================================================
   i18n: English (source language) <-> Italian
   Strategy: the game is written in English. When Italian is
   selected, every piece of text that reaches the page is
   translated through a dictionary (exact strings) and a set of
   rules (strings that contain numbers or names). A
   MutationObserver keeps newly created text translated.
   ========================================================= */

const I18N_KEY = "corvaliLang";

let uiLang = "en";


const IT = {

    /* ---------- menu ---------- */
    "CORVALI ENGINE // SYSTEM 01": "MOTORE CORVALI // SISTEMA 01",
    "A STEAMPUNK BLACKJACK ROGUELIKE": "UN ROGUELIKE STEAMPUNK DI BLACKJACK",
    "THE MACHINE REMEMBERS.": "LA MACCHINA RICORDA.",
    "ENGINEER": "INGEGNERE",
    "RUNS": "PARTITE",
    "DESTROYED": "DISTRUTTI",
    "DESCEND INTO THE ABYSS": "DISCENDI NELL'ABISSO",
    "HOW TO PLAY": "COME SI GIOCA",
    "SWITCH PROFILE": "CAMBIA PROFILO",
    "SELECT OR CREATE A PROFILE": "SCEGLI O CREA UN PROFILO",
    "IDENTIFY YOURSELF": "IDENTIFICATI",
    "CREATE PROFILE": "CREA PROFILO",
    "BACK": "INDIETRO",
    "ENGINEER NAME": "NOME INGEGNERE",
    "ENTER A NAME (LETTERS OR NUMBERS)": "INSERISCI UN NOME (LETTERE O NUMERI)",
    "Abandon your saved run and start a new one?": "Abbandonare la partita salvata e iniziarne una nuova?",
    "Language": "Lingua",

    /* ---------- top bar / panels ---------- */
    "ENGINE // ACTIVE": "MOTORE // ATTIVO",
    "CYCLE": "CICLO",
    "COGS": "INGRANAGGI",
    "HULL": "SCAFO",
    "hull integrity": "integrità dello scafo",
    "PRESSURE": "PRESSIONE",
    "system pressure": "pressione del sistema",
    "BASE TORQUE": "COPPIA BASE",
    "mechanical power": "potenza meccanica",
    "CLOCK POWER": "POTENZA OROLOGIO",
    "time power": "potenza temporale",
    "EQUIPPED ECHOES": "ECHI EQUIPAGGIATI",
    "MAXIMUM 3 - HOVER OR TAP FOR DETAILS": "MASSIMO 3 - PASSA IL MOUSE O TOCCA PER I DETTAGLI",
    "EMPTY SLOT": "SLOT VUOTO",
    "ATTACK": "ATTACCO",
    "ARMOR": "CORAZZA",
    "ABILITY": "ABILITÀ",
    "ENEMY HAND": "MANO NEMICA",
    "YOUR HAND": "LA TUA MANO",
    "VALUE": "VALORE",
    "ENGINE LOG": "REGISTRO MOTORE",

    /* ---------- actions ---------- */
    "HIT": "CARTA",
    "DRAW A CARD": "PESCA UNA CARTA",
    "STAND": "STAI",
    "KEEP YOUR HAND": "TIENI LA MANO",
    "DOUBLE": "RADDOPPIA",
    "x2 RISK, x2 REWARD": "RISCHIO x2, PREMIO x2",
    "VENT": "SFIATA",
    "RELEASE PRESSURE": "RILASCIA PRESSIONE",

    /* ---------- loot / workshop / game over ---------- */
    "ENCOUNTER RESOLVED": "INCONTRO RISOLTO",
    "ENEMY DESTROYED": "NEMICO DISTRUTTO",
    "THE MACHINE HAS BEEN SILENCED.": "LA MACCHINA È STATA ZITTITA.",
    "AN ELITE MACHINE HAS BEEN SILENCED. EXTRA LOOT.": "UNA MACCHINA ELITE È STATA ZITTITA. BOTTINO EXTRA.",
    "A BOSS HAS FALLEN. A FREE ECHO AWAITS IN THE WORKSHOP.": "UN BOSS È CADUTO. UN ECO GRATUITO TI ASPETTA NELL'OFFICINA.",
    "LOOT": "BOTTINO",
    "CONTINUE": "CONTINUA",
    "CORVALI WORKSHOP": "OFFICINA DI CORVALI",
    "SELECT AN ECHO": "SCEGLI UN ECO",
    "CHOOSE AN ECHO TO MODIFY THE ENGINE. MAXIMUM 3 EQUIPPED.": "SCEGLI UN ECO PER MODIFICARE IL MOTORE. MASSIMO 3 EQUIPAGGIATI.",
    "REPLACE AN EQUIPPED ECHO": "SOSTITUISCI UN ECO EQUIPAGGIATO",
    "CANCEL": "ANNULLA",
    "TAKE - FREE": "PRENDI - GRATIS",
    "NO ECHOES AVAILABLE": "NESSUN ECO DISPONIBILE",
    "SYSTEM FAILURE": "GUASTO DI SISTEMA",
    "ENGINE SILENCED": "MOTORE SPENTO",
    "NEW RECORD": "NUOVO RECORD",
    "FINAL CYCLE": "CICLO FINALE",
    "BEST CYCLE": "MIGLIOR CICLO",
    "RETURN TO MENU": "TORNA AL MENU",

    /* ---------- pause menu ---------- */
    "ENGINE PAUSED": "MOTORE IN PAUSA",
    "RESUME": "RIPRENDI",
    "MUSIC": "MUSICA",
    "♪ ON": "♪ ACCESA",
    "♪ OFF": "♪ SPENTA",
    "VOLUME": "VOLUME",
    "VIBRATION": "VIBRAZIONE",
    "VIB ON": "VIB ACCESA",
    "VIB OFF": "VIB SPENTA",
    "REDUCE MOTION": "RIDUCI MOVIMENTO",
    "ON": "SÌ",
    "OFF": "NO",
    "LANGUAGE": "LINGUA",
    "EXIT TO MAIN MENU": "ESCI AL MENU PRINCIPALE",
    "FIELD MANUAL": "MANUALE DI CAMPO",
    "CLOSE": "CHIUDI",
    "Music volume": "Volume della musica",
    "Music on/off": "Musica sì/no",
    "Vibration on/off": "Vibrazione sì/no",

    /* ---------- help tabs / codex ---------- */
    "BASICS": "BASI",
    "STATS": "STATISTICHE",
    "ENEMIES": "NEMICI",
    "ECHOES": "ECHI",
    "ALL": "TUTTI",

    /* ---------- rarity ---------- */
    "WORN": "USURATO",
    "FORGED": "FORGIATO",
    "ENGINEERED": "PROGETTATO",
    "RELIC": "RELIQUIA",

    /* ---------- tooltips: titles ---------- */
    "Cycle": "Ciclo",
    "Cogs": "Ingranaggi",
    "How to play": "Come si gioca",
    "Hull": "Scafo",
    "Pressure": "Pressione",
    "Base Torque": "Coppia base",
    "Clock Power": "Potenza orologio",
    "Attack": "Attacco",
    "Armor": "Corazza",
    "Ability": "Abilità",
    "Hand value": "Valore della mano",
    "If you win": "Se vinci",
    "If you lose": "Se perdi",
    "Hit": "Carta",
    "Stand": "Stai",
    "Double": "Raddoppia",
    "Vent": "Sfiata",

    /* ---------- tooltips: descriptions ---------- */
    "Each cycle is one duel against a machine. Every 5th is an Elite, every 10th a Boss.": "Ogni ciclo è un duello contro una macchina. Ogni 5° è un Elite, ogni 10° un Boss.",
    "Currency. Earn it by destroying enemies and spend it on Echoes in the Workshop.": "Valuta. La ottieni distruggendo i nemici e la spendi in Echi nell'Officina.",
    "Rules, stats, enemies and the full Echo codex. Shortcut: ?": "Regole, statistiche, nemici e il codex completo degli Echi. Scorciatoia: ?",
    "Pause, sound settings and exit. Shortcut: Esc": "Pausa, impostazioni audio e uscita. Scorciatoia: Esc",
    "Your health. If it reaches 0 the run ends. Destroying enemies repairs some of it, and so do certain Echoes.": "La tua salute. Se arriva a 0 la partita finisce. Distruggere i nemici ne ripara una parte, e così fanno certi Echi.",
    "Rises when you HIT or DOUBLE (+5 / +10) and when you bust (+20). Past the limit the engine overheats and damages your hull. VENT lowers it.": "Sale quando usi CARTA o RADDOPPIA (+5 / +10) e quando sballi (+20). Oltre il limite il motore si surriscalda e danneggia lo scafo. SFIATA la abbassa.",
    "Equals your hand value plus Echo bonuses. It is the base of the damage you deal when you win a round.": "È il valore della tua mano più i bonus degli Echi. È la base del danno che infliggi quando vinci un round.",
    "A damage multiplier. Damage = Torque x (1 + Clock Power / 10) minus enemy Armor. Hands of 18+ grant bonus Clock Power.": "Un moltiplicatore di danno. Danno = Coppia x (1 + Potenza orologio / 10) meno la Corazza del nemico. Le mani da 18+ danno Potenza orologio extra.",
    "The damage you take when you lose a round or bust.": "Il danno che subisci quando perdi un round o sballi.",
    "Subtracted from every hit you deal (minimum 1 damage).": "Sottratta a ogni colpo che infliggi (danno minimo 1).",
    "Special behaviour of this machine.": "Comportamento speciale di questa macchina.",
    "Get as close to 21 as you can without going over. Aces count as 11 or 1. The enemy draws until it reaches 17.": "Avvicinati a 21 senza superarlo. Gli Assi valgono 11 o 1. Il nemico pesca fino a 17.",
    "Damage you would deal right now, after the enemy's armor.": "Il danno che infliggeresti adesso, dopo la corazza del nemico.",
    "Damage you would take if the enemy beats you or you bust.": "Il danno che subiresti se il nemico ti batte o se sballi.",
    "Draw one card (+5 Pressure). Go over 21 and you bust. Shortcut: H": "Pesca una carta (+5 pressione). Se superi 21 sballi. Scorciatoia: H",
    "Keep your hand. The enemy reveals its card and draws to 17, then the hands are compared. Shortcut: S": "Tieni la mano. Il nemico scopre la carta e pesca fino a 17, poi si confrontano le mani. Scorciatoia: S",
    "Only on your first two cards. Draw exactly one card and stand. Damage you deal AND take is doubled (+10 Pressure). Shortcut: D": "Solo con le prime due carte. Pesca esattamente una carta e ti fermi. Il danno che infliggi E subisci raddoppia (+10 pressione). Scorciatoia: D",
    "Release 30 Pressure. Free and instant, but only before you commit to a round. Shortcut: V": "Rilascia 30 di pressione. Gratis e istantaneo, ma solo prima di decidere il round. Scorciatoia: V",

    /* ---------- enemy abilities ---------- */
    "NONE": "NESSUNA",
    "HEAT": "CALORE",
    "FORTRESS": "FORTEZZA",
    "BUST": "SBALLO",
    "TIME": "TEMPO",
    "HEAVY ARMOR": "CORAZZA PESANTE",
    "OVERHEAT": "SURRISCALDAMENTO",
    "REPAIR": "RIPARAZIONE",
    "OVERCLOCK": "SOVRAFREQUENZA",
    "A plain machine with no special ability.": "Una macchina semplice, senza abilità speciali.",
    "Each time it hits you, your Pressure rises by 5.": "Ogni volta che ti colpisce, la tua pressione sale di 5.",
    "Each time it hits you, your Pressure rises by 8.": "Ogni volta che ti colpisce, la tua pressione sale di 8.",
    "A special trait of this machine. Its effect is still being calibrated.": "Un tratto speciale di questa macchina. Il suo effetto è ancora in fase di taratura.",

    /* ---------- round feedback ---------- */
    "YOU WIN THE ROUND": "VINCI IL ROUND",
    "OVERLOAD — YOU BUST": "SOVRACCARICO — SBALLI",
    "YOU LOSE THE ROUND": "PERDI IL ROUND",
    "PUSH — NO DAMAGE": "PAREGGIO — NESSUN DANNO",
    "YOU BUST": "SBALLI",
    "BLOCKED": "BLOCCATO",
    "IF YOU LOSE: BLOCKED": "SE PERDI: BLOCCATO",

    /* ---------- log (fixed messages) ---------- */
    "NEW RUN INITIALIZED.": "NUOVA PARTITA AVVIATA.",
    "NATURAL BLACKJACK.": "BLACKJACK NATURALE.",
    "DOUBLE IS ONLY AVAILABLE ON THE INITIAL HAND.": "RADDOPPIA È DISPONIBILE SOLO CON LE PRIME DUE CARTE.",
    "ENEMY OVERLOADED.": "IL NEMICO SI È SOVRACCARICATO.",
    "SPARE PARTS: +3 COGS.": "RICAMBI: +3 INGRANAGGI.",
    "OVERLOAD: HAND BUSTED.": "SOVRACCARICO: MANO SBALLATA.",
    "BROKEN GEAR: +8 CLOCK POWER NEXT HAND.": "INGRANAGGIO ROTTO: +8 POTENZA OROLOGIO ALLA PROSSIMA MANO.",
    "BLACK GEAR DAMAGED THE ENEMY.": "INGRANAGGIO NERO HA DANNEGGIATO IL NEMICO.",
    "AEGIS GEAR BLOCKED THE HIT.": "INGRANAGGIO EGIDE HA BLOCCATO IL COLPO.",
    "PRESSURE IS ALREADY STABLE.": "LA PRESSIONE È GIÀ STABILE.",
    "BRASS LUNG RESTORED 5 HULL.": "POLMONE D'OTTONE HA RIPARATO 5 DI SCAFO.",
    "STEAM BROKER: +2 COGS.": "MEDIATORE DI VAPORE: +2 INGRANAGGI.",
    "INSUFFICIENT COGS.": "INGRANAGGI INSUFFICIENTI.",
    "ENGINE FAILURE.": "GUASTO AL MOTORE.",
    "MUSIC BLOCKED BY THE BROWSER. TAP THE ♪ BUTTON.": "MUSICA BLOCCATA DAL BROWSER. TOCCA IL PULSANTE ♪.",
    "CORVALI ENGINE READY.": "MOTORE CORVALI PRONTO.",

    /* ---------- enemy names ---------- */
    "BRASS SENTINEL": "SENTINELLA D'OTTONE",
    "GEAR HOUND": "CANE DEGLI INGRANAGGI",
    "BOILER WASP": "VESPA DA CALDAIA",
    "RUST MAW": "FAUCI DI RUGGINE",
    "TICKING SPIDER": "RAGNO TICCHETTANTE",
    "CLOCKWORK GUARD": "GUARDIA A CARICA",
    "IRON REVENANT": "SPETTRO DI FERRO",
    "CHRONOPHAGE": "CRONOFAGO",
    "AETHER GOLEM": "GOLEM D'ETERE",
    "FURNACE KING": "RE DELLA FORNACE",
    "ANCIENT AUTOMATON": "AUTOMA ANTICO",
    "CORVALI ENGINE": "MOTORE CORVALI",

    /* ---------- echo names ---------- */
    "CLOCKMAKER": "OROLOGIAIO",
    "BRASS HEART": "CUORE D'OTTONE",
    "PRESSURE VALVE": "VALVOLA DI PRESSIONE",
    "STEAM CORE": "NUCLEO A VAPORE",
    "BROKEN GEAR": "INGRANAGGIO ROTTO",
    "AUTOMATON": "AUTOMA",
    "BRASS LUNG": "POLMONE D'OTTONE",
    "OLD SPRING": "VECCHIA MOLLA",
    "PERFECT GEAR": "INGRANAGGIO PERFETTO",
    "HIGH PRESSURE PISTON": "PISTONE AD ALTA PRESSIONE",
    "COOLING COIL": "SERPENTINA DI RAFFREDDAMENTO",
    "STEAM VALVE": "VALVOLA A VAPORE",
    "CHRONO CORE": "NUCLEO CRONO",
    "RUSTED HEART": "CUORE ARRUGGINITO",
    "BRASS EYE": "OCCHIO D'OTTONE",
    "OVERDRIVE": "SOVRAMARCIA",
    "COUNTERWEIGHT": "CONTRAPPESO",
    "TIME SPRING": "MOLLA DEL TEMPO",
    "BLACK GEAR": "INGRANAGGIO NERO",
    "PRESSURE CHAMBER": "CAMERA DI PRESSIONE",
    "MECHANICAL HEART": "CUORE MECCANICO",
    "LOST ESCAPEMENT": "SCAPPAMENTO PERDUTO",
    "GOLDEN PISTON": "PISTONE D'ORO",
    "CORVALI LENS": "LENTE DI CORVALI",
    "AEON GEAR": "INGRANAGGIO EONICO",
    "INFINITE SPRING": "MOLLA INFINITA",
    "VOID VALVE": "VALVOLA DEL VUOTO",
    "MASTER CLOCK": "OROLOGIO MAESTRO",
    "THE FIRST GEAR": "IL PRIMO INGRANAGGIO",
    "CORVALI ECHO": "ECO DI CORVALI",
    "SPARE PARTS": "RICAMBI",
    "SALVAGE ENGINE": "MOTORE DI RECUPERO",
    "STEAM BROKER": "MEDIATORE DI VAPORE",
    "IRON LUNG": "POLMONE D'ACCIAIO",
    "GLASS PISTON": "PISTONE DI VETRO",
    "TICKING BOMB": "BOMBA A OROLOGERIA",
    "BRASS PERISCOPE": "PERISCOPIO D'OTTONE",
    "LAST STAND": "ULTIMA RESISTENZA",
    "DOUBLE CRANK": "DOPPIA MANOVELLA",
    "AEGIS GEAR": "INGRANAGGIO EGIDE",
    "TITAN HAMMER": "MARTELLO TITANICO",
    "STEEL NERVES": "NERVI D'ACCIAIO",

    /* ---------- echo descriptions ---------- */
    "+2 Clock Power every hand.": "+2 Potenza orologio a ogni mano.",
    "+10 maximum Hull.": "+10 Scafo massimo.",
    "Vent removes 40 Pressure instead of 30.": "Sfiata rimuove 40 di pressione invece di 30.",
    "+3 Base Torque every hand.": "+3 Coppia base a ogni mano.",
    "After a Bust, gain +8 Clock Power.": "Dopo uno sballo, ottieni +8 Potenza orologio.",
    "Start every hand with +5 Base Torque.": "Inizia ogni mano con +5 Coppia base.",
    "Vent also restores 5 Hull.": "Sfiata ripara anche 5 di Scafo.",
    "Every 21 gives +5 Clock Power.": "Ogni 21 dà +5 Potenza orologio.",
    "If hand value is exactly 21, +10 Clock Power.": "Se il valore della mano è esattamente 21, +10 Potenza orologio.",
    "Gain +1 Base Torque for every 10 Pressure.": "Ottieni +1 Coppia base ogni 10 di pressione.",
    "Reduce Pressure by 5 after every hand.": "Riduce la pressione di 5 dopo ogni mano.",
    "Each Vent gives +4 Clock Power to your current hand (max +8).": "Ogni Sfiata dà +4 Potenza orologio alla mano attuale (max +8).",
    "+5 Clock Power every third Cycle.": "+5 Potenza orologio ogni terzo Ciclo.",
    "Start every Cycle with +15 Hull.": "Inizia ogni Ciclo con +15 Scafo.",
    "Gain +5 Base Torque when standing on 18+.": "Ottieni +5 Coppia base quando ti fermi con 18+.",
    "Double gives +5 Clock Power.": "Raddoppia dà +5 Potenza orologio.",
    "Enemy attacks deal 2 less damage.": "Gli attacchi nemici infliggono 2 danni in meno.",
    "Every 20 gives +8 Clock Power.": "Ogni 20 dà +8 Potenza orologio.",
    "After Bust, deal 10 damage to the enemy.": "Dopo uno sballo, infliggi 10 danni al nemico.",
    "Maximum Pressure becomes 120.": "La pressione massima diventa 120.",
    "Start each Cycle with +25 Hull.": "Inizia ogni Ciclo con +25 Scafo.",
    "Blackjack gives +10 Clock Power.": "Il Blackjack dà +10 Potenza orologio.",
    "Stand on 20 or 21 gives +10 Base Torque.": "Fermarsi su 20 o 21 dà +10 Coppia base.",
    "Damage ignores 5 enemy Armor.": "Il danno ignora 5 di Corazza nemica.",
    "Every 10th Cycle gives +20 Clock Power.": "Ogni 10° Ciclo dà +20 Potenza orologio.",
    "Natural Blackjack gives +15 Base Torque.": "Il Blackjack naturale dà +15 Coppia base.",
    "Vent removes 45 Pressure.": "Sfiata rimuove 45 di pressione.",
    "+5 Clock Power every hand.": "+5 Potenza orologio a ogni mano.",
    "Natural Blackjack starts with 35 Base Torque.": "Il Blackjack naturale parte da 35 di Coppia base.",
    "All Clock Power bonuses are increased by 25%.": "Tutti i bonus di Potenza orologio aumentano del 25%.",
    "Gain +3 Cogs every time you win a round.": "Ottieni +3 Ingranaggi ogni volta che vinci un round.",
    "Repair 10 extra Hull when you destroy an enemy.": "Ripara 10 Scafo extra quando distruggi un nemico.",
    "Every Vent earns you +2 Cogs.": "Ogni Sfiata ti fa guadagnare +2 Ingranaggi.",
    "Overheat deals 5 Hull damage instead of 15.": "Il surriscaldamento infligge 5 danni allo Scafo invece di 15.",
    "Your damage is +30%, but enemy hits deal +3 damage.": "I tuoi danni aumentano del 30%, ma i colpi nemici infliggono +3 danni.",
    "A Push deals 8 damage to the enemy.": "Un Pareggio infligge 8 danni al nemico.",
    "You can see the enemy's hidden card.": "Puoi vedere la carta coperta del nemico.",
    "Below 30% Hull, you deal +50% damage.": "Con meno del 30% di Scafo, infliggi +50% di danni.",
    "Double no longer increases the damage you take.": "Raddoppia non aumenta più i danni che subisci.",
    "Ignore the first enemy hit of every encounter.": "Ignora il primo colpo nemico di ogni incontro.",
    "Winning with 20 or more ignores all enemy Armor.": "Vincere con 20 o più ignora tutta la Corazza nemica.",
    "HIT adds no Pressure.": "CARTA non aggiunge pressione."
};


/* Words used inside rules */
const IT_TYPE = { COMMON: "COMUNE", ELITE: "ELITE", BOSS: "BOSS" };


function itName(name) {

    return IT[name] || name;
}


const IT_RULES = [

    [/^TIER (\S+)(?: - (COMMON|ELITE|BOSS))?$/, function (tier, type) {
        return "LIVELLO " + tier + (type ? " - " + IT_TYPE[type] : "");
    }],

    [/^ENCOUNTER \[(COMMON|ELITE|BOSS)\]: (.+)\.$/, function (type, name) {
        return "INCONTRO [" + IT_TYPE[type] + "]: " + itName(name) + ".";
    }],

    [/^ENEMY ABILITY: (.+)\.$/, function (ability) {
        return "ABILITÀ NEMICA: " + itName(ability) + ".";
    }],

    [/^HIT: HAND VALUE (\d+)\.$/, function (n) { return "CARTA: VALORE MANO " + n + "."; }],
    [/^STAND: HAND VALUE (\d+)\.$/, function (n) { return "STAI: VALORE MANO " + n + "."; }],

    [/^DOUBLE: HAND VALUE (\d+)\. DAMAGE DEALT AND TAKEN IS DOUBLED\.$/, function (n) {
        return "RADDOPPIA: VALORE MANO " + n + ". DANNI INFLITTI E SUBITI RADDOPPIATI.";
    }],

    [/^ENEMY HAND: (\d+)( \(BUST\))?\.$/, function (n, bust) {
        return "MANO NEMICA: " + n + (bust ? " (SBALLATA)" : "") + ".";
    }],

    [/^YOU WIN: (\d+) VS (\d+)\.$/, function (a, b) { return "VINCI: " + a + " CONTRO " + b + "."; }],
    [/^YOU LOSE: (\d+) VS (\d+)\.$/, function (a, b) { return "PERDI: " + a + " CONTRO " + b + "."; }],
    [/^PUSH: (\d+) VS (\d+)\.$/, function (a, b) { return "PAREGGIO: " + a + " CONTRO " + b + "."; }],

    [/^(.+) DEALT (\d+) DAMAGE\.$/, function (source, n) {
        return itName(source) + " HA INFLITTO " + n + " DANNI.";
    }],

    [/^DAMAGE OUTPUT: (\d+)\.$/, function (n) { return "DANNO INFLITTO: " + n + "."; }],

    [/^(.+) HITS YOU FOR (\d+)\.$/, function (name, n) {
        return itName(name) + " TI COLPISCE PER " + n + ".";
    }],

    [/^OVERHEAT: (\d+) HULL DAMAGE\.$/, function (n) {
        return "SURRISCALDAMENTO: " + n + " DANNI ALLO SCAFO.";
    }],

    [/^VENT: (\d+) PRESSURE RELEASED\.$/, function (n) {
        return "SFIATA: " + n + " DI PRESSIONE RILASCIATA.";
    }],

    [/^STEAM VALVE: \+(\d+) CLOCK POWER THIS HAND\.$/, function (n) {
        return "VALVOLA A VAPORE: +" + n + " POTENZA OROLOGIO IN QUESTA MANO.";
    }],

    [/^HULL REPAIRED: \+(\d+)\.$/, function (n) { return "SCAFO RIPARATO: +" + n + "."; }],

    [/^(.+) DESTROYED\.$/, function (name) { return itName(name) + " DISTRUTTO."; }],
    [/^(.+) DESTROYED$/, function (name) { return itName(name) + " DISTRUTTO"; }],

    [/^REWARD: (\d+) COGS\.$/, function (n) { return "RICOMPENSA: " + n + " INGRANAGGI."; }],

    [/^ECHO EQUIPPED: (.+)\.$/, function (name) { return "ECO EQUIPAGGIATO: " + itName(name) + "."; }],

    [/^ECHO REPLACED: (.+) → (.+)\.$/, function (a, b) {
        return "ECO SOSTITUITO: " + itName(a) + " → " + itName(b) + ".";
    }],

    [/^MUSIC FILE NOT FOUND: (.+)$/, function (file) { return "FILE MUSICALE NON TROVATO: " + file; }],

    [/^RUN RESTORED\. CYCLE (\d+)\.$/, function (n) { return "PARTITA RIPRISTINATA. CICLO " + n + "."; }],

    [/^\+(\d+) COGS$/, function (n) { return "+" + n + " INGRANAGGI"; }],

    [/^-(\d+) OVERHEAT$/, function (n) { return "-" + n + " SURRISCALD."; }],
    [/^-(\d+) PRESSURE$/, function (n) { return "-" + n + " PRESSIONE"; }],

    [/^(\d+) BUST$/, function (n) { return n + " SBALLATA"; }],
    [/^YOU TAKE (\d+)$/, function (n) { return "SUBISCI " + n; }],
    [/^IF YOU WIN: (\d+) DMG$/, function (n) { return "SE VINCI: " + n + " DANNI"; }],
    [/^IF YOU LOSE: (\d+) DMG$/, function (n) { return "SE PERDI: " + n + " DANNI"; }],

    [/^(BUY|REPLACE) - (\d+) COGS$/, function (verb, n) {
        return (verb === "BUY" ? "COMPRA" : "SOSTITUISCI") + " - " + n + " INGRANAGGI";
    }],

    [/^CONTINUE RUN - CYCLE (\d+)$/, function (n) { return "CONTINUA LA PARTITA - CICLO " + n; }],
    [/^BEST CYCLE (\d+)$/, function (n) { return "MIGLIOR CICLO " + n; }],

    [/^(WORN|FORGED|ENGINEERED|RELIC) - (\d+) COGS( - EQUIPPED)?$/, function (rarity, n, equipped) {
        return IT[rarity] + " - " + n + " INGRANAGGI" + (equipped ? " - EQUIPAGGIATO" : "");
    }],

    [/^Delete profile (.+) and all its progress\?$/, function (name) {
        return "Eliminare il profilo " + name + " e tutti i suoi progressi?";
    }],

    [/^Delete profile (.+)$/, function (name) { return "Elimina il profilo " + name; }]
];


/* ---------- translator ---------- */

function trString(raw) {

    if (uiLang !== "it" || typeof raw !== "string") {
        return raw;
    }

    const parts = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);

    const core = parts[2].replace(/\s+/g, " ");

    if (!core) {
        return raw;
    }

    let out = IT[core];

    if (out === undefined) {

        for (let i = 0; i < IT_RULES.length; i++) {

            const match = IT_RULES[i][0].exec(core);

            if (match) {
                out = IT_RULES[i][1].apply(null, match.slice(1));
                break;
            }
        }
    }

    return out === undefined ? raw : parts[1] + out + parts[3];
}


/* ---------- DOM translation ---------- */

const i18nNodeState = new WeakMap();
const i18nAttrState = new WeakMap();

let i18nObserver = null;


function i18nTextNode(node) {

    const parent = node.parentNode;

    if (!parent) {
        return;
    }

    const tag = parent.nodeName;

    if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA") {
        return;
    }

    const state = i18nNodeState.get(node);

    const raw =
        state && node.nodeValue === state.shown
            ? state.raw
            : node.nodeValue;

    const out = trString(raw);

    if (out !== node.nodeValue) {
        node.nodeValue = out;
    }

    i18nNodeState.set(node, { raw: raw, shown: out });
}


function i18nAttributes(element) {

    ["aria-label", "placeholder"].forEach(function (attribute) {

        if (!element.hasAttribute || !element.hasAttribute(attribute)) {
            return;
        }

        const stored = i18nAttrState.get(element) || {};

        const current = element.getAttribute(attribute);

        const entry = stored[attribute];

        const raw = entry && current === entry.shown ? entry.raw : current;

        const out = trString(raw);

        if (out !== current) {
            element.setAttribute(attribute, out);
        }

        stored[attribute] = { raw: raw, shown: out };

        i18nAttrState.set(element, stored);
    });
}


function i18nTree(root) {

    if (!root) {
        return;
    }

    if (root.nodeType === 3) {
        i18nTextNode(root);
        return;
    }

    if (root.nodeType !== 1) {
        return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

    const nodes = [];

    while (walker.nextNode()) {
        nodes.push(walker.currentNode);
    }

    nodes.forEach(i18nTextNode);

    i18nAttributes(root);

    root.querySelectorAll("[aria-label], [placeholder]").forEach(i18nAttributes);
}


function i18nObserve(enabled) {

    if (typeof MutationObserver === "undefined") {
        return;
    }

    if (!i18nObserver) {

        i18nObserver = new MutationObserver(function (records) {

            records.forEach(function (record) {

                if (record.type === "characterData") {
                    i18nTextNode(record.target);
                }
                else {
                    record.addedNodes.forEach(i18nTree);
                }
            });

            /* drop the mutations caused by our own changes */
            i18nObserver.takeRecords();
        });
    }

    i18nObserver.disconnect();

    if (enabled) {

        i18nObserver.observe(document.body, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }
}


function updateLangButtons() {

    document.querySelectorAll("[data-lang]").forEach(function (button) {

        const active = button.getAttribute("data-lang") === uiLang;

        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
    });
}


function setLanguage(code) {

    uiLang = code === "it" ? "it" : "en";

    try {
        localStorage.setItem(I18N_KEY, uiLang);
    }
    catch (error) {
        /* ignore */
    }

    document.documentElement.lang = uiLang;

    if (typeof refreshAfterLanguage === "function") {
        refreshAfterLanguage();
    }

    i18nTree(document.body);

    i18nObserve(uiLang === "it");

    updateLangButtons();
}


function initI18n() {

    let stored = null;

    try {
        stored = localStorage.getItem(I18N_KEY);
    }
    catch (error) {
        stored = null;
    }

    if (stored !== "it" && stored !== "en") {

        const browser =
            (typeof navigator !== "undefined" && navigator.language) || "en";

        stored = browser.toLowerCase().indexOf("it") === 0 ? "it" : "en";
    }

    setLanguage(stored);
}


/* ---------- Italian field manual ---------- */

function helpHtmlIt(tab) {

    if (tab === "BASICS") {

        return "<h3>IL DUELLO</h3>" +
            "<p>Ogni ciclo è un duello di Blackjack contro una macchina. Tu e il nemico ricevete due carte, e una delle carte del nemico resta coperta.</p>" +
            "<h3>IL TUO TURNO</h3>" +
            "<p><b>CARTA</b> pesca una carta. <b>STAI</b> tiene la tua mano: il nemico scopre la sua carta e pesca fino a 17. <b>RADDOPPIA</b> (solo con le prime due carte) pesca una carta e si ferma, raddoppiando i danni inflitti e subiti. <b>SFIATA</b> rilascia pressione gratis.</p>" +
            "<h3>VINCERE UN ROUND</h3>" +
            "<p>Vince il totale più alto (massimo 21). <b>Se vinci, colpisci il nemico. Se perdi o sballi, ti colpisce il nemico.</b> Il pareggio non fa danno a nessuno. Un Blackjack naturale (Asso + carta da 10) batte qualsiasi altra mano.</p>" +
            "<h3>LA PARTITA</h3>" +
            "<p>Distruggi le macchine per guadagnare Ingranaggi. Ogni 3° nemico distrutto apre l'Officina, dove puoi comprare Echi (massimo 3 equipaggiati). I boss la aprono sempre e ti regalano un Eco. Se lo Scafo arriva a 0 la partita finisce; il tuo miglior ciclo resta salvato nel profilo.</p>" +
            "<h3>SCORCIATOIE DA TASTIERA</h3>" +
            "<p><kbd>H</kbd> Carta &nbsp; <kbd>S</kbd> Stai &nbsp; <kbd>D</kbd> Raddoppia &nbsp; <kbd>V</kbd> Sfiata &nbsp; <kbd>M</kbd> Musica &nbsp; <kbd>?</kbd> Guida &nbsp; <kbd>Esc</kbd> Menu<br>(le lettere sono le iniziali inglesi: Hit, Stand, Double, Vent)</p>" +
            "<h3>SUGGERIMENTO</h3>" +
            "<p>Passa il mouse (o tocca) su statistiche, valori del nemico, pulsanti ed Echi per vedere cosa fanno. I due indicatori sopra le carte mostrano il danno che infliggeresti o subiresti in questo momento.</p>";
    }

    if (tab === "STATS") {

        return "<h3>SCAFO</h3><p>La tua salute. A 0 la partita è finita. Distruggere i nemici ripara un po' di Scafo, e così fanno certi Echi.</p>" +
            "<h3>PRESSIONE</h3><p>CARTA aggiunge 5, RADDOPPIA 10, uno sballo 20. Oltre il limite (100, o 120 con la Camera di pressione) il motore si surriscalda: perdi Scafo e la pressione si azzera. SFIATA ne rilascia 30.</p>" +
            "<h3>COPPIA BASE E POTENZA OROLOGIO</h3>" +
            "<p>La Coppia base è il valore della tua mano più i bonus degli Echi. La Potenza orologio è un moltiplicatore che cresce con le mani forti:</p>" +
            "<table class=\"help-table\"><tr><th>MANO</th><th>POTENZA OROLOGIO</th></tr>" +
            "<tr><td>17 o meno</td><td>+0</td></tr><tr><td>18</td><td>+3</td></tr><tr><td>19</td><td>+5</td></tr><tr><td>20</td><td>+8</td></tr><tr><td>21</td><td>+12</td></tr>" +
            "<tr><td>Blackjack naturale</td><td>25 di Coppia, +15 di Potenza orologio</td></tr></table>" +
            "<h3>DANNO</h3>" +
            "<span class=\"formula\">danno = Coppia x (1 + Potenza orologio / 10) - Corazza del nemico</span>" +
            "<p>Minimo 1 danno. RADDOPPIA lo raddoppia, in entrambe le direzioni.</p>";
    }

    if (tab === "ENEMIES") {

        const rows = ["COMMON", "ELITE", "BOSS"].map(function (key) {

            const type = ENEMY_TYPES[key];

            return "<tr><td><b>" + IT_TYPE[key] + "</b></td><td>" + type.attack +
                "</td><td>" + type.armor + "</td><td>" + type.hull +
                "</td><td>x" + type.loot + "</td><td>+" + type.repair + "</td></tr>";
        }).join("");

        return "<h3>TRE TIPI DI MACCHINE</h3>" +
            "<p>Quasi tutti gli scontri sono contro macchine comuni. Ogni 5° nemico è un <b>Elite</b> e ogni 10° è un <b>Boss</b>.</p>" +
            "<table class=\"help-table\"><tr><th>TIPO</th><th>ATTACCO</th><th>CORAZZA</th><th>SCAFO</th><th>BOTTINO</th><th>RIPARAZIONE</th></tr>" +
            rows + "</table>" +
            "<p>I valori sono quelli del Livello I. Ogni 10 cicli inizia un nuovo livello: i nemici ottengono +2 Attacco, +1 Corazza e il 25% di Scafo in più.</p>" +
            "<h3>RICOMPENSA DEL BOSS</h3>" +
            "<p>Un boss sconfitto apre l'Officina e ti permette di prendere un Eco (Forgiato o superiore) gratis.</p>";
    }

    return "<h3>RARITÀ</h3>" +
        "<p><b>USURATO</b> 10 ingranaggi, <b>FORGIATO</b> 18, <b>PROGETTATO</b> 28, <b>RELIQUIA</b> 45. Puoi equipaggiarne tre alla volta e cambiarli nell'Officina.</p>";
}
