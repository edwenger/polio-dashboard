import json

with open('pakistan.geojson', 'r') as f:
    j2 = json.loads(f.read())

with open('afghan.geojson', 'r') as f:
    j = json.loads(f.read())

for f in j['features']:
    f['properties']['name'] = f['properties']['DIST_34_NA']

j['features'] += j2['features']

with open('afpak.geojson', 'w') as f:
    f.write(json.dumps(j))
