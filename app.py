import json
from boggle import Boggle
from flask import Flask, request, render_template, redirect, flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = 'a'

boggle_game = Boggle()
scores = []

@app.route('/')
def start_page():
    board = boggle_game.make_board()
    session['board'] = board
    return render_template('board.html', board=board)

@app.route('/check')
def check_word():
    board = session['board']
    word = request.args["word"]
    result = boggle_game.check_valid_word(board, word)
    return jsonify(result)

@app.route('/submit', methods=["POST"])
def submit_score():
    response = {}
    data = request.get_json()
    score = data['score']
    scores.append(score)
    response['high_score'] = str(max(scores))
    response['games_played'] = str(len(scores))
    return response
