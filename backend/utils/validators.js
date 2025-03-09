const validateRegisterInput = (username, email, password) => {
    const errors = {};

    // Validate username
    if (!username || username.trim() === '') {
        errors.username = 'Username must not be empty';
    }

    // Validate email
    if (!email || email.trim() === '') {
        errors.email = 'Email must not be empty';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = 'Email must be a valid email address';
        }
    }

    // Validate password
    if (!password || password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};

const validateLoginInput = (email, password) => {
    const errors = {};

    if (!email || email.trim() === '') {
        errors.email = 'Email must not be empty';
    }
    if (!password || password.trim() === '') {
        errors.password = 'Password must not be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};

module.exports = {
    validateRegisterInput,
    validateLoginInput
};
