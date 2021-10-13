import requests
import json
from config import config
    
def getimgurls(word, count = 3):
    r = requests.get("{0}getimgurl/{1}/{2}".format(config.api_url, word, count))
    return json.loads(r.text), "{:,}".format(int(str(r.elapsed.total_seconds() * 1000).split(".", 1)[0]))

def thai2loo(word):
    r = requests.get("{0}thai2loo/{1}".format(config.api_url, word))
    return json.loads(r.text)["data"], "{:,}".format(int(str(r.elapsed.total_seconds() * 1000).split(".", 1)[0]))
    
def loo2thai(word):
    r = requests.get("{0}loo2thai/{1}".format(config.api_url, word))
    return json.loads(r.text)["data"], "{:,}".format(int(str(r.elapsed.total_seconds() * 1000).split(".", 1)[0]))