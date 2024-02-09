const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path'); // Add path module for file paths
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 3000;
//mongodb+srv://anuarbek0471:9BQm7QWmRsvtfoKI@cluster0.xycxadw.mongodb.net/?retryWrites=true&w=majority"
// MongoDB connection
mongoose.connect("mongodb+srv://anuarbek0471:9BQm7QWmRsvtfoKI@cluster0.xycxadw.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({ secret: 'ba686a76b6c89f97646df8c0b98b7a7f1408523aef8fffe7d2a9cce8c4297e40', resave: true, saveUninitialized: true }));

// Routes
const registerRoute = require('./routes/register');
app.use('/register', registerRoute);
app.use('/', require('./routes/main'));
app.use('/login', require('./routes/login'));
app.use('/admin', require('./routes/admin'));
const mainRouter = require('./routes/index'); // или путь к вашему файлу с маршрутами
app.use('/', mainRouter); // здесь используется корневой путь, вы можете изменить его по необходимости
app.use('/exchangeRate', require('./routes/main'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
