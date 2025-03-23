import jwt
from bson import ObjectId, json_util
from helpers import make_return_message

def admin_view_all_users(bearer, user_collection, app):
    """
    View all users with admin privileges.

    Args:
    - bearer (str): Bearer token for authentication.
    - user_collection: MongoDB collection for users.
    - app: Flask app.

    Returns:
    - Tuple: A JSON response and HTTP status code.
    """
    token = bearer.split()[1]    
    try:
        uid = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        requester = user_collection.find_one({'_id': ObjectId(uid['uid'])})
        if requester['role'] == '10':
            users = list(user_collection.aggregate([
                {
                    "$match": {
                        'role': {'$ne': '10'}
                    }
                },
                {
                    "$project": {
                        "password": 0
                    }
                }
            ]))
        return json_util.dumps(users), 200
    except Exception as e:
        return make_return_message(status='error', message=str(e), data={}, code=500)


def admin_delete_account(token, delete_id, user_collection, app):
    """
    Delete a user account with admin privileges.

    Args:
    - token (str): Bearer token for authentication.
    - delete_id (str): ID of the user to be deleted.
    - user_collection: MongoDB collection for users.
    - app: Flask app.

    Returns:
    - Tuple: A JSON response and HTTP status code.
    """
    try:
        requesterID = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        requester = user_collection.find_one({'_id': ObjectId(requesterID['uid'])})
        if requester['role'] == '10' or requesterID['uid'] == delete_id:
            delete_user = user_collection.find_one({'_id': ObjectId(delete_id)})

            # Delete the user document from the MongoDB users user_collection
            user_collection.delete_one({'_id': ObjectId(delete_id)})

            return make_return_message(status='success', message='User deleted successfully', data={'token': token, 'user_id': delete_id, 'delete_user':delete_user}, code=200)
        else:
            return make_return_message(status='error', message='Unauthorized', data={}, code=403)
    except Exception as e:
        return make_return_message(status='error', message=str(e), data={}, code=500)
    

def admin_view_project_list(token, project_collection, user_collection, app):
    """
    View the list of projects with admin privileges.

    Args:
    - token (str): Bearer token for authentication.
    - project_collection: MongoDB collection for projects.
    - user_collection: MongoDB collection for users.
    - app: Flask app.

    Returns:
    - Tuple: A JSON response and HTTP status code.
    """
    try:
        uid = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        requester = user_collection.find_one({'_id': ObjectId(uid['uid'])})
        if requester['role'] == '10':
            project_list = list(project_collection.find({}))
            return make_return_message(status='success', message='Project list', data=project_list, code=200)
        else:
            return make_return_message(status='error', message='Unauthorized', data={}, code=403)
    except Exception as e:
        return make_return_message(status='error', message=str(e), data={}, code=500)
    
    
def admin_view_statistics(token, user_collection, project_collection, review_collection, app):
    """
    View statistics with admin privileges.

    Args:
    - token (str): Bearer token for authentication.
    - user_collection: MongoDB collection for users.
    - project_collection: MongoDB collection for projects.
    - review_collection: MongoDB collection for reviews.
    - app: Flask app.

    Returns:
    - Tuple: A JSON response and HTTP status code.
    """
    try:
        uid = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        requester = user_collection.find_one({'_id': ObjectId(uid['uid'])})
        if requester['role'] == '10':            
            user_stats = {
                'total_users': get_total_user_stats(user_collection),
                'users_creation_date': get_total_user_stats_monthly(user_collection)
            }
            
            project_stats = {
                'total_projects': get_total_project_stats(project_collection),
                'projects_creation_date': get_total_project_stats_monthly(project_collection)
            }
            
            review_stats = {
                'total_reviews': get_total_review_stats(review_collection),
                'reviews_creation_date': get_total_review_stats_monthly(review_collection)
            }
            
            return make_return_message(status='success', message='Statistics', data={'user': user_stats, 'project': project_stats, 'review': review_stats}, code=200)
        else:
            return make_return_message(status='error', message='Unauthorized', data={}, code=403)
    except Exception as e:
        return make_return_message(status='error', message=str(e), data={}, code=500)
    

def get_total_user_stats(user_collection):
    """
    Get total user statistics excluding admin users.

    Args:
    - user_collection: MongoDB collection for users.

    Returns:
    - dict: A dictionary containing user statistics.
    """
    total_users = list(user_collection.aggregate([    
        {
            '$match': {
                'role': {'$ne': '10'}  # Exclude documents where role is '10'
            }
        },
        {
            '$group': {
                '_id': {
                    'role': '$role'
                },
                'count': {'$sum': 1},
            }
        },
        {
            '$sort': {'_id': 1}
        }
    ]))
    
    counts = {user['_id']['role']: user['count'] for user in total_users}
    return counts

