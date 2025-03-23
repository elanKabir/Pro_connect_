import jwt
from bson import Binary, ObjectId
from helpers import make_return_message

def user_edit_profile(data, user_collection, token, app):
    """
    Edit user profile information.

    Args:
        data (dict): The data containing the updated profile information.
        user_collection (MongoDB Collection): The user collection in the database.
        token (str): The user's JWT token.
        app (Flask App): The Flask application object.

    Returns:
        dict: A JSON response indicating the success or failure of the profile update.
    """
    new_email = data.get('email', None)
    new_phone = data.get('phone', None)
    new_location = data.get('location', None)
    new_name = data.get('entityname', None)   
    user_id = jwt.decode(token, app.secret_key, algorithms=['HS256'])
    user = user_collection.find_one({'_id': ObjectId(user_id['uid'])})
   
    try:
        # Check if the user with the given user_id exists
        if not user:
            return make_return_message(
                message='Invalid user id',
                status='error',
                code=403,
                data={}
            )
        # Update the user's name, email, and phone number
        user['email'] = new_email
        user['phone'] = new_phone
        user['location'] = new_location

        if user['role'] == '30':
            user['entityname'] = new_name
        # Update the user document in the MongoDB users user_collection
        user_collection.update_one({'_id': ObjectId(user_id['uid'])}, {'$set': user})
        new_token = jwt.encode({'uid': user_id['uid'], 'email': new_email, 'phone': new_phone, 'location': new_location, 'entityname': new_name, 'role':user['role']}, app.secret_key, algorithm='HS256')

        return make_return_message(
            message='Profile updated successfully',
            status='success',
            code=200,
            data={'user_id': user_id['uid'], 'user':str(user), 'new_token': str(new_token)}
        )
    except Exception as e:
        make_return_message(
            message=str(e),
            status='error',
            code=500,
            data={}
        )

def upload_cv_in_profile(user_collection, file, token, app, cv_collection):
    """
    Upload a CV to a user's profile.

    Args:
        user_collection (MongoDB Collection): The user collection in the database.
        file (FileStorage): The CV file to upload.
        token (str): The user's JWT token.
        app (Flask App): The Flask application object.
        cv_collection (MongoDB Collection): The collection to store CV documents.

    Returns:
        dict: A JSON response indicating the success or failure of the CV upload.
    """
    try:
        user_id = jwt.decode(token, app.secret_key, algorithms=['HS256']) 
        if 'cv' not in file:
            return make_return_message(
                message='File not found',
                status='error',
                code=500,
                data={}
            )

        cv_file = file['cv']
        if cv_file.filename == '':
            return make_return_message(
                message='No selected file',
                status='error',
                code=400,
                data={}
            )

        if cv_file:
            # Save the CV file to a designated folder
            cv_data = cv_file.read()
            # save the file info into a document
            cv_document = {
                'filename': cv_file.filename,
                'content_type': cv_file.content_type,
                'data': Binary(cv_data)
            }
        
            # get the oid for the cv document and insert into the account profile
            cv_id = cv_collection.insert_one(cv_document).inserted_id
            # # Associate the CV ObjectId with the user's profile
            user_collection.update_one(
                {'_id': ObjectId(user_id['uid'])},
                {'$set': {'cv_id': cv_id}}
            )
            return make_return_message(
                message='CV uploaded successfully',
                status='success',
                code=200,
                data={'user_id': user_id['uid'], 'cv_id': str(cv_id), 'cv_doc': str(cv_document)}
            )
        return make_return_message(
            message='Failed to upload',
            status='error',
            code=500,
            data={}
        )

    except Exception as e:
        make_return_message(
            message=str(e),
            status='error',
            code=500,
            data={}
        )

def upload_profile_photo(user_collection, file, token, app, image_collection):
    """
    Upload a profile photo to a user's profile.

    Args:
        user_collection (MongoDB Collection): The user collection in the database.
        file (FileStorage): The image file to upload as a profile photo.
        token (str): The user's JWT token.
        app (Flask App): The Flask application object.
        image_collection (MongoDB Collection): The collection to store image documents.

    Returns:
        dict: A JSON response indicating the success or failure of the profile photo upload.
    """
    try:
        user_id = jwt.decode(token, app.secret_key, algorithms=['HS256'])

        if 'img' not in file:
            return make_return_message(
                message='File not found',
                status='error',
                code=500,
                data={}
            )

        img_file = file['img']
        if img_file.filename == '':
            return make_return_message(
                message='No selected file',
                status='error',
                code=400,
                data={}
            )

        if img_file:
            img_data = img_file.read()       
            img_document = {
                'filename': img_file.filename,
                'content_type': img_file.content_type,
                'data': Binary(img_data)
            }
        
            img_id = image_collection.insert_one(img_document).inserted_id
            user_collection.update_one(
                {'_id': ObjectId(user_id['uid'])},
                {'$set': {'img_id': img_id}}
            )
            return make_return_message(
                message='Profile photo uploaded successfully',
                status='success',
                code=200,
                data={'user_id': user_id['uid'], 'img_id': str(img_id), 'image_doc': str(img_document)}
            )
        return make_return_message(
            message='Failed to upload',
            status='error',
            code=500,
            data={}
        )
    
    except Exception as e:
        return make_return_message(
            message=str(e),
            status='error',
            code=500,
            data={}
        )
    

