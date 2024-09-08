import sys
import os
sys.path.append(f"{os.getcwd()}/utils/")

import hashlib
from utils.db import get_connection, close_connection
import pymysql

def fetch_user(user_id: str):
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                sql = "SELECT * FROM users WHERE id = %s"
                cursor.execute(sql, (user_id,))
                row = cursor.fetchone()  # Fetch a single row
                return row
    except pymysql.MySQLError as e:
        print(f"Error while fetching user: {e}")
        return None  # Return None if there's an error
    
def insert_user(id: str="test_id", password: str="test_pwd"):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO users (id, password) VALUES (%s, %s)"
            cursor.execute(sql, (id, password))
        connection.commit()
    finally:
        close_connection(connection)

def update_user_email(id: str="test_id", password: str="test_pwd"):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            sql = "UPDATE users SET email = %s WHERE id = %s"
            cursor.execute(sql, (id, password))
        connection.commit()
    finally:
        close_connection(connection)

# pwd = "5f4dcc3b5aa765d61d8327deb882cf99"
def log_in(user:dict):
    email = user["email"]
    password = user["password"]
    hashed_pwd = hashlib.md5(password.encode()).hexdigest()

    user = fetch_user(user_id=email)
    if user:
        print(f"User found: {user}")
        return True
    else:
        print("User not found or an error occurred.")
        return False

def register(user:dict):
    try:
        fullName = user["fullName"]
        email = user["email"]
        password = user["password"]
        hashed_pwd = hashlib.md5(password.encode()).hexdigest()

        insert_user(id=email, password=hashed_pwd)
        return True, "created"
    except Exception as e:
        return False, e