var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(process.env.DATABASE_URL || './winder.db');
db.serialize(function() {
    db.run(" DROP TABLE IF EXISTS frequent_problems");
    db.run("CREATE TABLE frequent_problems (id INTEGER PRIMARY KEY AUTOINCREMENT, env TEXT, sub_env TEXT, subject TEXT, solution TEXT)");
    var stmt = db.prepare("INSERT INTO frequent_problems VALUES (?,?,?,?,?)");

    var values = [
        ["אביד", "רגיל", "לא מצליח להקליט", "מדריך להקלטה"],
        ["אביד", "interplay", "media offline", "ביצוע login לinterplay"],
        ["מחשב", "סאונד", "שומעים מהאביד אבל לא מהיוטיוב או דפדפן", "מדריך - יש לבחור default device בהגדרות שמע"],
        ["אביד", "רגיל", "לא רואים במוניטור ", "מדריך - לבדוק הגדרות חומרה "],
        ["אביד", "marquee", "מדריך שימוש בmarquee", ""],
        ["מחשב", "סאונד", "צליל הודעות המערכת משגע אותי", "מדריך איך להשתיק"],
        ["אביד", "interplay", "מדריך שימוש בinterplay", ""],
        ["מחשב", "רגיל", "קיצורי מקלדת שימושיים", ""]
    ]

    for (var i = 0; i < 8; i++) {
        console.log("inserting :", i, values[i][0], values[i][1], values[i][2], values[i][3])
        stmt.run(i, values[i][0], values[i][1], values[i][2], values[i][3]);
    }
    stmt.finalize();

    db.each("SELECT * FROM frequent_problems", function(err, row) {
        console.log(row.id , row.env , row.sub_env , row.subject , row.solution );
    });
});
db.close();