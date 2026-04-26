// Konfigurasjon av dyr for hver gangetabell
const tableConfig = {
    1: { animal: '🐨', name: '1-gangen' },
    2: { animal: '🐱', name: '2-gangen' },
    3: { animal: '🐯', name: '3-gangen' },
    4: { animal: '🦁', name: '4-gangen' },
    5: { animal: '🐻', name: '5-gangen' },
    6: { animal: '🐼', name: '6-gangen' },
    7: { animal: '🐶', name: '7-gangen' },
    8: { animal: '🦊', name: '8-gangen' },
    9: { animal: '🐰', name: '9-gangen' },
    10: { animal: '🦒', name: '10-gangen' }
};

// Positive meldinger for perfekt score
const perfectMessages = [
    'Fantastisk!',
    'Kjempebra!',
    'Supert!',
    'Utrolig!',
    'Perfekt!',
    'Helt rått!',
    'Strålende!'
];

// Fremgang - lagre hvilke tabeller som er fullført med medalje
function getProgress() {
    const saved = localStorage.getItem('gangemester_progress');
    const progress = saved ? JSON.parse(saved) : {};

    // Migrer gammel struktur til ny struktur
    let needsMigration = false;
    for (const table in progress) {
        // Gammel struktur: string
        if (typeof progress[table] === 'string') {
            const oldMedal = progress[table];
            progress[table] = {
                ascending: { medal: oldMedal, goldCount: 0 },
                mixed: { medal: null, goldCount: 0 }
            };
            needsMigration = true;
        }
        // Halvgammel struktur: object med ascending/mixed som strings
        else if (progress[table].ascending && typeof progress[table].ascending === 'string') {
            const ascMedal = progress[table].ascending;
            const mixMedal = progress[table].mixed;
            progress[table] = {
                ascending: { medal: ascMedal, goldCount: ascMedal === '🥇' ? 1 : 0 },
                mixed: { medal: mixMedal, goldCount: mixMedal === '🥇' ? 1 : 0 }
            };
            needsMigration = true;
        }
    }

    // Lagre migrert data
    if (needsMigration) {
        localStorage.setItem('gangemester_progress', JSON.stringify(progress));
    }

    return progress;
}

function saveProgress(table, medal, mode) {
    const progress = getProgress();

    // Initialiser tabell hvis den ikke finnes, eller konverter gammel struktur
    if (!progress[table] || typeof progress[table] === 'string') {
        progress[table] = {
            ascending: { medal: null, goldCount: 0 },
            mixed: { medal: null, goldCount: 0 }
        };
    }

    // Konverter gammel struktur (kun medalje) til ny struktur (medalje + goldCount)
    if (progress[table][mode] && typeof progress[table][mode] === 'string') {
        const oldMedal = progress[table][mode];
        progress[table][mode] = { medal: oldMedal, goldCount: 0 };
    }

    // Sørg for at struktur eksisterer
    if (!progress[table][mode]) {
        progress[table][mode] = { medal: null, goldCount: 0 };
    }

    const currentData = progress[table][mode];
    const currentMedal = currentData.medal;

    // Oppdater medalje hvis ny er bedre
    if (!currentMedal || getMedalValue(medal) > getMedalValue(currentMedal)) {
        progress[table][mode].medal = medal;
    }

    // Øk goldCount hvis dette er gull
    if (medal === '🥇') {
        progress[table][mode].goldCount = (currentData.goldCount || 0) + 1;

        // Hvis 3 eller flere gull, oppgrader til krone
        if (progress[table][mode].goldCount >= 3) {
            progress[table][mode].medal = '👑';
        }
    }

    localStorage.setItem('gangemester_progress', JSON.stringify(progress));
}

function getMedalValue(medal) {
    if (medal === '👑') return 5;
    if (medal === '🥇') return 4;
    if (medal === '🥈') return 3;
    if (medal === '🥉') return 2;
    return 0;
}

// Rekorttider - lagre beste tid per tabell
function getBestTimes() {
    const saved = localStorage.getItem('gangemester_best_times');
    return saved ? JSON.parse(saved) : {};
}

function saveBestTime(key, time) {
    const bestTimes = getBestTimes();
    const hadPreviousTime = bestTimes[key] !== undefined;

    if (!bestTimes[key] || time < bestTimes[key]) {
        bestTimes[key] = time;
        localStorage.setItem('gangemester_best_times', JSON.stringify(bestTimes));
        return hadPreviousTime; // Ny rekord kun hvis det fantes tidligere tid
    }
    return false;
}

