from flask import Flask, render_template, request, jsonify
import sqlite3
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
DB_PATH = 'portfolio.db'


# ── Database setup ──────────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row   # lets you access columns by name
    return conn

def init_db():
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS messages (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            name      TEXT    NOT NULL,
            email     TEXT    NOT NULL,
            message   TEXT    NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS projects (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            title       TEXT    NOT NULL,
            description TEXT    NOT NULL,
            tech        TEXT    NOT NULL,   -- comma-separated tags e.g. "Python,Flask,SQLite"
            github_url  TEXT,
            live_url    TEXT,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ''')

    # Seed some sample projects if the table is empty
    count = conn.execute('SELECT COUNT(*) FROM projects').fetchone()[0]
    if count == 0:
        sample_projects = [
            (
                'Personal Portfolio',
                'A full-stack portfolio site built with Flask and SQLite, featuring a contact form and dynamic project listing.',
                'Python,Flask,SQLite,HTML,CSS,JavaScript',
                'https://github.com/Joel0804',
                ''
            ),
            (
                'CLI Task Manager',
                'A command-line CRUD app to manage daily tasks, stored in a JSON file with colourful terminal output.',
                'Python,JSON,CLI',
                'https://github.com/Joel0804',
                ''
            ),
            (
                'Weather Dashboard',
                'Fetches live weather data from an open API and displays it in a clean, responsive UI.',
                'JavaScript,HTML,CSS,REST API',
                'https://github.com/Joel0804',
                ''
            ),
        ]
        conn.executemany(
            'INSERT INTO projects (title, description, tech, github_url, live_url) VALUES (?,?,?,?,?)',
            sample_projects
        )

    conn.commit()
    conn.close()


# ── Page routes ─────────────────────────────────────────────────
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/skills')
def skills():
    return render_template('skills.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')


# ── API: contact form ────────────────────────────────────────────
@app.route('/api/contact', methods=['POST'])
def api_contact():
    data = request.get_json()

    name    = (data.get('name')    or '').strip()
    email   = (data.get('email')   or '').strip()
    message = (data.get('message') or '').strip()

    if not name or not email or not message:
        return jsonify({'status': 'error', 'message': 'All fields are required.'}), 400

    conn = get_db()
    conn.execute(
        'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
        (name, email, message)
    )
    conn.commit()
    conn.close()

    return jsonify({'status': 'ok', 'message': f"Thanks {name}! I'll get back to you soon."})


# ── API: projects list ───────────────────────────────────────────
@app.route('/api/projects', methods=['GET'])
def api_projects():
    conn = get_db()
    rows = conn.execute(
        'SELECT id, title, description, tech, github_url, live_url FROM projects ORDER BY id DESC'
    ).fetchall()
    conn.close()

    projects_list = []
    for row in rows:
        projects_list.append({
            'id':          row['id'],
            'title':       row['title'],
            'description': row['description'],
            'tech':        row['tech'].split(','),   # return as a proper list
            'github_url':  row['github_url'],
            'live_url':    row['live_url'],
        })

    return jsonify(projects_list)


# ── API: add a project (optional admin use) ──────────────────────
@app.route('/api/projects', methods=['POST'])
def api_add_project():
    data = request.get_json()

    title       = (data.get('title')       or '').strip()
    description = (data.get('description') or '').strip()
    tech        = (data.get('tech')        or '').strip()   # comma-separated string
    github_url  = (data.get('github_url')  or '').strip()
    live_url    = (data.get('live_url')    or '').strip()

    if not title or not description or not tech:
        return jsonify({'status': 'error', 'message': 'title, description and tech are required.'}), 400

    conn = get_db()
    conn.execute(
        'INSERT INTO projects (title, description, tech, github_url, live_url) VALUES (?,?,?,?,?)',
        (title, description, tech, github_url, live_url)
    )
    conn.commit()
    conn.close()

    return jsonify({'status': 'ok', 'message': 'Project added.'}), 201


# ── Run ──────────────────────────────────────────────────────────
if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)