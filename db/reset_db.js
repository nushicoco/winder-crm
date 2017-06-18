require('dotenv-safe').load();
const {
    sequelize,
    FrequentProblem
} = require('../models')

const frequentProblemValues = [
    ["אביד", "רגיל", "הגדרות Export מומלצות", "", "https://res.cloudinary.com/dzbelv6cv/image/upload/v1496926821/assets/Definitions.pdf"],
    ["אביד", "רגיל", "הקלטה באביד", "" ,"https://res.cloudinary.com/dzbelv6cv/raw/upload/v1497436560/assets/Recording_In_Avid.pdf"],
    ["מחשב", "רגיל", "הדפסה במתחם", "", "https://res.cloudinary.com/dzbelv6cv/raw/upload/v1497437103/assets/Printing.pdf"],
    ["אביד", "interplay", "הדלקת Interplay", "כדי להדליק את האינטרפליי יש לרשום את הפקודה WorkgroupOverride off יש ללחוץ אנטר ולהיכנס מחדש לאביד", ""],
    ["אביד", "interplay", "כיבוי Interplay", "כדי לכבות את האינטרפליי יש לרשום ב console (קיצור מקלדת ctrl+6) את הפקודה הבאה WorkgroupOverride on יש ללחוץ אנטר ולהיכנס מחדש לאביד", ""],
]

sequelize.sync({force: true})
.then(function () {
    FrequentProblem.destroy({truncate: true})
        .then( () => frequentProblemValues.forEach( ([env, subEnv, subject, solution, solutionURL]) => {
            FrequentProblem.create({env, subEnv, subject, solution, solutionURL }).then(function(user) {
                // you can now access the newly created task via the variable task
                console.log('success');
            }).catch(function(err) {
                // print the error details
                console.log(err, env, subEnv, subject, solutionURL );
            });
        }))
})
