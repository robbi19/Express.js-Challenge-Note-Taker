const fs = require('fs');
const path = require('path');

module.exports = app => {
    const dbPath = path.join(__dirname, '../db/db.json');

    // Read initial notes data from the db.json file
    let notes = [];

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) throw err;
        notes = JSON.parse(data);
    });

    // API routes
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    app.get('/api/notes', (req, res) => {
        res.json(notes);
    });

    app.post('/api/notes', (req, res) => {
        const newNote = req.body;
        notes.push(newNote);
        updateDb();
        res.json(newNote);
    });

    app.get('/api/notes/:id', (req, res) => {
        const noteId = parseInt(req.params.id);
        if (noteId >= 0 && noteId < notes.length) {
            res.json(notes[noteId]);
        } else {
            res.status(404).send("Note not found");
        }
    });

    app.delete('/api/notes/:id', (req, res) => {
        const noteId = parseInt(req.params.id);
        if (noteId >= 0 && noteId < notes.length) {
            notes.splice(noteId, 1);
            updateDb();
            res.sendStatus(204); // No Content
        } else {
            res.status(404).send("Note not found");
        }
    });

    // HTML page routes
    app.get('/notes', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/notes.html'));
    });

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // Update the db.json file
    function updateDb() {
        fs.writeFile(dbPath, JSON.stringify(notes, null, '\t'), err => {
            if (err) throw err;
        });
    }
};
