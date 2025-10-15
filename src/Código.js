// Exemplo de função de força bruta para tentar senhas de uma lista

function bruteForce(passwordList, targetPassword) {
    for (let i = 0; i < passwordList.length; i++) {
        if (passwordList[i] === targetPassword) {
            console.log(`Senha encontrada: ${targetPassword}`);
            return true;
        }
    }
    console.log('Senha não encontrada.');
    return false;
}

// Exemplo de uso
const passwords = ['123456', 'password', '12345678', 'qwerty', 'abc123'];
const target = 'qwerty';
bruteForce(passwords, target);