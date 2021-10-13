import discord
from discord.ext import commands
import wavelink
from enum import Enum
import re
from config import config

URL_REGEX = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"

class RepeatMode(Enum):
    NONE = 0
    ONE = 1
    ALL = 2

class Queue:
    def __init__(self):
        self._queue = []
        self.position = 0
        self.repeat_mode = RepeatMode.NONE

    @property
    def is_empty(self):
        return not self._queue

class Player(wavelink.Player):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.queue = Queue()
        self.eq_levels = [0.] * 15

    async def connect(self, ctx, channel_id=None):
        await super().connect(channel_id)
        return channel_id

    async def teardown(self):
        try:
            await self.destroy()
        except KeyError:
            pass

    async def add_tracks(self, tracks):
        if isinstance(tracks, wavelink.TrackPlaylist):
            self.queue.add(*tracks.tracks)
        elif len(tracks) == 1:
            self.queue.add(tracks[0])
        if not self.is_playing and not self.queue.is_empty:
            await self.start_playback()
        print(self.queue)

    async def advance(self):
        if (track := self.queue.get_next_track()) is not None: await self.play(track)

    async def repeat_track(self):
        await self.play(self.queue.current_track)

class music(commands.Cog, wavelink.WavelinkMixin):
    def __init__(self, client):
        self.client = client
        self.wavelink = wavelink.Client(bot=client)
        self.client.loop.create_task(self.start_nodes())

    @wavelink.WavelinkMixin.listener()
    async def on_node_ready(self, node):
        print(f"Connect to music node [{node.identifier}] finish!")

    @wavelink.WavelinkMixin.listener("on_track_stuck")
    @wavelink.WavelinkMixin.listener("on_track_end")
    @wavelink.WavelinkMixin.listener("on_track_exception")
    async def on_player_stop(self, node, payload):
        if payload.player.queue.repeat_mode == RepeatMode.ONE:
            await payload.player.repeat_track()
        else:
            await payload.player.advance()

    async def start_nodes(self):
        await self.client.wait_until_ready()
        await self.connect_nodes()

    async def connect_nodes(self):
        for node in config.lavalink:
            await self.wavelink.initiate_node(**node)

    def get_player(self, obj):
        if isinstance(obj, commands.Context):
            return self.wavelink.get_player(obj.guild.id, cls=Player, context=obj)
        elif isinstance(obj, discord.Guild):
            return self.wavelink.get_player(obj.id, cls=Player)

    @commands.command()
    async def join(self, ctx, channel: discord.VoiceChannel=None):
        if channel is None:
            try:
                channel = ctx.author.voice.channel
            except AttributeError:
                return await ctx.reply(embed=discord.Embed(
                    title=f"ไม่พบช่องเสียงที่คุณอยู่ค่ะ",
                    color=0x00ffff
                ).set_author(
                    name="ไม่สามารถดำเนินการได้ค่ะ!",
                    icon_url=self.client.user.avatar_url,
                    url=config.author_url
                ))
        player = self.get_player(ctx)
        await player.connect(channel.id)
        await ctx.reply(embed=discord.Embed(
            title=f"เชื่อมต่อไปยังช่องเสียง `{channel.name}` เรียบร้อยค่ะ",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.command(aliases=["p"])
    async def play(self, ctx, *, query: str=None):
        player = self.get_player(ctx)
        if not player.is_connected:
            try:
                await player.connect(ctx)
            except AttributeError:
                return await ctx.reply(embed=discord.Embed(
                    title="ไม่พบช่องเสียงที่คุณอยู่ค่ะ",
                    color=0x00ffff
                ).set_author(
                    name="ไม่สามารถดำเนินการได้ค่ะ!",
                    icon_url=self.client.user.avatar_url,
                    url=config.author_url
                ))
        if query is None: return await ctx.reply(embed=discord.Embed(
            title="โปรดใส่ลิงก์หรือชื่อเพลงที่ต้องการจะให้เล่นมาด้วยนะคะ",
            description="เช่น `{0}play Stellar Stellar`".format(config["prefix"]),
            color=0x00ffff
        ).set_author(
            name="ไม่สามารถดำเนินการได้ค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

        if not re.match(URL_REGEX, query): query = f"ytsearch:{query}"

        tracks = await self.wavelink.get_tracks(query)

        if tracks is None: return await ctx.reply(embed=discord.Embed(
                title="ไม่พบผลการค้นหาของเพลงที่คุณขอมาค่ะ!",
                description="ลองใช้ Keyword อื่นดูนะคะ หรือลองใช้เป็นลิงก์ดูค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))
        

        if isinstance(tracks, wavelink.TrackPlaylist):
            print(tracks)
        else:
            print(tracks[0].info)

        await player.add_tracks(tracks)


def setup(client):
    client.add_cog(music(client))