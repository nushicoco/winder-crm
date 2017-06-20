/**
 * Created by einavcarmon on 20/06/2017.
 */
module.exports = function (app, passport) {

    var counter = 0;
    app.post('/chat', (req, res) => {
        // todo create chat in db and query them
        if (req.user && req.user.isSuperuser){
            console.log("super user logged in");
            res.status(200).send([{chatId:counter},{chatId:counter - 1}]);
        }else{
            res.status(200).send({chatId:counter++});
        }
    });
}