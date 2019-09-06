const express = require("express");
const app = express();

app.use(express.static(__dirname + "/static"));
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const session = require('express-session');
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))


app.get('/', (req, res) => {
    var values = {};
    /*
    var values = {            
        'box_class' : 'no_guess',
        'text_display' : 'none',
        'text_content' : '',
        'play_again_display' : 'none',
        'input_display': 'block',
        'submit_display': 'inline-block',
        'guess_display': 'none',
        'guess-text': ''};
        */
    if(!('randomNum' in req.session) || !('userGuess' in req.session)) {
        req.session.randomNum = Math.floor(Math.random() * 100) + 1
        req.session.userGuess = -1;
        req.session.numGuesses = 0;
    }

    if (parseInt(req.session.userGuess, 10) == -1){
        console.log("Hello I am here");
        values = {
            'box_class' : 'no_guess',
            'text_display' : 'none',
            'text_content' : '',
            'play_again_display' : 'none',
            'input_display': 'block',
            'submit_display': 'inline-block',
            'guess_display': 'none',
            'guess-text': '',
        };
    }

    else if(parseInt(req.session.numGuesses, 10) >= 4) {
        values = {'box_class' : 'wrong_guess',
        'text_display' : 'inline-block',
        'text_content' : 'You Lose!',
        'play_again_display' : 'inline-block',
        'input_display' : 'none',
        'submit_display' : 'none',
        'guess_display' : 'inline-block',
        'guess_text' : 'You ran out of guesses.'};
    }

    else if (parseInt(req.session.userGuess, 10) < req.session.randomNum){
        req.session.numGuesses += 1;
        values = {
            'box_class' : 'wrong_guess',
            'text_display' : 'inline-block',
            'text_content' : 'Toow Low!',
            'play_again_display' : 'none',
            'input_display': 'block',
            'submit_display': 'inline-block',
            'guess_display': 'inline-block',
            'guess_text': 'You have guessed' + String(req.session.numGuesses) + "times. You have " + String(5 - req.session.numGuesses) + " remaining."
        };
    }

    else if(parseInt(req.session.userGuess, 10) > req.session.randomNum) {
        req.session.numGuesses ++;
        values = {
            'box_class' : 'wrong_guess',
            'text_display' : 'inline-block',
            'text_content' : 'Too high!',
            'play_again_display' : 'none',
            'input_display' : 'block',
            'submit_display' : 'inline-block',
            'guess_display' : 'inline-block',
            'guess_text' : "You have guessed " + String(req.session.numGuesses) + " times. You have " + String(5 - req.session.numGuesses) + " remaining."};
    }

    else if(parseInt(req.session.userGuess, 10) == req.session.randomNum) {
        req.session.numGuesses++;
        values = {
            'box_class' : 'correct_guess',
            'text_display' : 'inline-block',
            'text_content' : String(req.session.userGuess) + ' was the correct number!',
            'play_again_display' : 'inline-block',
            'input_display' : 'none',
            'submit_display' : 'none',
            'guess_display' : 'inline-block',
            'guess_text' : "It took you " + String(req.session.numGuesses) + " times to find the right number!"
        };
    }
   res.render('index', {for_engine: values});
});

app.post('/guess', (req, res) => {
    req.session.userGuess = req.body.user_num;
    res.redirect('/');
});


app.get('/reset', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(8000, () => console.log("listening on port 8000"));