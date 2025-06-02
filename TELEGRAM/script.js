let secretNumber;
let attempts;
const maxAttempts = 7; // Límite de intentos

const guessInput = document.getElementById('guessInput');
const checkButton = document.getElementById('checkButton');
const resetButton = document.getElementById('resetButton');
const messageElement = document.getElementById('message');
const attemptsElement = document.getElementById('attempts');

function initializeGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    messageElement.textContent = '';
    attemptsElement.textContent = `Intentos: ${attempts}`;
    guessInput.value = '';
    guessInput.disabled = false;
    checkButton.style.display = 'block';
    resetButton.style.display = 'none';
    guessInput.focus();
    // Opcional: Establecer el color del header de la Mini App
    if (window.Telegram.WebApp) {
        window.Telegram.WebApp.setHeaderColor(window.Telegram.WebApp.themeParams.button_color || '#28a745');
        window.Telegram.WebApp.setBackgroundColor(window.Telegram.WebApp.themeParams.bg_color || '#f0f2f5');
        window.Telegram.WebApp.isClosingConfirmationEnabled = true; // Advertir al usuario antes de cerrar
    }
}

function checkGuess() {
    const userGuess = parseInt(guessInput.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        messageElement.textContent = 'Por favor, introduce un número válido entre 1 y 100.';
        messageElement.style.color = '#dc3545'; // Rojo para errores
        return;
    }

    attempts++;
    attemptsElement.textContent = `Intentos: ${attempts}`;

    if (userGuess === secretNumber) {
        messageElement.textContent = `¡Felicidades! Adivinaste el número ${secretNumber} en ${attempts} intentos.`;
        messageElement.style.color = '#28a745'; // Verde para éxito
        endGame(true);
    } else if (userGuess < secretNumber) {
        messageElement.textContent = 'Demasiado bajo. ¡Intenta de nuevo!';
        messageElement.style.color = '#ffc107'; // Amarillo para feedback
    } else {
        messageElement.textContent = 'Demasiado alto. ¡Intenta de nuevo!';
        messageElement.style.color = '#ffc107';
    }

    if (attempts >= maxAttempts && userGuess !== secretNumber) {
        messageElement.textContent = `¡Se acabaron los intentos! El número era ${secretNumber}.`;
        messageElement.style.color = '#dc3545';
        endGame(false);
    }
}

function endGame(won) {
    guessInput.disabled = true;
    checkButton.style.display = 'none';
    resetButton.style.display = 'block';

    // Opcional: Enviar datos al bot
    if (window.Telegram.WebApp) {
        const result = won ? `Ganó en ${attempts} intentos.` : `Perdió. Número: ${secretNumber}.`;
        // Telegram.WebApp.sendData() puede enviar datos en formato JSON o string.
        // Aquí lo enviamos como un mensaje simple para que el bot lo pueda procesar.
        window.Telegram.WebApp.sendData(JSON.stringify({
            status: won ? 'win' : 'lose',
            attempts: attempts,
            secretNumber: secretNumber
        }));
        // Opcional: mostrar un haptic feedback
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
}

checkButton.addEventListener('click', checkGuess);
resetButton.addEventListener('click', initializeGame);

// Inicializar el juego cuando la Mini App se carga
document.addEventListener('DOMContentLoaded', initializeGame);

// **Importante para Telegram Mini Apps:**
// Asegúrate de que window.Telegram.WebApp esté disponible.
// Este objeto se inyecta por el cliente de Telegram.
if (window.Telegram.WebApp) {
    window.Telegram.WebApp.ready(); // Indica que la Mini App está lista
    console.log("Telegram WebApp está disponible.");
    // Puedes acceder a información del usuario, etc., aquí si es necesario
    // console.log("Init Data:", window.Telegram.WebApp.initData);
    // console.log("User Data:", window.Telegram.WebApp.initDataUnsafe.user);

    // Puedes hacer que Telegram cierre la Mini App cuando el juego termina (si es relevante)
    // window.Telegram.WebApp.close();
} else {
    console.warn("Telegram WebApp API no está disponible. ¿Estás ejecutando esto dentro de Telegram?");
}