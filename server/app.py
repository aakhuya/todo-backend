import os
from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_migrate import Migrate
from flask_cors import CORS
from models import db, Tasks, Users, Category, UserTasks
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
CORS(app)

CORS(app, resources={r"/*": {"origins": "*"}})

api = Api(app)
migrate = Migrate(app, db)

class User(Resource):
    def get(self, user_id=None):
        if user_id:
            user = Users.query.get(user_id)
            if user:
                return make_response(user.to_dict(), 200)
            return {'message': 'User not found'}, 404
        users = Users.query.all()
        return make_response([user.to_dict() for user in users], 200)

    def post(self):
        data = request.get_json()

        existing_user = Users.query.filter_by(username=data['username']).first()
        if existing_user:
            return {'message': f"Username '{data['username']}' is already taken."}, 400

        existing_email = Users.query.filter_by(email=data['email']).first()
        if existing_email:
            return {'message': f"Email '{data['email']}' is already in use."}, 400
        
        new_user = Users(
            username=data['username'],
            email=data['email']
        )
        db.session.add(new_user)
        db.session.commit()
        return make_response(new_user.to_dict(), 201)


    def patch(self, user_id):
        user = Users.query.get(user_id)
        if user:
            data = request.get_json()
            if 'username' in data:
                user.username = data['username']
            if 'email' in data:
                user.email = data['email']
            db.session.commit()
            return make_response(user.to_dict(), 200)
        return {'message': 'User not found'}, 404

    def delete(self, user_id):
        user = Users.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return {'message': 'User deleted'}, 200
        return {'message': 'User not found'}, 404
class Task(Resource):
    def get(self, task_id=None):
        if task_id:
            task = Tasks.query.get(task_id)
            if task:
                return make_response(task.to_dict(), 200)
            return {'message': 'Task not found'}, 404
        
        tasks = Tasks.query.all()
        return make_response([task.to_dict() for task in tasks], 200) 


    def post(self):
        data = request.get_json()

        new_task = Tasks(
            title=data['title'],
            description=data.get('description', ''), 
            status=data.get('status', 'pending')
        )
        db.session.add(new_task)
        db.session.commit()
        return make_response(new_task.to_dict(), 201)

    def patch(self, task_id):
        task = Tasks.query.get(task_id)
        if task:
            data = request.get_json()
            if 'title' in data:
                task.title = data['title']
            if 'description' in data:
                task.description = data['description']
            if 'status' in data:
                task.status = data['status']
            db.session.commit()
            return make_response(task.to_dict(), 200)
        return {'message': 'Task not found'}, 404

    def delete(self, task_id):
        task = Tasks.query.get(task_id)
        if task:
            db.session.delete(task)
            db.session.commit()
            return {'message': 'Task deleted'}, 200
        return {'message': 'Task not found'}, 404

class CategoryResource(Resource):
    def get(self, category_id=None):
        if category_id:
            category = Category.query.get(category_id)
            if category:
                return make_response(category.to_dict(rules=('-tasks.category',)), 200)
            return {'message': 'Category not found'}, 404
        
        categories = Category.query.all()
        return make_response(
            [category.to_dict(rules=('-tasks.category',)) for category in categories], 
            200
        )

    def post(self):
        data = request.get_json()

        existing_category = Category.query.filter_by(name=data['name']).first()
        if existing_category:
            return {'message': 'Category already exists'}, 400

        new_category = Category(name=data['name'])
        db.session.add(new_category)
        db.session.commit()
        return make_response(new_category.to_dict(), 201)

    def patch(self, category_id):
        category = Category.query.get(category_id)
        if category:
            data = request.get_json()
            if 'name' in data:
                category.name = data['name']
            db.session.commit()
            return make_response(category.to_dict(), 200)
        return {'message': 'Category not found'}, 404

    def delete(self, category_id):
        category = Category.query.get(category_id)
        if category:
            if category.tasks:
                return {'message': 'Cannot delete category with tasks'}, 400

            db.session.delete(category)
            db.session.commit()
            return {'message': 'Category deleted successfully'}, 200
        return {'message': 'Category not found'}, 404


class UserTaskResource(Resource):

    def get(self, user_task_id=None):
        """ Fetch a single UserTask or all assigned tasks """
        if user_task_id:
            user_task = UserTasks.query.get(user_task_id)
            if user_task:
                return make_response(user_task.to_dict(), 200)
            return {'message': 'UserTask not found'}, 404

        user_tasks = UserTasks.query.all()
        return make_response([user_task.to_dict() for user_task in user_tasks], 200)

    def post(self):
        """ Assign a task to a user """
        data = request.get_json()
        new_user_task = UserTasks(
            user_id=data['user_id'],
            task_id=data['task_id']
        )
        db.session.add(new_user_task)
        db.session.commit()
        return make_response(new_user_task.to_dict(), 201)

    def patch(self, user_task_id):
        """ Update the assigned task (reassign a task to a different user) """
        user_task = UserTasks.query.get(user_task_id)
        if not user_task:
            return {'message': 'UserTask not found'}, 404

        data = request.get_json()

        if 'user_id' in data:
            user_task.user_id = data['user_id']
        if 'task_id' in data:
            user_task.task_id = data['task_id']

        db.session.commit()
        return make_response(user_task.to_dict(), 200)

    def delete(self, user_task_id):
        """ Remove a task assignment """
        user_task = UserTasks.query.get(user_task_id)
        if user_task:
            db.session.delete(user_task)
            db.session.commit()
            return {'message': 'UserTask deleted'}, 200  
        return {'message': 'UserTask not found'}, 404  


api.add_resource(Task, '/tasks', '/tasks/<int:task_id>')
api.add_resource(User, '/users', '/users/<int:user_id>')
api.add_resource(CategoryResource, '/categories', '/categories/<int:category_id>')
api.add_resource(UserTaskResource, '/user_tasks', '/user_tasks/<int:user_task_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
