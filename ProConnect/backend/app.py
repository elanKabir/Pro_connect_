import certifi
from flask import Flask, request
from flask_mail import Mail
from flask_pymongo import PyMongo
import flask_cors
from auth import *
from professional import all_professional
from project import *
from admin import *
from user_profile import *
from review import *
from notification import *
from config import Config  
import os

app = Flask(__name__)
flask_cors.CORS(app)

app.config.from_object(Config)  
mail = Mail(app)
# mongodb conenction 
# app.config['MONGO_URI'] = "mongodb+srv://proconnect:TfxyipfbG42m7oDL@proconnect.jynpsf3.mongodb.net/?retryWrites=true&w=majority"
app.config['MONGO_URI'] = os.environ.get('MONGO_URI')
app.secret_key = 'keyy'  
mongo = PyMongo(app, tlsCAFile=certifi.where())

db = mongo.cx.get_database('proconnect') 
user_collection = db.get_collection('users')
project_collection = db.get_collection('projects')
cv_collection = db.get_collection('cvs')
image_collection = db.get_collection('images')
review_collection = db.get_collection('reviews')
notification_collection = db.get_collection('notifications')
certificate_collection = db.get_collection('certificates')


# --------------------------
# ----- Authorization ------
# --------------------------
@app.route('/v2/register', methods=['POST'])
def v2_register():
    data = request.get_json()
    response = register_user(data, user_collection, app)
    return response

@app.route('/v2/login', methods=['POST'])
def v2_login():
    data = request.get_json()
    response = login_user(data, user_collection, app)
    return response

@app.route('/v3/change_password', methods=['POST'])
def v3_change_password():
    data = request.get_json()
    user_id = request.args.get('user_id')    
    response = change_password(data, user_collection, app, user_id)
    return response

# ------------------
# ---- PROFILE -----
# ------------------
@app.route('/v2/edit_profile', methods=['PUT'])
def edit_profile_v2():
    data = request.get_json()
    token = request.headers.get('Authorization').split()[1]
    response = user_edit_profile(data, user_collection, token, app)
    return response

@app.route('/upload_cv', methods=['POST'])
def upload_cv():
    file = request.files
    token = request.headers.get('Authorization').split()[1]
    response = upload_cv_in_profile(user_collection, file, token, app, cv_collection)
    return response

@app.route('/upload_profile_photo', methods=['POST'])
def upload_professional_photo():
    file = request.files
    token = request.headers.get('Authorization').split()[1]
    response = upload_profile_photo(user_collection, file, token, app, image_collection)
    return response

@app.route('/list_skills', methods=['GET'])
def list_skills():
    user_id = request.args.get('user_id')
    response = list_skill(user_collection, user_id)
    return response
    
@app.route('/add_skill', methods=['POST'])
def add_skill():
    data = request.get_json()
    response = add_skills(data, user_collection)
    return response
  
@app.route('/add_company_bio', methods=['POST'])
def add_company_bio():
    data = request.get_json()
    response = add_company_bio_in_profile(data, user_collection)
    return response

@app.route('/boost_profile', methods=['POST'])
def boost_profile():
    token = request.headers.get('Authorization').split()[1]
    response = user_boost_profile(token, user_collection, app)
    return response

    
# ------------------------------------------ 
# ----- PROJECT (FOR COMPANY USER) ---------
# ------------------------------------------
@app.route('/create_project', methods=['POST'])
def create_project():
    token = request.headers.get('Authorization').split()[1]
    data = request.get_json()
    response = company_create_project(data, token, user_collection, project_collection, app)
    return response

@app.route('/edit_project_detail', methods=['PUT']) 
def edit_project_detail():
    data = request.get_json()
    token = request.headers.get('Authorization').split()[1]
    response = company_edit_project_detail(data,project_collection, certificate_collection,token, app)  
    return response

@app.route('/delete_project', methods=['DELETE']) 
def delete_project():
    token = request.headers.get('Authorization').split()[1]
    project_id = request.args.get('project_id')
    response = company_delete_project(token, project_id, user_collection, project_collection, app)
    return response

