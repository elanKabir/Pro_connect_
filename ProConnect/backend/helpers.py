from bson import json_util
def make_return_message(message, status, data, code):
    return json_util.dumps({'message': message, 'status': status, 'data': data}), code