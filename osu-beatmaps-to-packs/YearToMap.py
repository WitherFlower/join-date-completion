import json
import csv
import datetime

beatmaps_file = "beatmaps_2023-05-18_105515.csv"

maps_year_data = {}

with open(beatmaps_file) as mapsCSV:
    reader = csv.DictReader(mapsCSV)
    for row in reader:
        print(datetime.date(int(row['approved_date'])).year)