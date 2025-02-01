const express = require('express');
const db = require('./models/db');
const app = express();
const userRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
app.use(express.json());
app.use('/api/v1/nextu/users' , userRouter);
app.use('/api/v1/nextu/posts' , postsRouter);

async function auth(){
  try {
      await db.sequelize.authenticate();
      console.log('bien connecté');
    } catch (error) {
      console.error('erreur de connection : ', error);
    }
    
}
auth();


module.exports = app;