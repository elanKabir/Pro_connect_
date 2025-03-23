import jwt
from datetime import datetime
from bson import ObjectId
from helpers import make_return_message
from notification import *

def company_create_project(data, token, user_collection, project_collection, app):
    """
    Create a project for a company user.

    Args:
    - data (dict): Project data including title, description, category, budget, deadline, professional_num, location, and project_type.
    - token (str): User authentication token.
    - user_collection (pymongo.collection.Collection): MongoDB collection for user data.
    - project_collection (pymongo.collection.Collection): MongoDB collection for project data.
    - app (Flask): Flask application object.

    Returns:
    - JSON response and HTTP status code.
    """
    try:
        project_title = data.get('title')
        description = data.get('description')
        category = data.get('category')
        budget = data.get('budget')
        deadline = data.get('deadline')
        professional_num = data.get('professional_num')
        location = data.get('location')
        project_type = data.get('project_type')
        
        if None in (project_title, description, category, budget, deadline, professional_num):
            return make_return_message(
                status='error',
                message='Missing data: All fields are required',
                code=400,
                data={},
            )

        user_id = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        user = user_collection.find_one({'_id': ObjectId(user_id['uid'])}) 
             
        if user['role'] == '20':
            current_date = datetime.now().date()
            current_date_str = current_date.strftime('%Y-%m-%d') 
            project_doc = {
                'title': project_title,
                'description': description,
                'category': category,
                'budget': budget,
                'deadline': deadline,
                'professional_num': professional_num,
                'status':'open',
                'location': location,
                'date_created': current_date_str,
                'project_owner': user_id['uid'],
                'project_owner_name': user['entityname'],  
                'project_type': project_type
            }

            project_id = project_collection.insert_one(project_doc).inserted_id

            # Find the user's document and append the new project to their 'projects' array
            if 'projects' not in user:
                user['projects'] = []

            # Converts project ID into string and append just the projectID into the array.
            user['projects'].append(str(project_id))

            # Update the user's document to include the new project
            user_collection.update_one({'_id': ObjectId(user_id['uid'])}, {'$set': {'projects': user['projects']}})

            return make_return_message(
                status='success',
                message='Project Created',
                code=200,
                data={'user_id': str(user_id['uid']), 'project_id': str(project_id), 'project_doc': str(project_doc), 'token':token},
            )
        return make_return_message(
            status='error',
            message='Company User Not Found',
            code=400,
            data={},
        )
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )

def company_edit_project_detail(data, project_collection, certificate_collection, token, app):
    """
    Edit project details for a company user.

    Args:
    - data (dict): New project details to update.
    - project_collection (pymongo.collection.Collection): MongoDB collection for project data.
    - certificate_collection (pymongo.collection.Collection): MongoDB collection for certificate data.
    - token (str): User authentication token.
    - app (Flask): Flask application object.

    Returns:
    - JSON response and HTTP status code.
    """
    new_title = data.get('title')
    new_description = data.get('description')
    new_category = data.get('category')
    new_budget = data.get('budget')
    new_deadline = data.get('deadline')
    new_professional_num = data.get('professional_num')
    new_location = data.get('location')
    new_project_type = data.get('project_type')
    new_status = data.get('status')
    
    project_id = data.get('project_id')
    user_id = jwt.decode(token, app.secret_key, algorithms=['HS256'])
   
    try:
        project = project_collection.find_one({'_id': ObjectId(project_id)})
        if not project:
            return make_return_message(
                status='error',
                message='Project not found',
                code=400,
                data={},
            )
        
        if project['project_owner'] != user_id['uid']:
            return make_return_message(
                status='error',
                message='Unauthorized',
                code=403,
                data={},
            )

        # Update the project's details
        if new_title is not None:
            project['title'] = new_title
        if new_description is not None:
            project['description'] = new_description
        if new_category is not None:
            project['category'] = new_category
        if new_budget is not None:
            project['budget'] = new_budget
        if new_deadline is not None:
            project['deadline'] = new_deadline
        if new_professional_num is not None:
            project['professional_num'] = new_professional_num
        if new_status is not None:
            project['status'] = new_status
        if new_location is not None:
            project['location'] = new_location
        if new_project_type is not None:
            project['project_type'] = new_project_type

        # Update the projects array in the user's document
        project_collection.update_one({'_id': ObjectId(project_id)}, {'$set': project})     
        if project['status'] == 'completed':
            company_issue_certificate(certificate_collection, project['approved_users'], project_id, project['title'], project['project_owner_name'], app)

        return make_return_message(
            status='success',
            message='Project detail updated successfully',
            code=200,
            data={'project_data': (project)},
        )
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )
        
