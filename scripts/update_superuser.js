/**
 * Created by einavcarmon on 11/06/2017.
 */
const { User } = require('../models')

// process.argv.forEach(function (val, index, array) {
//     console.log(index + ': ' + val);
// });

userEmail = process.argv[2];

if (!userEmail){
    console.log("plz supply a user email");
    return;
}

User.findOne({email:userEmail}).then(function(user) {
    console.log(`updating user ${userEmail} setting isSuperuser to ${!user.isSuperuser}` );
    user.isSuperuser = !user.isSuperuser;
    user.save();
});

