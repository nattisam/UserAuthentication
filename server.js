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
        const hashedPassWord = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassWord
        })
        res.redirect("/login")
    } catch {
        res.redirect("/register")
    }
    console.log(users)
})

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