import requests

if __name__ == "__main__":
    url = "http://localhost:8000/api/signup/"
    data = {
        "username": "bohdan",
        "password": "bohdan",
        "first_name": "bohdan",
        "last_name": "prokhorov",
        "age": 19,
        "mail": "bohdan@example.com",
        "phone_number": "0986652260",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "rating": 5,
    }

    # Ensure the path to your image is correct
    files = {
        "image": (
            "bgp052umgxs71.png", open("C:\\Users\\howch\\OneDrive\\Desktop\\bgp052umgxs71.png", "rb"), "image/png")
    }

    response = requests.post(url, data=data, files=files)

    print(response.status_code)
    print(response.text)
