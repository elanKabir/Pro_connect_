import unittest
from unittest.mock import MagicMock, patch
from bson import ObjectId
from review import user_create_review, list_user_reviews, v2_list_user_reviews, user_view_review_detail

class TestReviewFunctions(unittest.TestCase):
    def setUp(self):
        self.user_collection = MagicMock()
        self.review_collection = MagicMock()
        self.project_collection = MagicMock()
        self.app = MagicMock()
        self.app.secret_key = 'secret_key'
        self.token = 'jwt_token'
        self.user_id = str(ObjectId())
        self.project_id = str(ObjectId())
        self.review_id = str(ObjectId())
        self.rater_id = str(ObjectId())
        self.receiver_id = str(ObjectId())


    @patch('jwt.decode')
    def test_user_create_review_success(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.rater_id}
        self.user_collection.find_one.side_effect = [
            {'_id': ObjectId(self.rater_id), 'entityname': 'Rater User', 'role': '30', 'projects': [self.project_id], 'rating':'1'},
            {'_id': ObjectId(self.receiver_id), 'entityname': 'Receiver User', 'role': '20', 'projects': [self.project_id], 'reviews': [], 'rating':'1'}
        ]
        self.project_collection.find_one.return_value = {'_id': ObjectId(self.project_id), 'status': 'completed'}
        
        self.review_collection.insert_one.return_value = MagicMock(inserted_id=self.review_id)

        data = {
            'star_rating': 5,
            'review_message': 'Great work!',
            'receiver_user_id': self.receiver_id,
            'project_id': self.project_id
        }

        response = user_create_review(self.token, data, self.review_collection, self.app, self.user_collection, self.project_collection)
        self.assertEqual(response[1], 200)

    @patch('jwt.decode')
    def test_user_create_review_error_not_same_project(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.rater_id}
        self.user_collection.find_one.side_effect = [
            {'_id': ObjectId(self.rater_id), 'projects': [self.project_id], 'entityname':'sss'},
            {'_id': ObjectId(self.receiver_id), 'projects': ['some_other_project_id'], 'entityname':'sss', 'role':'20'}
        ]
        data = {
            'star_rating': 5,
            'review_message': 'Excellent work!',
            'receiver_user_id': self.receiver_id,
            'project_id': self.project_id
        }
        response = user_create_review(self.token, data, self.review_collection, self.app, self.user_collection, self.project_collection)
        self.assertEqual(response[1], 400)

    @patch('jwt.decode')
    def test_user_create_review_error_project_not_completed(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.rater_id}
        self.user_collection.find_one.side_effect = [
            {'_id': ObjectId(self.rater_id), 'projects': [self.project_id]},
            {'_id': ObjectId(self.receiver_id), 'projects': [self.project_id],'entityname':'sss', 'role':'20'}
        ]
        self.project_collection.find_one.return_value = {'_id': ObjectId(self.project_id), 'status': 'in_progress'}
        data = {
            'star_rating': 5,
            'review_message': 'Well done!',
            'receiver_user_id': self.receiver_id,
            'project_id': self.project_id
        }
        response = user_create_review(self.token, data, self.review_collection, self.app, self.user_collection, self.project_collection)
        print(response)
        self.assertEqual(response[1], 400)

    @patch('jwt.decode')
    def test_list_user_reviews_success(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.user_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.user_id), 'reviews': [self.review_id], 'rating':5}
        self.review_collection.find_one.return_value = {'_id': ObjectId(self.review_id), 'star_rating': 5}
        response = list_user_reviews(self.token, self.user_collection, self.app, self.review_collection)
        self.assertEqual(response[1], 200)

    # Example for error case in list_user_reviews
    @patch('jwt.decode')
    def test_list_user_reviews_error(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.user_id}
        self.user_collection.find_one.return_value = None
        response = list_user_reviews(self.token, self.user_collection, self.app, self.review_collection)
        self.assertEqual(response[1], 500)

    def test_v2_list_user_reviews_success(self):
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.user_id), 'reviews': [self.review_id], 'rating':5}
        self.review_collection.find_one.return_value = {
            '_id': ObjectId(self.review_id),
            'star_rating': 5,
            'rater_name': 'Rater Name',
            'rater_role': '30',
            'review_message': 'Great job!',
        }
        response = v2_list_user_reviews(self.user_id, self.user_collection, self.review_collection)
        self.assertEqual(response[1], 200)

    # Test for v2_list_user_reviews error case (user not found)
    def test_v2_list_user_reviews_error_user_not_found(self):
        self.user_collection.find_one.return_value = None
        response = v2_list_user_reviews(self.user_id, self.user_collection, self.review_collection)
        self.assertEqual(response[1], 500)

    # Test for user_view_review_detail success case
    def test_user_view_review_detail_success(self):
        self.review_collection.find_one.return_value = {
            '_id': ObjectId(self.review_id),
            'star_rating': 5,
            'rater_name': 'Rater Name',
            'rater_role': '30',
            'review_message': 'Great job!'
        }
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.user_id)}
        response = user_view_review_detail(self.review_collection, self.review_id, self.user_id, self.user_collection)
        self.assertEqual(response[1], 200)

    # Test for user_view_review_detail error case (review not found)
    def test_user_view_review_detail_error_review_not_found(self):
        self.review_collection.find_one.return_value = None
        response = user_view_review_detail(self.review_collection, self.review_id, self.user_id, self.user_collection)
        self.assertEqual(response[1], 500)
    

if __name__ == '__main__':
    unittest.main()
