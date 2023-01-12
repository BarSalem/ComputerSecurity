import config from '../configuration.json' assert {type: 'json'};

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isValidEmail = (email) => emailRegex.test(email);

const checkPassword = (password) => {
    
    const passwordRegex = new RegExp(config.password.characters.regex)
    const lowercaseRegex = new RegExp(config.password.characters.lowercase);
    const uppercaseRegex = new RegExp(config.password.characters.uppercase);
    const numbersRegex = new RegExp(config.password.characters.numbers);
    const specialRegex = new RegExp(config.password.characters.special);
    const seqs = config.password.avoid_sequence;
    if (seqs.some(seq => password.includes(seq))) {
        return 'password contains a sequence';
    } if (!passwordRegex.test(password)) {
        return 'password contains invalid characters';
    } if (!uppercaseRegex.test(password)) {
        return 'uppercase letter';
    } if (!numbersRegex.test(password)) {
        return 'number';
    } if (!specialRegex.test(password)) {
        return 'special character';
    } if (!lowercaseRegex.test(password)) {
        return 'lowercase letter';
    } if (password.length != config.password.length) {
        return 'length';
    } 
    return 'all required elements';
};


// const loginAttempts = {};

// const checkLoginAttempts = (username) => {
//     if (!loginAttempts[username]) {
//         loginAttempts[username] = 1;
//     } else {
//         loginAttempts[username] += 1;
//     }

//     if (loginAttempts[username] > config.login.num_of_login_attempts) {
//         return 'Too many login attempts';
//     } else {
//         delete loginAttempts[username]
//         return 'OK';
//     }
// }

console.log(checkPassword("ABCd123"));

export { checkPassword, isValidEmail }