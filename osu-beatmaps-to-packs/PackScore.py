# Commands to get scores :

# All maps before PPV2
# !getfile -type scores -u WitherFlower -end 2014-01-27 -name scores

# Approved Packs :
# !getfile -type scores -apacks 1-19 -start 2014-01-27 -name scores_approved

# Packs 902 and 903 (Previously A15 and A16):
# !getfile -type scores -packs 902-903 -start 2014-01-27 -name scores_902_903

# Top Scores
# !getfile -type top_score_nomod -name topscores


# Packs 902 and 903 incident
# https://discord.com/channels/792807563980308481/792807563980308484/867716700656500766


import json
import csv

score_file = "scores.csv"
score_file_approved = "scores_approved.csv"
score_file_902_903 = "scores_902_903.csv"

top_score_file = "topscores.csv"

score_data = {}

def process_score_file(file: str):
    with open(file, encoding="UTF-8") as scoreCSV:

        reader = csv.DictReader(scoreCSV)
        for row in reader:
            score_data.update(
                { row['beatmap_id']: { 'score': row['score'] } }
            )

process_score_file(score_file)
process_score_file(score_file_approved)
process_score_file(score_file_902_903)

def process_top_score_file(file: str):
    with open(file, encoding="UTF-8") as scoreCSV:
        
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

process_top_score_file(top_score_file)

    # nextLine = scoreCSV.readline()

    # while nextLine != "":
    #     nextLine = scoreCSV.readline()
    #     lineData = nextLine.split(',')
    #         currentScore.append(int(lineData[1]))
    #     if len(lineData) > 1:
    #         currentScore = []
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