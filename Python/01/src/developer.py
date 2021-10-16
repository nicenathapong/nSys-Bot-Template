import discord
from discord.ext import commands
from src.functions import api
import json
import random
from config import config
import psutil
import cpuinfo
import os
import math

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
        async with ctx.typing():
            python_process = psutil.Process(os.getpid())
            cputinfo = cpuinfo.get_cpu_info()

        await ctx.reply(embed=discord.Embed(
            color=0x00ffff
        ).set_author(
            name=f"Bot Status | นี่คือสถานะของบอทค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ).add_field(
            name="Server count",
            value="{0} servers".format("{:,}".format(len(self.client.guilds))),
            inline=True
        ).add_field(
            name="Member count",
            value="{0} members".format("{:,}".format(sum(list(map(lambda g: len(g.channels), self.client.guilds))))),
            inline=True
        ).add_field(
            name="Channel count",
            value="{0} channels".format("{:,}".format(sum(list(map(lambda g: len(list(filter(lambda m: not m.bot, g.members))), self.client.guilds))))),
            inline=True
        ).add_field(
            name="CPU Usage",
            value=f"{python_process.cpu_percent()}%",
            inline=True
        ).add_field(
            name="RAM Usage",
            value=f"{convert_size(python_process.memory_info()[0])}",
            inline=True
        ).add_field(
            name="Server info :",
            value="```" +
                    "CPU info : {0}\n".format(cputinfo["brand_raw"]) +
                    f"CPU Usage : {psutil.cpu_percent()}%\n" +
                    f"RAM Usage : {psutil.virtual_memory().percent}% ({convert_size(psutil.virtual_memory().used)}/{convert_size(psutil.virtual_memory().total)})```",
            inline=False
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
        ).set_footer(
            text=f"Client : {round(self.client.latency * 1000)}"
        ))

def setup(client):
    client.add_cog(developer(client))

def convert_size(size_bytes):
   if size_bytes == 0:
       return "0B"
   size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
   i = int(math.floor(math.log(size_bytes, 1024)))
   p = math.pow(1024, i)
   s = round(size_bytes / p, 2)
   return "%s %s" % (s, size_name[i])