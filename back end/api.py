import os
from itertools import product

from dotenv import load_dotenv
import requests
import json

food_images = {
    "American Indian/Alaska Native Foods": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS62MWQNQBdd9VSDHuitYzEpKXqBHQLPt07WAP-Nt_jLA&s=10",
    "Baby Foods": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXWm_bufDl8wjogLL0bW6K5gcSTk67DZZ7byWOXCMYqQ&s=10",
    "Baked Products": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeQR9GU13Kqf9p-Vi9y6efareQPDpL_iHeeTgcV24W-g&s=10",
    "Beef Products": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJizd9oBWex24eiulJkfNeEwzyyAYpZR0TFQIlFETarg&s=10",
    "Beverages": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA-uGYXbaiqEnj6I_vd7zhZvkT3unnPSAPTLRpoIKakg&s=10",
    "Breakfast Cereals": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFJ21TT2CHtO9bBy581DhAGo867bPsHEg9UoyD_gecDg&s=10",
    "Cereal Grains and Pasta": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAYxY63JVDx0-VrKxqV6eCuELJ1xx-7I-_8xnCMjCS6A&s=10",
    "Dairy and Egg Products": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpJIGZaWTAVIemlFQySarOPZt78MEVTYW2IfHmpK5fTg&s=10",
    "Fast Foods": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKB6sm0PA14mSh8CpRX-OFtavNlyE0qJUToBp4hDP0sA&s=10",
    "Fats and Oils": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAk2a8zNoZVvRW8vuMLF_5cUxQtzXU3h2OTOM-n6tOQ&s=10",
    "Finfish and Shellfish Products": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1dbxztIK63pvFAaog7g2VRIZiq_1bDJIBpzKJPIQ-BQ&s=10",
    "Fruits and Fruit Juices": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnUW72KD_IFn6-lHtxJ53n26dqrDHfibKhgQDPRKARzQ&s=10",
    "Lamb, Veal, and Game Products": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm5JFqJqKxPGUtMNJ9YZiT3of2JOVTDS2419aiKvJBhw&s=10",
    "Legumes and Legume Products": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwP-PQb-e_doMcaDAOAa1D6Y89JSkxMRZe_hSBqoz45g&s=10",
    "Meals, Entrees, and Side Dishes": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHv9VwoQLzyooOz2criiGcBBwUBOqeWDlt5qJz-XmluA&s=10",
    "Nut and Seed Products": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiS05oRnpNSxf1cccCifcVScyVxdbOKUbUlYPn7SGZoA&s=10",
    "Pork Products": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIVwVQ8fPD1IcT7ceDAZr0vTw12JT1mskNNo-al-OHfA&s=10",
    "Poultry Products": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAk7o66Y1-lhXI_utK8AYxls2MgAW28VDir1ysrjDCHg&s=10",
    "Restaurant Foods": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr74LqLsu9A7fngxAqfqEODrRzr6mvYOzmcmmZFSzWiA&s=10",
    "Sausages and Luncheon Meats": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMnkH7Scqz1LIW7GKipL4LQpNWwSohcg56dkG7R41ilQ&s=10",
    "Snacks": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyrasIfp8uQYOlN1WY5Dp4KMmZHeHeNmDV2yhucb9zmQ&s=10",
    "Soups, Sauces, and Gravies": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7qd0CQmmux0gOXU_76JNm4vWfhMX3A0MsW_I1ZPOWEA&s=10",
    "Spices and Herbs": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw7unziet29jWrJilV7e42a6SbTQNpFHHbZglny4VDJQ&s=10",
    "Sweets": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaHkMfkNDQlrZeTUam33fOUoCFoeFLu4ELdjGt7ZkCMQ&s=10",
    "Vegetables and Vegetable Products": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3XIVo4FVF6C0vdrpw2wU7PVhIObxy9jUKwnS7qHexyg&s=10"
}




load_dotenv()

api_key = os.getenv("USDA_API_KEY")

header = {"X-API-Key": api_key}
header2 = {"User-Agent": "NutritionTracker/1.0 (contact: wassimetestmail@gmail.com)"}
header3 = {"api_key": api_key}





def search_food(name, page=1):
    params = {"search_terms": name, "search_simple": 1, "action": "process", "json": 1, "page_size": 100,
              "fields": "code,product_name,nutriments,image_url", "page": page, "lc": "en"}
    response = requests.get(
        f"https://world.openfoodfacts.org/cgi/search.pl",
        headers=header2, params=params)
    response.raise_for_status()
    data = response.json()
    products = data["products"]

    url = response.url
    results = [
        {
            "total_pages": data["page_count"],
            "current_page": data["page"],

            "results": [

                {
                    "id": product["code"],
                    "image": product["image_url"],
                    "name": product["product_name"],
                    "calorie": product["nutriments"]["energy-kcal_100g"],
                    "fat": product.get("nutriments").get("fat_100g", 0),
                    "protein": product.get("nutriments").get("proteins_100g", 0),
                    "carb": product.get("nutriments").get("carbohydrates_100g", 0),
                    "quantity": 100,
                    "unit": "g",
                    "api": True
                }
                for product in products
                if product.get("nutriments", {}).get("energy-kcal_100g") is not None
                   and product.get("image_url") and product.get("product_name")
            ]
        }
    ]

    return results


def search_normal_food(name="", page=1):
    params = {
        "query": name,
        "api_key": api_key,
        "dataType": ["Foundation", "SR Legacy"],
        "pageSize": 20,
        "pageNumber": page
    }

    response = requests.get(
        "https://api.nal.usda.gov/fdc/v1/foods/search",
        params=params
    )

    response.raise_for_status()
    data = response.json()

    results = []

    for product in data["foods"]:

        nutrients = {
            item["nutrientNumber"]: item.get("value", 0)
            for item in product.get("foodNutrients", [])
        }

        calories = nutrients.get("208")

        if calories is None:
            continue

        results.append({
            "id": product["fdcId"],
            "image": food_images.get(product.get("foodCategory")),
            "name": product["description"],
            "category": product["foodCategory"],
            "calorie": calories,
            "fat": nutrients.get("204", 0),
            "protein": nutrients.get("203", 0),
            "carb": nutrients.get("205", 0),
            "quantity": 100,
            "unit": "g",
            "api": True
        })

    return [{
        "total_pages": data["totalPages"],
        "current_page": data["currentPage"],
        "results": results
    }]


# print(search_food("fanta"))

# print(search_normal_food("chicken"))
