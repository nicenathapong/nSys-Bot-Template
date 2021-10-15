import discord
from discord.ext import commands
from PIL import Image, ImageDraw, ImageFont
import time
import requests
import io
import os
from config import config
import json
from discord_emoji import to_discord

class guild_settings(commands.Cog):
    def __init__(self, client):
        self.client = client

    @commands.command(aliases=["prefix"])
    @commands.has_permissions(administrator=True)
    async def setprefix(self, ctx, *, prefix=None):
        if prefix is None: return await ctx.reply(embed=discord.Embed(
            title=f"โปรดใส่ Prefix ที่ต้องการจะตั้งค่าด้วยนะคะ",
            description="เช่น `{0}setprefix =`".format(config.prefix),
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

        mycursor = self.client.mysql.cursor()
        mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{ctx.guild.id}'")
        if mycursor.fetchone() is not None:
            mycursor.execute(f"UPDATE `guilds` SET `custom_prefix` = '{prefix}' WHERE `guild_id` = '{ctx.guild.id}'")
        else:
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
            url=config.author_url
        ))

    @commands.command(aliases=["rmsetprefix","rmprefix"])
    @commands.has_permissions(administrator=True)
    async def setprefix_remove(self, ctx):
        mycursor = self.client.mysql.cursor()
        mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{ctx.guild.id}'")
        this_guild_settings = mycursor.fetchone()
        if this_guild_settings is not None:
            if this_guild_settings[2] is None:
                return await ctx.reply(embed=discord.Embed(
                    title=f"ไม่พบการตั้งค่า Custom prefix ของดิสนี้ในในระบบค่ะ",
                    color=0x00ffff
                ).set_author(
                    name="ไม่สามารถดำเนินการได้ค่ะ!",
                    icon_url=self.client.user.avatar_url,
                    url=config.author_url
                ))
            mycursor.execute(f"UPDATE `guilds` SET `custom_prefix` = NULL WHERE `guild_id` = '{ctx.guild.id}'")
            database_empty = 0
            for i in range(len(this_guild_settings)):
                if this_guild_settings.index(this_guild_settings[i]) != 0 and this_guild_settings.index(this_guild_settings[i]) != 1 and this_guild_settings[i] is None:
                    database_empty += 1
            if database_empty >= 7:
                mycursor.execute(f"DELETE FROM `guilds` WHERE `guild_id` = '{ctx.guild.id}'")
        else:
            return await ctx.reply(embed=discord.Embed(
                title=f"ไม่พบการตั้งค่า Custom prefix ของดิสนี้ในในระบบค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        await ctx.reply(embed=discord.Embed(
            title=f"ลบการตั้งค่า Prefix เรียบร้อยค่ะ!",
            description=f"ตอนนี้ Prefix ของดิสนี้กลับมาเป็น {config.prefix} แล้วค่ะ",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.command(aliases=["setjoinlog"])
    @commands.has_permissions(administrator=True)
    async def welcome_message_add(self, ctx, channel_id=None):
        if channel_id is None: return await ctx.reply(embed=discord.Embed(
            title=f"โปรดใส่เลข ID ของช่องข้อความที่ต้องการจะตั้งค่าด้วยนะคะ",
            description="เช่น `{0}setprefix 850819315745947719`".format(config.prefix),
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))
        if not channel_id.isnumeric(): return await ctx.reply(embed=discord.Embed(
            title=f"โปรดใส่เลข ID ของช่องข้อความ\nที่ต้องการจะตั้งค่าให้ถูกต้องด้วยนะคะ",
            description="เช่น `{0}setprefix 850819315745947719`".format(config.prefix),
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))
        try:
            channel = ctx.guild.get_channel(int(channel_id))

            mycursor = self.client.mysql.cursor()
            mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{ctx.guild.id}'")
            this_guild_settings = mycursor.fetchone()
            if this_guild_settings is not None:
                mycursor.execute(f"UPDATE `guilds` SET `welcome_channel_id` = '{str(channel.id)}' WHERE `guild_id` = '{ctx.guild.id}'")
            else:
                mycursor.execute(
                    "INSERT INTO guilds (id, guild_id, custom_prefix, blacklist, premium, ranking_exp, welcome_channel_id, auto_voice_channel_id, music_player_channel_id, reactions_roles) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (None, str(ctx.guild.id), None, None, None, None, str(channel.id), None, None, None)
                )
        except AttributeError:
            return await ctx.reply(embed=discord.Embed(
                title=f"ไม่พบช่องข้อความของ ID นั้นในดิสนี้ค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        await ctx.reply(embed=discord.Embed(
            title=f"ตั้งค่า Welcome message\nเป็นช่อง `{channel.name}` เรียบร้อยค่ะ!",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.command(aliases=["rmsetjoinlog","rmjoinlog"])
    @commands.has_permissions(administrator=True)
    async def welcome_message_remove(self, ctx):
        mycursor = self.client.mysql.cursor()
        mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{ctx.guild.id}'")
        this_guild_settings = mycursor.fetchone()
        if this_guild_settings is not None:
            if this_guild_settings[6] is None:
                return await ctx.reply(embed=discord.Embed(
                    title=f"ไม่พบการตั้งค่า Welcome message ของดิสนี้ในในระบบค่ะ",
                    color=0x00ffff
                ).set_author(
                    name="ไม่สามารถดำเนินการได้ค่ะ!",
                    icon_url=self.client.user.avatar_url,
                    url=config.author_url
                ))
            mycursor.execute(f"UPDATE `guilds` SET `welcome_channel_id` = NULL WHERE `guild_id` = '{ctx.guild.id}'")
            database_empty = 0
            for i in range(len(this_guild_settings)):
                if this_guild_settings.index(this_guild_settings[i]) != 0 and this_guild_settings.index(this_guild_settings[i]) != 1 and this_guild_settings[i] is None:
                    database_empty += 1
            if database_empty >= 7:
                mycursor.execute(f"DELETE FROM `guilds` WHERE `guild_id` = '{ctx.guild.id}'")
        else:
            return await ctx.reply(embed=discord.Embed(
                title=f"ไม่พบการตั้งค่า Welcome message ของดิสนี้ในในระบบค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        await ctx.reply(embed=discord.Embed(
            title=f"ลบการตั้งค่า Welcome message เรียบร้อยค่ะ!",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.Cog.listener()
    async def on_member_join(self, member):
        mycursor = self.client.mysql.cursor()
        mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{member.guild.id}'")
        this_guild_settings = mycursor.fetchone()
        if this_guild_settings is not None:
            if this_guild_settings[6] is not None:
                await send_welcome_message(self, member, this_guild_settings[6], "JOIN")

    @commands.Cog.listener()
    async def on_member_remove(self, member):
        mycursor = self.client.mysql.cursor()
        mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{member.guild.id}'")
        this_guild_settings = mycursor.fetchone()
        if this_guild_settings is not None:
            if this_guild_settings[6] is not None:
               await  send_welcome_message(self, member, this_guild_settings[6], "LEFT")
    
    @commands.command(aliases=["addautovc"])
    @commands.has_permissions(administrator=True)
    async def auto_voice_channel_add(self, ctx):
        mycursor = self.client.mysql.cursor()
        mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{ctx.guild.id}'")
        this_guild_settings = mycursor.fetchone()
        if this_guild_settings is not None:
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
                            url=config.author_url
                        ))
                except AttributeError:
                    ctg = await ctx.guild.create_category("Create Room | nSys")
                    new_channel = await ctg.create_voice_channel("join - to create you room")
                    mycursor.execute(f"UPDATE `guilds` SET `auto_voice_channel_id` = '{new_channel.id}' WHERE `guild_id` = '{ctx.guild.id}'")
        else:
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
            url=config.author_url
        ))

    @commands.command(aliases=["rmautovc"])
    @commands.has_permissions(administrator=True)
    async def auto_voice_channel_remove(self, ctx):
        mycursor = self.client.mysql.cursor()
        mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{ctx.guild.id}'")
        this_guild_settings = mycursor.fetchone()
        if this_guild_settings is not None:
            if this_guild_settings[7] is None:
                return await ctx.reply(embed=discord.Embed(
                    title=f"ไม่พบการตั้งค่า Auto voice channel ของดิสนี้ในในระบบค่ะ",
                    color=0x00ffff
                ).set_author(
                    name="ไม่สามารถดำเนินการได้ค่ะ!",
                    icon_url=self.client.user.avatar_url,
                    url=config.author_url
                ))
            try:
                channel = ctx.guild.get_channel(int(this_guild_settings[7]))
                if str(channel.id) == this_guild_settings[7]:
                    ctg = channel.category
                    for ch in ctg.channels:
                        await ch.delete()
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
        else:
            return await ctx.reply(embed=discord.Embed(
                title=f"ไม่พบการตั้งค่า Auto voice channel ของดิสนี้ในในระบบค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        await ctx.reply(embed=discord.Embed(
            title=f"ลบการตั้งค่า Auto voice channel เรียบร้อยค่ะ!",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.Cog.listener()
    async def on_voice_state_update(self, member, before, after):
        if member is not None:
            mycursor = self.client.mysql.cursor()
            mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{member.guild.id}'")
            this_guild_settings = mycursor.fetchone()
            if this_guild_settings is not None:
                if this_guild_settings[7] is not None:
                    try:
                        channel_main = member.guild.get_channel(int(this_guild_settings[7]))
                        for member in channel_main.members:
                            new_channel = await member.guild.create_voice_channel(
                                name=f"{member.name} - Create",
                                category=channel_main.category
                            )
                            await member.move_to(new_channel)
                    except:
                        pass
                    try:
                        for channel in channel_main.category.channels:
                            if channel.id != int(this_guild_settings[7]) and len(channel.members) == 0:
                                await channel.delete()
                    except:
                        pass

    @commands.Cog.listener()
    async def on_guild_channel_delete(self, channel):
        mycursor = self.client.mysql.cursor()
        mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{channel.guild.id}'")
        this_guild_settings = mycursor.fetchone()
        if this_guild_settings is not None:
            if this_guild_settings[7] is not None:
                try:
                    channel_system = channel.guild.get_channel(int(this_guild_settings[7]))
                    if channel_system.id is not None:
                        pass
                except AttributeError:
                    try:
                        ctg = channel.category
                        for ch in ctg.channels:
                            await ch.delete()
                    except:
                        pass
                    mycursor.execute(f"UPDATE `guilds` SET `auto_voice_channel_id` = NULL WHERE `guild_id` = '{channel.guild.id}'")
                    database_empty = 0
                    for i in range(len(this_guild_settings)):
                        if this_guild_settings.index(this_guild_settings[i]) != 0 and this_guild_settings.index(this_guild_settings[i]) != 1 and this_guild_settings[i] is None:
                            database_empty += 1
                    if database_empty >= 7:
                        mycursor.execute(f"DELETE FROM `guilds` WHERE `guild_id` = '{channel.guild.id}'")
                    print(f"\n[AUTO_VC] auto voice channel from [ {channel.guild.name} - {channel.guild.id} ] is lost.\n[AUTO_VC] DELETE SETTINGS IN DATABASE FINISH.")
                    
                try:
                    ctg = discord.utils.get(channel.guild.channels, name="Create Room | nSys")
                    if ctg.id is not None:
                        pass
                except AttributeError:
                    try:
                        channel_main = discord.utils.get(channel.guild.channels, name="join - to create you room")
                        await channel_main.delete()
                    except:
                        pass
                    mycursor.execute(f"UPDATE `guilds` SET `auto_voice_channel_id` = NULL WHERE `guild_id` = '{channel.guild.id}'")
                    database_empty = 0
                    for i in range(len(this_guild_settings)):
                        if this_guild_settings.index(this_guild_settings[i]) != 0 and this_guild_settings.index(this_guild_settings[i]) != 1 and this_guild_settings[i] is None:
                            database_empty += 1
                    if database_empty >= 7:
                        mycursor.execute(f"DELETE FROM `guilds` WHERE `guild_id` = '{channel.guild.id}'")
                    print(f"\n[AUTO_VC] auto voice channel from [ {channel.guild.name} - {channel.guild.id} ] is lost.\n[AUTO_VC] DELETE SETTINGS IN DATABASE FINISH.")
            
    @commands.command(aliases=["reacroleadd"])
    @commands.has_permissions(administrator=True)
    async def reaction_role_add(self, ctx, channel_id: int=None, message_id: int=None, emoji=None, role: discord.Role=None):
        if channel_id is None or message_id is None or emoji is None or role is None:
            return await ctx.reply(embed=discord.Embed(
                title=f"โปรดใส่ข้อมูลของ Reaction Role ให้ครบถ้วนด้วยนะคะ",
                description="เช่น `{0}reacroleadd 850819315745947719 898267492403793961 👍 <แท็กยศนั้นๆ>`".format(config.prefix),
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        try:
            channel = ctx.guild.get_channel(channel_id)
            message = await channel.fetch_message(message_id)
            if channel.id is not None:
                pass
            if message.content is not None:
                await message.add_reaction(emoji)
        except AttributeError:
            return await ctx.reply(embed=discord.Embed(
                title=f"ไม่พบข้อความของ ID {channel_id} ค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        data = {"emoji": to_discord(emoji), "role_id": role.id}
        mycursor = self.client.mysql.cursor()
        mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{channel.guild.id}'")
        this_guild_settings = mycursor.fetchone()
        if this_guild_settings is not None:
            if this_guild_settings[9] is not None:
                old_data = json.loads(this_guild_settings[9])
                if data in old_data: return await ctx.reply(embed=discord.Embed(
                    title=f"มี Setting ของ Reaction Role นี้อยู่ในระบบอยู่แล้วค่ะ",
                    color=0x00ffff
                ).set_author(
                    name="ไม่สามารถดำเนินการได้ค่ะ!",
                    icon_url=self.client.user.avatar_url,
                    url=config.author_url
                ))
                old_data.append(data)
                mycursor.execute(f"UPDATE `guilds` SET `reactions_roles` = '{json.dumps(old_data)}' WHERE `guild_id` = '{ctx.guild.id}'")
            else:
                mycursor.execute(f"UPDATE `guilds` SET `reactions_roles` = '{json.dumps([data])}' WHERE `guild_id` = '{ctx.guild.id}'")
        else:
            mycursor.execute(
                "INSERT INTO guilds (id, guild_id, custom_prefix, blacklist, premium, ranking_exp, welcome_channel_id, auto_voice_channel_id, music_player_channel_id, reactions_roles) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (None, str(ctx.guild.id), None, None, None, None, None, None, None, json.dumps([data]))
            )

        await ctx.reply(embed=discord.Embed(
            title=f"เพิ่ม Reaction Role ใหม่ เรียบร้อยค่ะ!",
            description="```" + f"msgID[{message.id}] : {emoji} => {role.name}" + "```",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.command(aliases=["reacroleremove","rmreacrole"])
    @commands.has_permissions(administrator=True)
    async def reaction_role_remove(self, ctx, channel_id: int=None, message_id: int=None, emoji=None, role: discord.Role=None):
        if channel_id is None or message_id is None or emoji is None or role is None:
            return await ctx.reply(embed=discord.Embed(
                title=f"โปรดใส่ข้อมูลของ Reaction Role ให้ครบถ้วนด้วยนะคะ",
                description="เช่น `{0}reacroleadd 850819315745947719 898267492403793961 👍 <แท็กยศนั้นๆ>`".format(config.prefix),
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        try:
            channel = ctx.guild.get_channel(channel_id)
            message = await channel.fetch_message(message_id)
            if channel.id is not None:
                pass
            if message.content is not None:
                pass
        except AttributeError:
            return await ctx.reply(embed=discord.Embed(
                title=f"ไม่พบข้อความของ ID {channel_id} ค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        data = {"emoji": to_discord(emoji), "role_id": role.id}
        mycursor = self.client.mysql.cursor()
        mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{channel.guild.id}'")
        this_guild_settings = mycursor.fetchone()
        if this_guild_settings is not None:
            if this_guild_settings[9] is not None:
                old_data = json.loads(this_guild_settings[9])
                if data in old_data:
                    for d in old_data:
                        if d["emoji"] == to_discord(emoji) and d["role_id"] == role.id: del d
                    if len(old_data) <= 1:
                        mycursor.execute(f"UPDATE `guilds` SET `reactions_roles` = NULL WHERE `guild_id` = '{ctx.guild.id}'")
                    else:
                        mycursor.execute(f"UPDATE `guilds` SET `reactions_roles` = '{json.dumps(old_data)}' WHERE `guild_id` = '{ctx.guild.id}'")
                    database_empty = 0
                    for i in range(len(this_guild_settings)):
                        if this_guild_settings.index(this_guild_settings[i]) != 0 and this_guild_settings.index(this_guild_settings[i]) != 1 and this_guild_settings[i] is None:
                            database_empty += 1
                    if database_empty >= 7:
                        mycursor.execute(f"DELETE FROM `guilds` WHERE `guild_id` = '{ctx.guild.id}'")
                    return await ctx.reply(embed=discord.Embed(
                        title=f"ลบ Reaction Role เรียบร้อยค่ะ!",
                        description="```" + f"msgID[{message.id}] : {emoji} => {role.name}" + "```",
                        color=0x00ffff
                    ).set_author(
                        name="ดำเนินการเรียบร้อยค่ะ!",
                        icon_url=self.client.user.avatar_url,
                        url=config.author_url
                    ))

        await ctx.reply(embed=discord.Embed(
            title=f"ไม่พบ Setting ของ Reaction role นี้ในระบบค่ะ",
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.Cog.listener()
    async def on_raw_reaction_add(self, payload):
        mycursor = self.client.mysql.cursor()
        mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{payload.guild_id}'")
        this_guild_settings = mycursor.fetchone()
        if this_guild_settings is not None:
            if this_guild_settings[9] is not None:
                data = json.loads(this_guild_settings[9])
                for e in data:
                    emoji_config = e["emoji"]
                    role_id = e["role_id"]
                    if to_discord(payload.emoji.name) == emoji_config:
                        try:
                            guild = self.client.get_guild(payload.guild_id)
                            member = guild.get_member(payload.user_id)
                            role = discord.utils.get(guild.roles, id=role_id)
                            await member.add_roles(role)
                        except:
                            pass

    @commands.Cog.listener()
    async def on_raw_reaction_remove(self, payload):
        mycursor = self.client.mysql.cursor()
        mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{payload.guild_id}'")
        this_guild_settings = mycursor.fetchone()
        if this_guild_settings is not None:
            if this_guild_settings[9] is not None:
                data = json.loads(this_guild_settings[9])
                for e in data:
                    emoji_config = e["emoji"]
                    role_id = e["role_id"]
                    if to_discord(payload.emoji.name) == emoji_config:
                        try:
                            guild = self.client.get_guild(payload.guild_id)
                            member = guild.get_member(payload.user_id)
                            role = discord.utils.get(guild.roles, id=role_id)
                            await member.remove_roles(role)
                        except:
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