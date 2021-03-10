from boggle import Boggle
from flask import Flask, request, render_template, redirect, flash, session
# from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = 'a'

boggle_game = Boggle()

@app.route('/')
def start_page():
    board = boggle_game.make_board()
    session['board'] = board
    return render_template('board.html', board=board)

@app.route('/check', methods=["POST"])
def check_word():
    word = request.form["word"]
    print(word)
