import discord
from discord.ext import commands
from src.functions import api
import json
import random
from config import config

class developer(commands.Cog):
    def __init__(self, client):
        self.client = client

    @commands.command()
    async def ping(self, ctx):
        await ctx.reply(embed=discord.Embed(color=0x00ffff).set_author(
            name="ปิงของบอทตอนนี้ อยู่ที่ {0}ms ค่ะ!".format("{:,}".format(round(self.client.latency * 1000))),
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.command(aliases=["bi","stats"])
    async def botinfo(self, ctx):
        await ctx.reply(embed=discord.Embed(color=0x00ffff).set_author(
            name=f"ปิงของบอทตอนนี้ อยู่ที่ {round(self.client.latency * 1000)}ms ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.command()
    async def menuadd(self, ctx, *, menu):
        async with ctx.typing():
            mycursor = self.client.mysql.cursor()
            mycursor.execute("SELECT * FROM `food`")
            all_database_menu = mycursor.fetchall()
            all_menu_only = list(map(lambda x: x[1] ,all_database_menu))
            if menu not in all_menu_only:
                api_res = api.getimgurls(menu, 3)
                mycursor.execute("INSERT INTO food (id, menu, pic) VALUES (%s, %s, %s)", (None, menu, json.dumps(api_res[0])))
            mycursor.execute(f"SELECT * FROM `food` WHERE menu ='{menu}'")
            myresult = mycursor.fetchone()
        await ctx.reply(embed=discord.Embed(title=f"เพิ่ม `{menu}` ลงในคลังเมนูเรียบร้อยค่ะ!", color=0x00ffff).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ).set_image(
            url=random.choice(json.loads(myresult[2]))["url"]
        ))

def setup(client):
    client.add_cog(developer(client))