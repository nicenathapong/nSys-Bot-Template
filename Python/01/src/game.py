import discord
from discord_together import DiscordTogether
from discord.ext import commands
import random
from asyncio.exceptions import TimeoutError as ast
from config import config

words = ["tennis","badminton","nice","cars","volleyball"]

class game(commands.Cog):
    def __init__(self, client):
        self.client = client

    @commands.Cog.listener()
    async def on_ready(self):
        self.togetherControl = await DiscordTogether(config.token)

    @commands.command(aliases=["ytt","youtube"])
    async def YouTube_Together(self, ctx):
        try:
            ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "youtube")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Youtube Together** แล้วค่ะ!\n{link}")

    @commands.command(aliases=["poker"])
    async def Poker_Night(self, ctx):
        try:
            ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "poker")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Poker Night** แล้วค่ะ!\n{link}")

    @commands.command(aliases=["chess"])
    async def Chess_in_the_Park(self, ctx):
        try:
            ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "chess")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Chess in the Park** แล้วค่ะ!\n{link}")

    @commands.command(aliases=["betrayal"])
    async def Betrayal_io(self, ctx):
        try:
            ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "betrayal")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Betrayal.io** แล้วค่ะ!\n{link}")

    @commands.command(aliases=["fishing"])
    async def Fishington_io(self, ctx):
        try:
            ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "fishing")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Fishington.io** แล้วค่ะ!\n{link}")

    @commands.command(aliases=["letter-tile"])
    async def Letter_Tile(self, ctx):
        try:
            ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "letter-tile")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Letter Tile** แล้วค่ะ!\n{link}")

    @commands.command(aliases=["word-snack","word"])
    async def Word_Snack(self, ctx):
        try:
            ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "word-snack")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Word Snack** แล้วค่ะ!\n{link}")

    @commands.command(aliases=["doodle-crew"])
    async def Doodle_Crew(self, ctx):
        try:
            ctx.author.voice.channel
        except AttributeError:
            return await cant(self.client, ctx)
        link = await self.togetherControl.create_link(ctx.author.voice.channel.id, "doodle-crew")
        await ctx.reply(f"`{ctx.author}` ได้สร้างกิจกรรม **Doodle Crew** แล้วค่ะ!\n{link}")

    @commands.command()
    async def hangman(self, ctx):
        word = random.choice(words)
        all_char = list(word)
        message = await ctx.reply(embed=discord.Embed(
            title=gen_display(word, all_char),
            description=f"จำนวนครั้งผิด `{0}`",
            color=0x00ffff
        ).set_author(
            name="Hangman Game",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))
        try:
            _input = await self.client.wait_for('message', timeout=30)
            await play(self, message, _input, all_char, word)
        except ast:
            await message.delete()
            return await message.edit(embed=discord.Embed(
                title="หมดเวลาแล้วค่ะ\n" + gen_display(word, all_char),
                description=f"จำนวนครั้งผิด `{0}`",
                color=0x00ffff
            ).set_author(
                name="Hangman Game",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

def setup(client):
    client.add_cog(game(client))

async def play(self, message, _input, all_char, word, cor_count=0, incor_count=0):
    if _input.content in all_char:
        cor_count += 1
        for n, i in enumerate(all_char):
            if i == _input.content :
                all_char[n] = "` `"
                break
        await _input.delete()
        if cor_count == len(all_char): return await message.edit(embed=discord.Embed(
            title="คุณชนะแล้วค่ะ!\n" + gen_display(word, all_char),
            description=f"จำนวนครั้งผิด `{incor_count}`",
            color=0x00ffff
        ).set_author(
            name="Hangman Game",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))
    else:
        incor_count += 1
        await _input.delete()
    await message.edit(embed=discord.Embed(
            title=gen_display(word, all_char),
            description=f"จำนวนครั้งผิด `{incor_count}`",
            color=0x00ffff
        ).set_author(
            name="Hangman Game",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))
    try:
        _input = await self.client.wait_for('message', timeout=30)
    except ast:
        return await message.edit(embed=discord.Embed(
            title="หมดเวลาแล้วค่ะ\n" + gen_display(word, all_char),
            description=f"จำนวนครั้งผิด `{incor_count}`",
            color=0x00ffff
        ).set_author(
            name="Hangman Game",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))
    await play(self, message, _input, all_char, word, cor_count, incor_count)

def gen_display(word, all_char):
    gen = []
    for i in range(len(list(word))):
        if list(word)[i] == all_char[i]:
            gen.append("` `")
            gen.append(" ")
        else:
            gen.append("`" + list(word)[i] + "`")
            gen.append(" ")
    return "".join(gen)

async def cant(client, ctx):
    await ctx.reply(embed=discord.Embed(
        title=f"ไม่พบช่องเสียงที่คุณอยู่ค่ะ",
        description="โปรดเข้าช่องเสียงก่อน เพื่อใช้คำสั่งนี้นะคะ",
        color=0x00ffff
    ).set_author(
        name="ไม่สามารถดำเนินการได้ค่ะ!",
        icon_url=client.user.avatar_url,
        url=config.author_url
    ))