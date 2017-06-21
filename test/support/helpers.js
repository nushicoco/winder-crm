const consoleLog = console.log.bind(console)
const consoleError = console.error.bind(console)

module.exports.suppressConsoleLog = function () {
    console.log = function () {}
}
module.exports.restoreConsoleLog = function () {
    console.log = consoleLog
}

module.exports.suppressConsoleError = function () {
    console.error = function () {}
}
module.exports.restoreConsoleError = function () {
    console.error = consoleError
}
