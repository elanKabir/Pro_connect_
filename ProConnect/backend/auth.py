from helpers import make_return_message
from bson import ObjectId
import jwt

default_image_path = '/backend/white text logo.png'
def register_user(data, collection, app):
    """
    Register a new user.

    Args:
    - data (dict): User registration data.
    - collection (pymongo.collection.Collection): MongoDB collection for user data.
    - app (Flask): Flask application instance.

    Returns:
    - JSON response and HTTP status code.
    """
    try:
        email = data.get('email')
        password = data.get('password')
        entityname = data.get('entityname')
        phone = data.get('phone')
        location = data.get('location')
        abn = data.get('abn')
        role = data.get('role')
        
        default_bio = 'I am proud of myself'
        default_rating = '0.0'
        default_skill = []

        # Check if the email address or ABN is already in use
        existing_user_email = collection.find_one({'email': email})
        existing_user_abn = collection.find_one({'abn': abn})
        
        if existing_user_email:
            return make_return_message(
                message='Email already exists, Please try again',
                status='error',
                data={},
                code=403
            )

        if existing_user_abn:
             return make_return_message(
                message='ABN already exists, Please try again',
                status='error',
                data={},
                code=403
            )          

        # Create a new user document
        new_user = {
            'email': email,
            'password': password,
            'entityname': entityname,
            'phone': phone,
            'location': location,
            'abn': abn,
            'role': role ,
            'profile_image': default_image_path,
            'bio': default_bio,
            'rating': default_rating,
            'skills': default_skill
        } 
        result = collection.insert_one(new_user)
        inserted_id = str(result.inserted_id)
        # Registration successful
        response = {
            'message': 'Registration successful',
            'status': 'success',
            'data': {
                'token': jwt.encode({
                    'uid': inserted_id,
                    'email': email,
                    'entityname': entityname,
                    'abn': abn,
                    'role': role 
                }, app.secret_key)
            }
        }
        return make_return_message(
            message='Welcome to ProConnect',
            status='success',
            data=response,
            code=200
        )

    except Exception as e:
        return make_return_message(
            message=str(e),
            status='error',
            data={},
            code=500
        )

def login_user(data, collection, app):
    """
    Log in an existing user.

    Args:
    - data (dict): User login data.
    - collection (pymongo.collection.Collection): MongoDB collection for user data.
    - app (Flask): Flask application instance.

    Returns:
    - JSON response and HTTP status code.
    """
    try:
        email = data.get('email')
        password = data.get('password')

        user = collection.find_one({'email': email})

        if not user:
            return make_return_message(
                message='Invalid Credentials, Please try again.',
                status='error',
                data={},
                code=403
            )

        stored_password = user.get('password')
        if not stored_password:
            return make_return_message(
                message='Invalid Credentials, Please try again.',
                status='error',
                data={},
                code=403
            )

        if stored_password == password:
            user_id = str(user['_id'])
            entityname = user.get('entityname')
            abn = user.get('abn')
            role = user.get('role')
            token = jwt.encode({
                'uid': user_id,
                'email': email,
                'entityname': entityname,
                'abn': abn,
                'role': role
            }, app.secret_key)

            return make_return_message(
                message='Logged in successfully',
                status='success',
                data={'token': token, 'user_id': user_id},
                code=200
            )
        else:
            return make_return_message(
                message='Invalid Credentials, Please try again.',
                status='error',
                data={},
                code=403
            )
    except Exception as e:
        return make_return_message(
                message=str(e),
                status='error',
                data={},
                code=500
            )

    
def change_password(data, collection, app, user_id):
    """
    Change the password of a user.

    Args:
    - data (dict): User password change data.
    - collection (pymongo.collection.Collection): MongoDB collection for user data.
    - app (Flask): Flask application instance.
    - user_id (str): User ID for which the password is to be changed.

    Returns:
    - JSON response and HTTP status code.
    """
    try:
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        # Fetch the user from the database using user_id.
        user = collection.find_one({'_id': ObjectId(user_id)})
        if user is None:
            make_return_message(
                message='Invalid Credentials, Please try again.',
                status='error',
                data={},
                code=403
            )

        stored_password = user.get('password')
        if stored_password == old_password:
            collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'password': new_password}}
            )
            

            return make_return_message(
                message='change password successfully',
                status='success',
                data={'user_id': user_id},
                code=200
            )
        else:
            return make_return_message(
                message='Invalid Credentials, Please try again.',
                status='error',
                data={},
                code=403
            )
    except Exception as e:
        return make_return_message(
                message=str(e),
                status='error',
                data={},
                code=500
            )
