import json
import csv
import datetime
from typing import Dict, List

beatmaps_file = "beatmaps_2023-05-18_105515.csv"

maps_year_data : Dict[str, List[int]] = dict()

with open(beatmaps_file, encoding='utf-8') as mapsCSV:
    reader = csv.DictReader(mapsCSV)
    for row in reader:
        year = str(datetime.datetime.strptime(row['approved_date'], "%Y-%m-%d %H:%M:%S").year)

        if maps_year_data.keys().__contains__(year):
            if(row['approved'] != '1' and row['approved'] != '2'):
                print(row['beatmap_id'])
            maps_year_data[year].append(int(row['beatmap_id']))
        else:
            maps_year_data.update({year: [int(row['beatmap_id'])]})

total = 0
for k, v in maps_year_data.items():
    print(f'{k} : {len(v)} Maps')
    total += len(v)

print(f'{total} Total Maps')

with open("YearToMap.json", 'w') as outfile:
    json.dump(maps_year_data, outfile)