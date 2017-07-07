import Settings from '../../settings'
const EMAIL_REGEX = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i // source: https://stackoverflow.com/questions/46155/validate-email-address-in-javascript

export default {

  email (email) {
    const valid = email && email.match(EMAIL_REGEX)
    return valid
  },

  passwordLength (password) {
    return password && password.length >= Settings.minPasswordLength
  },

  name (name) {
    return name && name.length > Settings.minNameLength
  }
}
