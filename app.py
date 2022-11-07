from boggle import Boggle
from flask import Flask, request, render_template, redirect, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension


app = Flask(__name__)
app.config['SECRET_KEY'] = 'test'
debug = DebugToolbarExtension(app)

boggle_game = Boggle()


@app.route('/')
def home_page():
    """Home page for application. Also sets up three session variables."""
    session['board'] = boggle_game.make_board() 
    session['highscore'] = session.get("highscore", 0)
    session['games_played'] = session.get("games_played", 0)
    return render_template('home_page.html', board=session['board'])


@app.route('/verify_word')
def word_verify():
    """this listens to the query string argument after the form is submitted and verifies the word"""
    guess = request.args['guess']
    verification = boggle_game.check_valid_word(session['board'], guess)
    return jsonify({'result':verification})


@app.route('/end_game', methods=["POST"])
def end_game():
    """This tracks how many times the user has played the game while also updating the highscore."""
    score = int(request.json['currentScore'])
    current_high_score = session.get("highscore")

    if (current_high_score < score):
        session['highscore'] = score;

    game_counter = session.get("games_played") + 1
    session['games_played'] = game_counter
    # I currntly have this set to return the highscore value, though it is not used.
    return jsonify({'highscore':session['highscore']})