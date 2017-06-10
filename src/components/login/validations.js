const MIN_PASSWORD_LENGTH = 1 //TODO: Decide?
const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i // source: https://stackoverflow.com/questions/46155/validate-email-address-in-javascript

export default {

    email (email) {
        const valid = email && email.match(EMAIL_REGEX)
        return valid
    },

    passwordLength (password) {
        return password && password.length >= MIN_PASSWORD_LENGTH
    },

    name (name) {
        return name && name.length > 1 //TODO: decide
    }
}
