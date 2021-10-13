import discord
from discord.ext import commands

class guild_admin(commands.Cog):
    def __init__(self, client):
        self.client = client

def setup(client):
    client.add_cog(guild_admin(client))