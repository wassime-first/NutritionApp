
from flask import Flask, request, jsonify
from flask_bootstrap import Bootstrap
from db import session, User, Food, Meal
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date,timedelta
from api import search_food, search_normal_food
import os
from dotenv import load_dotenv
from flask_cors import CORS


load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')

app = Flask(__name__)
Bootstrap(app)
app.config.update(
    SESSION_COOKIE_SAMESITE='None',
    SESSION_COOKIE_SECURE=True,
    SECRET_KEY=SECRET_KEY,
    REMEMBER_COOKIE_SAMESITE='None',
    REMEMBER_COOKIE_SECURE=True
)

CORS(app, origins=[
    "http://localhost:5173",
    "https://nutritionapp-kce9.onrender.com"
], supports_credentials=True)


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    return session.get(User, int(user_id))


@app.route('/api/user')
def get_user():
    if current_user.is_authenticated:
        print("yes")
        current_date = date.today()
        days = (current_date - current_user.goal_start_date).days
        return {
            "name": current_user.name,
            "id": current_user.id,
            "email": current_user.email,
            "calorie_goal": current_user.calorie_goal,
            "age": current_user.age,
            "height": current_user.height,
            "weight": current_user.weight,
            "protein": current_user.protein,
            "carb": current_user.carb,
            "fat": current_user.fat,
            "weight_goal": current_user.weight_goal,
            "days_goal": current_user.days_goal,
            "days_passed": days,
            "goal_start_date": current_user.goal_start_date.isoformat(),
            "target_date": current_user.target_date.isoformat(),
            "logged_in": True,
        }
    print("no")
    return {
        "logged_in": False,
    }


@login_required
@app.route('/api/user_data', methods=['POST'])
def user_data():
    age = request.json.get('age')
    height = request.json.get('height')
    weight = request.json.get('weight')
    activity = request.json.get('activity')
    weight_goal = request.json.get('weight_goal')
    days_goal = request.json.get('days_goal')
    goal_start_date = request.json.get('date')
    try:
        goal_start_date = date.fromisoformat(goal_start_date)
        target_date = goal_start_date + timedelta(days=int(days_goal))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid date"}), 400


    daily_deficit = int(((int(weight)-int(weight_goal))*7700)/int(days_goal))


    if daily_deficit<0:

        calorie_goal = int(int(10 * int(weight) + 6.25 * int(height) - 5 * int(age) + 5)*float(activity))+abs(daily_deficit)

    else:
        calorie_goal = int(int(10 * int(weight) + 6.25 * int(height) - 5 * int(age) + 5)*float(activity))-daily_deficit

    protein = int(weight) * 1.5
    protein_calories = protein * 4
    fat_calories = int(calorie_goal) * 0.25
    daily_fat = fat_calories / 9
    carb_calorie = calorie_goal - (fat_calories + protein_calories)
    carb = carb_calorie / 4

    try:

        current_user.age = age
        current_user.height = height
        current_user.weight = weight
        current_user.calorie_goal = int(calorie_goal)
        current_user.protein = int(protein)
        current_user.fat = int(daily_fat)
        current_user.carb = int(carb)
        current_user.weight_goal = int(weight_goal)
        current_user.days_goal = int(days_goal)
        current_user.goal_start_date = goal_start_date
        current_user.target_date = target_date
        session.commit()
        return {"goal": calorie_goal}
    except:
        return {"error": "Something went wrong"}


@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('name')
    password = request.json.get('password')
    email = request.json.get('email')
    user_in = session.query(User).filter(User.email == email).first()
    if user_in:
        if check_password_hash(user_in.password, password):
            login_user(user_in, remember=True)
            current_date = date.today()
            days = (current_date - current_user.goal_start_date).days
            return {
                "name": current_user.name,
                "id": current_user.id,
                "email": current_user.email,
                "calorie_goal": current_user.calorie_goal,
                "protein": current_user.protein,
                "carb": current_user.carb,
                "fat": current_user.fat,
                "weight_goal": current_user.weight_goal,
                "days_goal": current_user.days_goal,
                "days_passed": days,
                "goal_start_date": current_user.goal_start_date.isoformat(),
                "target_date": current_user.target_date.isoformat(),
            }
    else:
        new_user = User(name=username, email=email, password=generate_password_hash(password, salt_length=10))
        session.add(new_user)
        session.commit()
        login_user(new_user, remember=True)
        return {
            "name": current_user.name,
            "id": current_user.id,
            "email": current_user.email,
        }
    return {
        'logged_in': current_user.is_authenticated,
    }


@app.route('/api/food', methods=["GET"])
def food():
    all_food = session.query(Food).filter_by(user_id=current_user.id).all()
    foods = [
        {"id": f.id,
         "name": f.name,
         "calorie": f.calories_per_100g,
         "image": f.image_url,
         "fat":f.fat,
         "carb":f.carb,
         "protein":f.protein,
         "unit":f.unit,
         "quantity":f.quantity
         }
        for f in all_food
    ]
    return jsonify(foods)


