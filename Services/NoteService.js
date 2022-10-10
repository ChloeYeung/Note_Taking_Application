const { timeStamp } = require("console");
const { resolve } = require("path");
let nt = require("../Stores/notes.json");

class NoteService {
  constructor(file, fs, knex) {
    this.file = file;
    this.fs = fs;
    this.init(); // Call the init() method.
    this.notes = {};
    this.knex = knex;
  }

  init() {
    new Promise((resolve, reject) => {
      this.read().then((data) => {
        this.notes = data;
      });
    });
  }

  read() {
    return new Promise((resolve, reject) => {
      resolve(nt);
    });
  }

  write(data) {
    return new Promise((resolve, reject) => {
      this.fs.writeFile(
        require.resolve("../Stores/notes.json"),
        JSON.stringify(data, null, " "),
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  list(user) {
    let query = this.knex
      .select("notes.id", "notes.content")
      .from("notes")
      .innerJoin("users", "notes.user_id", "users.id")
      .where("users.username", user)
      .orderBy("notes.id", "asc");

    return query.then((rows) => {
      return rows.map((row) => ({
        id: row.id,
        content: row.content,
      }));
    });
  }


  async add(note, user) {
    let query = await this.knex
      .select("id")
      .from("users")
      .where("users.username", user);

    if (query.length === 1) {
      console.log("oo");
      await this.knex
        .insert({
          content: note,
          user_id: query[0].id,
        })
        .into("notes");
    } else {
      throw new Error(`Cannot add a note to a user that doesn't exist!`);
    }
  }


  update(index, note, user) {
    console.log(index);

    let query = this.knex
      .select("id")
      .from("users")
      .where("users.username", user);

    return query.then((rows) => {
      if (rows.length === 1) {
        return this.knex("notes").where("id", index).update({
          content: note,
        });
      } else {
        throw new Error(`Cannot update a note if the user doesn't exist!`);
      }
    });
  }

  remove(index, user) {
    console.log(index);
    let query = this.knex
      .select("id")
      .from("users")
      .where("users.username", user);

    return query.then((rows) => {
      if (rows.length === 1) {
        return this.knex("notes").where("id", index).del();
      } else {
        throw new Error(`Cannot remove a note when the user doesn't exist!`);
      }
    });
  }
}

module.exports = NoteService;
