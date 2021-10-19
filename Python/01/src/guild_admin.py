import discord
from discord.ext import commands
from config import config
import requests
import os
from src.functions.main import get_prefix

class guild_admin(commands.Cog):
    def __init__(self, client):
        self.client = client

    @commands.command()
    @commands.has_permissions(administrator=True)
    async def kick(self, ctx, member: discord.Member=None, *, reason=None):
        if member is None:
            return await ctx.reply(embed=discord.Embed(
                title=f"โปรดระบุผู้ใช้ที่ต้องการเตะด้วยนะคะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))
        await member.kick(reason=reason)
        await ctx.reply(embed=discord.Embed(
            title=f"`{member}`\nได้ถูกเตะออกจากดิสเรียบร้อยค่ะ",
            description="เหตุผล : " + ("None" if reason is None else reason),
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.command()
    @commands.has_permissions(administrator=True)
    async def ban(self, ctx, member: discord.Member=None, *, reason=None):
        if member is None:
            return await ctx.reply(embed=discord.Embed(
                title=f"โปรดระบุผู้ใช้ที่ต้องการแบนด้วยนะคะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))
        await member.ban(reason=reason)
        await ctx.reply(embed=discord.Embed(
            title=f"`{member}`\nได้ถูกแบนออกจากดิสเรียบร้อยค่ะ",
            description="เหตุผล : " + ("None" if reason is None else reason),
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.command()
    @commands.has_permissions(administrator=True)
    async def unban(self, ctx, *, member=None):
        if member is None:
            return await ctx.reply(embed=discord.Embed(
                title=f"โปรดระบุผู้ใช้ที่ต้องการปลดแบนด้วยนะคะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        banned_users = await ctx.guild.bans()
        member_name, member_discriminator = member.split('#')
        for ban_entry in banned_users:
            user = ban_entry.user

            if (user.name, user.discriminator) == (member_name, member_discriminator):
                await ctx.guild.unban(user)
                return await ctx.reply(embed=discord.Embed(
                    title=f"`{member}`\nได้ถูกปลดแบนเรียบร้อยค่ะ",
                    color=0x00ffff
                ).set_author(
                    name="ดำเนินการเรียบร้อยค่ะ!",
                    icon_url=self.client.user.avatar_url,
                    url=config.author_url
                ))

        await ctx.reply(embed=discord.Embed(
            title=f"ไม่พบผู้ใช้นี้ในรายชื่อผู้ที่ถูกแบนค่ะ",
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.command(aliases=["edit-server-icon"])
    @commands.has_permissions(administrator=True)
    async def editsvi(self, ctx, url=None):
        if url is None:
            return await ctx.reply(embed=discord.Embed(
                title=f"โปรดระบุ url ของรูปด้วยนะคะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        open(f"./data/temp/icon_server_{ctx.guild.id}.webp", "wb").write(requests.get(ctx.guild.icon_url).content)
        
        await ctx.guild.edit(icon=requests.get(url).content)
        await ctx.reply(embed=discord.Embed(
            title=f"เปลี่ยนปกดิสตาม url เรียบร้อยค่ะ",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ).set_image(url=url))

    @commands.command(aliases=["restore-server-icon"])
    @commands.has_permissions(administrator=True)
    async def restoresvi(self, ctx):
        if not os.path.isfile(f"./data/temp/icon_server_{ctx.guild.id}.webp"):
            return await ctx.reply(embed=discord.Embed(
                title=f"ไม่มีข้อมูลปกดิสก่อนหน้านี้ของดิสนี้ค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        await ctx.guild.edit(icon=open(f"./data/temp/icon_server_{ctx.guild.id}.webp", "rb").read())

        await ctx.reply(
            file=discord.File(f"./data/temp/icon_server_{ctx.guild.id}.webp", filename=f"icon_server_{ctx.guild.id}.webp"),
            embed=discord.Embed(
                    title=f"เปลี่ยนปกดิสเป็นรูปเดิมเรียบร้อยค่ะ",
                    color=0x00ffff
                ).set_author(
                    name="ดำเนินการเรียบร้อยค่ะ!",
                    icon_url=self.client.user.avatar_url,
                    url=config.author_url
                ).set_image(
                    url=f"attachment://icon_server_{ctx.guild.id}.webp"
                )
            )

    @commands.command(aliases=["edit-server-name"])
    @commands.has_permissions(administrator=True)
    async def editsvn(self, ctx, *, name=None):
        if name is None:
            return await ctx.reply(embed=discord.Embed(
                title=f"โปรดระบุชื่อดิสใหม่ที่ต้องการจะตั้งด้วยนะคะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))
        await ctx.guild.edit(name=name)
        await ctx.reply(embed=discord.Embed(
            title=f"เปลี่ยนชื่อดิสเป็น {name} เรียบร้อยค่ะ",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.command(aliases=["change-nickname"])
    @commands.has_permissions(administrator=True)
    async def chnick(self, ctx, member: discord.Member=None, name=None):
        if member is None or name is None:
            return await ctx.reply(embed=discord.Embed(
                title=f"โปรดระบุข้อมูลให้ครบถ้วนด้วยนะคะ",
                description=f"เช่น `{get_prefix(self.client, ctx)[0]}chnick @nicenathapong คนหล่อเท่`",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        await member.edit(nick=name)
        await ctx.reply(embed=discord.Embed(
            title=f"เปลี่ยนชื่อเล่น {member} เป็น {name} เรียบร้อยค่ะ",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

def setup(client):
    client.add_cog(guild_admin(client))