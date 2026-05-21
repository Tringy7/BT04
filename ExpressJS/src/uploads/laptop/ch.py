import os
import re
from pathlib import Path

# =========================
# PATH ĐÚNG
# =========================

ROOT_DIR = Path(r"./UPLOADS/laptop")

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif"
}

# =========================
# SLUGIFY
# =========================

def slugify(text):

    text = text.lower()

    # space -> -
    text = re.sub(r"\s+", "-", text)

    # remove special chars
    text = re.sub(r"[^a-z0-9\-]", "", text)

    # remove duplicate -
    text = re.sub(r"-+", "-", text)

    return text.strip("-")


# =========================
# RENAME
# =========================

for file_path in ROOT_DIR.rglob("*"):

    if not file_path.is_file():
        continue

    ext = file_path.suffix.lower()

    if ext not in IMAGE_EXTENSIONS:
        continue

    old_name = file_path.stem

    new_name = slugify(old_name)

    new_file = file_path.with_name(f"{new_name}{ext}")

    # skip nếu giống
    if file_path == new_file:
        continue

    print(f"\nOLD: {file_path.name}")
    print(f"NEW: {new_file.name}")

    os.rename(file_path, new_file)

print("\n✅ DONE")