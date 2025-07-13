# test_upload.py
import requests

url = "https://nutriscan-ai-2.onrender.com/upload"
files = {
    "file": open(r"C:\Users\Mohammed Maaz\Pictures\Screenshots\picture1.png", "rb")
}
data = {
    "lang": "eng"
}

response = requests.post(url, files=files, data=data)
print(response.json())
