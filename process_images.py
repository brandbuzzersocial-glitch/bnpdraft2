import os
import shutil
import json

source_dir = r"C:\Users\korja\Downloads\drive-download-20260819T063726Z-1-001"
target_dir = r"c:\BNP RESOURCE 2\assets\images\portfolio"
output_json = r"c:\BNP RESOURCE 2\slider_images.json"

project_images = {}

if not os.path.exists(source_dir):
    print(f"Source directory {source_dir} not found.")
    exit(1)

for folder_name in os.listdir(source_dir):
    folder_path = os.path.join(source_dir, folder_name)
    if os.path.isdir(folder_path):
        # Create a safe folder name for the target
        safe_name = folder_name.lower().replace(",", "").replace(" ", "_").replace("__", "_")
        target_folder_path = os.path.join(target_dir, safe_name)
        
        os.makedirs(target_folder_path, exist_ok=True)
        
        images = []
        for file in os.listdir(folder_path):
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                src_file = os.path.join(folder_path, file)
                # Create a safe file name
                safe_file_name = file.replace(" ", "_").replace("(", "").replace(")", "")
                dst_file = os.path.join(target_folder_path, safe_file_name)
                
                shutil.copy2(src_file, dst_file)
                # Store relative path for HTML
                images.append(f"assets/images/portfolio/{safe_name}/{safe_file_name}")
        
        if images:
            project_images[folder_name] = {
                "safe_name": safe_name,
                "images": images
            }
            print(f"Processed {folder_name}: {len(images)} images")

with open(output_json, "w") as f:
    json.dump(project_images, f, indent=2)

print("Done generating images mapping.")
