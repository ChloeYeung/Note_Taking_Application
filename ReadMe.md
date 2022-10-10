# :scroll: Note Taking Application

- Node JS, Database

- Functionalities:

:cloud: Login 

:cloud: Show, Add, Edit, Delete notes
  
<img width="1073" alt="notesTaking" src="https://user-images.githubusercontent.com/106992258/194902656-9808bc5d-772e-4c3b-91e7-945ba460e8c1.png">


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

### Account Login
- :bust_in_silhouette: ac: sam  :key: pw: sam
-  or
- :bust_in_silhouette: ac: test  :key: pw: test
