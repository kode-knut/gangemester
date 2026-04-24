// Konfigurasjon av dyr for hver gangetabell
const tableConfig = {
    1: { animal: '🐶', name: '1-gangen' },
    2: { animal: '🐱', name: '2-gangen' },
    3: { animal: '🐰', name: '3-gangen' },
    4: { animal: '🦊', name: '4-gangen' },
    5: { animal: '🐻', name: '5-gangen' },
    6: { animal: '🐼', name: '6-gangen' },
    7: { animal: '🐨', name: '7-gangen' },
    8: { animal: '🦁', name: '8-gangen' },
    9: { animal: '🐯', name: '9-gangen' },
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
    return saved ? JSON.parse(saved) : {};
}

function saveProgress(table, medal) {
    const progress = getProgress();
    // Kun lagre hvis ny medalje er bedre enn eksisterende
    if (!progress[table] || getMedalValue(medal) > getMedalValue(progress[table])) {
        progress[table] = medal;
        localStorage.setItem('gangemester_progress', JSON.stringify(progress));
    }
}

function getMedalValue(medal) {
    if (medal === '🥇') return 3;
    if (medal === '🥈') return 2;
    if (medal === '🥉') return 1;
    return 0;
}

function updateMedalDisplay() {
    const progress = getProgress();
    numberCards.forEach(card => {
        const table = card.dataset.table;
        const medalEl = card.querySelector('.card-medal');
        if (progress[table]) {
            medalEl.textContent = progress[table];
            medalEl.classList.add('show');
        } else {
            medalEl.classList.remove('show');
        }
    });
}

// Globale variabler
let currentMode = 'ascending'; // 'ascending' eller 'mixed'
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
const retryBtn = document.getElementById('retry-btn');
const menuBtn = document.getElementById('menu-btn');

// Event listeners for meny
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentMode = tab.dataset.mode;
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
        startQuiz(tables, 50);
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

    showScreen('quiz');
    showQuestion();
}

function generateQuestions(tables, count) {
    const questions = [];

    for (let i = 0; i < count; i++) {
        const table = tables[Math.floor(Math.random() * tables.length)];
        let multiplier;

        if (currentMode === 'ascending') {
            // Stigende: 1, 2, 3, ... 10
            multiplier = (i % 10) + 1;
        } else {
            // Blandet: tilfeldig
            multiplier = Math.floor(Math.random() * 10) + 1;
        }

        questions.push({
            table: table,
            multiplier: multiplier,
            answer: table * multiplier
        });
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

    // Sett bakgrunnsfarge basert på gangetabell
    quizScreen.className = 'screen active table-' + question.table;

    // Vis dyr og spørsmål
    animalIcon.textContent = tableConfig[question.table].animal;
    questionEl.textContent = `${question.table} × ${question.multiplier} = ?`;

    // Tøm og fokuser input
    answerInput.value = '';
    answerInput.focus();
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

    // Oppdater resultattekster
    scoreBig.textContent = `${correctAnswers}/${totalQuestions}`;
    scorePercent.textContent = `${percentage}%`;
    timeStat.textContent = `Tid: ${elapsedTime} sekunder`;

    // Hent score-card element
    const scoreCard = document.querySelector('.score-card');

    if (isPerfect) {
        // Perfekt score: 10/10
        const randomMessage = perfectMessages[Math.floor(Math.random() * perfectMessages.length)];
        celebrationIcon.textContent = '🎉';
        resultTitle.textContent = randomMessage;
        scoreCard.className = 'score-card perfect';

        // Bestem medalje basert på tid
        let medal = '🥉';
        let medalName = 'Bronsemedalje!';

        if (totalQuestions === 10) {
            // Enkelt tabell
            if (elapsedTime < 30) {
                medal = '🥇';
                medalName = 'Gullmedalje!';
            } else if (elapsedTime <= 40) {
                medal = '🥈';
                medalName = 'Sølvmedalje!';
            }
        } else if (totalQuestions === 50) {
            // Gruppe (1-5 eller 6-10)
            if (elapsedTime < 150) {
                medal = '🥇';
                medalName = 'Gullmedalje!';
            } else if (elapsedTime <= 210) {
                medal = '🥈';
                medalName = 'Sølvmedalje!';
            }
        } else if (totalQuestions === 100) {
            // Full test (alle kombinasjoner)
            if (elapsedTime < 300) {
                medal = '🥇';
                medalName = 'Gullmedalje!';
            } else if (elapsedTime <= 420) {
                medal = '🥈';
                medalName = 'Sølvmedalje!';
            } else if (elapsedTime <= 600) {
                medal = '🥉';
                medalName = 'Bronsemedalje!';
            }
        }

        medalIcon.textContent = medal;
        medalText.textContent = medalName;

        // Lagre fremgang hvis enkelt tabell
        if (selectedTables.length === 1) {
            saveProgress(selectedTables[0], medal);
        }

        // Knapper: menu-btn er primary (grønn), retry-btn er secondary (grå)
        retryBtn.classList.remove('primary');
        menuBtn.classList.add('primary');

        // Vis confetti
        createConfetti();
    } else {
        // Ikke perfekt
        celebrationIcon.textContent = '🤓';
        resultTitle.textContent = 'Godt forsøk!';
        scoreCard.className = 'score-card not-perfect';
        medalIcon.textContent = '';
        medalText.textContent = '';

        // Knapper: retry-btn er primary (grønn), menu-btn er secondary (grå)
        retryBtn.classList.add('primary');
        menuBtn.classList.remove('primary');
    }

    showScreen('result');
}

function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(confetti);

            // Fjern confetti etter animasjon
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// PWA installering
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
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