@app.route('/applied_user_list', methods=['GET']) 
def applied_user_list():
    token = request.headers.get('Authorization').split()[1]
    project_id = request.args.get('project_id')
    response = company_project_applied_user_list(token, project_id, user_collection, project_collection, app)
    return response

@app.route('/view_project_application', methods=['GET']) 
def view_project_application():
    applied_user_id = request.args.get('applied_user_id')
    project_id = request.args.get('project_id')
    response = user_view_project_application(project_collection, app, project_id, applied_user_id)
    return response

@app.route('/approve_user', methods=['POST']) 
def approve_user():
    token = request.headers.get('Authorization').split()[1]
    data = request.get_json()
    project_id = data.get('project_id')
    approve_uid = data.get('approve_uid')
    response = company_approve_user(user_collection, project_collection, project_id, approve_uid, token, app, notification_collection)
    return response

@app.route('/reject_user', methods=['DELETE']) 
def reject_user():
    token = request.headers.get('Authorization').split()[1]
    project_id = request.args.get('project_id')
    reject_id = request.args.get('reject_id')
    response = company_reject_user(project_collection, project_id, reject_id, token, app, notification_collection, user_collection)
    return response

@app.route('/edit_approved_user_list', methods=['PUT']) 
def edit_approve_user_list():
    token = request.headers.get('Authorization').split()[1]
    project_id = request.args.get('project_id')
    user_id = request.args.get('user_id')
    response = company_edit_approved_user(token, app, project_collection, project_id, user_collection, user_id)
    return response

@app.route('/boost_project', methods=['PUT']) 
def boost_project():
    token = request.headers.get('Authorization').split()[1]
    project_id = request.args.get('project_id')
    response = user_boost_project(token, project_collection, user_collection, app, project_id)
    return response


# ----------------------------------------------------------
# ----- PROJECT (COMPANY USER & PROFESSIONAL USER) ---------
# ----------------------------------------------------------
@app.route('/view_project_detail', methods=['GET']) 
def view_project_detail():
    token = request.headers.get('Authorization').split()[1]
    project_id = request.args.get('project_id')
    response = user_view_project_detail(project_collection, project_id, app, token, user_collection)
    return response

@app.route('/view_my_projectlist', methods=['GET']) 
def view_my_projectlist():
    bearer = request.headers.get('Authorization')
    query = request.args.get('query')
    project_type = request.args.getlist('project_type')
    project_category = request.args.getlist('project_category')
    project_location = request.args.getlist('project_location')
    project_status = request.args.getlist('project_status')
    sortby = request.args.get('sortby')
    response = user_view_my_project_list(bearer, user_collection, project_collection, app, query, project_type, project_category, project_location, project_status, sortby)
    return response

@app.route('/view_profile_projectlist', methods=['GET']) 
def view_profile_projectlist():
    user_id = request.args.get('user_id')
    query = request.args.get('query')
    project_type = request.args.getlist('project_type')
    project_category = request.args.getlist('project_category')
    project_location = request.args.getlist('project_location')
    project_status = request.args.getlist('project_status')
    sortby = request.args.get('sortby')
    response = user_view_profile_project_list(user_id, user_collection, project_collection, app, query, project_type, project_category, project_location, project_status, sortby)
    return response

@app.route('/view_all_project_user', methods=['GET']) 
def view_all_project_user():
    project_id = request.args.get('project_id')
    response = user_view_all_project_user(project_id, project_collection)
    return response

@app.route('/view_user_application', methods=['GET']) 
def view_user_application():
    project_id = request.args.get('project_id')
    applied_user_id = request.args.get('user_id')
    response = user_view_project_application( project_collection, app, project_id, applied_user_id)
    return response

@app.route('/browse_all_projects', methods=['GET'])
def browse_projects():
    query = request.args.get('query')
    project_type = request.args.getlist('project_type')
    project_category = request.args.getlist('project_category')
    project_location = request.args.getlist('project_location')
    project_status = request.args.getlist('project_status')
    sortby = request.args.get('sortby')
    response = user_browse_all_projects(project_collection, query, project_type, project_category, project_location, project_status, sortby)
    return response

