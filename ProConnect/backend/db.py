import certifi
from pymongo.mongo_client import MongoClient

uri = "mongodb+srv://proconnect:TfxyipfbG42m7oDL@proconnect.jynpsf3.mongodb.net/?retryWrites=true&w=majority"
ca = certifi.where()

# Create a new client and connect to the server
# client = MongoClient(uri, server_api=ServerApi('1'))
client = MongoClient(uri, tlsCAFile=ca)
db = client['uri']
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
