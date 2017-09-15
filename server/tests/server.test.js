const expect     = require('expect');
const request    = require('supertest');
const {ObjectID} = require('mongodb');

const {app}  = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


//Deletes all records before test
beforeEach(populateUsers);
beforeEach(populateTodos);


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

});

describe('PATCH /todos/:id', () => {
  it('should update the todo',(done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed: true,
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');

    })
    .end(done)
  });

  it('should clear completedAt when is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = 'This should be the new text!!';

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed: false,
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.comnpletedAt).toNotExist();
    })
    .end(done)

  });
});


describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toString());
        expect(res.body.email).toBe(users[0].email);
      }). end(done);
  });

  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      }).end(done);
  });
});

describe('POST /users', () => {
  it ('Should create a user', (done) => {
    var email = 'test3@sample.com';
    var password = '123mnb!';

    request(app)
     .post('/users')
     .send({email, password})
     .expect(200)
     .expect((res) => {
       expect(res.headers['x-auth']).toExist();
       expect(res.body._id).toExist();
       expect(res.body.email).toBe(email);
     }).end((error) => {
       if (error) {
         return done(error);
       }
       User.findOne({email}).then((user) => {
         expect(user).toExist();
         expect(user.password).toNotBe(password);
         done();
       }).catch((e) => done());
     });
  });

  it ('Should return validation errors if request is invalid', (done) => {

    request(app)
      .post('/users')
      .send({email: 'test', password: '123'})
      .expect(400)
      .end(done);
  });


  it ('Should not create user if email exists already', (done) => {
    request(app)
      .post('/users')
      .send({email: users[0].email, password: 'password123!'})
      .expect(400)
      .end(done)
  });
});


describe('POST /users/login', () => {
   it('Should login user and return auth token', (done) => {
     request(app)
       .post('/users/login')
       .send({
         email: users[1].email,
         password: users[1].password
       })
       .expect(200)
       .expect((res) => {
         expect(res.headers['x-auth']).toExist();
       })
       .end((error, res) => {
         if (error) { return done(error);}

         User.findById(users[1]._id).then((user) => {
           expect(user.tokens[0]).toInclude({
             access: 'auth',
             token: res.headers['x-auth']
           });
           done();
         }).catch((e) => done());
       });
   });

   it('Should return invalid login', (done) => {
     request(app)
       .post('/users/login')
       .send({
         email: users[1].email,
         password: users[1].password + 'Serge'
       })
       .expect(400)
       .expect((res) => {
         expect(res.headers['x-auth']).toNotExist();
       })
       .end((error, res) => {
         if (error) { return done(error);}

         User.findById(users[1]._id).then((user) => {
           expect(user.tokens[0].length).toEqual(0);
           done();
         }).catch((e) => done());
       });
   });


});
