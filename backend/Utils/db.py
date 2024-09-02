import pymysql
from pymysql.connections import Connection

# Define your MySQL connection parameters
DB_HOST = '112.169.16.65'  # e.g., 'localhost'
PORT = 32123
DB_USER = 'root'  # e.g., 'root'
DB_PASSWORD = '7786'
DB_NAME = 'mlops_crpyto'

# Create a connection object
def get_connection() -> Connection:
    try:
        connection = pymysql.connect(
            host=DB_HOST,
            port=PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            cursorclass=pymysql.cursors.DictCursor  # This returns rows as dictionaries
        )
        return connection
    except pymysql.MySQLError as e:
        print(f"Error connecting to the database: {e}")
        raise

# Optionally, you can also create a function to close the connection
def close_connection(connection: Connection):
    if connection and connection.open:
        connection.close()

# You can now import `get_connection` from this module in other parts of your code.
