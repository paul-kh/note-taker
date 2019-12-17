/* PSEUDO CODE
---------------------------------------------------------------------------
## create routes
- /notes   : return notes.html
- '*' or / : return index.html
- /api/notes + GET: read from db.json and return notes
- /api/notes + POST: write notes to db.json
- /api/notes + DELETE: delete notes in db.json

## Send notes data in JSON to client:
- receive req for notes data from client via /api/notes + GET
- read notes data from DB file
- send JSON data to client

## Create notes:
- get notes creation req from client via /api/notes + POST
- read data from DB file and assign to array
- add new notes to array by making unique id = array.length + 1
- write the updated array back to DB file
- send updated JSON data to client for refreshing page

## Delete notes:
- get notes deletion req from client via /api/notes + DELETE
- read data from DB file and assign to array
- use array.splice() to delete item in array
- write the updated array back to DB file
- send updated JSON data to client for refreshing page
---------------------------------------------------------------------------
*/

// IMPORT ALL REQUIRED MODULES
const Express = require("express");
const fs = require("fs");
const path = require("path");

const app = Express();
app.use(Express.static("public"));
const PORT = process.env.PORT || 3000;

app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());

// Route to notes.html when the url is /notes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/", "notes.html"));
});

// Read notes from db.json and send as JSON object to render
// notes.html when client is making GET req with URL / api / notes
app.get("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname + "/db/db.json"), "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        if (data === "") { // if db.json is empty
            return;
        }
        else {
            res.json(JSON.parse(data));
            // console.log(data);
        }
    });
});

// Create new notes
app.post("/api/notes", function (req, res) {
    let dbNotes = [];
    const newNotes = req.body;
    fs.readFile(path.join(__dirname + "/db/db.json"), "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        if (data === "") { // if db.json is empty
            dbNotes.push({ "id": 1, "title": newNotes.title, "text": newNotes.text });
        } else {
            dbNotes = JSON.parse(data);
            dbNotes.push({ "id": dbNotes.length + 1, "title": newNotes.title, "text": newNotes.text });
        }
        // Sort array DESC by ID so newly created notes will show first
        const dbNotesDSC = sortDscObjectId(dbNotes);
        res.json(dbNotesDSC);
        // write updates to db.json
        fs.writeFile((path.join(__dirname + "/db/db.json")), JSON.stringify(dbNotesDSC), function (error) {
            if (error) { return console.log(error); }
        });
    });
});

// Delete notes by id sent from client, and save to db.json
app.delete("/api/notes/:id", function (req, res) {
    let dbNotes;
    const id = req.params.id;
    console.log(id);
    // read db file
    fs.readFile(path.join(__dirname + "/db/db.json"), "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        dbNotes = JSON.parse(data);
        if (dbNotes.id === 1) { // because array.filter() doesn't work when there's only 1 element
            dbNotes = [];
        } else {
            dbNotes = dbNotes.filter(obj => obj.id !== parseInt(id));
            // update db.json
            fs.writeFile((path.join(__dirname + "/db/db.json")), JSON.stringify(dbNotes), function (error) {
                if (error) { return console.log(error); }
            });
            // send updated API to client to refresh page
            res.json(dbNotes);
        }
    });
});

// Sort DSC array of objects by id
function sortDscObjectId(arrObj) {
    const newArrObj = [];
    const idArr = arrObj.map(obj => {
        return obj.id;
    });
    // Create descending array of IDs
    const idArrDSC = idArr.sort((a, b) => b - a);
    // Create new array of object with descending IDs
    for (let id of idArrDSC) {
        for (let el of arrObj) {
            if (el.id === id) {
                newArrObj.push({ "id": el.id, "title": el.title, "text": el.text });
            }
        }
    }
    return newArrObj;
}



app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
