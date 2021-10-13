import discord
from discordTogether import DiscordTogether
from discord.ext import commands
import json

with open("./config.json","r",encoding="utf-8") as f:
    config = json.load(f)

class game(commands.Cog):
    def __init__(self, client):
        self.client = client
        self.togetherControl = DiscordTogether(client)

    @commands.command(aliases=["ytt","youtube"])
    async def YouTube_Together(self, ctx):
        try:
            member_voice_channel = ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "youtube")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Youtube Together** แล้วค่ะ!\n{link}")

    @commands.command(aliases=["poker"])
    async def Poker_Night(self, ctx):
        try:
            member_voice_channel = ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "poker")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Poker Night** แล้วค่ะ!\n{link}")

    @commands.command(aliases=["chess"])
    async def Chess_in_the_Park(self, ctx):
        try:
            member_voice_channel = ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "chess")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Chess in the Park** แล้วค่ะ!\n{link}")

    @commands.command(aliases=["betrayal"])
    async def Betrayal_io(self, ctx):
        try:
            member_voice_channel = ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "betrayal")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Betrayal.io** แล้วค่ะ!\n{link}")

    @commands.command(aliases=["fishing"])
    async def Fishington_io(self, ctx):
        try:
            member_voice_channel = ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "fishing")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Fishington.io** แล้วค่ะ!\n{link}")

    @commands.command(aliases=["letter-tile"])
    async def Letter_Tile(self, ctx):
        try:
            member_voice_channel = ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "letter-tile")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Letter Tile** แล้วค่ะ!\n{link}")

    @commands.command(aliases=["word-snack","word"])
    async def Word_Snack(self, ctx):
        try:
            member_voice_channel = ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "word-snack")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Word Snack** แล้วค่ะ!\n{link}")

    @commands.command(aliases=["doodle-crew"])
    async def Doodle_Crew(self, ctx):
        try:
            member_voice_channel = ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "doodle-crew")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Doodle Crew** แล้วค่ะ!\n{link}")

def setup(client):
    client.add_cog(game(client))

async def cant(client, ctx):
    await ctx.reply(embed=discord.Embed(
        title=f"ไม่พบช่องเสียงที่คุณอยู่ค่ะ",
        description="โปรดเข้าช่องเสียงก่อน เพื่อใช้คำสั่งนี้นะคะ",
        color=0x00ffff
    ).set_author(
        name="ไม่สามารถดำเนินการได้ค่ะ!",
        icon_url=client.user.avatar_url,
        url=config["author_url"]
    ))