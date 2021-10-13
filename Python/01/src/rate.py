import discord
from discord.ext import commands
import random
from discord.ext.commands.core import check
import requests
import json
from bs4 import BeautifulSoup
from asyncio.exceptions import TimeoutError as ast

with open("./config.json","r",encoding="utf-8") as f:
    config = json.load(f)

class game(commands.Cog):
    def __init__(self, client):
        self.client = client

    @commands.command(aliases=["r34"])
    async def rule34(self, ctx, tag=None):
        if not ctx.channel.is_nsfw(): return await ctx.reply(embed=discord.Embed(
            title="คำสั่งนี้ใช้ได้แค่กับห้อง NSFW เท่านั้นนะคะ",
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config["author_url"]
        ))
        async with ctx.typing():
            mycursor = self.client.mysql.cursor()
            mycursor.execute("SELECT * FROM rule34")
            all_rule34_tags = mycursor.fetchall()
            if tag is None:
                if len(all_rule34_tags) > 0:
                    tag = random.choice(all_rule34_tags)[1]
                else: tag = "hololive"
            if tag in list(map(lambda tag: tag[1], all_rule34_tags)):
                file_urls = json.loads(next(x for x in all_rule34_tags if x[1] == tag)[2])
            else:
                r = requests.get("https://rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=1000&tags={0}".format(tag))
                try:
                    res = json.loads(r.text)
                except json.decoder.JSONDecodeError:
                    return await ctx.reply(embed=discord.Embed(
                        title=f"ไม่พบแท็ก `{tag}` ใน rule34 ค่ะ",
                        color=0x00ffff
                    ).set_author(
                        name="ไม่สามารถดำเนินการได้ค่ะ!",
                        icon_url=self.client.user.avatar_url,
                        url=config["author_url"]
                    ))
                file_urls = list(map(lambda pic: pic["file_url"], res))
                mycursor.execute("INSERT INTO rule34 (id, tags, pic) VALUES (%s, %s, %s)", (None, tag, json.dumps(file_urls)))

        file_urls = random.sample(file_urls, len(file_urls))

        def generateEmbed(start):
            current = file_urls[start]
            return discord.Embed(
                title=tag,
                url="https://rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=1000&tags={0}".format(tag),
                description=f"random from {len(file_urls)} images.",
                color=0x00ffff
            ).set_author(
                name="rule34",
                url="https://rule34.xxx/"
            ).set_image(
                url=current
            ).set_footer(
                text=f"นี่คือรูปที่ {file_urls.index(current) + 1} จากทั้งหมด {len(file_urls)} รูป ของแท็กค่ะ"
            )

        i = 0
        embedMessage = await ctx.reply(embed=generateEmbed(i))
        if len(file_urls) > 1:
            await embedMessage.add_reaction("⬅️")
            await embedMessage.add_reaction("➡️")

        def reac_check(r, u):
            return embedMessage.id == r.message.id and u != self.client.user and r.emoji in ["⬅️", "➡️"]

        while True:
            try:
                reaction, user = await self.client.wait_for('reaction_add', timeout=180, check=reac_check)
                em = str(reaction.emoji)
            except ast:
                break

            if user != self.client.user:
                await embedMessage.remove_reaction(emoji=em, member=user)

            if em == "⬅️":
                i -= 1
                await embedMessage.edit(embed=generateEmbed(i))
            if em == "➡️":
                i += 1
                await embedMessage.edit(embed=generateEmbed(i))

    @commands.command(aliases=["nht"])
    async def nhentai(self, ctx):
        if not ctx.channel.is_nsfw(): return await ctx.reply(embed=discord.Embed(
            title="คำสั่งนี้ใช้ได้แค่กับห้อง NSFW เท่านั้นนะคะ",
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config["author_url"]
        ))

        async def generateEmbed(ctx):

            url = f"https://nhentai.net/g/{random.randrange(300000)}/"

            r = requests.get(url)

            soup = BeautifulSoup(r.text, "html.parser")

            title = soup.find("meta", property="og:title")["content"]
            imgurl = soup.find("meta", property="og:image")["content"]

            return discord.Embed(
                title=title,
                url=url,
                color=0x00ffff
            ).set_author(
                name="nhentai",
                url="https://nhentai.net/"
            ).set_image(
                url=imgurl
            )
        async with ctx.typing():
            embedMessage = await ctx.reply(embed=await generateEmbed(ctx))
        await embedMessage.add_reaction("➡️")

        def reac_check(r, u):
            return embedMessage.id == r.message.id and u != self.client.user and r.emoji in ["➡️"]

        while True:
            try:
                reaction, user = await self.client.wait_for('reaction_add', timeout=180, check=reac_check)
                em = str(reaction.emoji)
            except ast:
                break

            if user != self.client.user:
                await embedMessage.remove_reaction(emoji=em, member=user)

            if em == "➡️":
                await embedMessage.edit(embed=await generateEmbed(ctx))

def setup(client):
    client.add_cog(game(client))