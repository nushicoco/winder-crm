const MIN_PASSWORD_LENGTH = 1 //TODO: Decide?
const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i // source: https://stackoverflow.com/questions/46155/validate-email-address-in-javascript

export default {

    email: (email) => {
        return email && email.match(EMAIL_REGEX)
    },

    passwordLength: (password) => {
        return password && password.length >= MIN_PASSWORD_LENGTH
    }
}
