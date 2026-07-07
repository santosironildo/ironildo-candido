const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Elementos da tela
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');
const passwordDisplay = document.getElementById('password-display');
const btnGenerate = document.getElementById('btn-generate');
const btnCopy = document.getElementById('btn-copy');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');

// Atualiza o contador de tamanho na tela
lengthSlider.addEventListener('input', () => {
    lengthVal.textContent = lengthSlider.value;
});

// Função matemática para gerar index aleatório seguro
function getRandomSecureIndex(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}

// Função principal de geração
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let allowedChars = '';
   
    const options = [
        { id: 'chk-uppercase', pool: charSets.uppercase },
        { id: 'chk-lowercase', pool: charSets.lowercase },
        { id: 'chk-numbers', pool: charSets.numbers },
        { id: 'chk-symbols', pool: charSets.symbols }
    ];

    let typesCount = 0;
    options.forEach(opt => {
        if (document.getElementById(opt.id).checked) {
            allowedChars += opt.pool;
            typesCount++;
        }
    });

    // Se nenhuma caixa estiver marcada
    if (allowedChars === '' || length === 0) {
        passwordDisplay.textContent = 'Selecione uma opção!';
        updateStrength(0, 0);
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = getRandomSecureIndex(allowedChars.length);
        password += allowedChars[randomIndex];
    }

    passwordDisplay.textContent = password;
   
    // Cálculo de Força Baseado em Entropia Matemática: E = L * log2(R)
    // R = tamanho do conjunto (pool de caracteres)
    const poolSize = allowedChars.length;
    const entropy = length * Math.log2(poolSize);

    updateStrength(entropy, typesCount);
}

// Atualiza o medidor visual de força
function updateStrength(entropy, typesCount) {
    // Critérios baseados em bits de entropia
    if (entropy === 0) {
        strengthBar.style.width = '0%';
        strengthText.textContent = 'Inexistente';
    } else if (entropy < 40 || typesCount < 2) {
        strengthBar.style.width = '33%';
        strengthBar.style.backgroundColor = '#ff4d4d'; // Vermelho
        strengthText.textContent = 'Fraca';
    } else if (entropy < 60 || typesCount < 3) {
        strengthBar.style.width = '66%';
        strengthBar.style.backgroundColor = '#ffaa00'; // Laranja/Amarelo
        strengthText.textContent = 'Média';
    } else {
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = '#00cc66'; // Verde
        strengthText.textContent = 'Forte';
    }
}

// Copiar para a área de transferência
btnCopy.addEventListener('click', () => {
    const text = passwordDisplay.textContent;
    if (text && text !== 'Clique em Gerar' && text !== 'Selecione uma opção!') {
        navigator.clipboard.writeText(text);
        alert('Senha copiada com sucesso!');
    }
});

// Evento do botão
btnGenerate.addEventListener('click', generatePassword);
