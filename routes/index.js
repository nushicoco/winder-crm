module.exports = function (app, passport, dirname) {

    require('./tickets')(app, passport)
    require('./authentication')(app, passport)
    require('./frequentProblems')(app, passport)

    app.get('*', (req,res) => {
        res.sendFile(dirname + '/client/build/index.html');
    })
}
