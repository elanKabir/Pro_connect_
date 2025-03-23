import unittest
from unittest.mock import MagicMock
from bson import ObjectId
from auth import register_user, login_user, change_password
import json

class TestUserRegistration(unittest.TestCase):
    def setUp(self):
        self.data = {
            'email': 'test@example.com',
            'password': 'password123',
            'entityname': 'Test Entity',
            'phone': '1234567890',
            'location': 'Test Location',
            'abn': '123-456-789',
            'role': 'user'
        }
        self.collection = MagicMock()
        self.app = MagicMock()
        self.app.secret_key = 'secret'
        self.user_id = '507f191e810c19729de860ea'
        self.pw_data = {'old_password': 'old_password', 'new_password': 'new_password'}

        
    def test_register_user_success(self):
        self.collection.find_one.return_value = None
        response = register_user(self.data, self.collection, self.app)
        response_data, status_code = response

        response_dict = json.loads(response_data)  # Parse the JSON string into a dictionary
        self.assertEqual(response_dict['status'], 'success')
        self.assertEqual(status_code, 200)  # Check the status code

    def test_register_user_duplicate_email(self):
        self.collection.find_one.side_effect = [self.data, None]
        response = register_user(self.data, self.collection, self.app)
        response_data, status_code = response

        response_dict = json.loads(response_data)  # Parse the JSON string into a dictionary
        self.assertEqual(response_dict['status'], 'error')
        self.assertIn('Email already exists', response_dict['message'])
        self.assertEqual(status_code, 403)  # Check the status code
    
    def test_valid_login(self):
        self.collection.find_one.return_value = {'_id': '123', 'password': 'password123',}
        response = login_user(self.data, self.collection, self.app)
        response_data, status_code = response
        response_dict = json.loads(response_data)
        self.assertEqual(response_dict['status'], 'success')
        self.assertEqual(status_code, 200)
        
    def test_successful_password_change(self):
        self.collection.find_one.return_value = {'_id': ObjectId(self.user_id), 'password': 'old_password'}
        response = change_password(self.pw_data, self.collection, self.app, self.user_id)
        response_data, status_code = response
        response_dict = json.loads(response_data)
        self.assertEqual(response_dict['status'], 'success')
        self.assertEqual(status_code, 200)

   
if __name__ == '__main__':
    unittest.main()
