/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex, Promise) {
  return knex("notes")
    .del()
    .then(() => {
      return knex("users").del()
    .then(function () { 
      return knex("users")
      .insert([
        { username: "sam", password: "sam" },
        { username: "test", password: "test" },
      ])
      .then(() => {
        return knex("notes").insert([
          { content: "one", user_id: "1" },
          { content: "two", user_id: "2" }, 
        ]);
            });
        });
    });
};
