import os
import sys

try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'Pillow'])
    from PIL import Image

logo_path = r"c:\Users\Juhi Vishwakarma\Downloads\settleease-your-indian-relocation-buddy-main\public\logo.png"
fav_path = r"c:\Users\Juhi Vishwakarma\Downloads\settleease-your-indian-relocation-buddy-main\public\favicon.png"

img = Image.open(logo_path)
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Get the bounding box of non-transparent components
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

# Create a square image to fit the cropped version (no padding)
w, h = img.size
size = max(w, h)
new_img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
new_img.paste(img, ((size - w) // 2, (size - h) // 2))

new_img.save(fav_path, "PNG")
print("SUCCESS: Saved favicon.png")
