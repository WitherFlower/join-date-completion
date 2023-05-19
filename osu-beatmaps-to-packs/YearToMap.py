import json
import csv
import datetime
from typing import Dict, List

# !getfile -type beatmaps -end 2014-01-27 -name maps
# !getfile -type beatmaps -apacks 1-17 -start 2014-01-27 -name maps_approved
# !getfile -type beatmaps -packs 902-903 -start 2014-01-27 -name maps_902_903

beatmaps_file = "maps.csv"
beatmaps_file_approved = "maps_approved.csv"
beatmaps_file_902_903 = "maps_902_903.csv"

maps_year_data : Dict[str, List[int]] = dict()

def process_file(filename: str):
    with open(filename, encoding='utf-8') as mapsCSV:
        reader = csv.DictReader(mapsCSV)
        for row in reader:
            year = str(datetime.datetime.strptime(row['approved_date'], "%Y-%m-%d %H:%M:%S").year)

            if maps_year_data.keys().__contains__(year):
                if(row['approved'] != '1' and row['approved'] != '2'):
                    print(row['beatmap_id'])
                maps_year_data[year].append(int(row['beatmap_id']))
            else:
                maps_year_data.update({year: [int(row['beatmap_id'])]})

process_file(beatmaps_file)
process_file(beatmaps_file_approved)
process_file(beatmaps_file_902_903)

total = 0
for k, v in maps_year_data.items():
    print(f'{k} : {len(v)} Maps')
    total += len(v)

print(f'{total} Total Maps')

with open("YearToMap.json", 'w') as outfile:
    json.dump(maps_year_data, outfile)