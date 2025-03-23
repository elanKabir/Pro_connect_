import unittest
from unittest.mock import MagicMock, patch
import json
from bson import ObjectId
from project import (company_edit_project_detail, company_create_project, company_approve_user, company_delete_project, 
                     company_edit_approved_user, user_view_project_detail, professional_apply_project, professional_user_certificate,
                     professional_user_view_project_applications, user_boost_project, user_browse_all_projects, user_view_project_application)

class TestCompanyEditProjectDetail(unittest.TestCase):
    def setUp(self):
        self.project_collection = MagicMock()
        self.user_collection = MagicMock()
        self.certificate_collection = MagicMock()
        self.notification_collection = MagicMock()
        self.app = MagicMock()
        self.app.secret_key = 'secret'
        self.mock_project_id = str(ObjectId()) 
        self.mock_user_id = str(ObjectId())  
        self.another_user_id = str(ObjectId())
       
        self.data = {
            'mock_project_id': self.mock_project_id,
            'title': 'New Title',
            'description': 'description',
            'category': 'category',
            'budget': 'budget',
            'deadline': 'deadline',
            'professional_num': 'professional_num',
            'status':'open',
            'location': 'location',
            'date_created': 'current_date_str',
            'project_owner': 'mock_user_id',
            'project_owner_name': 'user',  
            'project_type': 'project_type'
        }
        self.token = 'jwt_token'
        
    @patch('jwt.decode')
    def test_successful_project_creation(self, mock_jwt_decode):
        mock_user_id = str(ObjectId())  # Use a valid ObjectId format

        mock_jwt_decode.return_value = {'uid': mock_user_id}
        self.user_collection.find_one.return_value = {'role': '20', 'entityname': 'Test Entity'}

        response = company_create_project(self.data, self.token, self.user_collection, self.project_collection, self.app)
        response_data, status_code = response
        response_dict = json.loads(response_data)
        self.assertEqual(response_dict['status'], 'success')
        self.assertEqual(status_code, 200)
        
    @patch('jwt.decode')
    def test_project_creation_missing_data(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': 'mock_user_id'}
        self.user_collection.find_one.return_value = {'role': '20', 'entityname': 'Test Entity'}

        data_missing_field = self.data.copy()
        del data_missing_field['budget']

        response = company_create_project(data_missing_field, self.token, self.user_collection, self.project_collection, self.app)
        response_data, status_code = response
        response_dict = json.loads(response_data)
        self.assertEqual(response_dict['status'], 'error')
        self.assertEqual(status_code, 400)
        self.assertIn('Missing data', response_dict['message'])
    
    @patch('jwt.decode')
    def test_successful_project_update(self, mock_jwt_decode):
        # Mock the jwt.decode function to return a fake user ID
        mock_jwt_decode.return_value = {'uid': 'mock_user_id'}

        # Mock project data
        self.project_collection.find_one.return_value = {'project_owner': 'mock_user_id'}
        response = company_edit_project_detail(self.data, self.project_collection, self.certificate_collection, self.token, self.app)
        response_data, status_code = response
        response_dict = json.loads(response_data)
        self.assertEqual(response_dict['status'], 'success')
        self.assertEqual(status_code, 200)

    @patch('jwt.decode')
    def test_company_edit_project_detail_error_project_not_found(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': 'user_id'}
        self.project_collection.find_one.return_value = None
        data = {
            'project_id': self.mock_project_id,
        }
        response = company_edit_project_detail(data, self.project_collection, MagicMock(), 'token', MagicMock())
        self.assertEqual(response[1], 400)

    @patch('jwt.decode')
    def test_delete_project_success(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.mock_user_id}
        self.project_collection.find_one.return_value = {'_id': ObjectId(self.mock_project_id), 'project_owner': self.mock_user_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.mock_user_id), 'projects': [self.mock_project_id]}
        
        response = company_delete_project(self.token, self.mock_project_id, self.user_collection, self.project_collection, self.app)
        self.assertEqual(response[1], 200)  # Success status code

    @patch('jwt.decode')
    def test_delete_project_not_found(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.mock_user_id}
        self.project_collection.find_one.return_value = None
        
        response = company_delete_project(self.token, self.mock_project_id, self.user_collection, self.project_collection, self.app)
        self.assertEqual(response[1], 400)  # Error status code

    @patch('jwt.decode')
    def test_approve_user_success(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.mock_user_id}
        self.project_collection.find_one.return_value = {
            '_id': ObjectId(self.mock_project_id), 
            'project_owner': self.mock_user_id, 
            'applied_users': [{'user_id': self.another_user_id}],  # Ensure this matches the expected structure
            'approved_users': [], 
            'professional_num': 50,
            'title': 'Mock Project Title' 
        }
        
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.another_user_id), 'projects': []}
        
        response = company_approve_user(self.user_collection, self.project_collection, self.mock_project_id, self.another_user_id, self.token, self.app, self.notification_collection)
        print(response)
        self.assertEqual(response[1], 200)  

    @patch('jwt.decode')
    def test_approve_user_not_found(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.mock_user_id}
        self.project_collection.find_one.return_value = {'_id': ObjectId(self.mock_project_id), 'project_owner': self.mock_user_id, 'applied_users': []}
        
        response = company_approve_user(self.user_collection, self.project_collection, self.mock_project_id, self.another_user_id, self.token, self.app, self.notification_collection)
        self.assertEqual(response[1], 400)  # Error status code

    @patch('jwt.decode')
    def test_edit_approved_user_success(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.mock_user_id}
        self.project_collection.find_one.return_value = {
            '_id': ObjectId(self.mock_project_id),
            'project_owner': self.mock_user_id,
            'approved_users': [{'user_id': self.another_user_id}],
            'rejected_users': []
        }

        response = company_edit_approved_user(self.token, self.app, self.project_collection, self.mock_project_id, self.user_collection, self.another_user_id)
        print(response)
        self.assertEqual(response[1], 200)

    @patch('jwt.decode')
    def test_edit_approved_user_not_found(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.mock_user_id}
        self.project_collection.find_one.return_value = {
            '_id': ObjectId(self.mock_project_id),
            'project_owner': self.mock_user_id,
            'approved_users': []
        }

        response = company_edit_approved_user(self.token, self.app, self.project_collection, self.mock_project_id, self.user_collection, self.another_user_id)
        self.assertEqual(response[1], 404)  # User not found status code

    @patch('jwt.decode')
    def test_view_project_detail_success(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.mock_user_id}
        self.project_collection.find_one.return_value = {
            '_id': ObjectId(self.mock_project_id),
            'title': 'Project Title',
            'budget': 1000,
            'professional_num': 50,
            'description': 'dddd',
            'category': 'ca',
            'deadline': 'deadline',
            'status':'open',
            'location': 'location',
            'date_created': 'current_date_str',
            'project_owner': 'mock_user_id',
            'project_owner_name': 'user',  
            'project_type': 'project_type'
        }
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.mock_user_id), 'role': '30'}

        response = user_view_project_detail(self.project_collection, self.mock_project_id, self.app, self.token, self.user_collection)
        self.assertEqual(response[1], 200)  # Success status code

    @patch('jwt.decode')
    def test_professional_apply_project_success(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.mock_user_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.mock_user_id), 'role': '30'}
        self.project_collection.find_one.return_value = {'_id': ObjectId(self.mock_project_id), 'approved_users': []}

        data = {'proposed_deadline': '2023-12-31', 'proposal': 'Test Proposal', 'project_id': self.mock_project_id}
        response = professional_apply_project(data, self.user_collection, self.project_collection, self.token, self.app)
        self.assertEqual(response[1], 200)

    @patch('jwt.decode')
    def test_user_view_project_application_success(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.mock_user_id}
        self.project_collection.find_one.return_value = {'_id': ObjectId(self.mock_project_id), 'applied_users': [{'user_id': self.mock_user_id, 'proposal': 'Test Proposal'}]}
        response = user_view_project_application(self.project_collection, self.app, self.mock_project_id, self.mock_user_id)
        self.assertEqual(response[1], 200)

    def test_user_browse_all_projects(self):
        self.project_collection.aggregate.return_value = [{'_id': ObjectId(self.mock_project_id), 'title': 'Project Title'}]
        response = user_browse_all_projects(self.project_collection)
        self.assertEqual(response[1], 200)

    @patch('jwt.decode')
    def test_user_boost_project(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.mock_user_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.mock_user_id), 'boosted': False}
        self.project_collection.find_one.return_value = {'_id': ObjectId(self.mock_project_id), 'project_owner': self.mock_user_id, 'boosted': False, 'status': 'open'}
        response = user_boost_project(self.token, self.project_collection, self.user_collection, self.app, self.mock_project_id)
        print(response)
        self.assertEqual(response[1], 200)

    @patch('jwt.decode')
    def test_professional_user_certificate(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.mock_user_id}
        self.certificate_collection.aggregate.return_value = [{'certificate_id': '123', 'user_id': self.mock_user_id}]
        response = professional_user_certificate(self.token, self.certificate_collection, self.app)
        self.assertEqual(response[1], 200)

    @patch('jwt.decode')
    def test_professional_user_view_project_applications(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.mock_user_id}
        self.project_collection.aggregate.return_value = [{'_id': ObjectId(self.mock_project_id), 'title': 'Project Title', 'applied_users': [{'user_id': self.mock_user_id}]}]
        response = professional_user_view_project_applications(self.token, self.project_collection, self.app)
        self.assertEqual(response[1], 200)


if __name__ == '__main__':
    unittest.main()