@app.route('/api/meals', methods=['POST', "GET"])
def meals():
    current_date = request.args.get('date')
    try:
        current_date = date.fromisoformat(current_date)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid date"}), 400

    all_meals = session.query(Meal).filter_by(user_id=current_user.id, log_date=current_date).all()
    meals = [
        {
            "id": meal.id,
            "name": meal.name,
            "calories": meal.calories,
            "type": meal.type,
            "image": meal.image_url,
            "protein": meal.protein,
            "carb": meal.carb,
            "fat": meal.fat,
            "quantity": meal.quantity,
            "unit": meal.unit,
            "date": meal.log_date.isoformat() if meal.log_date else None
        }
        for meal in all_meals
    ]

    return jsonify(meals)


@app.route('/api/add-meal', methods=["POST"])
def add_meal():
    data = request.json
    type = data.get('type')
    name = data.get('name')
    image = data.get('image_url')
    calories = data.get('calories')
    fat = data.get("fat")
    protein = data.get('protein')
    carb = data.get('carb')
    date = data.get('date')
    quantity = data.get('quantity')
    unit = data.get('unit')

    new_meal = Meal(type=type,
                    name=name,
                    calories=calories,
                    log_date=date,
                    user_id=current_user.id,
                    image_url=image,
                    fat=int(fat),
                    protein=int(protein),
                    carb=int(carb),
                    quantity=int(quantity),
                    unit=unit
                    )
    session.add(new_meal)
    session.commit()
    return jsonify({"success": True}), 200


@app.route('/api/delete-meal', methods=["POST"])
def delete_meal():
    data = request.json
    meals = data.get('meals')
    id = data.get('id')
    print(meals)
    print(id)
    session.query(Meal).filter_by(id=id, user_id=current_user.id).delete()
    session.commit()
    submmited_meals = [
        {
            "id": meal["id"],
            "name": meal["name"],
            "calories": meal["calories"],
            "type": meal["type"],
            "date": meal["date"]
        }
        for meal in meals if meal["id"] != id
    ]

    return jsonify(submmited_meals)


@app.route('/api/add-food', methods=["POST"])
def add_food():
    data = request.json
    print(data)
    name = data.get('name')
    image = data.get('image_url')
    calories_per_100g = int(data.get('calories_per_100g'))
    fat = data.get("fat")
    protein = data.get('protein')
    carb = data.get('carb')
    quantity = data.get('quantity')
    unit = data.get('unit')

    if image:
        new_food = Food(name=name, calories_per_100g=calories_per_100g, user_id=current_user.id, image_url=image,
                        fat=int(fat), protein=int(protein),
                        carb=int(carb),
                        quantity=int(quantity), unit=unit)
        session.add(new_food)
    else:
        new_food = Food(name=name, calories_per_100g=calories_per_100g, user_id=current_user.id, fat=int(fat),
                        protein=int(protein), carb=int(carb), quantity=int(quantity), unit=unit)
        session.add(new_food)
    session.commit()
    f = {
        "id": new_food.id,
        "image": new_food.image_url,
        "name": new_food.name,
        "fat": new_food.fat,
        "protein": new_food.protein,
        "carb": new_food.carb,
        "calorie": new_food.calories_per_100g,
        "quantity": new_food.quantity,
        "unit": new_food.unit
    }
    return jsonify(f), 200


@app.route('/api/search-food', methods=["GET"])
def search_foods():
    name = request.args.get('name')
    page = request.args.get('page')
    food_type = request.args.get('type')

    print(f'name: {name}, page: {page}, type: {food_type}')
    if food_type=="Basic":
        data = search_normal_food(name=name, page=page)
    else:
        data = search_food(name=name, page=page)

    return jsonify(data)


@app.route('/api/update-food', methods=["POST"])
def update_food():
    data = request.json
    id = data.get('id')
    name = data.get('name')
    calories_per_100g = data.get('calories_per_100g')
    image = data.get('image_url')
    fat = data.get("fat")
    protein = data.get('protein')
    carb = data.get('carb')
    quantity = data.get('quantity')
    unit = data.get('unit')

    food_to_update = session.query(Food).filter_by(id=id).first()
    food_to_update.name = name
    food_to_update.calories_per_100g = int(calories_per_100g)
    food_to_update.image_url = image
    food_to_update.fat = int(fat)
    food_to_update.carb = int(carb)
    food_to_update.protein = int(protein)
    food_to_update.quantity = int(quantity)
    food_to_update.unit = unit
    session.commit()
    f = {
        "id": food_to_update.id,
        "image": food_to_update.image_url,
        "name": food_to_update.name,
        "calorie": food_to_update.calories_per_100g,
        "quantity": food_to_update.quantity,
        "unit": food_to_update.unit,
        "fat": food_to_update.fat,
        "carb": food_to_update.carb,
        "protein": food_to_update.protein,
    }
    return jsonify(f), 200


@app.route('/api/delete-food', methods=["POST"])
def delete_food():
    data = request.json
    id = data.get('id')
    food_to_delete = session.query(Food).filter_by(id=int(id)).first()
    session.delete(food_to_delete)
    session.commit()
    return {"success": True}, 200


@app.route('/api/logout', methods=['GET'])
def logout():
    logout_user()
    return {
        'logged_in': current_user.is_authenticated,
    }


if __name__ == '__main__':
    app.run()
