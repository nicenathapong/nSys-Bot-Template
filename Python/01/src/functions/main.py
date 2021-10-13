from operator import le
from sys import prefix
from discord.ext import commands
import json

with open("./config.json","r",encoding="utf-8") as f:
    config = json.load(f)

def get_prefix(client, message):
    mycursor = client.mysql.cursor(buffered=True)
    mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{message.guild.id}'")
    try:
        prefix = mycursor.fetchall()[0][2]
        if prefix is None: prefix = config["prefix"]
    except IndexError:
        prefix = config["prefix"]
    return [prefix, f"<@!{client.user.id}> ",f"<@!{client.user.id}>"]