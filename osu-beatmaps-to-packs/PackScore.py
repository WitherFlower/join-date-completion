# Commands to get scores :
# All maps before PPV2
# !getfile -type scores -u WitherFlower -end 2014-01-27
# This is missing some maps from approved packs, and also 902 + 903
# Relevaant message for 902+903 incident
# https://discord.com/channels/792807563980308481/792807563980308484/867716700656500766

# Interesting getfile type : nomodnumberones to compute score completion %
# !getfile -type top_score_nomod -end 2014-01-27

import json
import csv

score_file = "WitherFlower_scores_2023-05-17_064522.csv"
top_score_file = "top_score_nomod_2023-05-17_070753.csv"

score_data = {}

with open(score_file, encoding="UTF-8") as scoreCSV:

    reader = csv.DictReader(scoreCSV)
    for row in reader:
        score_data.update(
            { row['beatmap_id']: { 'score': row['score'] } }
        )

with open(top_score_file, encoding="UTF-8") as scoreCSV:
    
    reader = csv.DictReader(scoreCSV)
    for row in reader:
        if score_data.keys().__contains__(row['beatmap_id']):
            score_data[row['beatmap_id']].update(
                {'top_nomod_score' : row['top_score_nomod']}
            )
        else:
            score_data.update(
                { row['beatmap_id']: { 
                    'score': 0, 
                    'top_nomod_score' : row['top_score_nomod'] 
                    } 
                }
            )

    # nextLine = scoreCSV.readline()

    # while nextLine != "":
    #     nextLine = scoreCSV.readline()
    #     lineData = nextLine.split(',')
    #     if len(lineData) > 1:
    #         currentScore = []
    #         currentScore.append(int(lineData[1]))
    #         currentScore.append(int(lineData[2]))
    #         scoreData.append(currentScore)

print(f"Disco Prince : {score_data['75']}")
print(f"paraparaMAX : {score_data['9007']}")

with open("PackScoreData.json", 'w') as outfile:
    json.dump(score_data, outfile)

# packData = json.load(open("PackToMap.json", 'r'))
# total = 0
# for id in packData['S251']:
#     for s in scoreData:
#         if s[0] == id:
#             total += s[1]
# print(packData['S251'])
# print(total)