function getTimeKey(tables, questionCount, mode) {
    // Generer unik nøkkel for denne quizen med modus
    let baseKey;
    if (questionCount === 100) {
        baseKey = 'full-test';
    } else if (questionCount === 20) {
        baseKey = tables.length > 1 ? `group-${tables[0]}-${tables[tables.length - 1]}` : `table-${tables[0]}`;
    } else {
        baseKey = `table-${tables[0]}`;
    }
    return `${baseKey}-${mode}`;
}

function updateMedalDisplay() {
    const progress = getProgress();
    numberCards.forEach(card => {
        const table = card.dataset.table;
        const medalEl = card.querySelector('.card-medal');

        // Vis medalje for valgt modus
        if (progress[table] && progress[table][currentMode]) {
            const modeData = progress[table][currentMode];
            // Håndter både ny struktur (object) og gammel struktur (string)
            const medal = typeof modeData === 'string' ? modeData : modeData.medal;

            if (medal) {
                medalEl.textContent = medal;
                medalEl.classList.add('show');
            } else {
                medalEl.classList.remove('show');
            }
        } else {
            medalEl.classList.remove('show');
        }
    });
}

// Globale variabler
let currentMode = 'ascending'; // 'ascending' eller 'mixed'
let currentQuizType = 'single'; // 'single', 'group-1-5', 'group-6-10', 'full-test'
let currentQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let startTime = null;
let selectedTables = [];

// DOM-elementer
const splashScreen = document.getElementById('splash-screen');
const menuScreen = document.getElementById('menu-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const tabs = document.querySelectorAll('.tab');
const numberCards = document.querySelectorAll('.number-card');
const groupCards = document.querySelectorAll('.group-card');
const fullTestCard = document.querySelector('.full-test-card');

const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');
const animalIcon = document.getElementById('animal-icon');
const questionEl = document.getElementById('question');
const answerInput = document.getElementById('answer-input');
const skipBtn = document.getElementById('skip-btn');
const cancelBtn = document.getElementById('cancel-btn');

const celebrationIcon = document.getElementById('celebration-icon');
const resultTitle = document.getElementById('result-title');
const scoreBig = document.getElementById('score-big');
const scorePercent = document.getElementById('score-percent');
const timeStat = document.getElementById('time-stat');
const medalIcon = document.getElementById('medal-icon');
const medalText = document.getElementById('medal-text');
const recordStat = document.getElementById('record-stat');
const recordText = document.getElementById('record-text');
const retryBtn = document.getElementById('retry-btn');
const menuBtn = document.getElementById('menu-btn');

// Event listeners for meny
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentMode = tab.dataset.mode;
        updateMedalDisplay(); // Oppdater medaljer når modus endres
    });
});

numberCards.forEach(card => {
    card.addEventListener('click', () => {
        const table = parseInt(card.dataset.table);
        startQuiz([table]);
    });
});

groupCards.forEach(card => {
    card.addEventListener('click', () => {
        const range = card.dataset.range;
        const [start, end] = range.split('-').map(Number);
        const tables = [];
        for (let i = start; i <= end; i++) {
            tables.push(i);
        }
        startQuiz(tables, 20);
    });
});

fullTestCard.addEventListener('click', () => {
    // Test hele: alle kombinasjoner 1x1 til 10x10 = 100 spørsmål
    startFullTest();
});

// Event listeners for quiz
cancelBtn.addEventListener('click', () => {
    showScreen('menu');
    updateMedalDisplay();
});

skipBtn.addEventListener('click', () => {
    nextQuestion();
});

answerInput.addEventListener('input', () => {
    const userAnswer = parseInt(answerInput.value);
    const correctAnswer = currentQuestions[currentQuestionIndex].answer;

    // Sjekk om brukeren har skrevet nok siffer
    if (answerInput.value.length >= correctAnswer.toString().length) {
        if (userAnswer === correctAnswer) {
            // Riktig svar!
            answerInput.classList.add('correct');
            correctAnswers++;

            // Auto-advance etter kort pause
            setTimeout(() => {
                answerInput.classList.remove('correct');
                nextQuestion();
            }, 500);
        } else {
            // Feil svar - vis rød feedback og gå videre
            answerInput.classList.add('incorrect');

            setTimeout(() => {
                answerInput.classList.remove('incorrect');
                nextQuestion();
            }, 500);
        }
    }
});

