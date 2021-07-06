const database = require("./modules/database");

database.connect().then(db => {
    db.get(`
        SELECT username
        FROM players
        WHERE user_id = 5182050`, (err, row) => console.log(row));
});


