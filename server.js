if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path'); // Import the path module

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email == email),
    id => users.find(user => user.id == id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', checkIfAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})

app.get('/login', checkIfNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkIfNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}))

app.get('/register', checkIfNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkIfNotAuthenticated, async (req, res) => {
    try {
        // Check if user with the same email already exists
        const existingUser = users.find(user => user.email === req.body.email);
        if (existingUser) {
            // If user with the same email exists, redirect back to register page with an error message
            req.flash('error', 'An account with this email already exists.');
            return res.redirect('/register');
        }

        // If user with the same email doesn't exist, proceed with registration
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = {
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        };
        users.push(newUser);
        req.flash('success', 'Registration successful! You can now log in.');
        res.redirect("/login");
    } catch {
        // Handle any unexpected errors during registration
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect("/register");
    }
});


app.delete('/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
            res.redirect('/login');
    });
});

function checkIfAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkIfNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    return next()
}

app.listen(3000);