import discord
from discord.ext import commands

class bot_admin(commands.Cog):
    def __init__(self, client):
        self.client = client

def setup(client):
    client.add_cog(bot_admin(client))