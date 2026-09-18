import json

with open(r"c:\BNP RESOURCE 2\assets\js\projects-data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for k, v in data.items():
    print(f"{v['name']} | Location: {v['location']}")
