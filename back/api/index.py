from flask import Flask
from methods.auth_queries import query_email_availability, query_username_availability, create_user
import firebase_admin
from firebase_admin import credentials, auth
import pyrebase
from setup import firebaseConfig


app = Flask(__name__)

fb = pyrebase.initialize_app(firebaseConfig)
auth = fb.auth()
cred = credentials.Certificate('methods/setup.json')
firebase_admin.initialize_app(cred)


@app.route('/isEmailAvailable/<email>')
def is_email_available(email):
    res = query_email_availability(email)
    return res


@app.route('/isUsernameAvailable/<username>')
def is_username_available(username):
    res = query_username_availability(username)
    return res.__str__()


@app.route('/createUser/<email>/<username>/<pswd>')
def create_user_ep(email, username, pswd):
    x = create_user(email, username, pswd)
    return x


if __name__ == "__main__":
    app.run()
