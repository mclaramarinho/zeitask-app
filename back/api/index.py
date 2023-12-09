from flask import Flask
from methods.auth_queries import query_email_availability, query_username_availability, create_user
import firebase_admin
from firebase_admin import credentials
from pyrebase import initialize_app
#from firebaseConfig import FIREBASE_CONFIG
import os
from dotenv import load_dotenv

load_dotenv()
private_key_id = os.environ.get('FIREBASE_PRIVATE_KEY_ID')
private_key = os.environ.get('FIREBASE_PRIVATE_KEY')
project_id = os.environ.get('FIREBASE_PROJECT_ID')

app = Flask(__name__)

fb = initialize_app(FIREBASE_CONFIG)
auth = fb.auth()
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": f"{project_id}",
    "private_key_id": f"{private_key_id}",
    "private_key": f"{private_key}",
    "client_email": "firebase-adminsdk-66v42@zeitask.iam.gserviceaccount.com",
    "client_id": "101692490798999468550",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-66v42%40zeitask.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
})
firebase_admin.initialize_app(cred)

@app.route('/')
def main_endpoint():
    return "You should go to another endpoint."
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

if __name__ == '__main__':
    app.run()