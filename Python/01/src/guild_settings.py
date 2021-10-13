import discord
from discord import guild
from discord import channel
from discord.ext import commands
import json
from PIL import Image, ImageDraw, ImageFont
import time
import requests
import io
import os

with open("./config.json","r",encoding="utf-8") as f:
    config = json.load(f)

class guild_settings(commands.Cog):
    def __init__(self, client):
        self.client = client

    @commands.command()
    @commands.has_permissions(administrator=True)
    async def setprefix(self, ctx, *, prefix=None):
        if prefix is None: return await ctx.reply(embed=discord.Embed(
            title=f"โปรดใส่ Prefix ที่ต้องการจะตั้งค่าด้วยนะคะ",
            description="เช่น `{0}setprefix =`".format(config["prefix"]),
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config["author_url"]
        ))
        mycursor = self.client.mysql.cursor()
        mycursor.execute("SELECT * FROM `guilds`")

        try:
            next(x for x in mycursor.fetchall() if x[1] == str(ctx.guild.id))
            mycursor.execute(f"UPDATE `guilds` SET `custom_prefix` = '{prefix}' WHERE `guild_id` = '{ctx.guild.id}'")
        except:
            mycursor.execute(
                "INSERT INTO guilds (id, guild_id, custom_prefix, blacklist, premium, ranking_exp, welcome_channel_id, auto_voice_channel_id, music_player_channel_id, reactions_roles) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (None, str(ctx.guild.id), prefix, None, None, None, None, None, None, None)
            )

        await ctx.reply(embed=discord.Embed(
            title=f"ตั้งค่า Prefix เป็น `{prefix}` เรียบร้อยค่ะ!",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config["author_url"]
        ))

    @commands.command(aliases=["rmsetprefix"])
    @commands.has_permissions(administrator=True)
    async def setprefix_remove(self, ctx):
        mycursor = self.client.mysql.cursor()
        mycursor.execute("SELECT * FROM `guilds`")

        try:
            this_guild_settings = next(x for x in mycursor.fetchall() if x[1] == str(ctx.guild.id))
            mycursor.execute(f"UPDATE `guilds` SET `custom_prefix` = NULL WHERE `guild_id` = '{ctx.guild.id}'")
            database_empty = 0
            for i in range(len(this_guild_settings)):
                if this_guild_settings.index(this_guild_settings[i]) != 0 and this_guild_settings.index(this_guild_settings[i]) != 1 and this_guild_settings[i] is None:
                    database_empty += 1
            if database_empty >= 7:
                mycursor.execute(f"DELETE FROM `guilds` WHERE `guild_id` = '{ctx.guild.id}'")
        except:
            return await ctx.reply(embed=discord.Embed(
            title=f"ไม่พบการตั้งค่า Custom prefix ของดิสนี้ในในระบบค่ะ",
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config["author_url"]
        ))

        await ctx.reply(embed=discord.Embed(
            title=f"ลบการตั้งค่า Prefix เรียบร้อยค่ะ!",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config["author_url"]
        ))

    @commands.command(aliases=["setjoinlog"])
    @commands.has_permissions(administrator=True)
    async def welcome_message_add(self, ctx, channel_id=None):
        if channel_id is None: return await ctx.reply(embed=discord.Embed(
            title=f"โปรดใส่เลข ID ของช่องข้อความที่ต้องการจะตั้งค่าด้วยนะคะ",
            description="เช่น `{0}setprefix 850819315745947719`".format(config["prefix"]),
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config["author_url"]
        ))
        if not channel_id.isnumeric(): return await ctx.reply(embed=discord.Embed(
            title=f"โปรดใส่เลข ID ของช่องข้อความ\nที่ต้องการจะตั้งค่าให้ถูกต้องด้วยนะคะ",
            description="เช่น `{0}setprefix 850819315745947719`".format(config["prefix"]),
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config["author_url"]
        ))
        try:
            channel = ctx.guild.get_channel(int(channel_id))

            mycursor = self.client.mysql.cursor()
            mycursor.execute("SELECT * FROM `guilds`")

            try:
                next(x for x in mycursor.fetchall() if x[1] == str(ctx.guild.id))
                mycursor.execute(f"UPDATE `guilds` SET `welcome_channel_id` = '{str(channel.id)}' WHERE `guild_id` = '{ctx.guild.id}'")
            except:
                mycursor.execute(
                    "INSERT INTO guilds (id, guild_id, custom_prefix, blacklist, premium, ranking_exp, welcome_channel_id, auto_voice_channel_id, music_player_channel_id, reactions_roles) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (None, str(ctx.guild.id), None, None, None, None, str(channel.id), None, None, None)
                )
                await ctx.reply(embed=discord.Embed(
                    title=f"ตั้งค่า Welcome message\nเป็นช่อง `{channel.name}` เรียบร้อยค่ะ!",
                    color=0x00ffff
                ).set_author(
                    name="ดำเนินการเรียบร้อยค่ะ!",
                    icon_url=self.client.user.avatar_url,
                    url=config["author_url"]
                ))
        except AttributeError:
            return await ctx.reply(embed=discord.Embed(
                title=f"ไม่พบช่องข้อความของ ID นั้นในดิสนี้ค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config["author_url"]
            ))
        mycursor = self.client.mysql.cursor()
        mycursor.execute("SELECT * FROM `guilds`")

    @commands.command(aliases=["rmsetjoinlog","rmjoinlog"])
    @commands.has_permissions(administrator=True)
    async def welcome_message_remove(self, ctx):
        mycursor = self.client.mysql.cursor()
        mycursor.execute("SELECT * FROM `guilds`")

        try:
            this_guild_settings = next(x for x in mycursor.fetchall() if x[1] == str(ctx.guild.id))
            mycursor.execute(f"UPDATE `guilds` SET `welcome_channel_id` = NULL WHERE `guild_id` = '{ctx.guild.id}'")
            database_empty = 0
            for i in range(len(this_guild_settings)):
                if this_guild_settings.index(this_guild_settings[i]) != 0 and this_guild_settings.index(this_guild_settings[i]) != 1 and this_guild_settings[i] is None:
                    database_empty += 1
            if database_empty >= 7:
                mycursor.execute(f"DELETE FROM `guilds` WHERE `guild_id` = '{ctx.guild.id}'")
        except:
            return await ctx.reply(embed=discord.Embed(
                title=f"ไม่พบการตั้งค่า Welcome message ของดิสนี้ในในระบบค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config["author_url"]
            ))

        await ctx.reply(embed=discord.Embed(
            title=f"ลบการตั้งค่า Welcome message เรียบร้อยค่ะ!",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config["author_url"]
        ))

    @commands.Cog.listener()
    async def on_member_join(self, member):
        mycursor = self.client.mysql.cursor(buffered=True)
        mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{member.guild.id}'")
        try:
            welcome_channel_id = mycursor.fetchall()[0][6]
            if welcome_channel_id is None: return
            await send_welcome_message(self, member, welcome_channel_id, _type="JOIN")
        except IndexError:
            return

    @commands.Cog.listener()
    async def on_member_remove(self, member):
        mycursor = self.client.mysql.cursor(buffered=True)
        mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{member.guild.id}'")
        try:
            welcome_channel_id = mycursor.fetchall()[0][6]
            if welcome_channel_id is None: return
            await send_welcome_message(self, member, welcome_channel_id, _type="LEFT")
        except IndexError:
            return
    
    @commands.command(aliases=["addautovc"])
    @commands.has_permissions(administrator=True)
    async def auto_voice_channel_add(self, ctx):
        mycursor = self.client.mysql.cursor()
        mycursor.execute("SELECT * FROM `guilds`")

        try:
            this_guild_settings = next(x for x in mycursor.fetchall() if x[1] == str(ctx.guild.id))
            if this_guild_settings[8] is None:
                ctg = await ctx.guild.create_category("Create Room | nSys")
                new_channel = await ctg.create_voice_channel("join - to create you room")
                mycursor.execute(f"UPDATE `guilds` SET `auto_voice_channel_id` = '{new_channel.id}' WHERE `guild_id` = '{ctx.guild.id}'")
            else:
                try:
                    channel = ctx.guild.get_channel(int(this_guild_settings[7]))
                    if str(channel.id) == this_guild_settings[7]:
                        return await ctx.reply(embed=discord.Embed(
                            title=f"มีการตั้งค่า Auto voice channel ของดิสนี้อยู่ในระบบแล้วค่ะ",
                            description="หากต้องการตั้งค่าใหม่ โปรดลบการตั้งค่าเก่าออกก่อนนะคะ",
                            color=0x00ffff
                        ).set_author(
                            name="ไม่สามารถดำเนินการได้ค่ะ!",
                            icon_url=self.client.user.avatar_url,
                            url=config["author_url"]
                        ))
                except AttributeError:
                    ctg = await ctx.guild.create_category("Create Room | nSys")
                    new_channel = await ctg.create_voice_channel("join - to create you room")
                    mycursor.execute(f"UPDATE `guilds` SET `auto_voice_channel_id` = '{new_channel.id}' WHERE `guild_id` = '{ctx.guild.id}'")
        except:
            ctg = await ctx.guild.create_category("Create Room | nSys")
            new_channel = await ctg.create_voice_channel("join - to create you room")
            mycursor.execute(
                "INSERT INTO guilds (id, guild_id, custom_prefix, blacklist, premium, ranking_exp, welcome_channel_id, auto_voice_channel_id, music_player_channel_id, reactions_roles) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (None, str(ctx.guild.id), None, None, None, None, None, str(new_channel.id), None, None)
            )

        await ctx.reply(embed=discord.Embed(
            title=f"ตั้งค่าช่อง Auto voice channel เรียบร้อยค่ะ!",
            description=f"<#{new_channel.id}>",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config["author_url"]
        ))

    @commands.command(aliases=["rmautovc"])
    @commands.has_permissions(administrator=True)
    async def auto_voice_channel_remove(self, ctx):
        mycursor = self.client.mysql.cursor()
        mycursor.execute("SELECT * FROM `guilds`")

        try:
            this_guild_settings = next(x for x in mycursor.fetchall() if x[1] == str(ctx.guild.id))
            if this_guild_settings[7] is None: return await ctx.reply(embed=discord.Embed(
                title=f"ไม่พบการตั้งค่า Auto voice channel ของดิสนี้ในในระบบค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config["author_url"]
            ))
            try:
                channel = ctx.guild.get_channel(int(this_guild_settings[7]))
                if str(channel.id) == this_guild_settings[7]:
                    ctg = channel.category
                    for ch in ctg.channels:
                        await channel.delete()
                    await ctg.delete()
                mycursor.execute(f"UPDATE `guilds` SET `auto_voice_channel_id` = NULL WHERE `guild_id` = '{ctx.guild.id}'")
            except AttributeError:
                mycursor.execute(f"UPDATE `guilds` SET `auto_voice_channel_id` = NULL WHERE `guild_id` = '{ctx.guild.id}'")
                database_empty = 0
                for i in range(len(this_guild_settings)):
                    if this_guild_settings.index(this_guild_settings[i]) != 0 and this_guild_settings.index(this_guild_settings[i]) != 1 and this_guild_settings[i] is None:
                        database_empty += 1
                if database_empty >= 7:
                    mycursor.execute(f"DELETE FROM `guilds` WHERE `guild_id` = '{ctx.guild.id}'")
        except:
            return await ctx.reply(embed=discord.Embed(
                title=f"ไม่พบการตั้งค่า Auto voice channel ของดิสนี้ในในระบบค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config["author_url"]
            ))

        await ctx.reply(embed=discord.Embed(
            title=f"ลบการตั้งค่า Auto voice channel เรียบร้อยค่ะ!",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config["author_url"]
        ))

    @commands.Cog.listener()
    async def on_voice_state_update(self, member, before, after):
        if member is not None:
            mycursor = self.client.mysql.cursor()
            mycursor.execute("SELECT * FROM `guilds`")
            guilds_settings = mycursor.fetchall()
            guilds = list(filter(lambda x: x[7] != None, guilds_settings))

            for i in range(len(guilds)):

                channel_main = member.guild.get_channel(int(guilds[i][7]))
                for member in channel_main.members:
                    new_channel = await member.guild.create_voice_channel(
                        name=f"{member.name} - Create",
                        category=channel_main.category
                    )
                    await member.move_to(new_channel)

                for channel in channel_main.category.channels:
                    if channel.id != int(guilds[i][7]) and len(channel.members) == 0:
                        try:
                            await channel.delete()
                        except:
                            pass
    
    @commands.Cog.listener()
    async def on_raw_message_delete(self, channel):
        if channel is not None:
            mycursor = self.client.mysql.cursor()
            mycursor.execute("SELECT * FROM `guilds`")
            guilds_settings = mycursor.fetchall()
            guilds = list(filter(lambda x: x[7] != None, guilds_settings))

            for i in range(len(guilds)):

                


    @commands.command(aliases=["reacroleadd"])
    @commands.has_permissions(administrator=True)
    async def reaction_role_add(self, ctx):
        pass

    @commands.command(aliases=["reacroleremove"])
    @commands.has_permissions(administrator=True)
    async def reaction_role_remove(self, ctx):
        pass

    @commands.command(aliases=["reacrolelist"])
    @commands.has_permissions(administrator=True)
    async def reaction_role_list(self, ctx):
        pass

    @commands.command(aliases=["reacrolerremoveall"])
    @commands.has_permissions(administrator=True)
    async def reaction_role_remove_all(self, ctx):
        pass

    @commands.command(aliases=["rankingmode"])
    @commands.has_permissions(administrator=True)
    async def rankingsystem(self, ctx):
        pass

