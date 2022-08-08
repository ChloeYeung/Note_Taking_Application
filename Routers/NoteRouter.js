/**********************************************
 * Routing for the NoteApplication
 * ==================================
 ***********************************************/

const e = require("express");
const nt = require("../Stores/notes.json")

// Setup a NoteRouter class which takes the note service as a dependency, that was we can inject the NoteService when we use our Router. As this is not a hard coded value we will need to inject the noteService for every instance of the note router.
class NoteRouter {
    constructor(noteService, express) {
        this.noteService = noteService;
        this.express = express;
    }
    // This utilises the express Router method, basically we are binding the path/ request to each restful verb
    router() {
        let router = this.express.Router();
        // bind the different methods (if not using arrow function, should bind the method to the class)
        // e.g., 
        router.get("/", this.get.bind(this));
        router.post("/", this.post.bind(this));
        router.put("/", this.put.bind(this));
        router.delete("/", this.delete.bind(this));
        return router;
    }

    /** # GET Method   # list all notes
  /*  ====================== */
    //   1) Create a get method
    //   when the route is "/"
    //   Here we handle what will occur when we have been sent down a particular path, this path is '/' - we will just list all of the notes, that match our(req.auth.user)
    get(req, res) {
        return this.noteService
            .list(req.auth.user)
            .then((notes) => res.json(notes))
            .catch((err) => res.status(500).json(err));
    }

    /** # Post Method   # add new notes
  /*  ====================== */
    // 2) Create a post method
    post(req, res) {
        console.log(req.body);
        return this.noteService
            .add(req.body.note, req.auth.user)
            .then(() => this.noteService.list(req.auth.user))
            .then((notes) => res.json(notes))
            .catch((err) => res.status(500).json(err));
    }

    /** # PUT Method   # edit notes
    /*  ====================== */
    // 3) Create a put method, which updates our json file
    // Here we handle our put request, which has an id as a parameter (req.params.id), the body of the updated note (req.body.note) and the user who's note we want to update (req.auth.user)
    put(req, res) {
        let index = req.body.index;
        let note = req.body.note;
        let user = req.auth.user;

       return this.noteService
       .update(index, note, user)
       .then(()=> this.noteService.list(user))
       .then((notes)=>res.json(notes))
       .catch((err)=> res.status(500).json(err));
    }

    /** # DELETE Method   # delete notes
    /*  ====================== */
    // 4) Create a delete method
    delete(req, res) {
        return this.noteService
                .remove((req.body.index), req.auth.user)
                .then(() => this.noteService.list(req.auth.user))
                .then ((notes)=>res.json(notes))
                .catch ((err)=> res.status(500).json(err));
    
    }
}

module.exports = NoteRouter;