from flask import Flask, render_template, request, session, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import datetime, os

load_dotenv()
db_password = os.getenv('DB_PASSWORD')

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://postgres:{db_password}@localhost/journals'
db = SQLAlchemy(app)
app.secret_key = '8ed72fdefdbb08df2243ad1a6e920e5595864e81b6b050bef5b205423ad9de23'

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(20), unique = True, nullable = False)
    password = db.Column(db.String(60), nullable = False)
    def __init__(self, p_username, p_password):
        self.username = p_username
        self.password = p_password

class JournalEntry(db.Model):
    __tablename__ = 'journal_entries'
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)
    date = db.Column(db.DateTime, nullable = False)
    title = db.Column(db.String(100), nullable = False)
    body = db.Column(db.String(1000), nullable = False)
    def __init__(self, p_user_id, p_date, p_title, p_body):
        self.user_id = p_user_id
        self.date = p_date
        self.title = p_title
        self.body = p_body

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    if 'username' in session:
        user_id = User.query.filter(User.username==session['username']).all()[0].id
        count = JournalEntry.query.filter(JournalEntry.user_id==user_id).count()
        return render_template('index.html', username=session['username'], count=count)
    if 'message' in session:
        message = session['message']
        del session['message']
        return render_template('login.html', message=message)
    else:
        return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        user_list = User.query.filter(User.username==username).all()
        if len(user_list) == 0:
            session['message'] = 'Username not found'
            return redirect(url_for('index'))
        user = user_list[0]
        password = user.password
        if (request.form['password'] == password):
            session['username'] = username
        else:
            session['message'] = 'Incorrect password'
        return redirect(url_for('index'))

@app.route('/create-account', methods=['POST'])
def create_account():
    if request.method == 'POST':
        username = request.form['username']
        all_usernames = [username_tuple[0] for username_tuple in db.session.query(User.username).all()]
        if username in all_usernames:
            session['message'] = 'Username already in use'
            return redirect(url_for('index'))
        password = request.form['password']
        user = User(username, password)
        db.session.add(user)
        db.session.commit()
        session['username'] = username
        return redirect(url_for('index'))

@app.route('/logout', methods=['POST'])
def logout():
    if request.method == 'POST':
        del session['username']
        return redirect(url_for('index'))

@app.route('/journal', methods=['GET'])
def journal():
    if 'username' not in session:
        return redirect(url_for('index'))
    user_id = User.query.filter(User.username==session['username']).all()[0].id
    entries = JournalEntry.query.filter(JournalEntry.user_id==user_id).all()
    entries.reverse()
    return render_template('journal.html', entries=entries)

@app.route('/new', methods=['GET', 'POST'])
def new():
    if 'username' not in session:
        return redirect(url_for('index'))
    if request.method == 'GET':
        return render_template('new.html')
    elif request.method == 'POST':
        user_id = User.query.filter(User.username==session['username']).all()[0].id
        date = datetime.datetime.now()
        title = request.form['title']
        body = request.form['body']
        if title=='' or body=='':
            return redirect(url_for('new'))
        entry = JournalEntry(user_id, date, title, body)
        db.session.add(entry)
        db.session.commit()
        return redirect(url_for('journal'))

@app.route('/edit', methods=['GET', 'POST'])
def edit():
    if 'username' not in session:
        return redirect(url_for('index'))
    if request.method == 'GET':
        entry_id = request.args.get('entry_id')
        entry = JournalEntry.query.filter(JournalEntry.id==entry_id).all()[0]
        user_id = User.query.filter(User.username==session['username']).all()[0].id
        if entry.user_id != user_id:
            return redirect(url_for('journal'))
        title = entry.title
        body = entry.body
        return render_template('edit.html', title=title, body=body, entry_id=entry_id)
    elif request.method == 'POST':
        entry_id = request.form['entry_id']
        entry = JournalEntry.query.filter(JournalEntry.id==entry_id).all()[0]
        title = request.form['title']
        body = request.form['body']
        # update entry values
        entry.title = title
        entry.body = body
        db.session.commit()
        return redirect(url_for('journal'))

if __name__=='__main__':
    app.debug = True
    app.run()