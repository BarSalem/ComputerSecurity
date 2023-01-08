import config from '../configuration.json' assert {type: 'json'};

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isValidEmail = (email) => emailRegex.test(email);

const isValidPass = (password) => emailRegex.test(email);
console.log(isValidEmail('eli@gmail.co'));


const loginAttempts = {};

const checkLoginAttempts = (username) => {
    if (!loginAttempts[username]) {
        loginAttempts[username] = 1;
    } else {
        loginAttempts[username] += 1;
    }

    if (loginAttempts[username] > config.login.num_of_login_attempts) {
        return 'Too many login attempts';
    } else {
        delete loginAttempts[username]
        return 'OK';
    }
}

