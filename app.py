from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure the database (MySQL in this example)
app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Zk77p455@'
app.config['MYSQL_DB'] = 'FlexCalendar'

# Initialize the MySQL database connection
mysql_conn = mysql.connector.connect(
    host=app.config['MYSQL_HOST'],
    user=app.config['MYSQL_USER'],
    password=app.config['MYSQL_PASSWORD'],
    database=app.config['MYSQL_DB']
)

# Define the database model for CalendarEvent
db = SQLAlchemy(app)
class CalendarEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    motive = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(10), nullable=False)
    hours = db.Column(db.Integer, nullable=False)

# Create the database tables (initialize the database)
with app.app_context():
    db.create_all()

# Route to handle data saving
@app.route('/api/saveData', methods=['POST', 'OPTIONS'])
def save_data():
    if request.method == 'OPTIONS':
        # Handle the OPTIONS request for CORS preflight
        return '', 200

    data = request.json

    if not data or 'events' not in data:
        return jsonify({"error": "Invalid request! No data received."}), 400

    events = data['events']

    if not events:
        return jsonify({"error": "Invalid request! No events provided."}), 400

    try:
        # Process each event in the events array
        for event in events:
            name = event.get('name')
            motive = event.get('motive')
            month = event.get('date').split('-')[1]
            day = event.get('date').split('-')[2]
            year = event.get('date').split('-')[0]
            hours = event.get('hours')

            if not name or not motive or not month or not day or not year or not hours:
                return jsonify({"error": "Incomplete data! Please provide all the required fields."}), 400

            # Create a new CalendarEvent object with the provided data
            event_obj = CalendarEvent(
                name=name,
                motive=motive,
                date=f"{year}-{month}-{day}",
                hours=int(hours)
            )

            # Add the event to the database
            db.session.add(event_obj)

        # Commit all events to the database
        db.session.commit()
        return jsonify({"message": "Data saved successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error saving data to the database: {e}"}), 500

# Route to fetch all names from the database
@app.route('/api/names', methods=['GET'])
def get_all_names():
    try:
        connection = mysql.connector.connect(**app.config)
        cursor = connection.cursor()

        # Execute the SQL query to fetch all unique names
        cursor.execute("SELECT DISTINCT name FROM CalendarEvent")

        # Fetch all rows and convert them to a list of strings
        names = [row[0] for row in cursor.fetchall()]

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return jsonify({"names": names}), 200
    except Exception as e:
        return jsonify({"error": f"Error fetching names: {e}"}), 500

# Route to fetch all motives from the database
@app.route('/api/getAllMotives', methods=['GET'])
def get_all_motives():
    try:
        connection = mysql.connector.connect(**app.config)
        cursor = connection.cursor()

        # Execute the SQL query to fetch all unique motives
        cursor.execute("SELECT DISTINCT motive FROM CalendarEvent")

        # Fetch all rows and convert them to a list of strings
        motives = [row[0] for row in cursor.fetchall()]

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return jsonify({"motives": motives}), 200
    except Exception as e:
        return jsonify({"error": f"Error fetching motives: {e}"}), 500

# Function to query all data from the CalendarEvent table
def query_all_data():
    try:
        connection = mysql.connector.connect(**app.config)
        cursor = connection.cursor()

        # Execute the SQL query to fetch all data
        cursor.execute("SELECT * FROM CalendarEvent")

        # Fetch all rows and convert them to a list of dictionaries
        data = [
            {
                "id": row[0],
                "name": row[1],
                "motive": row[2],
                "date": row[3],
                "hours": row[4]
            }
            for row in cursor.fetchall()
        ]

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": f"Error querying data: {e}"}), 500

# Run the Flask app
if __name__ == '__main__':
    with app.app_context():
        # Create the database tables (initialize the database) within the app context
        db.create_all()
    app.run(debug=True, port=8000)