def get_total_user_stats_monthly(user_collection):
    """
    Get monthly user statistics excluding admin users.

    Args:
    - user_collection: MongoDB collection for users.

    Returns:
    - dict: A dictionary containing monthly user statistics.
    """
    users_creation_date = list(user_collection.aggregate([
        {
            '$addFields': {
                'yearMonth': {
                    '$dateToString': {'format': '%Y-%m', 'date': '$_id'}
                }
            }
        },
        {
            '$match': {
                'role': {'$ne': '10'}  # Exclude documents where role is '10'
            }
        },
        {
            '$group': {
                '_id': {
                    'role': '$role',
                    'yearMonth': '$yearMonth'
                },
                'count': {'$sum': 1},
            }
        },
        {
            '$sort': {'_id': 1}
        }
    ]))

    # Create a dictionary to store the data
    data = {}
    # Loop through the results and add them to the dictionary
    for result in users_creation_date:
        role = result['_id']['role']
        year_month = result['_id']['yearMonth']
        count = result['count']

        if role not in data:
            data[role] = {'xAxis': [], 'series': []}

        data[role]['xAxis'].append(year_month)
        data[role]['series'].append(count)

    return data
    
def get_total_project_stats(project_collection):
    """
    Get total project statistics.

    Args:
    - project_collection: MongoDB collection for projects.

    Returns:
    - dict: A dictionary containing project statistics.
    """
    total_projects = list(project_collection.aggregate([
        {
            '$group': {
                '_id': {
                    'status': '$status'
                },
                'count': {'$sum': 1},
            }
        },
        {
            '$sort': {'_id': 1}
        }
    ]))
    
    counts = {project['_id']['status']: project['count'] for project in total_projects}
    return counts

def get_total_project_stats_monthly(project_collection):
    """
    Get monthly project statistics.

    Args:
    - project_collection: MongoDB collection for projects.

    Returns:
    - dict: A dictionary containing monthly project statistics.
    """
    projects_creation_date = list(project_collection.aggregate([
        {
            '$addFields': {
                'yearMonth': {
                    '$dateToString': {'format': '%Y-%m', 'date': '$_id'}
                }
            }
        },
        {
            '$group': {
                '_id': {
                    'status': '$status',
                    'yearMonth': '$yearMonth'
                },
                'count': {'$sum': 1},
            }
        },
        {
            '$sort': {'_id': 1}
        }
    ]))

    # Create a dictionary to store the data
    data = {}

    # Loop through the results and add them to the dictionary
    for result in projects_creation_date:
        status = result['_id']['status']
        year_month = result['_id']['yearMonth']
        count = result['count']

        if status not in data:
            data[status] = {'xAxis': [], 'series': []}

        data[status]['xAxis'].append(year_month)
        data[status]['series'].append(count)

    return data

def get_total_review_stats(review_collection):
    """
    Get total review statistics.

    Args:
    - review_collection: MongoDB collection for reviews.

    Returns:
    - dict: A dictionary containing review statistics.
    """
    total_reviews = list(review_collection.aggregate([
        {
            '$group': {
                '_id': {
                    'rating': '$star_rating'
                },
                'count': {'$sum': 1},
            }
        },
        {
            '$sort': {'_id': 1}
        }
    ]))
    
    counts = {review['_id']['rating']: review['count'] for review in total_reviews}
    return counts

def get_total_review_stats_monthly(review_collection):
    """
    Get monthly review statistics.

    Args:
    - review_collection: MongoDB collection for reviews.

    Returns:
    - dict: A dictionary containing monthly review statistics.
    """
    reviews_creation_date = list(review_collection.aggregate([
        {
            '$addFields': {
                'yearMonth': {
                    '$dateToString': {'format': '%Y-%m', 'date': '$_id'}
                }
            }
        },
        {
            '$group': {
                '_id': {
                    'rating': '$star_rating',
                    'yearMonth': '$yearMonth'
                },
                'count': {'$sum': 1},
            }
        },
        {
            '$sort': {'_id': 1}
        }
    ]))

    # Create a dictionary to store the data
    data = {}

    # Loop through the results and add them to the dictionary
    for result in reviews_creation_date:
        rating = result['_id']['rating']
        year_month = result['_id']['yearMonth']
        count = result['count']

        if rating not in data:
            data[rating] = {'xAxis': [], 'series': []}

        data[rating]['xAxis'].append(year_month)
        data[rating]['series'].append(count)

    return data

def get_user_detail(user_id, user_collection, cv_collection, image_collection):
    """
    Get user details by user ID.

    Args:
    - user_id (str): ID of the user to retrieve details for.
    - user_collection: MongoDB collection for users.
    - cv_collection: MongoDB collection for CVs.
    - image_collection: MongoDB collection for images.

    Returns:
    - Tuple: A JSON response and HTTP status code.
    """
    try:
        user = user_collection.find_one({'_id': ObjectId(user_id)})

        user_info = {
            'email': user['email'],
            'entityname': user['entityname'],
            'phone': user['phone'],
            'location': user['location'],
            'abn': user['abn'],
            'role': user['role'],
            'cv_id': str(user.get('cv_id', None)),
            'img_id': str(user.get('img_id', None)),
            'skills': user.get('skills', None),
            'company_bio': user.get('company_bio', None)
        } 

        cv_id = user.get('cv_id', None)
        img_id = user.get('img_id', None)

        img_data = image_collection.find_one({'_id': ObjectId(img_id)})
        cv_data = cv_collection.find_one({'_id': ObjectId(cv_id)})
        
        return make_return_message(status='success', message='User profile info', data={'user_info': (user_info), 'img_data': (img_data), 'cv_data': (cv_data)}, code=200)

    except Exception as e:
        return make_return_message(status='error', message=str(e), data={}, code=500)