def setup(client):
    client.add_cog(guild_settings(client))

async def send_welcome_message(self, member, welcome_channel_id, _type="JOIN"):
    if type(welcome_channel_id) == str: welcome_channel_id = int(welcome_channel_id)

    now = int(time.strftime("%H"))

    bgdefault = "./data/welcome/bg.png"
    white_layer = "./data/welcome/white_layer.png"
    dark_layer = "./data/welcome/dark_layer.png"
    font_path = "./data/welcome/FC Iconic Bold.ttf"

    fc84 = ImageFont.truetype(font_path, 84)
    fc72 = ImageFont.truetype(font_path, 72)
    fc52 = ImageFont.truetype(font_path, 52)

    im_profile = Image.open(io.BytesIO(requests.get(member.avatar_url).content))
    im_profile = im_profile.resize((300, 300))

    bigsize = (im_profile.size[0] * 3, im_profile.size[1] * 3)
    mask = Image.new('L', bigsize, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0) + bigsize, fill=255)
    mask = mask.resize(im_profile.size, Image.ANTIALIAS)
    im_profile.putalpha(mask)

    bg = Image.open(bgdefault)
    layer = Image.open(white_layer if now > 5 and now < 18 else dark_layer)

    bg.paste(layer, (0, 0), layer)
    bg.paste(im_profile, (60, 90), im_profile)
    draw = ImageDraw.Draw(bg)
    draw.text((400, 215), f"{member}", (42, 157, 244), font=fc72 if len(str(member)) > 20 else fc84)
    draw.text((380, 320), "ยินดีต้อนรับเข้าสู่" if _type == "JOIN" else "ได้ออกจากดิส", (42, 157, 244), font=fc52)
    draw.text((380, 370), f"ดิสคอร์ด {member.guild} ค่ะ!" if _type == "JOIN" else f"{member.guild} ไปแล้วค่ะ! ;w;", (42, 157, 244), font=fc52)

    filename = f"{str(member.id) + _type + str(member.guild.id)}"
    bg.save(f"./data/welcome/{filename}.png")
    channel = member.guild.get_channel(welcome_channel_id)
    await channel.send(
        file=discord.File(f"./data/welcome/{filename}.png", filename=f"{filename}.png"),
        embed=discord.Embed(
            description=f"{member.mention}\nยินดีต้อนรับสู่ {member.guild.name} ค่ะ" if _type == "JOIN" else f"{member.mention}\nได้ออกจากดิส {member.guild.name} ไปแล้วค่ะ ;w;",
            color=0x00ffff
        ).set_author(
            name="Member join!" if _type == "JOIN" else "Member left..",
            icon_url=member.guild.icon_url
        ).set_image(
            url=f"attachment://{filename}.png"
        )
    )
    os.remove(f"./data/welcome/{filename}.png")