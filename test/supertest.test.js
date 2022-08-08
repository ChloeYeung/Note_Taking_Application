const app = require('../index');
const request = require('supertest');
const expressBasicAuth = require('express-basic-auth');

// test get('/')
describe('Rendering the Index Page and check the content type as html', (done) => {

    test('Render HTML page', async () => {
        let res = await request(app).get('/').auth('dennis', 'password')
        // console.log("------------------------------------------------------------------------------------------------")
        // console.log(res.header)
        // console.log("------------------------------------------------------------------------------------------------")
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe("text/html; charset=utf-8")
    })
})

// test get('/api/notes')
describe('Get Notes From User and check the content type as object', (done) => {

    test('return notes', async () => {
        let res = await request(app).get('/api/notes').auth('dennis', 'password')
        // console.log("------------------------------------------------------------------------------------------------")
        // console.log(res)
        // console.log("------------------------------------------------------------------------------------------------")
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe("application/json; charset=utf-8")
        expect(typeof (res.body)).toBe("object")
    })
})

// test post('/api/notes')
describe('Add new Note to the User and varify it with the get("/api/notes")', (done) => {

    test('add notes', async () => {
        let getRes = await request(app).get('/api/notes').auth('dennis', 'password')
        expect(getRes.statusCode).toBe(200)
        expect(getRes.headers['content-type']).toBe("application/json; charset=utf-8")
        expect(typeof (getRes.body)).toBe("object")

        let addMessage = "hi from the supertestsss";
        let postRes = await request(app).post('/api/notes').send({ note: addMessage }).auth('dennis', 'password')
        expect(postRes.statusCode).toBe(200)
        expect(postRes.headers['content-type']).toBe("application/json; charset=utf-8")
        expect(typeof (postRes.body)).toBe("object")

        // getRes is the the request we made in the first place before adding the note to the server.
        // in such way, after pushing addMessage to getRes's body, it should match the responding body we got from postRes.

        var getAfterAdd = [];

        for (var i in getRes.body)
        getAfterAdd.push( getRes.body[i]);

        getAfterAdd.push(addMessage)

        var postOriginal = [];

        for (var i in postRes.body)
        postOriginal.push( postRes.body[i]);
        
        expect(getAfterAdd).toEqual(postOriginal)
    })
})


// test delete('/api/notes')
describe('Delete the first note of the User and varify it with the get("/api/notes")', (done) => {

    test('delete notes', async () => {
        let getRes = await request(app).get('/api/notes').auth('dennis', 'password')
        expect(getRes.statusCode).toBe(200)
        expect(getRes.headers['content-type']).toBe("application/json; charset=utf-8")
        expect(typeof (getRes.body)).toBe("object")

        let deleteRes = await request(app).delete('/api/notes').send({ index: 0 }).auth('dennis', 'password')
        expect(deleteRes.statusCode).toBe(200)
        expect(deleteRes.headers['content-type']).toBe("application/json; charset=utf-8")
        expect(typeof (deleteRes.body)).toBe("object")

        // getRes is the the request we made in the first place before adding the note to the server.
        // in such way, after pushing addMessage to getRes's body, it should match the responding body we got from deleteRes.

        var getAfterDelete = [];

        for (var i in getRes.body)
        getAfterDelete.push( getRes.body[i]);

        getAfterDelete.shift();

        var deleteOriginal = [];

        for (var i in deleteRes.body)
        deleteOriginal.push( deleteRes.body[i]);
          
        expect(getAfterDelete).toEqual(deleteOriginal)
    })
})


// test update('/api/notes')
describe('update the first note of the User and varify it with the get("/api/notes")', (done) => {

    test('update notes', async () => {
        let getRes = await request(app).get('/api/notes').auth('dennis', 'password')
        expect(getRes.statusCode).toBe(200)
        expect(getRes.headers['content-type']).toBe("application/json; charset=utf-8")
        expect(typeof (getRes.body)).toBe("object")

        let updateRes = await request(app).put('/api/notes').send({note:"The is an update from the Supertest", index: 0 }).auth('dennis', 'password')
        expect(updateRes.statusCode).toBe(200)
        expect(updateRes.headers['content-type']).toBe("application/json; charset=utf-8")
        expect(typeof (updateRes.body)).toBe("object")

        // getRes is the the request we made in the first place before adding the note to the server.
        // in such way, after pushing addMessage to getRes's body, it should match the responding body we got from updateRes.

        var getAfterUpdate = [];

        for (var i in getRes.body)
        getAfterUpdate.push( getRes.body[i]);

        getAfterUpdate[0] = "The is an update from the Supertest";

        var updateOriginal = [];

        for (var i in updateRes.body)
        updateOriginal.push( updateRes.body[i]);
        
        expect(getAfterUpdate).toEqual(updateOriginal)
    })
})
