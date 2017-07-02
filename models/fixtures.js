const { FrequentProblem } = require('.')

const frequentProblemValues = [
    ['אביד', 'רגיל', 'לא מצליח להקליט', 'מדריך להקלטה'],
    ['אביד', 'interplay', 'media offline', 'ביצוע login לinterplay'],
    ['מחשב', 'סאונד', 'שומעים מהאביד אבל לא מהיוטיוב או דפדפן', 'מדריך - יש לבחור default device בהגדרות שמע'],
    ['אביד', 'רגיל', 'לא רואים במוניטור ', 'מדריך - לבדוק הגדרות חומרה '],
    ['אביד', 'marquee', 'מדריך שימוש בmarquee', ''],
    ['מחשב', 'סאונד', 'צליל הודעות המערכת משגע אותי', 'מדריך איך להשתיק'],
    ['אביד', 'interplay', 'מדריך שימוש בinterplay', ''],
    ['מחשב', 'רגיל', 'קיצורי מקלדת שימושיים', '']
]

FrequentProblem.destroy({truncate: true})
    .then(() => frequentProblemValues.forEach(([env, subEnv, subject, solution]) => {
      FrequentProblem.create({ env, subEnv, subject, solution })
    }))
