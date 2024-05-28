from datetime import datetime

import requests

# Replace 'YOUR_API_KEY' with your actual Google API key

isbn = "9781473655324"
url = "https://www.googleapis.com/books/v1/volumes"

params = {
    "q": f"isbn:{isbn}"
}

response = requests.get(url, params=params)

if response.status_code == 200:
    data = response.json()

    if 'items' in data:
        book_info = data['items'][0]['volumeInfo']
        name = book_info.get('title', 'N/A')
        authors = ', '.join(book_info.get('authors', ['N/A']))
        publisher = book_info.get('pageCount', 'N/A')
        published_date = datetime.fromisoformat(book_info.get('publishedDate', 'N/A')).strftime('%Y')
        description = book_info.get('description', 'N/A')

        print(book_info)

        print(f"Title: {name}")
        print(f"Authors: {authors}")
        print(f"Publisher: {publisher}")
        print(f"Published Date: {published_date}")
        print(f"Description: {description}")
    else:
        print("No results found.")
else:
    print(f"Failed: {response.status_code} {response.text}")
