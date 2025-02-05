from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

class Users(db.Model, SerializerMixin):  
    __tablename__ = "Users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)

    tasks_association = db.relationship("UserTasks", backref="user_obj", lazy='select', 
                                        primaryjoin="Users.id == UserTasks.user_id")

    # Add this to avoid recursion during serialization
    serialize_rules = ('-tasks_association.user_obj', '-user_tasks.user', '-user_tasks.task')

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "tasks": [task.to_dict() for task in self.tasks_association]
        }


class Category(db.Model, SerializerMixin):
    __tablename__ = "Category"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)

    tasks = db.relationship("Tasks", lazy='select')  # Change to 'select' to avoid eager loading recursion

    serialize_rules = ('-tasks.category',)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "tasks": [task.to_dict() for task in self.tasks]
        }


class Tasks(db.Model, SerializerMixin):
    __tablename__ = "Tasks"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    status = db.Column(db.String(50), nullable=False)

    category_id = db.Column(db.Integer, db.ForeignKey('Category.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'))

    category = db.relationship("Category", backref="category_tasks", lazy=True)
    user = db.relationship("Users", backref="tasks")

    serialize_rules = ('-category.category_tasks', '-user.tasks', '-user_tasks.user', '-user_tasks.task')

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "category": self.category.name if self.category else None,
            "user": self.user.username if self.user else "Unassigned"
        }

class UserTasks(db.Model, SerializerMixin):
    __tablename__ = "UserTasks"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('Tasks.id'), nullable=False)

    user = db.relationship("Users", backref="user_tasks", lazy='select')
    task = db.relationship("Tasks", backref="task_users", lazy='select')

    serialize_rules = ('-user.user_tasks', '-task.task_users')

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "task_id": self.task_id,
            "user": self.user.username if self.user else "No User",
            "task": self.task.title if self.task else "No Task"
        }
def __repr__(self):
    return f"<Task id={self.id}, title={self.title}, user_id={self.user_id}>"