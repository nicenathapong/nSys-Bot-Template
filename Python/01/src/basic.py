import discord
from discord.ext import commands
import random
import requests
import json
from src.functions import api
from config import config
from asyncio.exceptions import TimeoutError as ast
from src.functions.main import get_prefix

horoscope_res = [
    "แน่นอนอยู่แล้วค่า",
    "ก็น่าจะเป็นอย่างนั้นนะคะ",
    "โดยไม่มีข้อกังขาเลยค่ะ!",
    "ใช่แน่นอนค่าา",
    "คุณอาจพึ่งพามันได้นะคะ",
    "เท่าที่เค้าเห็น เค้าว่าใช่น้า",
    "หัวใจของฉัน..มันบอกว่าใช่ค่ะ!",
    "เป็นไปได้สุดๆเลยค่าา",
    "ก็ดูท่าจะดีนะคะ",
    "ใช่ค่า",
    "เลือกทางที่คุณอยากดีกว่านะคะ",
    "อะไรนะคะไม่เข้าใจ ขออีกรอบได้ไหมคะ?",
    "ไว้มาถามใหม่ทีหลังนะคะ..",
    "คุณไม่ควรรู้ตอนนี้จะดีกว่านะคะ..555",
    "อันนี้ฉันไม่รู้จริงๆค่ะ",
    "เรียบเรียงคำพูดดีๆ แล้วขออีกรอบได้ไหมคะะ",
    "อย่าไปนับมันเลยค่ะ",
    "ฉันคิดว่าไม่นะคะ",
    "หัวใจของฉัน..มันบอกว่าไม่ค่ะ",
    "ดูท่าไม่ค่อยจะดีเลยนะคะ",
    "แย่มากเลยค่ะ.."
]

def convertdate(day, dayn, month, year):
    if day == "Monday": day = "จันทร์"
    if day == "Tuesday": day = "อังคาร"
    if day == "Wednesday": day = "พุธ"
    if day == "Thursday": day = "พฤหัสบดี"
    if day == "Friday": day = "ศุกร์"
    if day == "Saturday": day = "เสาร์"
    if day == "Sunday": day = "อาทิตย์"

    if month == "January": month = "มกราคม"    
    if month == "February": month = "กุมภาพันธ์"    
    if month == "March": month = "มีนาคม"    
    if month == "April": month = "เมษายน"    
    if month == "May": month = "พฤษภาคม"    
    if month == "June": month = "มิถุนายน"    
    if month == "July": month = "กรกฎาคม"    
    if month == "August": month = "สิงหาคม"    
    if month == "September": month = "กันยายน"    
    if month == "October": month = "ตุลาคม"    
    if month == "November": month = "พฤศจิกายน"    
    if month == "December": month = "ธันวาคม"

    date = f"วัน{day} ที่ {dayn} เดือน{month} ปี {year}"
    return date

