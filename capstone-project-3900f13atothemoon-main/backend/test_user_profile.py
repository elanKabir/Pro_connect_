import unittest
from unittest.mock import MagicMock, patch
from bson import ObjectId
from user_profile import (user_edit_profile, upload_cv_in_profile, upload_profile_photo,
                          list_skill, add_skills, add_company_bio_in_profile, user_boost_profile)

class TestUserProfileFunctions(unittest.TestCase):
    def setUp(self):
        self.user_collection = MagicMock()
        self.cv_collection = MagicMock()
        self.image_collection = MagicMock()
        self.app = MagicMock()
        self.app.secret_key = 'secret_key'
        self.token = 'jwt_token'
        self.user_id = str(ObjectId())

    @patch('jwt.decode')
    def test_user_edit_profile(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.user_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.user_id), 'role': '30'}
        data = {'email': 'new@example.com', 'phone': '1234567890', 'location': 'New Location', 'entityname': 'New Name'}

        response = user_edit_profile(data, self.user_collection, self.token, self.app)
        self.assertEqual(response[1], 200)

    @patch('jwt.decode')
    def test_upload_cv_in_profile(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.user_id}
        file = {'cv': MagicMock(filename='test_cv.pdf', content_type='application/pdf', read=MagicMock(return_value=b'cv_data'))}
        
        response = upload_cv_in_profile(self.user_collection, file, self.token, self.app, self.cv_collection)
        self.assertEqual(response[1], 200)

    @patch('jwt.decode')
    def test_upload_profile_photo(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.user_id}
        file = {'img': MagicMock(filename='test_img.png', content_type='image/png', read=MagicMock(return_value=b'img_data'))}
        
        response = upload_profile_photo(self.user_collection, file, self.token, self.app, self.image_collection)
        self.assertEqual(response[1], 200)

    @patch('jwt.decode')
    def test_list_skill(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.user_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.user_id), 'skills': ['Python', 'JavaScript']}
        response = list_skill(self.user_collection, self.user_id)
        self.assertEqual(response[1], 200)

    def test_add_skills(self):
        data = {'user_id': self.user_id, 'skills': ['Java']}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.user_id)}
        response = add_skills(data, self.user_collection)
        self.assertEqual(response[1], 200)

    def test_add_company_bio_in_profile(self):
        data = {'user_id': self.user_id, 'company_bio': 'New Bio'}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.user_id)}
        response = add_company_bio_in_profile(data, self.user_collection)
        self.assertEqual(response[1], 200)

    @patch('jwt.decode')
    def test_user_boost_profile(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.user_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.user_id), 'role': '30'}
        response = user_boost_profile(self.token, self.user_collection, self.app)
        self.assertEqual(response[1], 200)

    @patch('jwt.decode')
    def test_list_skill_user_not_found(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.user_id}
        self.user_collection.find_one.return_value = None
        response = list_skill(self.user_collection, self.user_id)
        self.assertEqual(response[1], 403)

    # Error cases for add_skills
    def test_add_skills_missing_user_id(self):
        data = {'skills': ['Java']}
        response = add_skills(data, self.user_collection)
        self.assertEqual(response[1], 400)

    def test_add_skills_user_not_found(self):
        data = {'user_id': self.user_id, 'skills': ['Java']}
        self.user_collection.find_one.return_value = None
        response = add_skills(data, self.user_collection)
        self.assertEqual(response[1], 403)

    # Error cases for add_company_bio_in_profile
    def test_add_company_bio_missing_bio(self):
        data = {'user_id': self.user_id}
        response = add_company_bio_in_profile(data, self.user_collection)
        self.assertEqual(response[1], 400)

    def test_add_company_bio_user_not_found(self):
        data = {'user_id': self.user_id, 'company_bio': 'New Bio'}
        self.user_collection.find_one.return_value = None
        response = add_company_bio_in_profile(data, self.user_collection)
        self.assertEqual(response[1], 403)

    # Error cases for user_boost_profile
    @patch('jwt.decode')
    def test_user_boost_profile_already_boosted(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.user_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.user_id), 'boosted': True}
        response = user_boost_profile(self.token, self.user_collection, self.app)
        self.assertEqual(response[1], 400)

    @patch('jwt.decode')
    def test_user_boost_profile_incorrect_role(self, mock_jwt_decode):
        mock_jwt_decode.return_value = {'uid': self.user_id}
        self.user_collection.find_one.return_value = {'_id': ObjectId(self.user_id), 'role': '20'}
        response = user_boost_profile(self.token, self.user_collection, self.app)
        self.assertEqual(response[1], 400)

if __name__ == '__main__':
    unittest.main()
