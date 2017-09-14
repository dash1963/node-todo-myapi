const expect     = require('expect');
const request    = require('supertest');
const {ObjectID} = require('mongodb');

const {app}  = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

// dummy todos
const todos = [
                { _id: new ObjectID(), text: 'first test todo'},
                { _id: new ObjectID(), text: 'second test todo'}
              ]


//Deletes all records before test
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});


describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo TEXT';
    request(app)
       .post('/todos')
       .send({text})
       .expect(200)
       .expect((res) => {
         expect(res.body.text).toBe(text);
       })
       .end((error, res) => {
         if (error)
         {
           return done(error);
         }
         Todo.find({text}).then((todos) => {
           expect(todos.length).toBe(1);
           expect(todos[0].text).toBe(text);
           done();
         }).catch((error) => done(error));
       });
  });

  it('should not create todo with invalid body data', (done) => {
    //var text = '';
    request(app)
       .post('/todos')
       .send({})
       .expect(400)
       .end((error, res) => {
         if (error)
         {
           return done(error);
         }

         Todo.find().then((todos) => {
           expect(todos.length).toBe(2);
           done();
         }).catch((error) => done(error));
      });
  });
});


describe ('GET /todos', () => {
  it('Should get all todos', (done) => {
     request(app)
       .get('/todos')
       .expect(200)
       .expect((res) => {
         expect(res.body.todos.length).toBe(2)
       })
       .end(done);
  });
});


describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
       .get(`/todos/${todos[0]._id.toHexString()}`)
       .expect(200)
       .expect((res) => {
         expect(res.body.todo.text).toBe(todos[0].text);
       }).end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done)
  });

  it('Should return 404 for non-object ids', (done) => {
    request(app)
    .get('/todos/123abc')
    .expect(404)
    .end(done)
  })
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    console.log("ID: ", hexId);

    request(app)
       .delete(`/todos/${hexId}`)
       .expect(200)
       .expect((res) => {
         expect(res.body.todo._id).toBe(hexId)
       })
       .end((error, res) => {
         if (error) {
           return done(error)
         }

         Todo.findById(hexId).then((todo) => {
           expect(todo).toNotExist();
           done();
         }).catch((error) => done(error));
       });
  });

  it('should return 404 if todo not found', (done) => {
    var id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done)
   });

it('Should return 404 if object id is invalid', (done) => {
  request(app)
  .delete('/todos/123abc')
  .expect(404)
  .end(done)
 });

})
