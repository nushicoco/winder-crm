/* globals fetch */
const analytics = require('./analytics.js')

const request = function (path, method, jsonBody) {
  return fetch(path, {
    method,
    body: jsonBody,
    headers: {'Content-Type': 'application/json'},
    credentials: 'include'
  })
    .then(function (response) {
      if (response.status !== 200) {
        const error = {
          errorMessage: `Bad response received (${response.status})`,
          status: response.status
        }
        throw error
      }

      if (response.redirected && response.url) {
        window.location.href = response.url
        return
      }

      const contentType = response.headers.get('content-type')
      if (/application\/json/i.test(contentType)) {
        return response.json()
      }
      return true
    })
}
const del = function (path) {
  return request(path, 'DELETE')
}

const get = function (path) {
  return request(path, 'GET')
}

const post = function (path, body) {
  return request(path, 'POST', JSON.stringify(body))
}

module.exports.createFrequentProblem = function (fields) {
  return post(`/frequent_problem/new`, fields)
}

module.exports.updateFrequentProblem = function (id, fields) {
  return post(`/frequent_problem/${id}`, fields)
}

module.exports.deleteFrequentProblem = function (id) {
  return del(`/frequent_problem/${id}`)
}

module.exports.getFrequentProblemsList = function () {
  return get('/frequent_problems')
}

module.exports.getFrequentProblem = function (problemId) {
  return get(`/frequent_problem/${problemId}`)
}

module.exports.createTicket = function (details) {
  return post('/ticket', details)
}

module.exports.getTicket = function (ticketId, accessToken) {
  return get(`/tickets/${ticketId}?accessToken=${accessToken}`)
}

module.exports.getTickets = function () {
  return get('/tickets')
}

module.exports.updateTicket = function (fields) {
  return post('/update_ticket', fields)
}

module.exports.signin = function (email, password) {
  return post('/login', {email, password})
    .then((response) => {
      const user = response && response.user
      analytics.setRecordedUser(user)
      return user
    })
}

module.exports.signup = function (fields) {
  return post('/signup', fields)
    .then((response) => {
      const user = response && response.user
      analytics.setRecordedUser(user)
      return user
    })
}

module.exports.getUser = function () {
  return get('/user')
    .then(function ({ user }) {
      analytics.setRecordedUser(user)
      return user
    })
}

module.exports.logout = function () {
  return post('/logout')
}

module.exports.createChat = function (clientName, clientId) {
  return post('/chat', {clientName, clientId})
}

module.exports.getChat = function (chatId) {
  return get(`/chats/${chatId}`)
}

module.exports.getAdminChat = function () {
  return get(`/admin/chat`)
}

module.exports.getAdmins = function () {
  return get('/admin/admins')
}
