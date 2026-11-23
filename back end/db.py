from sqlalchemy import (create_engine, Column, Integer, String, ForeignKey, Numeric
, VARCHAR, CheckConstraint, DATE, CHAR)
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import relationship, backref, sessionmaker,declarative_base
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv


load_dotenv()
DB_URL = os.environ.get("DB_URL")

engine = create_engine(
     DB_URL,
    echo=True
)
Base = declarative_base()
class User(UserMixin,Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String,unique=True, nullable=False)
    password = Column(String, nullable=False)
    age = Column(Integer)
    height = Column(Numeric)
    weight = Column(Numeric)
    calorie_goal = Column(Integer)
    protein = Column(Integer)
    fat = Column(Integer)
    carb = Column(Integer)
    days_goal = Column(Integer)
    weight_goal = Column(Integer)
    goal_start_date = Column(DATE)
    target_date = Column(DATE)


class Food(Base):
    __tablename__ = 'foods'
    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(100), nullable=False)
    calories_per_100g = Column(Integer, nullable=False)
    image_url = Column(VARCHAR)
    protein = Column(Integer)
    fat = Column(Integer)
    carb = Column(Integer)
    unit = Column(CHAR(20))
    quantity = Column(Integer)
    user_id = Column(Integer, ForeignKey('users.id'))

    __table_args__ = (
        CheckConstraint(
            "calories_per_100g >= 0",
            name="check_calories_positive"
        ),
    )

class Meal(Base):
    __tablename__ = 'meals'
    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(100), nullable=False)
    calories = Column(Integer, nullable=False)
    type = Column(VARCHAR(100), nullable=False)
    log_date = Column(DATE, nullable=False)
    image_url = Column(VARCHAR)
    protein = Column(Integer)
    fat = Column(Integer)
    carb = Column(Integer)
    unit = Column(CHAR(20))
    quantity = Column(Integer)
    user_id = Column(Integer, ForeignKey('users.id'))
    __table_args__ = (
        CheckConstraint(
            "type IN ('breakfast', 'lunch', 'dinner')",
            name="check_meal_type"
        ),

    )

# Base.metadata.create_all(engine)

session = sessionmaker(bind=engine)
session = session()