import pytesseract
from PIL import Image

image_path = r"C:\Users\Mohammed Maaz\Pictures\Screenshots\picture1.png"
text = pytesseract.image_to_string(Image.open(image_path))
print(text)
