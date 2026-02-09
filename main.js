
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
    
    // Barcha savollarni aralashtirish
    const shuffledQuestions = shuffle([...allTests]);
    // Savollarning javob variantlarini ham aralashtiramiz
    currentTests = shuffledQuestions.map(q => {
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
    }, 1000);
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

// ========== QIDIRUV MODAL ==========
const categoryNames = {
    'category0': '📱 AKT zamonaviy yutuqlari',
    'category1': '💻 AKT dolzarb muammolari',
    'category2': '🚀 Taraqqiyot strategiyasi',
    'category3': "📊 Ta'lim sifati",
    'category4': '👨‍🏫 Pedagogik kompetensiyalar',
    'category5': '🌐 Raqamli kompetensiyalar',
    'category6': '⚖️ Huquqiy asoslar',
    'category7': '🔬 Ilmiy-innovatsion faoliyat'
};

function openSearchModal() {
    const modal = document.getElementById('searchModal');
    modal.classList.add('show');
    document.getElementById('modalSearchInput').value = '';
    document.getElementById('modalSearchInput').focus();
    // Filter tugmalarini yaratish (faqat bir marta)
    const filterBar = document.getElementById('modalFilterBar');
    if (filterBar.children.length <= 1) {
        for (const [catKey, catName] of Object.entries(categoryNames)) {
            if (window.allQuestions[catKey] && window.allQuestions[catKey].length > 0) {
                const btn = document.createElement('button');
                btn.className = 'modal-filter-btn';
                btn.dataset.filter = catKey;
                btn.textContent = catName;
                filterBar.appendChild(btn);
            }
        }
    }
    modalDoSearch();
}

function closeSearchModal() {
    document.getElementById('searchModal').classList.remove('show');
}

let modalActiveFilter = 'all';
let modalDebounce;

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-filter-btn')) {
        document.querySelectorAll('.modal-filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        modalActiveFilter = e.target.dataset.filter;
        modalDoSearch();
    }
});

document.addEventListener('input', (e) => {
    if (e.target.id === 'modalSearchInput') {
        clearTimeout(modalDebounce);
        modalDebounce = setTimeout(modalDoSearch, 200);
    }
});

// ESC tugmasi bilan yopish
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearchModal();
});

function modalDoSearch() {
    const query = document.getElementById('modalSearchInput').value.trim().toLowerCase();
    
    let allItems = [];
    for (const [catKey, questions] of Object.entries(window.allQuestions)) {
        questions.forEach(q => {
            allItems.push({
                category: catKey,
                categoryName: categoryNames[catKey] || catKey,
                question: q.question,
                options: q.options,
                correct: q.correct
            });
        });
    }
    
    let filtered = allItems;
    if (modalActiveFilter !== 'all') {
        filtered = filtered.filter(item => item.category === modalActiveFilter);
    }
    if (query.length > 0) {
        filtered = filtered.filter(item => {
            return item.question.toLowerCase().includes(query) ||
                   item.correct.toLowerCase().includes(query) ||
                   item.options.some(o => o.toLowerCase().includes(query));
        });
    }
    
    const resultsDiv = document.getElementById('modalResults');
    const infoDiv = document.getElementById('modalResultsInfo');
    
    if (filtered.length === 0) {
        infoDiv.textContent = '0 ta natija';
        resultsDiv.innerHTML = '<div style="text-align:center;padding:40px;color:#999;">🔍 Hech narsa topilmadi</div>';
        return;
    }
    
    infoDiv.textContent = `${filtered.length} ta natija`;
    
    resultsDiv.innerHTML = filtered.map(item => {
        const qText = query ? modalHighlight(item.question, query) : modalEscHtml(item.question);
        const aText = query ? modalHighlight(item.correct, query) : modalEscHtml(item.correct);
        return `
        <div class="modal-result-card">
            <div class="modal-result-q">${qText}</div>
            <div class="modal-result-opts">
                <ul>
                    ${item.options.map(opt => {
                        const oText = query ? modalHighlight(opt, query) : modalEscHtml(opt);
                        return `<li class="${opt === item.correct ? 'modal-correct' : ''}">${opt === item.correct ? '✅ ' : ''}${oText}</li>`;
                    }).join('')}
                </ul>
            </div>
        </div>`;
    }).join('');
}

function modalEscHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

function modalHighlight(text, query) {
    const escaped = modalEscHtml(text);
    const escapedQ = modalEscHtml(query);
    const regex = new RegExp(`(${escapedQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escaped.replace(regex, '<mark>$1</mark>');
}