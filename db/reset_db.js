const { User, FrequentProblem } = require('../models')

User.sync({force: true})
FrequentProblem.sync({force: true})

const frequentProblemValues = [
    ["אביד", "רגיל", "לא מצליח להקליט", "מדריך להקלטה", "http://res.cloudinary.com/dzbelv6cv/image/upload/v1496926821/assets/Definitions.pdf"],
    ["אביד", "interplay", "media offline", "ביצוע login לinterplay", "http://res.cloudinary.com/dzbelv6cv/image/upload/v1496926821/assets/Definitions.pdf"],
    ["מחשב", "סאונד", "שומעים מהאביד אבל לא מהיוטיוב או דפדפן", "מדריך - יש לבחור default device בהגדרות שמע", "http://res.cloudinary.com/dzbelv6cv/image/upload/v1496926821/assets/Definitions.pdf"],
    ["אביד", "רגיל", "לא רואים במוניטור ", "מדריך - לבדוק הגדרות חומרה ", "http://res.cloudinary.com/dzbelv6cv/image/upload/v1496926821/assets/Definitions.pdf"],
    ["אביד", "marquee", "מדריך שימוש בmarquee", "", "http://res.cloudinary.com/dzbelv6cv/image/upload/v1496926821/assets/Definitions.pdf"],
    ["מחשב", "סאונד", "צליל הודעות המערכת משגע אותי", "מדריך איך להשתיק", "http://res.cloudinary.com/dzbelv6cv/image/upload/v1496926821/assets/Definitions.pdf"],
    ["אביד", "interplay", "מדריך שימוש בinterplay", ""],
    ["מחשב", "רגיל", "קיצורי מקלדת שימושיים", ""]
]

FrequentProblem.destroy({truncate: true})
    .then( () => frequentProblemValues.forEach( ([env, subEnv, subject, solution, solutionURL]) => {
        FrequentProblem.create({env, subEnv, subject, solutionURL }).catch(function (err) {
            console.log(err, env, subEnv, subject, solutionURL );
        });
    }))
