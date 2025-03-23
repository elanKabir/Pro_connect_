import unittest
from unittest.mock import MagicMock
from bson import ObjectId
from datetime import datetime
from helpers import make_return_message
import jwt
import json
from notification import (
    send_notification,
    list_all_notifications,
    user_delete_notification,
    edit_notification_status,
)

def generate_token(user_id, secret_key):
    payload = {'uid': str(user_id)}
    return jwt.encode(payload, secret_key, algorithm='HS256')
        
class TestNotificationFunctions(unittest.TestCase):

    def setUp(self):
        self.user_id = ObjectId('507f191e810c19729de860ea')
        self.notification_id = ObjectId('5f9e9403c00a616aa1fe13c3')
        self.notification_collection = MagicMock()
        self.user_collection = MagicMock()
        self.app = MagicMock()
        self.app.secret_key = 'secret'
        self.token = generate_token(self.user_id, self.app.secret_key)

    def test_send_notification_success(self):
        user = {'_id': self.user_id, 'notifications': []}
        self.user_collection.find_one.return_value = user
        message = 'New notification'

        notification_id = send_notification(str(self.user_id), message, self.notification_collection, user, self.user_collection)
        self.assertIn(str(notification_id), user['notifications'])


    def test_user_delete_notification(self):
        user = {'_id': self.user_id, 'notifications': [str(self.notification_id)]}
        self.user_collection.find_one.return_value = user
        self.notification_collection.find_one.return_value = {'_id': self.notification_id}

        response = user_delete_notification(self.token, str(self.notification_id), self.user_collection, self.notification_collection, self.app)

        self.assertNotIn(str(self.notification_id), user['notifications'])

    def test_list_all_notifications(self):
        user = {'_id': self.user_id, 'notifications': [str(self.notification_id)]}
        self.user_collection.find_one.return_value = user
        notification = {
            '_id': self.notification_id,
            'message': 'Test notification',
            'timestamp': str(datetime.now()),
            'read_status': False
        }
        self.notification_collection.find_one.return_value = notification

        response = list_all_notifications(self.token, self.user_collection, self.app, self.notification_collection)
        response_data, _ = json.loads(response[0]), response[1]  

        self.assertEqual(response_data['status'], 'success')
        self.assertEqual(response_data['message'], 'User list of notifications')
        self.assertIn('data', response_data)
        self.assertIn('notification_id', response_data['data'])
        self.assertIn('notification_list', response_data['data'])
        self.assertEqual(response_data['data']['notification_id'], user['notifications'])
        self.assertEqual(response_data['data']['notification_list'][0]['read_status'], notification['read_status'])

    def test_edit_notification_status(self):
        user = {'_id': self.user_id}
        self.user_collection.find_one.return_value = user
        notification = {
            '_id': self.notification_id,
            'read_status': False
        }
        self.notification_collection.find_one.return_value = notification

        response = edit_notification_status(self.token, self.user_collection, self.app, self.notification_collection, str(self.notification_id))
        response_dict, _ = json.loads(response[0]), response[1]  

        self.assertEqual(response_dict['status'], 'success')
        self.assertEqual(response_dict['message'], 'Notification marked as read.')

        if 'code' in response_dict.get('data', {}):
            self.assertEqual(response_dict['data']['code'], 200)

if __name__ == '__main__':
    unittest.main()
