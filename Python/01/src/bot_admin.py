import discord
from discord.ext import commands
from config import config
import asyncio

async def check(self, ctx):
    mycursor = self.client.mysql.cursor()
    mycursor.execute("SELECT * FROM `admin`")
    if ctx.author.id in config.owner_id or ctx.author.id in list(map(lambda x: x[1], mycursor.fetchall())): return False
    msg = await ctx.reply(embed=discord.Embed(
        title=f"คำสั่งนี้เป็นคำสั่งเฉพาะแอดมินเท่านั้นค่ะ",
        color=0x00ffff
    ).set_author(
        name="ไม่สามารถดำเนินการได้ค่ะ!",
        icon_url=self.client.user.avatar_url,
        url=config.author_url
    ))
    await asyncio.sleep(10)
    await msg.delete()
    return True

class bot_admin(commands.Cog):
    def __init__(self, client):
        self.client = client

    @commands.command()
    async def reload(self, ctx):
        if await check(self, ctx): return

    @commands.command()
    async def menulist(self, ctx):
        if await check(self, ctx): return

    @commands.command()
    async def menuremove(self, ctx):
        if await check(self, ctx): return

    @commands.command(aliases=["sva"])
    async def server_all(self, ctx):
        if await check(self, ctx): return

    @commands.command()
    async def backlist_add(self, ctx):
        if await check(self, ctx): return

    @commands.command()
    async def backlist_remove(self, ctx):
        if await check(self, ctx): return

    @commands.command()
    async def premium_add(self, ctx):
        if await check(self, ctx): return

    @commands.command()
    async def premium_remove(self, ctx):
        if await check(self, ctx): return

    @commands.command()
    async def admin_add(self, ctx):
        if await check(self, ctx): return

    @commands.command()
    async def admin_remove(self, ctx):
        if await check(self, ctx): return

def setup(client):
    client.add_cog(bot_admin(client))