// Event listeners for resultat
retryBtn.addEventListener('click', () => {
    startQuiz(selectedTables, currentQuestions.length);
});

menuBtn.addEventListener('click', () => {
    showScreen('menu');
});

// Funksjoner
function showScreen(screen) {
    splashScreen.classList.remove('active');
    menuScreen.classList.remove('active');
    quizScreen.classList.remove('active');
    resultScreen.classList.remove('active');

    if (screen === 'splash') {
        splashScreen.classList.add('active');
    } else if (screen === 'menu') {
        menuScreen.classList.add('active');
        updateMedalDisplay();
    } else if (screen === 'quiz') {
        quizScreen.classList.add('active');
    } else if (screen === 'result') {
        resultScreen.classList.add('active');
    }
}

function startQuiz(tables, questionCount = 10) {
    selectedTables = tables;
    currentQuestions = generateQuestions(tables, questionCount);
    currentQuestionIndex = 0;
    correctAnswers = 0;
    startTime = Date.now();

    // Bestem quiz-type
    if (questionCount === 20 && tables.length > 1) {
        // Gruppe quiz
        if (tables.includes(1) || tables.includes(2)) {
            currentQuizType = 'group-1-5';
        } else {
            currentQuizType = 'group-6-10';
        }
    } else {
        currentQuizType = 'single';
    }

    showScreen('quiz');
    showQuestion();
}

function startFullTest() {
    // Generer alle kombinasjoner 1x1 til 10x10
    const allQuestions = [];
    for (let table = 1; table <= 10; table++) {
        for (let multiplier = 1; multiplier <= 10; multiplier++) {
            allQuestions.push({
                table: table,
                multiplier: multiplier,
                answer: table * multiplier
            });
        }
    }

    // Bland spørsmålene
    for (let i = allQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    selectedTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    currentQuestions = allQuestions;
    currentQuestionIndex = 0;
    correctAnswers = 0;
    startTime = Date.now();
    currentQuizType = 'full-test';

    showScreen('quiz');
    showQuestion();
}

function generateQuestions(tables, count) {
    const questions = [];

    if (currentMode === 'ascending') {
        // Stigende: 1, 2, 3, ... 10 (repeterer hvis mer enn 10)
        for (let i = 0; i < count; i++) {
            const table = tables[Math.floor(Math.random() * tables.length)];
            const multiplier = (i % 10) + 1;

            questions.push({
                table: table,
                multiplier: multiplier,
                answer: table * multiplier
            });
        }
    } else {
        // Blandet: generer alle mulige kombinasjoner, bland og velg unike
        const allPossible = [];

        tables.forEach(table => {
            for (let multiplier = 1; multiplier <= 10; multiplier++) {
                allPossible.push({
                    table: table,
                    multiplier: multiplier,
                    answer: table * multiplier
                });
            }
        });

        // Bland alle kombinasjoner
        for (let i = allPossible.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allPossible[i], allPossible[j]] = [allPossible[j], allPossible[i]];
        }

        // Velg de første 'count' spørsmålene (garantert unike)
        return allPossible.slice(0, count);
    }

    return questions;
}

function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    const totalQuestions = currentQuestions.length;

    // Oppdater progress
    progressText.textContent = `Oppgave ${currentQuestionIndex + 1} av ${totalQuestions}`;
    const progressPercent = ((currentQuestionIndex) / totalQuestions) * 100;
    progressBar.style.width = progressPercent + '%';

    // Sett bakgrunnsfarge basert på quiz-type
    if (currentQuizType === 'single') {
        quizScreen.className = 'screen active table-' + question.table;
    } else {
        quizScreen.className = 'screen active ' + currentQuizType;
    }

    // Vis emoji og spørsmål basert på quiz-type
    if (currentQuizType === 'group-1-5') {
        animalIcon.textContent = '🐙';
    } else if (currentQuizType === 'group-6-10') {
        animalIcon.textContent = '🦋';
    } else if (currentQuizType === 'full-test') {
        animalIcon.textContent = '👑';
    } else {
        animalIcon.textContent = tableConfig[question.table].animal;
    }

    questionEl.textContent = `${question.table} × ${question.multiplier} = ?`;

    // Tøm input
    answerInput.value = '';

    // Scroll til toppen før fokus (iOS fix)
    window.scrollTo(0, 0);

    // Fokuser input
    answerInput.focus();

    // Scroll igjen etter kort delay (iOS Safari scroller etter focus)
    setTimeout(() => {
        window.scrollTo(0, 0);
        quizScreen.scrollTop = 0;
    }, 100);
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex >= currentQuestions.length) {
        // Quiz ferdig!
        showResults();
    } else {
        showQuestion();
    }
}