def company_issue_certificate(certificate_collection, professionals, project_id, project_title, project_owner, app):
    """
    Issue certificates to professionals who have completed a project.

    Args:
    - certificate_collection (pymongo.collection.Collection): MongoDB collection for certificate data.
    - professionals (list): List of professionals who completed the project.
    - project_id (str): ID of the project for which certificates are issued.
    - project_title (str): Title of the project.
    - project_owner (str): Owner of the project.
    - app (Flask): Flask application object.

    Returns:
    - JSON response and HTTP status code.
    """
    try:
        for professional in professionals:
            certificate = {
                'user_id': professional.get('user_id'),
                'name': professional.get('name'),
                'project_id': project_id,
                'project_title': project_title,
                'project_owner': project_owner,
                'date_issued': datetime.now().date().strftime('%Y-%m-%d') 
            }
            certificate_collection.insert_one(certificate)
        return make_return_message(
            status='success',
            message='Certificate issued successfully',
            code=200,
            data={},
        )
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={}
        )

def company_delete_project(token, project_id, user_collection, project_collection, app):
    """
    Delete a project created by a company user.

    Args:
    - token (str): User authentication token.
    - project_id (str): ID of the project to delete.
    - user_collection (pymongo.collection.Collection): MongoDB collection for user data.
    - project_collection (pymongo.collection.Collection): MongoDB collection for project data.
    - app (Flask): Flask application object.

    Returns:
    - JSON response and HTTP status code.
    """
    try:
        requesterID = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        project = project_collection.find_one({'_id': ObjectId(project_id)})

        if not project:
            return make_return_message(
                status='error',
                message='Project not found',
                code=400,
                data={},
            )
        
        requester = user_collection.find_one({'_id': ObjectId(requesterID['uid'])})

        if project['project_owner'] != requesterID['uid'] and requester['role'] != '10':
            return make_return_message(
                status='error',
                message='Unauthorized',
                code=403,
                data={},
            )
        
        user = user_collection.find_one({'_id': ObjectId(project['project_owner'])})
        project_collection.delete_one({'_id': ObjectId(project_id)})

        projects = user.get('projects', [])
        projects.remove(project_id)

        user_collection.update_one({'_id': ObjectId(project['project_owner'])}, {'$set': {'projects': projects}})

        return make_return_message(
            status='success',
            message='Project deleted successfully',
            code=200,
            data={'project_id': str(project_id)},
        )

    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )

def company_project_applied_user_list(token, project_id, user_collection, project_collection, app):
    """
    Get a list of users who have applied to join a project.

    Args:
    - token (str): User authentication token.
    - project_id (str): ID of the project for which applied users are retrieved.
    - user_collection (pymongo.collection.Collection): MongoDB collection for user data.
    - project_collection (pymongo.collection.Collection): MongoDB collection for project data.
    - app (Flask): Flask application object.

    Returns:
    - JSON response and HTTP status code.
    """
    try:
        user_id = jwt.decode(token, app.secret_key, algorithms=['HS256'])['uid']
        project = project_collection.find_one({'_id': ObjectId(project_id)})
        status = project['status']
        post_date = project['date_created']
        
        if not project:
            return make_return_message(
                status='error',
                message='Project not found',
                code=400,
                data={},
            )
        
        if project['project_owner'] != user_id and user_collection.find_one({'_id': ObjectId(user_id)})['role'] != '10':
            return make_return_message(
                status='error',
                message='Unauthorized',
                code=403,
                data={},
            )
        
        applied_users = project.get('applied_users', [])
        return make_return_message(
            status='success',
            message='Applied users retrieved successfully',
            code=200,
            data=applied_users,
        )
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )
 
def company_approve_user(user_collection, project_collection, project_id, approve_uid, token, app, notification_collection):
    """
    Approve a user to join a project and issue a notification.

    Args:
    - user_collection (pymongo.collection.Collection): MongoDB collection for user data.
    - project_collection (pymongo.collection.Collection): MongoDB collection for project data.
    - project_id (str): ID of the project to approve the user for.
    - approve_uid (str): ID of the user to be approved.
    - token (str): User authentication token.
    - app (Flask): Flask application object.
    - notification_collection (pymongo.collection.Collection): MongoDB collection for notification data.

    Returns:
    - JSON response and HTTP status code.
    """
    try:
        company_user_id = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        project = project_collection.find_one({'_id': ObjectId(project_id)})

        if project['project_owner'] != company_user_id['uid'] and user_collection.find_one({'_id': ObjectId(company_user_id['uid'])})['role'] != '10':
            return make_return_message(
                status='error',
                message='Unauthorized',
                code=403,
                data={},
            )
          
        if 'applied_users' not in project:
            return make_return_message(
                status='error',
                message='No applied user for this project',
                code=400,
                data={},
            )

        for user in project['applied_users']:
            if user.get('user_id') == approve_uid:
                project['applied_users'].remove(user)

                if 'approved_users' not in project:
                    project['approved_users'] = []

                if 'date_joined' not in user:
                    user['date_joined'] = []
                user['date_joined'] = datetime.now().date().strftime('%Y-%m-%d') 
                
                project['approved_users'].append(user) 
                project_collection.update_one({'_id': ObjectId(project_id)}, {'$set': project})

                # Calculate how many more users are needed
                professional_num = int(project.get('professional_num', 0))
                approved_users_count = len(project.get('approved_users', []))
                manpower_required = professional_num - approved_users_count
                if manpower_required < 0:
                    return make_return_message(
                        status='error',
                        message='Manpower requirement for this project is already fulfilled',
                        code=400,
                        data={},
                    )
                    
                # add project id to the approve_user profile
                approve_user = user_collection.find_one({'_id': ObjectId(approve_uid)})
                
                if 'projects' not in approve_user:
                    approve_user['projects'] = []

                approve_user['projects'].append(str(project_id))
                user_collection.update_one({'_id': ObjectId(approve_uid)}, {'$set': approve_user})
                
                project_name = project['title']
                notification_msg = f'Congrats, your request to join project {project_name} has been accepted!'
                notification_id = send_notification(approve_uid, notification_msg, notification_collection, approve_user, user_collection)
                
                return make_return_message(
                    status='success',
                    message='User approved for the project successfully',
                    code=200,
                    data={'project_id': str(project_id),
                            'applied_user_list': str(project['applied_users']),
                            'approved_user_list': str(project['approved_users']),
                            'manpower_required': str(manpower_required),
                            'notification_id': notification_id
                        },
                )

        return make_return_message(
            status='error',
            message='User not found in the applied users list',
            code=400,
            data={},
        )
        
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )

def company_reject_user(project_collection, project_id, reject_id, token, app, notification_collection, user_collection):
    """
    Reject a user's request to join a project and issue a notification.

    Args:
    - project_collection (pymongo.collection.Collection): MongoDB collection for project data.
    - project_id (str): ID of the project to reject the user from.
    - reject_id (str): ID of the user to be rejected.
    - token (str): User authentication token.
    - app (Flask): Flask application object.
    - notification_collection (pymongo.collection.Collection): MongoDB collection for notification data.
    - user_collection (pymongo.collection.Collection): MongoDB collection for user data.

    Returns:
    - JSON response and HTTP status code.
    """
    try:
        company_user_id = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        project = project_collection.find_one({'_id': ObjectId(project_id)})

        if project['project_owner'] != company_user_id['uid'] and user_collection.find_one({'_id': ObjectId(company_user_id['uid'])})['role'] != '10':
            return make_return_message(
                status='error',
                message='Unauthorized',
                code=403,
                data={},
            )

        if 'applied_users' not in project:
            return make_return_message(
                status='error',
                message='No applied user for this project',
                code=400,
                data={},
            )

        for user in project['applied_users']:
            if user.get('user_id') == reject_id:
                project['applied_users'].remove(user) 

                if 'rejected_users' not in project:
                    project['rejected_users'] = []

                project['rejected_users'].append(user) 
                project_collection.update_one({'_id': ObjectId(project_id)}, {'$set': project})

                project_name = project['title']
                notification_msg = f'unfortunately, your request to join project {project_name} has been rejected'
                notification_id = send_notification(reject_id, notification_msg, notification_collection, user, user_collection)
               
                return make_return_message(
                    status='success',
                    message='User reject for the project successfully',
                    code=200,
                    data={'project_id': str(project_id),
                            'applied_user_list': str(project['applied_users']),
                            'rejected_user_list': str(project['rejected_users']),
                            'notification_id': notification_id
                        },
                )
        return make_return_message(
            status='error',
            message='User not found in the applied users list',
            code=400,
            data={},
        )
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )

def company_edit_approved_user(token, app, project_collection, project_id, user_collection, user_id):
    """
    Move a user from the approved list to the rejected list for a project.

    Args:
    - token (str): User authentication token.
    - app (Flask): Flask application object.
    - project_collection (pymongo.collection.Collection): MongoDB collection for project data.
    - project_id (str): ID of the project.
    - user_collection (pymongo.collection.Collection): MongoDB collection for user data.
    - user_id (str): ID of the user to be moved.

    Returns:
    - JSON response and HTTP status code.
    """
    try:
        requesterID = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        requester = user_collection.find_one({'_id': ObjectId(requesterID['uid'])})
        project = project_collection.find_one({'_id': ObjectId(project_id)})

        user = user_collection.find_one({'_id': ObjectId(user_id)})
        if not project:
            return make_return_message(
                status='error',
                message='Project not found',
                code=400,
                data={},
            )

        if project['project_owner'] != requesterID['uid']:
            return make_return_message(
                status='error',
                message='Unauthorized',
                code=403,
                data={},
            )
        for approve_user in project['approved_users']:
            if approve_user.get('user_id') == user_id:
                if 'rejected_users' not in project:
                    project['rejected_users'] = []
                    
                project['approved_users'].remove(approve_user)
                project['rejected_users'].append(approve_user)
                project_collection.update_one({'_id': ObjectId(project_id)}, {'$set': project})
                return make_return_message(
                    status='success',
                    message='User removed from approved list and added to rejected list',
                    code=200,
                    data={'project_id': str(project_id), 'approve_user': (project['approved_users']), 'reject_user':project['rejected_users']},
                )
        
        return make_return_message(
            status='error',
            message='User not found in approved list',
            code=404,
            data={},
        )

    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )

def user_view_project_detail(project_collection, project_id, app, token, user_collection):
    """
    Get detailed information about a project.

    Args:
    - project_collection (pymongo.collection.Collection): MongoDB collection for project data.
    - project_id (str): ID of the project to view.
    - app (Flask): Flask application object.
    - token (str): User authentication token.
    - user_collection (pymongo.collection.Collection): MongoDB collection for user data.

    Returns:
    - JSON response and HTTP status code.
    """
    try:
        project = project_collection.find_one({'_id': ObjectId(project_id)})
        
        user_id = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        user = user_collection.find_one({'_id': ObjectId(user_id['uid'])})
        professional_num = int(project.get('professional_num', 0))
        approved_users_count = len(project.get('approved_users', []))
        manpower_required = professional_num - approved_users_count

        budget = project['budget']
        professional_num = project['professional_num']
        if user['role'] == '30': 
            budget = int(budget) / int(professional_num)
            
        project_details = {
            'title': project['title'],
            'description': project['description'],
            'category': project['category'],
            'budget': budget,
            'deadline': project['deadline'],
            'professional_num': project['professional_num'],
            'status': project['status'],
            'date_created': project['date_created'],
            'project_type': project['project_type'],
            'project_location': project['location'],
            'manpower_required': manpower_required,
            'project_owner': project['project_owner'],
            'project_owner_name': project['project_owner_name'],  

        }
        return make_return_message(
            status='success',
            message='Projects detail',
            code=200,
            data=project_details,
        )

    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )

def user_view_my_project_list(bearer, user_collection, project_collection, app, query=None, project_type=None, project_category=None, project_location=None, project_status=None, sortby=-1,):
    """
    Get a list of projects that the user is either an owner or approved for.

    Args:
    - bearer (str): Bearer token containing user authentication.
    - user_collection (pymongo.collection.Collection): MongoDB collection for user data.
    - project_collection (pymongo.collection.Collection): MongoDB collection for project data.
    - app (Flask): Flask application object.
    - query (str): Optional search query.
    - project_type (list of str): Optional project types to filter by.
    - project_category (list of str): Optional project categories to filter by.
    - project_location (list of str): Optional project locations to filter by.
    - project_status (list of str): Optional project statuses to filter by.
    - sortby (int): Sort direction (-1 for newest, 1 for oldest).

    Returns:
    - JSON response and HTTP status code.
    """
    try:
        token = bearer.split()[1]
        uid = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        user = user_collection.find_one({'_id': ObjectId(uid['uid'])})

        if query:
            projects = list(project_collection.aggregate([
                {
                    "$search": {
                        "index": "default",
                        "text": {
                            "query": query,
                            "path": {
                                "wildcard": "*"
                            }
                        }
                    }
                },
                {
                    "$match": {
                        "$or": [
                            {"project_owner": uid['uid']},
                            {"approved_users.user_id": uid['uid']}
                        ]
                    }
                }
            ]))
        else:
            projects = list(project_collection.aggregate([
                {
                    "$match": {
                        "$or": [
                            {"project_owner": uid['uid']},
                            {"approved_users.user_id": uid['uid']}
                        ]
                    }
                }
            ]))
            


        if project_type:
            projects = [p for p in projects if p.get('project_type') in project_type]
        if project_category:
            projects = [p for p in projects if p.get('category') in project_category]
        if project_location:
            projects = [p for p in projects if p.get('location') in project_location]
        if project_status:
            projects = [p for p in projects if p.get('status').lower() in project_status]      
        
        if sortby == "Newest":
            sortby = -1
        elif sortby == "Oldest":
            sortby = 1
        else:
            sortby = -1 # default to Oldest

        projects = sorted(projects, key=lambda p: p.get('date_created'), reverse=sortby == -1)
        return make_return_message(
            status='success',
            message='Projects retrieved successfully',
            code=200,
            data=projects,
        )
    except Exception as e:
        print(str(e))
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )

def user_view_profile_project_list(user_id, user_collection, project_collection, app, query=None, project_type=None, project_category=None, project_location=None, project_status=None, sortby=-1,):
    """
    View a user's project list based on various filters.

    Args:
        user_id (str): The ID of the user whose projects are to be viewed.
        user_collection (MongoDB Collection): The user collection in the database.
        project_collection (MongoDB Collection): The project collection in the database.
        app (Flask app): The Flask application object.
        query (str, optional): A search query to filter projects. Defaults to None.
        project_type (list of str, optional): List of project types to filter by. Defaults to None.
        project_category (list of str, optional): List of project categories to filter by. Defaults to None.
        project_location (list of str, optional): List of project locations to filter by. Defaults to None.
        project_status (list of str, optional): List of project statuses to filter by. Defaults to None.
        sortby (int, optional): Sort order for projects (-1 for newest, 1 for oldest). Defaults to -1.

    Returns:
        dict: A JSON response containing the project list based on the specified filters.
    """
    try:
        if query:
            projects = list(project_collection.aggregate([
                {
                    "$search": {
                        "index": "default",
                        "text": {
                            "query": query,
                            "path": {
                                "wildcard": "*"
                            }
                        }
                    }
                },
                {
                    "$match": {
                        "$or": [
                            {"project_owner": user_id},
                            {"approved_users.user_id": user_id}
                        ]
                    }
                }
            ]))
        else:
            projects = list(project_collection.aggregate([
                {
                    "$match": {
                        "$or": [
                            {"project_owner": user_id},
                            {"approved_users.user_id": user_id}
                        ]
                    }
                }
            ]))
        if project_type:
            projects = [p for p in projects if p.get('project_type') in project_type]
        if project_category:
            projects = [p for p in projects if p.get('category') in project_category]
        if project_location:
            projects = [p for p in projects if p.get('project_location') in project_location]
        if project_status:
            projects = [p for p in projects if p.get('status').lower() in project_status]
        
        # filter project, only list project if its status is not archived
        valid_statuses = ['ongoing', 'completed', 'open']
        projects = [p for p in projects if p.get('status').lower() in valid_statuses]
 
        if sortby == "Newest":
            sortby = -1
        elif sortby == "Oldest":
            sortby = 1
        else:
            sortby = -1 # default to Oldest

        projects = sorted(projects, key=lambda p: p.get('date_created'), reverse=sortby == -1)
        return make_return_message(
            status='success',
            message='Projects retrieved successfully',
            code=200,
            data=projects,
        )

    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )

def user_view_all_project_user(project_id, project_collection):
    """
    View a list of users related to a project, including approved, applied, and rejected users.

    Args:
        project_id (str): The ID of the project.
        project_collection (MongoDB Collection): The project collection in the database.

    Returns:
        dict: A JSON response containing a list of users related to the project.
    """
    try:
        project = project_collection.find_one({'_id': ObjectId(project_id)})
        if not project:
            return make_return_message(
                status='error',
                message='Project Not Found',
                code=404,
                data={},
            )

        approved_users = project.get('approved_users', [])
        applied_users = project.get('applied_users', [])
        rejected_users = project.get('rejected_users', [])

        result = {
            'approved_users': approved_users,
            'applied_users': applied_users,
            'rejected_users': rejected_users
        }

        return make_return_message(
            status='success',
            message='Project related user list',
            code=200,
            data=result
        )
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )

def check_user_status(user_id, project):
    """
    Check the status of a user (applied, approved, or rejected) for a given project.

    Args:
        user_id (str): The ID of the user to check.
        project (dict): The project document.

    Returns:
        dict: A JSON response indicating the user's status for the project or an error message if already in a status.
    """
    user_statuses = ['applied_users', 'approved_users', 'rejected_users']
    
    for status in user_statuses:
        users = project.get(status, [])
        for user in users:
            
            if user.get('user_id') == user_id:
                status_str = status.split('_')[0]
                return make_return_message(
                    status='error',
                    message=f'User has already been {status_str} for this project',
                    code=400,
                    data={},
                )

def professional_apply_project(data, user_collection, project_collection, token, app):
    """
    Allow a professional user to apply for a project.

    Args:
        data (dict): A dictionary containing the application data, including proposed_deadline, proposal, and project_id.
        user_collection (MongoDB Collection): The user collection in the database.
        project_collection (MongoDB Collection): The project collection in the database.
        token (str): The user's authentication token.
        app (Flask app): The Flask application object.

    Returns:
        dict: A JSON response indicating the success or failure of the application submission.
    """
    try:
        uid = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        user = user_collection.find_one({'_id': ObjectId(uid['uid'])})
        
        proposed_deadline = data.get('proposed_deadline')
        proposal = data.get('proposal')
        project_id = data.get('project_id')
        
        if None in (proposed_deadline, proposal, project_id):
            return make_return_message(
            status='error',
            message='Missing data: All fields are required',
            code=400,
            data={},
        )
        project = project_collection.find_one({'_id': ObjectId(project_id)})  
        if not user or not project:
            return make_return_message(
                status='error',
                message='User or project not found',
                code=400,
                data={},
            )
        
        if user.get('role') != '30':
            return make_return_message(
                status='error',
                message='User is not a professional',
                code=400,
                data={},
            )
        
        if 'applied_users' not in project:
                project['applied_users'] = []
        
        # Check if the user has already applied, been approved, or rejected for this project
        approved_users = project.get('approved_users', [])
        status_check_result = check_user_status(uid['uid'], project)
        if status_check_result:
            return status_check_result

        # Check if manpower requirement is greater than 0
        professional_num = project.get('professional_num', 0)
        manpower_required = int(professional_num) - len(approved_users)
        if manpower_required < 0:
            return make_return_message(
                status='error',
                message='Manpower requirement for this project is already fulfilled',
                code=400,
                data={},
            )

        email = user.get('email')
        phone = user.get('phone')
        entityname = user.get('entityname')
        user_info = {
            'user_id': uid['uid'],
            'name':entityname,
            'email': email,
            'phone': phone,
            'proposed_deadline': proposed_deadline,
            'proposal': proposal,     
            'date_applied': datetime.now().date().strftime('%Y-%m-%d') 
        }

        project['applied_users'].append(user_info)
        applied_list = user.get('project_applications', [])
        applied_list.append(str(project_id))

        user_collection.update_one({'_id': ObjectId(uid['uid'])}, {'$set': {'project_applications': applied_list}})
        project_collection.update_one({'_id': ObjectId(project_id)}, {'$set': project})

        return make_return_message(
            status='success',
            message='Application submitted successfully',
            code=200,
            data={'applied_user': str(project['applied_users'])},
        )
    
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )

def user_view_project_application(project_collection, app, project_id, applied_user_id):
    """
    View the application details of a user for a specific project.

    Args:
        project_collection (MongoDB Collection): The project collection in the database.
        app (Flask app): The Flask application object.
        project_id (str): The ID of the project.
        applied_user_id (str): The ID of the user whose application details are to be viewed.

    Returns:
        dict: A JSON response containing the application details of the specified user for the project.
    """
    try:
        project = project_collection.find_one({'_id': ObjectId(project_id)})
        applied_users = project['applied_users']

        # Search for the application with the specified user_id
        for applied_user in applied_users:
            if applied_user.get('user_id') == applied_user_id:
                application_detail = applied_user
                return make_return_message(
                    status='success',
                    message='Application detail retrieved successfully',
                    code=200,
                    data=application_detail,
                )
        return make_return_message(
            status='error',
            message='Project/ user no exist',
            code=400,
            data={},
        )      
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )
    
def user_browse_all_projects(project_collection, query=None, project_type=None, project_category=None, project_location=None, project_status=None, sortby=-1):
    """
    Browse all projects based on various filters.

    Args:
        project_collection (MongoDB Collection): The project collection in the database.
        query (str, optional): A search query to filter projects. Defaults to None.
        project_type (list of str, optional): List of project types to filter by. Defaults to None.
        project_category (list of str, optional): List of project categories to filter by. Defaults to None.
        project_location (list of str, optional): List of project locations to filter by. Defaults to None.
        project_status (list of str, optional): List of project statuses to filter by. Defaults to None.
        sortby (int, optional): Sort order for projects (-1 for newest, 1 for oldest). Defaults to -1.

    Returns:
        dict: A JSON response containing the list of projects based on the specified filters.
    """
    try:
        if query:
            projects = list(project_collection.aggregate([
                {
                    "$search": {
                        "index": "default",
                        "text": {
                            "query": query,
                            "path": {
                                "wildcard": "*"
                            }
                        }
                    }
                },
                {
                    "$match": {
                        "status": {
                            "$ne": "archived"
                        }
                    }
                }
            ]))
        else:
            projects = list(project_collection.aggregate([
                {
                    "$match": {
                        "status": {
                            "$ne": "archived"
                        }
                    }
                }
            ]))
      
        if project_type:
            projects = [p for p in projects if p.get('project_type') in project_type]
        if project_category:
            projects = [p for p in projects if p.get('category') in project_category]
        if project_location:
            projects = [p for p in projects if p.get('location').lower() in project_location]
        if project_status:
            projects = [p for p in projects if p.get('status').lower() in project_status]
          
        # Sort projects based on sortby
        if sortby == "Newest":
            sortby = -1
        elif sortby == "Oldest":
            sortby = 1
        else:
            sortby = -1 # default to Oldest


        boosted_projects = [p for p in projects if p.get('boosted', False)]
        non_boosted_projects = [p for p in projects if not p.get('boosted', False)]
        boosted_projects = sorted(boosted_projects, key=lambda p: p.get('date_created'), reverse=sortby == -1)
        non_boosted_projects = sorted(non_boosted_projects, key=lambda p: p.get('date_created'), reverse=sortby == -1)
        projects = boosted_projects + non_boosted_projects
        return make_return_message(
            status='success',
            message='Project list',
            code=200,
            data=projects,
        )

    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )

def user_boost_project(token, project_collection, user_collection, app, project_id):
    """
    Allow a user to boost their project, increasing its visibility.

    Args:
        token (str): The user's authentication token.
        project_collection (MongoDB Collection): The project collection in the database.
        user_collection (MongoDB Collection): The user collection in the database.
        app (Flask app): The Flask application object.
        project_id (str): The ID of the project to be boosted.

    Returns:
        dict: A JSON response indicating the success or failure of the project boost.
    """
    try:
        user_id = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        user = user_collection.find_one({'_id': ObjectId(user_id['uid'])})
        
        project = project_collection.find_one({'_id': ObjectId(project_id)})
        if project['project_owner'] != user_id['uid']:
            return make_return_message(
                status='error',
                message='Unauthorized',
                code=403,
                data={},
            )

        # User only has one chance to boost project
        if user.get('boosted'):
            return make_return_message(
                status='error',
                message='Company user already boosted one project.',
                code=400,
                data={},
            )
            
        if 'boosted' not in project:
            project['boosted'] = False
        
        if 'boosted'not in user:
            project['boosted'] = False

        if project['boosted'] == True:
            return make_return_message(
                status='error',
                message='Project already boosted',
                code=400,
                data={},
            )
          
        if project['status'] == 'open':
            project['boosted'] = True
            user['boosted'] = True
            project_collection.update_one({'_id': ObjectId(project_id)}, {'$set': project})
            user_collection.update_one({'_id': ObjectId(user_id['uid'])}, {'$set': user})

            return make_return_message(
                status='success',
                message='Project Boosted',
                code=200,
                data={'project_boosted':str(project['boosted'])},
            )
    except Exception as e:
        return make_return_message(
            status='error',
            message='You can only boost for an open project',
            code=400,
            data={},
        )
        

def professional_user_certificate(token, certificate_collection, app):
    """
    Retrieve a list of certificates associated with a professional user.

    Args:
        token (str): The user's authentication token.
        certificate_collection (MongoDB Collection): The certificate collection in the database.
        app (Flask app): The Flask application object.

    Returns:
        dict: A JSON response containing the list of certificates associated with the professional user.
    """
    try:
        uid = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        certificates = list(certificate_collection.aggregate([
            {
                '$match': {
                    'user_id': uid['uid']
                }
            }
        ]))

        return make_return_message(
            status='success',
            message='Certificate list',
            code=200,
            data=certificates,
        )
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )
        
def professional_user_view_project_applications(token, project_collection, app):
    """
    Retrieve a list of certificates associated with a professional user.

    Args:
        token (str): The user's authentication token.
        certificate_collection (MongoDB Collection): The certificate collection in the database.
        app (Flask app): The Flask application object.

    Returns:
        dict: A JSON response containing the list of certificates associated with the professional user.
    """
    try:
        uid = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        projects = list(project_collection.aggregate([
            {
                '$match': {
                        '$or': [
                        {'applied_users.user_id': uid['uid']},
                        {'approved_users.user_id': uid['uid']},
                        {'rejected_users.user_id': uid['uid']}
                    ]
                }
            },
            {
                '$project': {
                    'project_id': '$_id',
                    'title': 1,
                    'description': 1,
                    'project_type': 1,
                    'category': 1,
                    'project_location': 1,
                    'status': 1,
                    'budget': 1,
                    'deadline': 1,
                    'applied_users': {
                        '$filter': {
                            'input': '$applied_users',
                            'as': 'applied_user',
                            'cond': {
                                '$eq': ['$$applied_user.user_id', uid['uid']]
                            }
                        }
                    },
                    'approved_users': {
                        '$filter': {
                            'input': '$approved_users',
                            'as': 'approved_user',
                            'cond': {
                                '$eq': ['$$approved_user.user_id', uid['uid']]
                            }
                        }
                    },
                    'rejected_users': {
                        '$filter': {
                            'input': '$rejected_users',
                            'as': 'rejected_user',
                            'cond': {
                                '$eq': ['$$rejected_user.user_id', uid['uid']]
                            }
                        }
                    }
                }
            }
        ]))
        pending_projects = []
        rejected_projects = []               
        for project in projects:
            if project['applied_users']:
                project['application_status'] = 'pending'
                project['enquired_user'] = uid['uid']
                pending_projects.append(project)
            elif project['rejected_users']:
                project['application_status'] = 'rejected'
                project['enquired_user'] = uid['uid']
                rejected_projects.append(project)

        combined_list = pending_projects + rejected_projects

        return make_return_message(
            status='success',
            message='Project list',
            code=200,
            data=combined_list                
        )
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )