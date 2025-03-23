from helpers import make_return_message


def all_professional(user_collection, query=None, skills=None, location=None, rating=None, sort_by=-1):
    """
    Get a list of all professionals.

    Args:
    - user_collection (pymongo.collection.Collection): MongoDB collection for user data.
    - query (str, optional): Search query to filter professionals based on name or skills.
    - skills (list, optional): List of skills to filter professionals by.
    - location (str, optional): Location to filter professionals by.
    - rating (float, optional): Minimum rating to filter professionals by.

    Returns:
    - JSON response and HTTP status code.
    """

    try:
        if query:
            professional_list = list(user_collection.aggregate([
            {
                "$search": {
                    "index": "default",
                    "text": {
                        "query": query,
                        "path": {
                            "wildcard": "*"
                        }
                    }
                }
            },{
                '$match': {
                    'role': '30',
                }
            },
            {
                '$project': {
                    'email': 1,
                    'location': 1,
                    'profile_image': 1,
                    '_id': 1,
                    'entityname': 1,
                    'rating': 1,
                    'skills': 1,
                    'bio': 1,
                    'boosted': 1,
                }
            },
        ]))
        else:
            professional_list = list(user_collection.aggregate([
                {
                '$match': {
                    'role': '30',
                }
            },
            {
                '$project': {
                    'email': 1,
                    'location': 1,
                    'profile_image': 1,
                    '_id': 1,
                    'entityname': 1,
                    'rating': 1,
                    'skills': 1,
                    'bio': 1,
                    'boosted': 1,
                }
            }
            ]))

            
        if skills:
            professional_list = [p for p in professional_list if skills.lower() in [skill.lower() for skill in p.get('skills', [])]]

        if location:
            professional_list = [p for p in professional_list if any(loc.lower() in p.get('location', '').split(',')[0].lower() for loc in location)]

        if rating:
            professional_list_filtered = []
            for r in rating:
                professional_list_filtered += [p for p in professional_list if float(p.get('rating', '0.0') or 0.0) >= float(r) and float(p.get('rating', '0.0') or 0.0) < float(r) + 1]

            professional_list = professional_list_filtered

        if sort_by == "Highest Rated":
            sort_by = -1
        elif sort_by == "Lowest Rated":
            sort_by = 1
        else:
            sort_by = -1 # default to Oldest

        boosted_professionals = sorted([p for p in professional_list if p.get('boosted', False)], key=lambda p: (-float(p.get('rating', '0.0') or 0.0), p.get('_id')), reverse=sort_by == 1)
        non_boosted_professionals = sorted([p for p in professional_list if not p.get('boosted', False)], key=lambda p: (-float(p.get('rating', '0.0') or 0.0), p.get('_id')),reverse=sort_by ==1)

        professional_list = boosted_professionals + non_boosted_professionals
    
        return make_return_message(
            status='success',
            message='Professional list',
            code=200,
            data=professional_list,
        )
    except Exception as e:
        print(str(e))
        return make_return_message(
            status='error',
            message=str(e),
            code=500,
            data={},
        )
