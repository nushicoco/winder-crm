const request = function(path, method, jsonBody) {
    return fetch(path, {
        method,
        body: jsonBody,
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
    })
        .then(function (response) {
            if (response.status !== 200) {
                throw { errorMessage: `Bad response received (${response.status})`, status:response.status}
            }

            const contentType = response.headers.get('content-type');
            if(/application\/json/i.test(contentType)) {
                return response.json()
            }
            return true

        })
}
const get = function (path) {
    return request(path, 'GET')
}

const post = function (path, body) {
    return request(path, 'POST', JSON.stringify(body))
}

module.exports.getFrequentProblemsList = function () {
    return get('/frequent_problems')
}

module.exports.getFrequentProblem = function (problemId) {
    return get(`/frequent_problem/${problemId}`)
}

module.exports.createTicket = function(subject, text) {
    return post('/ticket', {subject, text})
}

module.exports.getTicket = function(ticketId) {
    return get(`/tickets/${ticketId}`)
}

module.exports.getTickets = function () {
    return get('/tickets')
}

module.exports.updateTicket = function (ticketId, text) {
    return post('/update_ticket', {ticketId, text})
}


module.exports.signin = function (email, password) {
    // TODO: handle bad creds properly
    return post('/login', {email, password})
        .then( (response) => {
            console.log(response.status);
           return response && (response.user || response.status)
        })
}

module.exports.signup = function (fields) {
    return post('/signup', fields)
        .then( (response) => {
            return response && response.user
        })
}

module.exports.getUser = function () {
    return get('/user')
}

module.exports.logout = function () {
    return post('/logout');
}
