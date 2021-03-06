import discord
from discord.ext import commands, tasks
import os
from src.functions import database, main
from config import config
import asyncio

intents = discord.Intents.default()
intents.members = True
intents.guilds = True
intents.messages = True

# sys.tracebacklimit = 0

client = commands.AutoShardedBot(
    shard_count=config.total_shards,
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

@tasks.loop(seconds=10)
async def activity(client):
    statuses = [
        "{0}help | {1} servers!".format(config.prefix, "{:,}".format(len(client.guilds))),
        "{0}help | {1} channels!".format(config.prefix, "{:,}".format(sum(list(map(lambda g: len(g.channels), client.guilds))))),
        "{0}help | {1} members!".format(config.prefix, "{:,}".format(sum(list(map(lambda g: len(list(filter(lambda m: not m.bot, g.members))), client.guilds)))))
    ]
    try: index = int(open("./activity_index.txt", "r").read())
    except: index = 0
    await client.change_presence(activity=discord.Activity(type=discord.ActivityType.watching, name=statuses[index]))
    index += 1
    if index == 3: index = 0
    open("./activity_index.txt", "w").write(str(index))

@client.event
async def on_shard_ready(shard_id):
    print(
        "---------------------------------------------" + "\n" +
        "nSys is starting up! | Shard {0}".format(shard_id) + "\n" +
        f"Login as {client.user} | {client.user.id}" + "\n" +
        "---------------------------------------------"
    )

@client.event
async def on_ready():
    activity.start(client)

@client.event
async def on_command_completion(ctx):
    for channel_id in config.log_channel_id:
        channel = client.get_channel(int(channel_id))
        await channel.send(embed=discord.Embed(
            title=ctx.message.content,
            description=f"{ctx.guild.name} | {ctx.author}",
            color=0x00ffff
        ).set_author(
            name="Command use!",
            icon_url=ctx.guild.icon_url,
            url=config.author_url
        ))

# @client.event
# async def on_command_error(ctx, error):
#     if isinstance(error, commands.errors.MissingPermissions):
#         await ctx.reply(embed=discord.Embed(
#             title=f"????????????????????????????????? Administrator ???????????????????????????",
#             description="???????????????????????????????????????????????????????????????????????????????????????",
#             color=0x00ffff
#         ).set_author(
#             name="????????????????????????????????????????????????????????????????????????!",
#             icon_url=client.user.avatar_url,
#             url=config.author_url
#         ))
#     elif isinstance(error, commands.errors.CommandNotFound):
#         pass
#     else:
#         print(error)
    
client.run(config.token)