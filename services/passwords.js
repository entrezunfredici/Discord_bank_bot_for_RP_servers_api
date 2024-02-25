exports.notePassword = async (password) => {
    passwordScore = 0;
    if (password.length > 10) {
        passwordScore+=1;
    }
    if(/\d/.test(password)){
        passwordScore += 1;
    }
    if(/[a-z]/.test(password)){
        passwordScore += 1;
    }
    if(/[A-Z]/.test(password)){
        passwordScore += 1;
    }
    if(/[^a-zA-Z0-9]/.test(password)){
        passwordScore += 1;
    }
    return passwordScore
}