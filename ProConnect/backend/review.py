import jwt
from bson import ObjectId
from helpers import make_return_message

def user_create_review(token, data, review_collection, app, user_collection, project_collection):
    """
    Create a review for a user based on a completed project.

    Args:
        token (str): The user's authentication token.
        data (dict): The data containing the review details.
        review_collection (MongoDB Collection): The review collection in the database.
        app (Flask app): The Flask application object.
        user_collection (MongoDB Collection): The user collection in the database.
        project_collection (MongoDB Collection): The project collection in the database.

    Returns:
        dict: A JSON response indicating the success or failure of the review creation.
    """
    try:
        star_rating = data.get('star_rating')
        review_message = data.get('review_message')

        receiver_id = data.get('receiver_user_id')
        receiver = user_collection.find_one({'_id': ObjectId(receiver_id)})

        project_id = data.get('project_id')
        project = project_collection.find_one({'_id': ObjectId(project_id)})
        
        rater_id = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        rater = user_collection.find_one({'_id': ObjectId(rater_id['uid'])})
        rater_name = rater['entityname']
        rater_role = rater['role']
        
        if None in (star_rating, rater_name, rater_role):
            return make_return_message(
                status='error',
                message='Missing data: All fields are required',
                code=400,
                data={},
            ) 

        # As a professional user, I want to be able to leave a review for coworker/company after project is completed
        # As a company user, I want to be able leave review/feedback to professionals who contributed to the project after project completion
        if (project_id not in rater.get('projects', []) or project_id not in receiver.get('projects', [])):
            return make_return_message(
                status='error',
                message='Both rater and receiver should have worked on the same project to leave a review',
                code=400,
                data={},
            )
        # Only can rate for a completed project 
        if project['status'] != 'completed':
            return make_return_message(
                status='error',
                message='You can not rate an incomplete project',
                code=400,
                data={},
            )
            
        # Check if the receiver has already received a review from the rater in the same project
        for review_id in receiver.get('reviews', []):
            review = review_collection.find_one({'_id': ObjectId(review_id)})
            if review.get('rater_id') == rater_id['uid'] and str(review['project_id']) == project_id:
                return make_return_message(
                    status='error',
                    message='You have already left a review for the same person in the same project',
                    code=400,
                    data={},
                )

        review_doc = {
            'project_id': project_id,
            'star_rating': star_rating,
            'rater_id': rater_id['uid'],
            'rater_name': rater_name,
            'rater_role': rater_role,
            'review_message': review_message     
        }
        review_id = review_collection.insert_one(review_doc).inserted_id
        if 'reviews' not in receiver:
            receiver['reviews'] = []
             
        receiver['reviews'].append(str(review_id))
        user_collection.update_one({'_id': ObjectId(receiver_id)}, {'$set': {'reviews': receiver['reviews']}})

        total_ratings = []  
        for review_id in receiver.get('reviews', []):
            review = review_collection.find_one({'_id': ObjectId(review_id)})
            review_rating = int(review['star_rating'])
            total_ratings.append(review_rating)  # Append to the list

        average_rating = sum(total_ratings) / len(total_ratings) 
        user_collection.update_one({'_id': ObjectId(receiver_id)}, {'$set': {'rating': str(average_rating)}})

        return make_return_message(
            status='success',
            message='Review Created',
            code=200,
            data={'receiver_id': str(receiver_id), 'review_id': str(review_id), 'review_doc': review_doc, 'receiver_token':token, 'receiver_rating':receiver['rating']},
        )

    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )

def list_user_reviews(token, user_collection, app, review_collection):
    """
    List reviews created by a user.

    Args:
        token (str): The user's authentication token.
        user_collection (MongoDB Collection): The user collection in the database.
        app (Flask app): The Flask application object.
        review_collection (MongoDB Collection): The review collection in the database.

    Returns:
        dict: A JSON response containing the list of reviews created by the user and their average rating.
    """  
    try: 
        user_id = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        user = user_collection.find_one({'_id': ObjectId(user_id['uid'])})
        review_ids = user.get('reviews', [])
        # Create a list to store project information
        review_list = []
        for id in review_ids:
            review = review_collection.find_one({'_id': ObjectId(id)})         
            review_id = str(review.get('_id'))
            review_star = review.get('star_rating')
            rater_name = review.get('rater_name')
            rater_role = review.get('rater_role')
            review_message = review.get('review_message')
       
            review_info = {
                'review_id': review_id,
                'review_star': review_star,
                'rater_name': rater_name,
                'rater_role': rater_role,
                'review_message': review_message
                
            }           
            review_list.append(review_info)
            
        return make_return_message(
            status='success',
            message='User list of reviews',
            code=200,
            data={'user_id': str(user_id['uid']), 'review_list': review_list, 'avg_rating':str(user['rating'])},
        )
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )
        
def v2_list_user_reviews(user_id, user_collection, review_collection):
    """
    List reviews created by a user (alternative version).

    Args:
        user_id (str): The ID of the user whose reviews are to be listed.
        user_collection (MongoDB Collection): The user collection in the database.
        review_collection (MongoDB Collection): The review collection in the database.

    Returns:
        dict: A JSON response containing the list of reviews created by the user and their average rating.
    """
    try:       
        user = user_collection.find_one({'_id': ObjectId(user_id)})
        review_ids = user.get('reviews', [])
        # Create a list to store project information
        review_list = []
        for id in review_ids:
            review = review_collection.find_one({'_id': ObjectId(id)})
            
            review_id = str(review.get('_id'))
            review_star = review.get('star_rating')
            rater_name = review.get('rater_name')
            rater_role = review.get('rater_role')
            review_message = review.get('review_message') 
            
            review_info = {
                'review_id': review_id,
                'review_star': review_star,
                'rater_name': rater_name,
                'rater_role': rater_role,
                'review_message': review_message
                
            }           
            review_list.append(review_info)
            
        return make_return_message(
            status='success',
            message='User list of reviews',
            code=200,
            data={'user_id': str(user_id), 'review_list': review_list, 'avg_rating':str(user['rating'])},
        )
         
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )

def user_view_review_detail(review_collection, review_id):
    """
    View details of a specific review.

    Args:
        review_collection (MongoDB Collection): The review collection in the database.
        review_id (str): The ID of the review to view.
        user_id (str): The ID of the user viewing the review.
        user_collection (MongoDB Collection): The user collection in the database.

    Returns:
        dict: A JSON response containing the details of the specified review.
    """
    try:
        review = review_collection.find_one({'_id': ObjectId(review_id)})        
        review_details = {
            'review_id': review_id,
            'review_star': review['star_rating'],
            'rater_name': review['rater_name'],
            'rater_role': review['rater_role'],
            'review_message': review['review_message']
       
        }
        return make_return_message(
            status='success',
            message='Review detail',
            code=200,
            data=review_details,
        )

    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )