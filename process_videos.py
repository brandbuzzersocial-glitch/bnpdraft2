import os
import subprocess
import glob

downloads_dir = r"C:\Users\korja\Downloads"

files = glob.glob(os.path.join(downloads_dir, "*202607301434*.mp4"))

sketch_file = [f for f in files if "Hand_sketching" in f][0]
collab_file = [f for f in files if "Interior_design_team" in f][0]
panels_file = [f for f in files if "Workers_installing" in f][0]
luxury_file = [f for f in files if "Modern_luxury_living_room_1080p" in f][0]

ordered_inputs = [sketch_file, collab_file, panels_file, luxury_file]

print("Ordered input files:")
for idx, f in enumerate(ordered_inputs):
    print(f"  Input {idx}: {os.path.basename(f)}")

output_dir = r"c:\bnp resource\assets\images"
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "hero-banner.mp4")

# Remove existing output file if present
if os.path.exists(output_path):
    try:
        os.remove(output_path)
    except Exception as e:
        print("Warning removing old file:", e)

# Construct FFmpeg command
cmd = ["ffmpeg", "-y"]
for f in ordered_inputs:
    cmd.extend(["-i", f])

filter_complex = (
    "[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,setsar=1[v0];"
    "[1:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,setsar=1[v1];"
    "[2:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,setsar=1[v2];"
    "[3:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,setsar=1[v3];"
    "[v0][v1]xfade=transition=fade:duration=1.0:offset=9.0[x1];"
    "[x1][v2]xfade=transition=fade:duration=1.0:offset=18.0[x2];"
    "[x2][v3]xfade=transition=fade:duration=1.0:offset=27.0[outv]"
)

cmd.extend([
    "-filter_complex", filter_complex,
    "-map", "[outv]",
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "24",
    "-pix_fmt", "yuv420p",
    "-an",
    "-movflags", "+faststart",
    output_path
])

print("Running FFmpeg fast render...")
proc = subprocess.run(cmd, capture_output=True, text=True)

print("FFmpeg exit code:", proc.returncode)
if proc.returncode == 0:
    print("SUCCESS! Output saved to:", output_path)
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Output File Size: {size_mb:.2f} MB")
else:
    print("FFmpeg ERROR Output:\n", proc.stderr[-2000:])
