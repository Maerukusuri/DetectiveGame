let gameData = null;

// Загружаем данные из бэкенда при старте
async function loadGameData() {
    const response = await fetch('database.json');
    gameData = await response.json();
    // Начинаем со стартового шага
    showStep('story_start');
}

// Функция отображения шага диалога
function showStep(stepKey) {
    const step = gameData[stepKey] || gameData.story_start;
    const messagesContainer = document.getElementById('chat-messages');
    const optionsContainer = document.getElementById('chat-options');

    // Добавляем сообщение от Алёны
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg incoming';
    msgDiv.innerText = step.text;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Очищаем старые кнопки вариантов
    optionsContainer.innerHTML = '';

    // Добавляем новые кнопки ответов
    step.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;
        btn.onclick = () => {
            // Отображаем выбор игрока в чате
            const playerMsg = document.createElement('div');
            playerMsg.className = 'msg outgoing';
            playerMsg.innerText = opt.text;
            messagesContainer.appendChild(playerMsg);

            // Если этот шаг ведет на открытие папки улик — логику добавим следующим шагом.
            // Пока просто переходим к следующей реплике
            setTimeout(() => showStep(opt.next_step), 1000);
        };
        optionsContainer.appendChild(btn);
    });
}

// Логика сворачивания/разворачивания чата
const chatHeader = document.getElementById('chat-header');
const chatWindow = document.getElementById('chat-window');
const toggleBtn = document.getElementById('toggle-chat');

chatHeader.addEventListener('click', (e) => {
    if (e.target !== toggleBtn) {
        chatWindow.classList.toggle('minimized');
    }
});

toggleBtn.addEventListener('click', () => {
    if (chatWindow.classList.contains('maximized')) {
        chatWindow.classList.remove('maximized');
        toggleBtn.innerText = '⬜';
    } else {
        chatWindow.classList.remove('minimized');
        chatWindow.classList.add('maximized');
        toggleBtn.innerText = '🗗';
    }
});

// Запуск
window.onload = loadGameData;