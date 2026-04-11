# Joel Dsilva — Personal Portfolio

A full-stack personal portfolio website built with Flask and SQLite.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, Flask
- **Database:** SQLite
- **Version Control:** Git

## Features

- Responsive portfolio with home, about, skills, projects and contact pages
- Contact form that saves messages to a database
- Projects loaded dynamically from the database via REST API
- Typing animation and scroll-triggered fade-in effects

## Setup

1. Clone the repo
   git clone https://github.com/Joel0804/Portfolio

2. Create and activate virtual environment
   python -m venv venv
   venv\Scripts\activate

3. Install dependencies
   pip install -r requirements.txt

4. Run the app
   python app.py

5. Open in browser
   http://127.0.0.1:5000

## API Routes

| Method | Route          | Description                  |
|--------|----------------|------------------------------|
| GET    | /              | Home page                    |
| GET    | /about         | About page                   |
| GET    | /skills        | Skills page                  |
| GET    | /projects      | Projects page                |
| GET    | /contact       | Contact page                 |
| POST   | /api/contact   | Save contact form submission |
| GET    | /api/projects  | Return all projects as JSON  |
| POST   | /api/projects  | Add a new project            |
