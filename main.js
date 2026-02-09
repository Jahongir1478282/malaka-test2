
// Qolgan kategoriyalar uchun ma'lumotlar HTML faylning davomida qo'shiladi...
// (Juda uzun bo'lgani uchun men buni alohida qismda yarataman)

let currentCategory = null;
let currentTests = [];
let currentQuestion = 0;
let answers = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Menu bosilganda
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        startTest(category);
    });
});

function startTest(category) {
    currentCategory = category;
    const allTests = allQuestions[`category${category}`];
    
    // 20 ta random test tanlash (yoki borini olish)
    const shuffledQuestions = shuffle([...allTests]);
    // Savollarning javob variantlarini ham aralashtiramiz
    currentTests = shuffledQuestions.slice(0, 20).map(q => {
        return {
            question: q.question,
            options: shuffle([...q.options]), // Variantlarni aralashtirish
            correct: q.correct
        };
    });
    
    currentQuestion = 0;
    answers = new Array(currentTests.length).fill(null);
    
    document.getElementById('menu').style.display = 'none';
    document.getElementById('testContainer').classList.add('active');
    
    renderTestNavigation();
    renderQuestion();
}

function renderTestNavigation() {
    const navContainer = document.getElementById('testNav');
    navContainer.innerHTML = '';
    
    for (let i = 0; i < currentTests.length; i++) {
        const navItem = document.createElement('div');
        navItem.className = 'test-nav-item';
        if (i === currentQuestion) {
            navItem.classList.add('active');
        }
        if (answers[i] !== null) {
            // Javob to'g'ri yoki noto'g'riligini tekshirish
            if (answers[i] === currentTests[i].correct) {
                navItem.classList.add('correct-nav');
            } else {
                navItem.classList.add('incorrect-nav');
            }
        }
        navItem.textContent = i + 1;
        navItem.onclick = () => goToQuestion(i);
        navContainer.appendChild(navItem);
    }

    // Toggle tugmasini qo'shish (agar umumiy savollar 20 tadan ko'p bo'lsa)
    const allCategoryQuestions = allQuestions[`category${currentCategory}`];
    
    if (allCategoryQuestions.length > 20) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'test-nav-item';
        toggleBtn.style.width = 'auto';
        toggleBtn.style.padding = '0 15px';
        toggleBtn.style.borderRadius = '20px';
        toggleBtn.style.fontSize = '12px';
        
        // Agar hozir 20 talik rejimda bo'lsak
        if (currentTests.length <= 20) {
            toggleBtn.textContent = 'Barchasi...';
            toggleBtn.title = "Barcha savollarni ishlash";
            toggleBtn.onclick = () => toggleTestMode('all');
            toggleBtn.style.background = '#ffffff';
            toggleBtn.style.color = '#007bff';
        } else {
            // Agar hozir barchasi rejimida bo'lsak
            toggleBtn.textContent = '20 ta...';
            toggleBtn.title = "20 ta tasodifiy testga qaytish";
            toggleBtn.onclick = () => toggleTestMode('20');
            toggleBtn.style.background = '#007bff';
            toggleBtn.style.color = '#ffffff';
        }
        navContainer.appendChild(toggleBtn);
    }
}

function toggleTestMode(mode) {
    if (!confirm("Hozirgi natijalaringiz o'chiriladi va test qayta boshlanadi. Davom etasizmi?")) {
        return;
    }

    const allTests = allQuestions[`category${currentCategory}`];
    const shuffledQuestions = shuffle([...allTests]);
    
    if (mode === 'all') {
        // Barchasini olish
        currentTests = shuffledQuestions.map(q => {
            return {
                question: q.question,
                options: shuffle([...q.options]), 
                correct: q.correct
            };
        });
    } else {
        // Faqat 20 tasini olish
        currentTests = shuffledQuestions.slice(0, 20).map(q => {
            return {
                question: q.question,
                options: shuffle([...q.options]), 
                correct: q.correct
            };
        });
    }
    
    currentQuestion = 0;
    answers = new Array(currentTests.length).fill(null);
    
    renderTestNavigation();
    renderQuestion();
    document.getElementById('questionsContainer').scrollTo(0, 0);
}

