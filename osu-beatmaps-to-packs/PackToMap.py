import json

beatmapCSV = open("beatmaps.csv")
beatmapData = []

nextLine = None

while nextLine != "":
    nextLine = beatmapCSV.readline()
    lineData = nextLine.split(',', 1)
    if len(lineData) == 2:
        lineData[0] = int(lineData[0].replace('"', ''))
        lineData[1] = lineData[1][1:-2]
        lineData[1] = lineData[1].split(',')
        beatmapData.append(lineData)

count = 0
packs = []

for beatmap in beatmapData:
    for pack in beatmap[1]:
        if not packs.__contains__(pack):
            packs.append(pack)

    # if lineData[1].__contains__('S72'):
    #     count += 1
    #     print(lineData)
packs.sort()
print(packs)

# Generate pack-to-ID dictionary
packs_maps_dict = dict()

for p in packs:
    packMaps = []
    for beatmap in beatmapData:
        if beatmap[1].__contains__(p):
            packMaps.append(beatmap[0])
    packs_maps_dict[p] = packMaps

with open("PackToMap.json", 'w') as outfile:
    json.dump(packs_maps_dict, outfile)
print(packs_maps_dict['S42'])
# print(f"Count : {count}")
