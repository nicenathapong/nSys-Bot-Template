import discord
from discord.ext import commands
import random
import requests
import json
from src.functions import api
from config import config

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
    if day == "Monday":
        day = "จันทร์"
    if day == "Tuesday":
        day = "อังคาร"
    if day == "Wednesday":
        day = "พุธ"
    if day == "Thursday":
        day = "พฤหัสบดี"
    if day == "Friday":
        day = "ศุกร์"
    if day == "Saturday":
        day = "เสาร์"
    if day == "Sunday":
        day = "อาทิตย์"

    if month == "January":
        month = "มกราคม"    
    if month == "February":
        month = "กุมภาพันธ์"    
    if month == "March":
        month = "มีนาคม"    
    if month == "April":
        month = "เมษายน"    
    if month == "May":
        month = "พฤษภาคม"    
    if month == "June":
        month = "มิถุนายน"    
    if month == "July":
        month = "กรกฎาคม"    
    if month == "August":
        month = "สิงหาคม"    
    if month == "September":
        month = "กันยายน"    
    if month == "October":
        month = "ตุลาคม"    
    if month == "November":
        month = "พฤศจิกายน"    
    if month == "December":
        month = "ธันวาคม"

    date = f"วัน{day} ที่ {dayn} เดือน{month} ปี {year}"
    return date

class basic(commands.Cog):
    def __init__(self, client):
        self.client = client

    @commands.command(aliases=["h"])
    async def help(self, ctx):
        await ctx.reply(embed=discord.Embed(
            title="นี่คือคำสั่งทั้งหมดของบอทค่ะ!",
            color=0x00ffff
        ).set_author(
            name="สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?",
            icon_url=self.client.user.avatar_url
        ).add_field(
            name="basic",
            value=
                "`help`" + "\n" +
                "`horoscope`" + "\n" +
                "`covid`" + "\n" +
                "`shake`" + "\n" +
                "`menu`" + "\n" +
                "`picture search`" + "\n" +
                "`time`",
            inline=True
        ).add_field(
            name="music",
            value=
                "`join`" + "\n" +
                "`play`" + "\n" +
                "`pause`" + "\n" +
                "`resume`" + "\n" +
                "`queue`" + "\n" +
                "`nowplaying`" + "\n" +
                "`volume`" + "\n" +
                "`equalizer`" + "\n" +
                "`loop`" + "\n" +
                "`skip`" + "\n" +
                "`skipto`" + "\n" +
                "`previous`" + "\n" +
                "`shuffle`" + "\n" +
                "`leave`" + "\n" +
                "`autoplay`" + "\n" +
                "`playskip`" + "\n" +
                "`forceskip`" + "\n" +
                "`setup-musicroom`",
            inline=True
        ).add_field(
            name="game",
            value=
                "`youtube`" + "\n" +
                "`poker`" + "\n" +
                "`chess`" + "\n" +
                "`betrayal`" + "\n" +
                "`fishing`" + "\n" +
                "`letter-tile`" + "\n" +
                "`word-snack`" + "\n" +
                "`doodle-crew`",
            inline=True
        ).add_field(
            name="rate",
            value=
                "`rule34`" + "\n" +
                "`nhentai`",
            inline=True
        ).add_field(
            name="guild settings",
            value=
                "`setprefix`" + "\n" +
                "`welcome-message-add`" + "\n" +
                "`welcome-message-remove`" + "\n" +
                "`auto-voice-channel-add`" + "\n" +
                "`auto-voice-channel-remove`" + "\n" +
                "`reaction-role-add`" + "\n" +
                "`reaction-role-remove`" + "\n" +
                "`reaction-role-list`" + "\n" +
                "`reaction-role-remove-all`" + "\n" +
                "`ranking-on`" + "\n" +
                "`ranking-off`",
            inline=True
        ).add_field(
            name="developer",
            value=
                "`ping`" + "\n" +
                "`botinfo`" + "\n" +
                "`menuadd`",
            inline=True
        ).add_field(
            name="guild admin",
            value=
                "`kick`" + "\n" +
                "`ban`" + "\n" +
                "`clear`" + "\n" +
                "`edit-server-icon`" + "\n" +
                "`restore-server-icon`" + "\n" +
                "`change-guild-name`" + "\n" +
                "`change-nickname`",
            inline=True
        ))

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
        mycursor = self.client.mysql.cursor()
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
            description="เช่น `{0}picsearch พิซซ่า`".format(config["prefix"]),
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
            description="เช่น `{0}loo หลับ`".format(config["prefix"]),
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
            description="เช่น `{0}tloo สับหลุบ`".format(config["prefix"]),
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