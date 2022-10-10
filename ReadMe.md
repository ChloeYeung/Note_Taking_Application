# Note Taking Application

- Functionalities:
  :cloud: login 
  :cloud: Add, Edit, Delete notes
- Node JS, Database

### Install Packages

`npm install knex axios express express-basic-auth express-handlebars path supertest jest`

### setup for backend .env

- set 3 variables in .env
  `DB_NAME= YOUR DATABASE NAME`
  `DB_USERNAME= YOUR DATABASE USERNAME`
  `DB_PASSWORD= YOUR DATABASE PASSWORD`

- set up dummy data, run:
  `knex migrate:latest`
  `knex seed:run`

### Start the App:

- `node index.js`
- go to `http://localhost:3000`

## CONTENTS OF THIS DILE

- Introduction

---

The purpose of this project is to make a note taking application with knex that can list, add, edit, and delete notes.

- Library

---

For the product, this project require knex, axios, express, express-basic-auth, express-handlebars, path.

For the development stage, supertest, and jest are required.

- Configuration

---

Production port: 3000
Development port: 3000
Testing port: 3000