class basic(commands.Cog):
    def __init__(self, client):
        self.client = client

    @commands.command(aliases=["h"])
    async def help(self, ctx):

        MainEmbed = discord.Embed(
            title="สามารถดูคำสั่งทั้งหมดได้ที่เมนูด้านล่างเลยค่ะ",
            color=0x00ffff
        ).set_author(
            name="สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ).set_image(
            url="https://cdn.discordapp.com/attachments/848527683381100555/899618887497306112/nSys02.png"
        )

        BasicEmbed = discord.Embed(
            title="นี่คือคำสั่งทั่วไปของบอทค่ะ",
            description=
                f"**{get_prefix(self.client, ctx)[0]}menu** - ไม่รู้จะกินอะไรดีใช่มะ ลองใช้คำสั่งนี้ดูสิคะ" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}horo** - อยากถามอะไรถามมาเลย ฉันจะทำนายให้คุณเอง!" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}shake** - เขย่าใครสักคน" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}ps** - ค้นหารูปภาพ" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}covid** - ดูสถานการณ์ Covid-19 ล่าสุดของไทย" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}time** - ดูเวลาตอนนี้" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}loo** - แปลภาษาไทยไปภาษาลู (555+)" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}tloo** - แปลภาษาลูมาภาษาไทย",
            color=0x00ffff
        ).set_author(
            name="สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        )

        MusicEmbed = discord.Embed(
            title="นี่คือคำสั่งเพลงของบอทค่ะ",
            description=
                f"**{get_prefix(self.client, ctx)[0]}join**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}play**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}pause**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}resume**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}queue**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}nowplaying**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}loop**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}skip**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}skipto**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}previous**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}shuffle**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}leave**",
            color=0x00ffff
        ).set_author(
            name="สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        )

        GameEmbed = discord.Embed(
            title="นี่คือคำสั่งในหมวดหมู่เกมค่ะ",
            description=
                f"**{get_prefix(self.client, ctx)[0]}youtube-together**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}betroyal**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}chess**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}betrayal**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}fishing**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}letter-tile**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}word-snack**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}doodle-crew**",
            color=0x00ffff
        ).set_author(
            name="สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        )

        RateEmbed = discord.Embed(
            title="นี่คือคำสั่งในหมวดหมู่ 18+ ค่ะ",
            description=
                f"**{get_prefix(self.client, ctx)[0]}rule34**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}nhentai**",
            color=0x00ffff
        ).set_author(
            name="สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        )

        SettingsEmbed = discord.Embed(
            title="นี่คือคำสั่งในหมวดหมู่การตั้งค่าเซิร์ฟเวอร์ค่ะ",
            description=
                f"**{get_prefix(self.client, ctx)[0]}setprefix**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}rmsetprefix**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}setjoinlog**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}rmsetjoinlog**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}addautovc**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}rmautovc**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}addreacrole**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}rmreacrole**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}reacrolelist**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}rmallreacrole**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}rankingsystem**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}kick**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}ban**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}unban**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}edit-server-icon**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}restore-server-icon**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}edit-server-name**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}change-nickname**",
            color=0x00ffff
        ).set_author(
            name="สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        )

        DevEmbed = discord.Embed(
            title="ในหมวดหมู่ผู้พัฒนาค่ะ",
            description=
                f"**{get_prefix(self.client, ctx)[0]}ping**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}botinfo**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}menuadd**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}menulist**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}menuremove**",
            color=0x00ffff
        ).set_author(
            name="สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        )

        Bot_admin_Embed = discord.Embed(
            title="ในหมวดหมู่ผู้แอดมินบอทค่ะ",
            description=
                f"**{get_prefix(self.client, ctx)[0]}lorem**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}lorem**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}lorem**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}lorem**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}lorem**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}lorem**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}lorem**" + "\n"
                f"**{get_prefix(self.client, ctx)[0]}lorem**",
            color=0x00ffff
        ).set_author(
            name="สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        )

        msg = await ctx.reply(embed=MainEmbed)
        await msg.add_reaction("❤️")
        await msg.add_reaction("🏠")
        await msg.add_reaction("🎶")
        await msg.add_reaction("🎮")
        await msg.add_reaction("⚙️")
        if ctx.author.id in config.owner_id:
            await msg.add_reaction("👑")
        def reac_check(r, u):
            return msg.id == r.message.id and u != self.client.user and r.emoji in ["❤️", "🏠","🎶","🎮","⚙️","👑"] and u.id == ctx.author.id
        while True:
            try:
                reaction, user = await self.client.wait_for('reaction_add', timeout=1800, check=reac_check)
                em = str(reaction.emoji)
            except ast:
                break

            if user != self.client.user:
                await msg.remove_reaction(emoji=em, member=user)

            if em == "❤️":
                await msg.edit(embed=MainEmbed)
            if em == "🏠":
                await msg.edit(embed=BasicEmbed)
            if em == "🎶":
                await msg.edit(embed=MusicEmbed)
            if em == "🎮":
                await msg.edit(embed=GameEmbed)
            if em == "⚙️":
                await msg.edit(embed=SettingsEmbed)
            if em == "👑":
                await msg.edit(embed=Bot_admin_Embed)

    @commands.command(aliases=["horo"])
    async def horoscope(self, ctx, *, question=None):
        await ctx.reply(embed=discord.Embed(color=0x00ffff).set_author(
            name=f"คำถามจาก {ctx.author.name}",
            icon_url=f"{ctx.author.avatar_url}"
        ).add_field(
            name="ถามว่า :",
            value=question,
            inline=False
        ).add_field(
            name="คำตอบ",
            value=random.choice(horoscope_res),
            inline=False
        ))

    @commands.command(aliases=["date"])
    async def time(self, ctx):
        import time
        hour = time.strftime("%H")
        minute = time.strftime("%M")
        sec = time.strftime("%S")
        day = time.strftime("%A")
        dayn = time.strftime("%d")
        month = time.strftime("%B")
        monthn = time.strftime("%m")
        year = time.strftime("%Y")
        await ctx.reply(embed=discord.Embed(
            title=f"{dayn}/{monthn}/{year} | {convertdate(day, dayn, month, year)}",
            color = 0x00ffff
        ).set_author(
            name=f"{hour}:{minute}:{sec} | ขณะนี้เวลา {hour} นาฬิกา {minute} นาที {sec} วินาที ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.command()
    async def covid(self, ctx):
        async with ctx.typing():
            r = requests.get("https://covid19.ddc.moph.go.th/api/Cases/today-cases-all")
            data = json.loads(r.text)

            new_case = "{:,}".format(data[0]['new_case'])
            new_recovered = "{:,}".format(data[0]['new_recovered'])
            total_recovered = "{:,}".format(data[0]['total_recovered'])
            total_case = "{:,}".format(data[0]['total_case'])
            new_death = "{:,}".format(data[0]['new_death'])

        await ctx.reply(embed=discord.Embed(
            title=f"ติดเชื้อเพิ่มวันนี้ `{new_case}` คน",
            color=0x00ffff
        ).set_author(
            name="อัพเดตสถานการณ์ โควิด-19 ในไทย ล่าสุดค่ะ",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ).add_field(
            name=f"หายป่วยวันนี้ `{new_recovered}` คน",
            value=
                f"หายป่วยสะสม `{total_recovered}` คน" + "\n" +
                f"ป่วยสะสม `{total_case}` คน" + "\n" +
                f"เสียชีวิตเพิ่ม `{new_death}` คน",
        ).set_footer(
            text=f"อัพเดตล่าสุด {data[0]['update_date']}"
        ))

    @commands.command()
    async def shake(self, ctx, member: discord.Member=None):
        if member is None: return await ctx.reply(embed=discord.Embed(
            title=f"โปรดระบุผู้ใช้ที่ต้องการจะให้ Shake ด้วยนะคะ",
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))
        if member.bot: return await ctx.reply(embed=discord.Embed(
            title=f"ไม่สามารถ Shake ผู้ใช้ที่เป็นบอทได้นะคะ",
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))
        # if member.id in config["owner_id"]: member = ctx.author
        try:
            member_voice_channel_default = member.voice.channel
        except AttributeError:
            return await ctx.reply(embed=discord.Embed(
                title=f"`{member}` เหมือนจะไม่ได้อยู่ในช่องเสียงนะคะ?",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))
        msg = await ctx.reply(embed=discord.Embed(
            title=f"กำลังเขย่า `{member}`",
            color=0x00ffff
        ).set_author(
            name="กำลังเขย่าผู้ใช้..",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))
        all_channel = []
        count = 0
        for channel in ctx.guild.channels:
            if channel.type is discord.ChannelType.voice and channel.permissions_for(member).connect:
                all_channel.append(channel)
                count += 1
            if count == 5: break
        for ch in all_channel:
            await member.move_to(ch)
        await member.move_to(member_voice_channel_default)
        await msg.edit(embed=discord.Embed(
            title=f"เขย่า `{member}` เรียบร้อยค่ะ!",
            color=0x00ffff
        ).set_author(
            name="เขย่าผู้ใช้ เรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.command()
    async def menu(self, ctx):
        mycursor = self.client.datacore.cursor()
        mycursor.execute("SELECT * FROM `food`")
        all_database_menu = mycursor.fetchall()
        random_menu = random.choice(all_database_menu)
        await ctx.reply(embed=discord.Embed(color=0x00ffff).set_author(
            name='ลอง "{0}" ไหมคะ?'.format(random_menu[1]),
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ).set_image(
            url=random.choice(json.loads(random_menu[2]))["url"]
        ))

    @commands.command(aliases=["ps"])
    async def picsearch(self, ctx, *, word=None):
        if word is None: return await ctx.reply(embed=discord.Embed(
            title=f"โปรดระบุคำที่ต้องการจะให้ค้นหาด้วยนะคะ",
            description="เช่น `{0}picsearch พิซซ่า`".format(config.prefix),
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))
        async with ctx.typing():
            res = api.getimgurls(word, 1)
        await ctx.reply(embed=discord.Embed(
            title=res[0][0]["title"],
            url=res[0][0]["source"],
            color=0x00ffff
        ).set_author(
            name=f'นี่คือผลการค้นหาของ "{word}" ค่ะ!',
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ).set_image(
            url=res[0][0]["url"]
        ).set_footer(
            text=f"API response : {res[1]}ms"
        ))

    @commands.command()
    async def loo(self, ctx, word=None):
        if word is None: return await ctx.reply(embed=discord.Embed(
            title=f"โปรดระบุคำที่ต้องการจะให้ค้นแปลด้วยนะคะ",
            description="เช่น `{0}loo หลับ`".format(config.prefix),
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))
        async with ctx.typing():
            res = api.thai2loo(word)
        await ctx.reply(embed=discord.Embed(title=res[0], url=f"http://lootranslator.infinityfreeapp.com/lootranslator.php?text={word}&mode=thai2loo", color=0x00ffff).set_author(
            name=f"thai2loo | {word}",
            icon_url=self.client.user.avatar_url,
            url="http://lootranslator.infinityfreeapp.com/lootranslator.php"
        ).set_footer(
            text=f"API response : {res[1]}ms"
        ))

    @commands.command()
    async def tloo(self, ctx, word=None):
        if word is None: return await ctx.reply(embed=discord.Embed(
            title=f"โปรดระบุคำที่ต้องการจะให้ค้นแปลด้วยนะคะ",
            description="เช่น `{0}tloo สับหลุบ`".format(config.prefix),
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))
        async with ctx.typing():
            res = api.loo2thai(word)
        await ctx.reply(embed=discord.Embed(title=res[0], url=f"http://lootranslator.infinityfreeapp.com/lootranslator.php?text={word}&mode=loo2thai", color=0x00ffff).set_author(
            name=f"loo2thai | {word}",
            icon_url=self.client.user.avatar_url,
            url="http://lootranslator.infinityfreeapp.com/lootranslator.php"
        ).set_footer(
            text=f"API response : {res[1]}ms"
        ))

def setup(client):
    client.add_cog(basic(client))