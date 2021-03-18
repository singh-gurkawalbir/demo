import json;
import datetime;
import time;
d = datetime.datetime.now();
with open('package.json', 'r') as myfile:
    data=myfile.read()
obj = json.loads(data)
gitRevision = obj["gitRevision"];
dateString = d.strftime("%d-%m-%H-%M"); 
if gitRevision.find("release") == 0:
    version = gitRevision + "." + dateString
elif gitRevision.find("master") == 0:
    version = gitRevision + "." + dateString
else: 
    version = gitRevision

def get_version_number():
    return version