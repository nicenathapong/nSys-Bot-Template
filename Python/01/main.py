import discord
from discord.ext import commands
import os
import sys
import json
from src.functions import database, main

with open("./config.json","r",encoding="utf-8") as f:
    config = json.load(f)

intents = discord.Intents.default()
intents.members = True
intents.guilds = True
intents.messages = True

# sys.tracebacklimit = 0

client = commands.AutoShardedBot(
    shard_count=config["total_shards"],
    command_prefix=main.get_prefix,
    intents=intents
)
client.remove_command('help')

print()
for file in os.listdir("./src"):
    if file.endswith(".py"):
        client.load_extension(f"src.{file[:-3]}")
        print(f"Loading extension {file[:-3]} finish!")

database.connect_to_database(client)

@client.event
async def on_shard_ready(shard_id):
    print(
        "---------------------------------------------" + "\n" +
        "nSys is starting up! | Shard {0}".format(shard_id + 1) + "\n" +
        f"Login as {client.user} | {client.user.id}" + "\n" +
        "---------------------------------------------"
    )

client.run(config["token"])