function showResults() {
    const totalQuestions = currentQuestions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const elapsedTime = Math.round((Date.now() - startTime) / 1000);
    const isPerfect = correctAnswers === totalQuestions;
    const errors = totalQuestions - correctAnswers;

    // Oppdater resultattekster
    scoreBig.textContent = `${correctAnswers}/${totalQuestions}`;
    scorePercent.textContent = `${percentage}%`;
    timeStat.textContent = `Tid: ${elapsedTime} sekunder`;

    // Hent score-card element
    const scoreCard = document.querySelector('.score-card');

    let medal = null;
    let medalName = '';
    let showConfetti = false;
    let isNewRecord = false;

    // Spesiallogikk for Full Test (100 spørsmål) - feilbasert
    if (totalQuestions === 100) {
        if (errors === 0) {
            // Perfekt - gull
            medal = '🥇';
            medalName = 'Gullmedalje!';
            celebrationIcon.textContent = '🎉';
            const randomMessage = perfectMessages[Math.floor(Math.random() * perfectMessages.length)];
            resultTitle.textContent = randomMessage;
            scoreCard.className = 'score-card perfect';
            showConfetti = true;

            // Sjekk rekorttid kun ved perfekt
            const timeKey = getTimeKey(selectedTables, totalQuestions, currentMode);
            isNewRecord = saveBestTime(timeKey, elapsedTime);
        } else if (errors < 5) {
            // Mindre enn 5 feil - sølv
            medal = '🥈';
            medalName = 'Sølvmedalje!';
            celebrationIcon.textContent = '🎉';
            resultTitle.textContent = 'Kjempebra!';
            scoreCard.className = 'score-card perfect';
            showConfetti = true;
        } else if (errors < 11) {
            // Mindre enn 11 feil - bronse
            medal = '🥉';
            medalName = 'Bronsemedalje!';
            celebrationIcon.textContent = '🎉';
            resultTitle.textContent = 'Godt jobbet!';
            scoreCard.className = 'score-card perfect';
            showConfetti = true;
        } else {
            // For mange feil - ingen medalje
            celebrationIcon.textContent = '🤓';
            resultTitle.textContent = 'Godt forsøk!';
            scoreCard.className = 'score-card not-perfect';
        }

        // Lagre fremgang for full test hvis medalje oppnådd
        if (medal) {
            // Full test lagres ikke per tabell, så vi kan bruke table "0" som placeholder
            // Eller vi kan velge å ikke lagre det på kort, bare vise på resultatskjerm
            medalIcon.textContent = medal;
            medalText.textContent = medalName;
        } else {
            medalIcon.textContent = '';
            medalText.textContent = '';
        }

        recordStat.style.display = isNewRecord ? 'block' : 'none';
        if (isNewRecord) {
            recordStat.classList.add('pulse');
            recordText.textContent = '🏆 Rekorttid!';
        }

        // Knapper
        if (medal) {
            retryBtn.classList.remove('primary');
            menuBtn.classList.add('primary');
        } else {
            retryBtn.classList.add('primary');
            menuBtn.classList.remove('primary');
        }
    }
    // Normal logikk for enkelttabeller og grupper - tidsbasert
    else if (isPerfect) {
        // Perfekt score: 10/10 eller 20/20
        const randomMessage = perfectMessages[Math.floor(Math.random() * perfectMessages.length)];
        celebrationIcon.textContent = '🎉';
        resultTitle.textContent = randomMessage;
        scoreCard.className = 'score-card perfect';

        // Sjekk rekorttid
        const timeKey = getTimeKey(selectedTables, totalQuestions, currentMode);
        isNewRecord = saveBestTime(timeKey, elapsedTime);

        // Bestem medalje basert på tid (null hvis ikke god nok tid)
        medal = null;
        medalName = '';

        if (totalQuestions === 10) {
            // Enkelt tabell - forskjellige tider basert på vanskelighetsgrad
            const table = selectedTables[0];
            let goldTime, silverTime, bronzeTime;

            if ([1, 2, 5, 10].includes(table)) {
                // Lette tabeller
                goldTime = 12;
                silverTime = 18;
                bronzeTime = 25;
            } else if ([3, 4, 6, 8].includes(table)) {
                // Medium tabeller
                goldTime = 20;
                silverTime = 28;
                bronzeTime = 38;
            } else {
                // Vanskelige tabeller (7, 9)
                goldTime = 25;
                silverTime = 35;
                bronzeTime = 45;
            }

            if (elapsedTime <= goldTime) {
                medal = '🥇';
                medalName = 'Gullmedalje!';
            } else if (elapsedTime <= silverTime) {
                medal = '🥈';
                medalName = 'Sølvmedalje!';
            } else if (elapsedTime <= bronzeTime) {
                medal = '🥉';
                medalName = 'Bronsemedalje!';
            }
        } else if (totalQuestions === 20) {
            // Gruppe (1-5 eller 6-10)
            const isEasyGroup = selectedTables.includes(1) || selectedTables.includes(2);

            if (isEasyGroup) {
                // 1-5 gangen (20 spørsmål)
                if (elapsedTime <= 35) {
                    medal = '🥇';
                    medalName = 'Gullmedalje!';
                } else if (elapsedTime <= 50) {
                    medal = '🥈';
                    medalName = 'Sølvmedalje!';
                } else if (elapsedTime <= 70) {
                    medal = '🥉';
                    medalName = 'Bronsemedalje!';
                }
            } else {
                // 6-10 gangen (20 spørsmål)
                if (elapsedTime <= 50) {
                    medal = '🥇';
                    medalName = 'Gullmedalje!';
                } else if (elapsedTime <= 70) {
                    medal = '🥈';
                    medalName = 'Sølvmedalje!';
                } else if (elapsedTime <= 90) {
                    medal = '🥉';
                    medalName = 'Bronsemedalje!';
                }
            }
        }

        medalIcon.textContent = medal || '';
        medalText.textContent = medalName;

        // Vis rekorttid hvis aktuelt
        if (isNewRecord) {
            recordStat.style.display = 'block';
            recordStat.classList.add('pulse');
            recordText.textContent = '🏆 Rekorttid!';
        } else {
            recordStat.style.display = 'none';
        }

        // Lagre fremgang hvis enkelt tabell OG medalje oppnådd
        if (selectedTables.length === 1 && medal) {
            saveProgress(selectedTables[0], medal, currentMode);
        }

        // Knapper: menu-btn er primary (blå), retry-btn er secondary (grå)
        retryBtn.classList.remove('primary');
        menuBtn.classList.add('primary');

        // Vis confetti kun for medaljer
        if (medal) {
            showConfetti = true;
        }
    } else {
        // Ikke perfekt (for enkelttabeller og grupper)
        celebrationIcon.textContent = '🤓';
        resultTitle.textContent = 'Godt forsøk!';
        scoreCard.className = 'score-card not-perfect';
        medalIcon.textContent = '';
        medalText.textContent = '';
        recordStat.style.display = 'none';

        // Knapper: retry-btn er primary (blå), menu-btn er secondary (grå)
        retryBtn.classList.add('primary');
        menuBtn.classList.remove('primary');
    }

    // Vis confetti hvis det er fortjent
    if (showConfetti) {
        createConfetti();
    }

    showScreen('result');
}

function createConfetti() {
    const colors = ['#FFD700', '#4285F4', '#34A853', '#EA4335', '#FBBC04', '#FF6B9D', '#C369E8', '#00BFA5'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 8 + 6) + 'px';
            confetti.style.height = (Math.random() * 8 + 6) + 'px';
            confetti.style.opacity = Math.random() * 0.5 + 0.5;
            confetti.style.animationDelay = Math.random() * 0.3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2.5) + 's';

            // Tilfeldig form
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }

            document.body.appendChild(confetti);

            // Fjern confetti etter animasjon
            setTimeout(() => confetti.remove(), 5000);
        }, i * 20);
    }
}

// PWA installering
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registrert:', registration);
            })
            .catch(error => {
                console.log('Service Worker registrering feilet:', error);
            });
    });
}

// Initialiser
console.log('Gangemester lastet!');

// Vis splash screen ved oppstart
setTimeout(() => {
    // Fade ut splash screen
    splashScreen.classList.add('fade-out');

    // Vent på fade-out før vi viser menyen
    setTimeout(() => {
        showScreen('menu');
    }, 500);
}, 3500); // Vent 3.5 sekunder før vi starter fade-out
