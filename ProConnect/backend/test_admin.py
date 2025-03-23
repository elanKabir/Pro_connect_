import unittest
from unittest.mock import MagicMock, patch
from bson import ObjectId
from admin import (admin_view_all_users, admin_delete_account, 
                         admin_view_project_list, admin_view_statistics, get_total_user_stats,
                         get_total_project_stats_monthly, get_total_review_stats, 
                         get_total_review_stats_monthly, get_user_detail)

class TestAdminFunctions(unittest.TestCase):
    def setUp(self):
        self.user_collection = MagicMock()
        self.project_collection = MagicMock()
        self.review_collection = MagicMock()
        self.image_collection = MagicMock()
        self.cv_collection = MagicMock()
        self.app = MagicMock()
        self.app.secret_key = 'secret_key'
        self.token = 'Bearer jwt_token'
        self.admin_id = str(ObjectId())
        self.user_id = str(ObjectId())

    @patch('jwt.decode')
    def test_admin_view_all_users(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.admin_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.admin_id), 'role': '10'}
        self.user_collection.aggregate.return_value = [{'_id': ObjectId(self.user_id), 'role': '30'}]
        response = admin_view_all_users(self.token, self.user_collection, self.app)
        self.assertEqual(response[1], 200)

    @patch('jwt.decode')
    def test_admin_delete_account(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.admin_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.admin_id), 'role': '10'}
        response = admin_delete_account(self.token.split()[1], self.user_id, self.user_collection, self.app)
        self.assertEqual(response[1], 200)

    @patch('jwt.decode')
    def test_admin_view_project_list(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.admin_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.admin_id), 'role': '10'}
        self.project_collection.find.return_value = [{'_id': ObjectId(), 'title': 'Project Title'}]
        response = admin_view_project_list(self.token.split()[1], self.project_collection, self.user_collection, self.app)
        self.assertEqual(response[1], 200)

    @patch('jwt.decode')
    def test_admin_view_statistics(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.admin_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.admin_id), 'role': '10'}
        response = admin_view_statistics(self.token.split()[1], self.user_collection, self.project_collection, self.review_collection, self.app)
        self.assertEqual(response[1], 200)

    def test_get_total_user_stats(self):
        self.user_collection.aggregate.return_value = [{'_id': {'role': '30'}, 'count': 5}]
        response = get_total_user_stats(self.user_collection)
        self.assertTrue(isinstance(response, dict))

    def test_get_total_project_stats_monthly(self):
        self.project_collection.aggregate.return_value = [
            {'_id': {'status': 'open', 'yearMonth': '2023-05'}, 'count': 5}
        ]
        result = get_total_project_stats_monthly(self.project_collection)
        self.assertIsInstance(result, dict)

    def test_get_total_review_stats(self):
        self.review_collection.aggregate.return_value = [
            {'_id': {'rating': 5}, 'count': 10}
        ]
        result = get_total_review_stats(self.review_collection)
        self.assertIsInstance(result, dict)

    def test_get_total_review_stats_monthly(self):
        self.review_collection.aggregate.return_value = [
            {'_id': {'rating': 5, 'yearMonth': '2023-05'}, 'count': 10}
        ]
        result = get_total_review_stats_monthly(self.review_collection)
        self.assertIsInstance(result, dict)

    @patch('admin.make_return_message')
    def test_get_user_detail(self, mock_return_message):
        user_id = str(ObjectId())
        self.user_collection.find_one.return_value = {'_id': ObjectId(user_id), 'email': 'test@example.com', 'entityname':'name', 'phone':'123123', 'location':'syd', 'abn':'123123', 'role':'30'}
        self.image_collection.find_one.return_value = {'_id': ObjectId(), 'data': 'image_data'}
        self.cv_collection.find_one.return_value = {'_id': ObjectId(), 'data': 'cv_data'}

        response = get_user_detail(user_id, self.user_collection, self.cv_collection, self.image_collection)
        print(response)
        mock_return_message.assert_called_with(status='success', message='User profile info', data=unittest.mock.ANY, code=200)

    @patch('jwt.decode')
    def test_admin_view_all_users_unauthorized(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.admin_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.admin_id), 'role': '30'}
        response = admin_view_all_users(self.token, self.user_collection, self.app)
        self.assertEqual(response[1], 500)

    # Error cases for admin_delete_account
    @patch('jwt.decode')
    def test_admin_delete_account_unauthorized(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.user_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.user_id), 'role': '30'}
        response = admin_delete_account(self.token.split()[1], self.user_id, self.user_collection, self.app)
        self.assertEqual(response[1], 200)

    # Error cases for admin_view_project_list
    @patch('jwt.decode')
    def test_admin_view_project_list_unauthorized(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.admin_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.admin_id), 'role': '30'}
        response = admin_view_project_list(self.token.split()[1], self.project_collection, self.user_collection, self.app)
        self.assertEqual(response[1], 403)

    # Error cases for admin_view_statistics
    @patch('jwt.decode')
    def test_admin_view_statistics_unauthorized(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.admin_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.admin_id), 'role': '30'}
        response = admin_view_statistics(self.token.split()[1], self.user_collection, self.project_collection, self.review_collection, self.app)
        self.assertEqual(response[1], 403)

    def test_get_total_project_stats_monthly_error(self):
        self.project_collection.aggregate.side_effect = Exception("Error")
        try:
            response = get_total_project_stats_monthly(self.project_collection)
            self.fail("Expected an Exception but none was raised.")
        except Exception as e:
            self.assertEqual(str(e), "Error")

    def test_get_total_review_stats_error(self):
        self.review_collection.aggregate.side_effect = Exception("Error")
        try:
            response = get_total_review_stats(self.review_collection)
            self.fail("Expected an Exception but none was raised.")
        except Exception as e:
            self.assertEqual(str(e), "Error")


if __name__ == '__main__':
    unittest.main()
