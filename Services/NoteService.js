// This file contains the logic to read and write from our JSON file so that information persists between logins.
// Create a class with methods that can be invoked
/**********************************************
 * Editing the Notes
 * ==================================
 ***********************************************/
/*

 */
// You will be using promises - remember...
// Promises are essentially task queues that “promise” a value will at some point be returned from asynchronous code.
const { timeStamp } = require("console");
const { resolve } = require("path");
let nt = require("../Stores/notes.json")

// Create a new NoteService class which takes a file as a dependency, this means whenever we are creating new instances of the noteService, we need to pass in a path to a file (this is the file that we will read, write and edit etc.)
class NoteService {
  constructor(file, fs, knex) {
    this.file = file;
    this.fs = fs;
    this.init(); // Call the init() method.
    this.notes = {};
    this.knex = knex;
  }

  /** # Initialize class   #
/*  ====================== */
  // 1) Initialize class
  // The init promise only needs to run once.
  // When it runs, when it runs, this.read resolves with this.notes (the notes from our json file) as a globally available variable.
  // the init promise is not concerned with resolving data - it just needs to run once to ensure persistence of the notes within our JSON file.
  init() {

    new Promise((resolve, reject) => {
      this.read().then((data) => {
        this.notes = data;
      })
      // wait until the read method finishes before sending a "done" promise
      // a promise is an object that returns the state (indicates whether or not its done)
    })
  }

  /** # Read method  #
/*  ====================== */
  // 2) Create promise that reads file

  // The purpose of this method is to read out notes from our json file, once we have the data from the file, we store the parsed notes in an instance variable called this.notes the read method then resolves with this.notes

  /*
  Example: 
    let readFilePromise = new Promise((resolve, reject) => {
      this.fs.readFile("data.txt", "utf-8", (err, data) => {
        if (err) {
          reject(err);
        } else {
        // You will also have to parse this.notes
          resolve(data);
        }
      });
    });
  */
  read() {
    return new Promise((resolve, reject) => {
      resolve(nt);
    })
  }

  /** # Write method  #
  /*  ====================== */
  // 3) Create promise that writes file
  // The write method is used to update our JSON file.
  // Promises (and Node.js style callbacks) are very useful for single-result functions
  // For instance, this.fs.writeFile fires the callback when all of the given contents have been written to the file.

  /*
    Example:
          let writeFilePromise = new Promise((resolve, reject) => {
            this.fs.writeFile("data.txt", data, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
    */
  write(data) {
    return new Promise((resolve, reject) => {
      this.fs.writeFile(require.resolve("../Stores/notes.json"), (JSON.stringify(data, null, " ")), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    });
  }

  /** # List method  #
  /*  ====================== */
  // 4) Get the notes for a specific user
  // The user is accessed via req.auth.user within our router.
  // The user is a parameter here (you can play with the user variable here )
  list(user) {

    let query = this.knex
      .select("notes.id", "notes.content")
      .from("notes")
      .innerJoin("users", "notes.user_id", "users.id")
      .where("users.username", user)
      .orderBy("notes.id", "asc");

    return query.then((rows) => {

      // console.log(rows, "pp");
      return rows.map((row) => ({
        id: row.id,
        content: row.content,
      }));
    });
  };

  /** # Add method  #
  /*  ====================== */
  // 5) Adds a note for the user
  // This method add notes updates the users notes, by adding the new note to this.notes,
  // it then calls this.write, to update our JSON file with the newest notes.
  async add(note, user) {

    let query = await this.knex
      .select("id")
      .from("users")
      .where("users.username", user);

    if (query.length === 1) {
      console.log("oo")
      await this.knex
        .insert({
          content: note,
          user_id: query[0].id,
        })
        .into("notes");
    } else {
      throw new Error
        (`Cannot add a note to a user that doesn't exist!`);
    }
  }

  /** # Update method  #
  /*  ====================== */
  // 6) Updates a note
  // This method will be used to update a specific note in our application,
  // it also handles some errors for our application. Then it calls this.write to update the JSON file.
  update(index, note, user) {
    console.log(index)
   
    let query = this.knex
      .select("id")
      .from("users")
      .where("users.username", user)

    return query.then((rows) => {
      if (rows.length === 1) {
        return this.knex("notes").where("id", index).update({
          content: note,
        });
      } else {
        throw new Error
          (`Cannot update a note if the user doesn't exist!`);
      }
    });
  }

  /** # Remove method  #
  /*  ====================== */
  // 7) Removes a note
  // This method will remove a particular note from our this.notes. Then it calls this.write to update our JSON file.
  remove(index, user) {
    console.log(index)
    let query = this.knex
      .select("id")
      .from("users")
      .where("users.username", user);

    return query.then((rows) => {
      if (rows.length === 1) {
        return this.knex("notes").where("id", index).del();
      } else {
        throw new Error
          (`Cannot remove a note when the user doesn't exist!`);
      }
    });
  }
}

module.exports = NoteService;