def list_skill(user_collection, user_id):
    """
    List the skills associated with a user.

    Args:
        user_collection (MongoDB Collection): The user collection in the database.
        user_id (str): The ID of the user whose skills are to be listed.

    Returns:
        dict: A JSON response containing the list of skills associated with the user.
    """
    try:
        user = user_collection.find_one({'_id': ObjectId(user_id)})
        if user:
            skills = user.get('skills', [])
            return make_return_message(
                message='Skill list',
                status='success',
                code=200,
                data={'skill list': skills, 'user_id': user_id}
            )
        else:
            return make_return_message(
                message='User not found',
                status='error',
                code=403,
                data={}
            )
    except Exception as e:
        return make_return_message(
            message=str(e),
            status='error',
            code=500,
            data={}
        )
 
def add_skills(data, user_collection):  
    """
    Add skills to a user's profile.

    Args:
        data (dict): The data containing the user ID and skills to be added.
        user_collection (MongoDB Collection): The user collection in the database.

    Returns:
        dict: A JSON response indicating the success or failure of adding skills to the user's profile.
    """
    user_id = data.get('user_id')    
    skills = data.get('skills')    
    try:
        if not user_id or not skills:
            return make_return_message(
                message='Missing user id',
                status='error',
                code=400,
                data={}
            )
        
        user = user_collection.find_one({'_id': ObjectId(user_id)})  
        if user:
            # Check if skills key exist in a user and if not then creates an 
            # empty list for the value skill and then adds to it
            if 'skills' not in user:
                user['skills'] = []

            user['skills'].append(skills)
    
            user_collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'skills': user['skills']}})
            return make_return_message(
                message='Skill added successfully',
                status='success',
                code=200,
                data={'user_id': user_id}
            )
        else:
            return make_return_message(
                message='User not found',
                status='error',
                code=403,
                data={}
            )
    except Exception as e:
        return make_return_message(
            message=str(e),
            status='error',
            code=500,
            data={}
        )

def add_company_bio_in_profile(data, user_collection):
    """
    Add a company bio to a user's profile.

    Args:
        data (dict): The data containing the user ID and company bio to be added.
        user_collection (MongoDB Collection): The user collection in the database.

    Returns:
        dict: A JSON response indicating the success or failure of adding the company bio to the user's profile.
    """
    user_id = data.get('user_id')    
    company_bio = data.get('company_bio')    
    try:
        if not company_bio:
            return make_return_message(
                message='Company bio missing',
                status='error',
                code=400,
                data={}
            )
   
        user = user_collection.find_one({'_id': ObjectId(user_id)})
        if user:
            if 'company_bio' not in user:
                user['company_bio'] = ''

            user['company_bio'] = (company_bio)
            user_collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'company_bio': user['company_bio']}})

            return make_return_message(
                message='Bio added successfully',
                status='success',
                code=200,
                data={'user_id': user_id}
            )
        else:
            return make_return_message(
                message='User not found',
                status='error',
                code=403,
                data={}
            )
    except Exception as e:
        return make_return_message(
            message=str(e),
            status='error',
            code=500,
            data={}
        )
        

def user_boost_profile(token, user_collection, app):
    """
    Boost a user's profile.

    Args:
        token (str): The user's JWT token.
        user_collection (MongoDB Collection): The user collection in the database.
        app (Flask App): The Flask application object.

    Returns:
        dict: A JSON response indicating the success or failure of boosting the user's profile.
    """
    try:
        user_id = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        user = user_collection.find_one({'_id': ObjectId(user_id['uid'])})
                
        # User only has one chance to boost profile
        if user.get('boosted'):
            return make_return_message(
                status='error',
                message='User already boosted one profile.',
                code=400,
                data={},
            )
        
        if user.get('role') == '20':
            return make_return_message(
                status='error',
                message='Only Professional user can boost profile ',
                code=400,
                data={},
            )            

        if 'boosted'not in user:
            user['boosted'] = False
        
        if user['boosted'] == True:
            return make_return_message(
                status='error',
                message='Profile already boosted',
                code=400,
                data={},
            )
        # update status
        user['boosted'] = True
        user_collection.update_one({'_id': ObjectId(user_id['uid'])}, {'$set': user})

        return make_return_message(
            status='success',
            message='User Profile Boosted',
            code=200,
            data={'user_boosted': str(user['boosted'])},
        )
        
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )
