import jwt
from datetime import datetime
from helpers import make_return_message
from bson import ObjectId

def send_notification(user_id, message, notification_collection, user, user_collection):
    """
    Send a notification to a user.

    Args:
    - user_id (str): User ID to whom the notification is sent.
    - message (str): Notification message.
    - notification_collection (pymongo.collection.Collection): MongoDB collection for notifications.
    - user (dict): User document.
    - user_collection (pymongo.collection.Collection): MongoDB collection for user data.

    Returns:
    - str: ID of the inserted notification.
    """
    notification = {
        'user_id': ObjectId(user_id),
        'message': message,
        'timestamp': str(datetime.now()),
        'read_status': False
    }
    notification_id = notification_collection.insert_one(notification).inserted_id
    if 'notifications' not in user:
        user['notifications'] = []

    user['notifications'].append(str(notification_id))
    user_collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'notifications': user['notifications']}})

    return str(notification_id)

def list_all_notifications(token, user_collection, app, notification_collection):
    """
    List all notifications for a user.

    Args:
    - token (str): User authentication token.
    - user_collection (pymongo.collection.Collection): MongoDB collection for user data.
    - app (Flask): Flask application instance.
    - notification_collection (pymongo.collection.Collection): MongoDB collection for notifications.

    Returns:
    - JSON response and HTTP status code.
    """
    try:    
        user_id = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        user = user_collection.find_one({'_id': ObjectId(user_id['uid'])})

        notification_ids = user.get('notifications', [])

        notification_list = []
        for id in notification_ids:
            notification = notification_collection.find_one({'_id': ObjectId(id)})

            notification_info = {
                'notification_id':id,
                'user_id': ObjectId(user_id['uid']),
                'message': notification['message'],
                'timestamp': notification['timestamp'],
                'read_status': notification['read_status']                 
            }           
            notification_list.append(notification_info)
        
        return make_return_message(
            status='success',
            message='User list of notifications',
            code=200,
            data={'notification_id': (user['notifications']), 'notification_list': notification_list},
        )
        
    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )

def user_delete_notification(token, notification_id, user_collection, notification_collection, app):
    """
    Delete a notification for a user.

    Args:
    - token (str): User authentication token.
    - notification_id (str): ID of the notification to be deleted.
    - user_collection (pymongo.collection.Collection): MongoDB collection for user data.
    - notification_collection (pymongo.collection.Collection): MongoDB collection for notifications.
    - app (Flask): Flask application instance.

    Returns:
    - JSON response and HTTP status code.
    """
    try:
        requesterID = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        notification = notification_collection.find_one({'_id': ObjectId(notification_id)})

        if not notification:
            return make_return_message(
                status='error',
                message='Notification not found',
                code=400,
                data={},
            )
        
        notification_collection.delete_one({'_id': ObjectId(notification_id)})
        user = user_collection.find_one({'_id': ObjectId(requesterID['uid'])})

        notifications_list = user.get('notifications', [])
        notifications_list.remove(notification_id)

        user_collection.update_one({'_id': ObjectId(requesterID['uid'])}, {'$set': {'notifications': notifications_list}})

        return make_return_message(
            status='success',
            message='Notification deleted successfully',
            code=200,
            data={'notification_id': str(notification_id)},
        )

    except Exception as e:
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )


def edit_notification_status(token, user_collection, app, notification_collection, notification_id):   
    """
    Mark a notification as read.

    Args:
    - token (str): User authentication token.
    - user_collection (pymongo.collection.Collection): MongoDB collection for user data.
    - app (Flask): Flask application instance.
    - notification_collection (pymongo.collection.Collection): MongoDB collection for notifications.
    - notification_id (str): ID of the notification to be marked as read.

    Returns:
    - JSON response and HTTP status code.
    """
    user_id = jwt.decode(token, app.secret_key, algorithms=['HS256'])
    user = user_collection.find_one({'_id': ObjectId(user_id['uid'])})
    notification = notification_collection.find_one({'_id': ObjectId(notification_id)})
   
    try:
        notification_collection.update_one(
            {'_id': ObjectId(notification_id)},
            {'$set': {'read_status': True}}
        )
        return make_return_message(
            message='Notification marked as read.',
            status='success',
            code=200,
            data={'read_status':notification['read_status']}
        )
    except Exception as e:
        make_return_message(
            message=str(e),
            status='error',
            code=500,
            data={}
        )
