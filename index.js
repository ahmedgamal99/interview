const mongoose = require('mongoose')
const express = require('express')
const app = express()
const config = require('config')


mongoose.connect('mongodb://localhost/interview', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));



if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}
const users = require('./routes/users')
const auth = require('./routes/auth')

//export interview_jwtPrivateKey=interview

app.use(express.json());
app.set("view engine", "ejs");

app.use('/api/users', users);
app.use('/api/auth', auth);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