# ----------------------------------------------- 
# ----- PROJECT (FOR PROFESSIONAL USER) ---------
# -----------------------------------------------
@app.route('/apply_project', methods=['POST'])
def apply_project():
    token = request.headers.get('Authorization').split()[1]
    data = request.get_json()
    response = professional_apply_project(data, user_collection, project_collection, token, app)
    return response

@app.route('/v1/mycertificate', methods=['GET'])
def get_my_certificate():
    token = request.headers.get('Authorization').split()[1]
    response = professional_user_certificate(token, certificate_collection, app)
    return response


@app.route('/v1/myapplication', methods=['GET'])
def get_my_application():
    token = request.headers.get('Authorization').split()[1]
    response = professional_user_view_project_applications(token, project_collection, app)
    return response


# -----------------------
# ------- REVIEW --------
# -----------------------
@app.route('/create_review', methods=['POST'])
def create_review():
    token = request.headers.get('Authorization').split()[1]
    data = request.get_json()
    response = user_create_review(token, data, review_collection, app, user_collection, project_collection)
    return response

@app.route('/list_review', methods=['GET'])
def list_review():
    token = request.headers.get('Authorization').split()[1]
    response = list_user_reviews(token, user_collection, app, review_collection)
    return response

@app.route('/v2/list_review', methods=['GET'])
def v2_list_review():
    user_id = request.args.get('user_id')
    response = v2_list_user_reviews(user_id, user_collection, review_collection)
    return response

@app.route('/view_review_detail', methods=['GET']) 
def view_review_detail():
    user_id = request.args.get('user_id')
    review_id = request.args.get('review_id')
    response = user_view_review_detail(review_collection, review_id)
    return response


# ----------------------------
# ------- NOTIFICATION --------
# -----------------------------
@app.route('/list_notification', methods=['GET'])
def list_notification():
    token = request.headers.get('Authorization').split()[1]
    response = list_all_notifications(token, user_collection, app, notification_collection)
    return response

@app.route('/delete_notification', methods=['DELETE']) 
def delete_notification():
    token = request.headers.get('Authorization').split()[1]
    notification_id = request.args.get('notification_id')
    response = user_delete_notification(token, notification_id, user_collection, notification_collection, app)
    return response

@app.route('/edit_notification', methods=['PUT']) 
def edit_notification():
    token = request.headers.get('Authorization').split()[1]
    notification_id = request.args.get('notification_id')
    response = edit_notification_status(token, user_collection, app, notification_collection, notification_id)
    return response


# -----------------------
# ----- ADMIN USER ------
# -----------------------
@app.route('/v2/view_user', methods=['GET'])
def view_all_users_v2():
    bearer = request.headers.get('Authorization')
    response = admin_view_all_users(bearer, user_collection, app)
    return response
    
@app.route('/v3/delete_account', methods=['DELETE'])
def delete_account_v3():
    token = request.headers.get('Authorization').split()[1]
    delete_id = request.args.get('uid')      
    response = admin_delete_account(token, delete_id, user_collection, app)
    return response

@app.route('/v1/admin/project', methods=['GET'])
def admin_project_v1():
    token = request.headers.get('Authorization').split()[1]
    response = admin_view_project_list(token, project_collection, user_collection, app)
    return response

@app.route('/v1/admin/statistics', methods=['GET'])
def admin_statistics_v1():
    token = request.headers.get('Authorization').split()[1]
    response = admin_view_statistics(token, user_collection, project_collection, review_collection, app)
    return response

@app.route('/userdetail', methods=['GET'])
def get_user_by_id():
    user_id = request.args.get('user_id')      
    response = get_user_detail(user_id, user_collection, cv_collection, image_collection)
    return response

@app.route('/professionals/all', methods=['GET'])
def get_professionals():
    query = request.args.get('query')
    skills = request.args.get('skills')
    location = request.args.getlist('location')
    rating = request.args.getlist('rating')
    sort_by = request.args.get('sort_by')
    response = all_professional(user_collection, query, skills, location, rating, sort_by)
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)