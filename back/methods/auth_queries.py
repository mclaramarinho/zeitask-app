import firebase_admin
from firebase_admin import auth


def query_email_availability(email):
        try:
                x = auth.get_user_by_email(email)
                return "unavailable"
        except:
                ## if the user does not exist, it returns an error
                return "available"


def query_username_availability(username):
        # Returns true if available
        # Returns false if unavailable
        try:
                x = auth.list_users()
                auth.get_users([

                ])
                is_available = True
                for user in x.iterate_all():
                        if user.display_name == username:
                            is_available = False
                            break
                return is_available

        except Exception as err:
                return err.__str__()

def create_user(email, username, pswd):
        auth.create_user(
                email = email,
                display_name = username,
                password = pswd
        )
        return "created"