function renderQuestion() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    if (currentQuestion >= currentTests.length) return;

    const question = currentTests[currentQuestion];
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-container active';
    
    questionDiv.innerHTML = `
        <div class="question-header">
            <div class="question-number">Savol ${currentQuestion + 1} / ${currentTests.length}</div>
            <div class="question-text">${question.question}</div>
        </div>
        <ul class="options">
            ${question.options.map((option, index) => `
                <li>
                    <button onclick="selectAnswer(${index}, '${option.replace(/'/g, "\\'")}')">
                        ${option}
                    </button>
                </li>
            `).join('')}
        </ul>
        <div class="answer-feedback" id="feedback"></div>
    `;
    
    container.appendChild(questionDiv);
    
    // Agar javob berilgan bo'lsa, uni ko'rsatish
    if (answers[currentQuestion] !== null) {
        showAnswer();
    }
}

function selectAnswer(index, answer) {
    if (answers[currentQuestion] !== null) return; // Agar javob berilgan bo'lsa, qaytadan tanlashga yo'l qo'ymaslik
    
    answers[currentQuestion] = answer;
    const question = currentTests[currentQuestion];
    const buttons = document.querySelectorAll('.options button');
    
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (btn.textContent.trim() === question.correct) {
            btn.classList.add('correct');
        }
        if (i === index && btn.textContent.trim() !== question.correct) {
            btn.classList.add('incorrect');
        }
    });
    
    const feedback = document.getElementById('feedback');
    feedback.className = 'answer-feedback show correct-answer';
    feedback.textContent = `✓ To'g'ri javob: ${question.correct}`;
    
    renderTestNavigation();
    
    // Avtomatik ravishda keyingi savolga o'tish (2 soniya kutish)
    setTimeout(() => {
        if (currentQuestion < currentTests.length - 1) {
            nextQuestion();
        } else {
            showResults();
        }
    }, 2000);
}

function showAnswer() {
    const question = currentTests[currentQuestion];
    const buttons = document.querySelectorAll('.options button');
    
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent.trim() === question.correct) {
            btn.classList.add('correct');
        }
        if (btn.textContent.trim() === answers[currentQuestion] && btn.textContent.trim() !== question.correct) {
            btn.classList.add('incorrect');
        }
    });
    
    const feedback = document.getElementById('feedback');
    feedback.className = 'answer-feedback show correct-answer';
    feedback.textContent = `✓ To'g'ri javob: ${question.correct}`;
}

function nextQuestion() {
    if (currentQuestion < currentTests.length - 1) {
        currentQuestion++;
        renderTestNavigation();
        renderQuestion();
        // Element scroll qilinadi, butun oyna emas
        document.getElementById('questionsContainer').scrollTo(0, 0);
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderTestNavigation();
        renderQuestion();
        document.getElementById('questionsContainer').scrollTo(0, 0);
    }
}

function goToQuestion(index) {
    currentQuestion = index;
    renderTestNavigation();
    renderQuestion();
    document.getElementById('questionsContainer').scrollTo(0, 0);
}

function finishTest() {
    if (confirm("Testni yakunlashni va natijalarni ko'rishni xohlaysizmi?")) {
        showResults();
    }
}

function showResults() {
    let correctAnswers = 0;
    currentTests.forEach((question, index) => {
        if (answers[index] === question.correct) {
            correctAnswers++;
        }
    });
    
    document.getElementById('testContainer').classList.remove('active');
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.classList.add('show');
    
    const percentage = (correctAnswers / currentTests.length) * 100;
    let emoji = '😊';
    if (percentage >= 90) emoji = '🎉';
    else if (percentage >= 70) emoji = '👍';
    else if (percentage < 50) emoji = '😔';
    
    document.getElementById('resultStats').innerHTML = `
        <p>To'g'ri javoblar: <strong>${correctAnswers} / ${currentTests.length}</strong></p>
        <p>Foiz: <strong>${percentage.toFixed(1)}%</strong></p>
        <p style="font-size: 48px; margin-top: 20px;">${emoji}</p>
    `;
}

function backToMenu() {
    document.getElementById('testContainer').classList.remove('active');
    document.getElementById('resultContainer').classList.remove('show');
    document.getElementById('menu').style.display = 'grid';
    
    currentCategory = null;
    currentTests = [];
    currentQuestion = 0;
    answers = [];
}

// Savollar sonini menyuda yangilash
function updateMenuCounts() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const categoryIndex = item.getAttribute('data-category');
        if (window.allQuestions && window.allQuestions[`category${categoryIndex}`]) {
            const count = window.allQuestions[`category${categoryIndex}`].length;
            const pElement = item.querySelector('p');
            if (pElement) {
                pElement.textContent = `${count} ta savol`;
            }
        }
    });
}

// Sahifa yuklanganda ishga tushirish
updateMenuCounts();