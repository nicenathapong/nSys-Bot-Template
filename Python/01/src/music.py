import discord
from discord.ext import commands
from config import config
import wavelink
from enum import Enum
import random
import asyncio
import datetime as dt
import typing as t
from src.functions.main import get_prefix
import re
from asyncio.exceptions import TimeoutError as ast
import math
import aiohttp

URL_REGEX = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
LYRICS_URL = "https://some-random-api.ml/lyrics?title="
HZ_BANDS = (20, 40, 63, 100, 150, 250, 400, 450, 630, 1000, 1600, 2500, 4000, 10000, 16000)
TIME_REGEX = r"([0-9]{1,2})[:ms](([0-9]{1,2})s?)?"
OPTIONS = {
    "1️⃣": 0,
    "2⃣": 1,
    "3⃣": 2,
    "4⃣": 3,
    "5⃣": 4,
}

class AlreadyConnectedToChannel(commands.CommandError):
    pass


class NoVoiceChannel(commands.CommandError):
    pass


class QueueIsEmpty(commands.CommandError):
    pass


class NoTracksFound(commands.CommandError):
    pass


class PlayerIsAlreadyPaused(commands.CommandError):
    pass


class NoMoreTracks(commands.CommandError):
    pass


class NoPreviousTracks(commands.CommandError):
    pass


class InvalidRepeatMode(commands.CommandError):
    pass


class VolumeTooLow(commands.CommandError):
    pass


class VolumeTooHigh(commands.CommandError):
    pass


class MaxVolume(commands.CommandError):
    pass


class MinVolume(commands.CommandError):
    pass


class NoLyricsFound(commands.CommandError):
    pass


class InvalidEQPreset(commands.CommandError):
    pass


class NonExistentEQBand(commands.CommandError):
    pass


class EQGainOutOfBounds(commands.CommandError):
    pass


class InvalidTimeString(commands.CommandError):
    pass

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

    @property
    def current_track(self):
        if not self._queue:
            return QueueIsEmpty

        if self.position <= len(self._queue) - 1:
            return self._queue[self.position]

    @property
    def upcoming(self):
        if not self._queue:
            raise QueueIsEmpty

        return self._queue[self.position + 1:]

    @property
    def history(self):
        if not self._queue:
            raise QueueIsEmpty

        return self._queue[:self.position]

    @property
    def length(self):
        return len(self._queue)

    def add(self, *args):
        self._queue.extend(args)

    def get_next_track(self):
        if not self._queue:
            raise QueueIsEmpty

        self.position += 1

        if self.position < 0:
            return None
        elif self.position > len(self._queue) - 1:
            if self.repeat_mode == RepeatMode.ALL:
                self.position = 0
            else:
                return None

        return self._queue[self.position]

    def shuffle(self):
        if not self._queue:
            raise QueueIsEmpty

        upcoming = self.upcoming
        random.shuffle(upcoming)
        self._queue = self._queue[:self.position + 1]
        self._queue.extend(upcoming)

    def set_repeat_mode(self, mode):
        if mode == "none":
            self.repeat_mode = RepeatMode.NONE
        elif mode == "1":
            self.repeat_mode = RepeatMode.ONE
        elif mode == "all":
            self.repeat_mode = RepeatMode.ALL

    def empty(self):
        self._queue.clear()
        self.position = 0

class Player(wavelink.Player):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.queue = Queue()
        self.eq_levels = [0.] * 15

    async def connect(self, ctx, channel=None):
        if self.is_connected:
            raise AlreadyConnectedToChannel

        if (channel := getattr(ctx.author.voice, "channel", channel)) is None:
            raise NoVoiceChannel

        await super().connect(channel.id)
        return channel

    async def teardown(self):
        try:
            await self.destroy()
        except KeyError:
            pass

    async def add_tracks(self, ctx, tracks):
        if not tracks:
            raise NoTracksFound

        if isinstance(tracks, wavelink.TrackPlaylist):
            self.queue.add(*tracks.tracks)
        elif len(tracks) == 1:
            self.queue.add(tracks[0])
            # await ctx.send(f"Added {tracks[0].title} to the queue.")
        else:
            # if (track := await self.choose_track(ctx, tracks)) is not None:
            #     self.queue.add(track)
            #     await ctx.send(f"Added {track.title} to the queue.")
            self.queue.add(tracks[0])

        if not self.is_playing and not self.queue.is_empty:
            await self.start_playback()

    # async def choose_track(self, ctx, tracks):
    #     def _check(r, u):
    #         return (
    #             r.emoji in OPTIONS.keys()
    #             and u == ctx.author
    #             and r.message.id == msg.id
    #         )

    #     embed = discord.Embed(
    #         title="Choose a song",
    #         description=(
    #             "\n".join(
    #                 f"**{i+1}.** {t.title} ({t.length//60000}:{str(t.length%60).zfill(2)})"
    #                 for i, t in enumerate(tracks[:5])
    #             )
    #         ),
    #         colour=ctx.author.colour,
    #         timestamp=dt.datetime.utcnow()
    #     )
    #     embed.set_author(name="Query Results")
    #     embed.set_footer(text=f"Invoked by {ctx.author.display_name}", icon_url=ctx.author.avatar_url)

    #     msg = await ctx.send(embed=embed)
    #     for emoji in list(OPTIONS.keys())[:min(len(tracks), len(OPTIONS))]:
    #         await msg.add_reaction(emoji)

    #     try:
    #         reaction, _ = await self.bot.wait_for("reaction_add", timeout=60.0, check=_check)
    #     except asyncio.TimeoutError:
    #         await msg.delete()
    #         await ctx.message.delete()
    #     else:
    #         await msg.delete()
    #         return tracks[OPTIONS[reaction.emoji]]

    async def start_playback(self):
        await self.play(self.queue.current_track)

    async def advance(self):
        try:
            if (track := self.queue.get_next_track()) is not None:
                await self.play(track)
        except QueueIsEmpty:
            pass

    async def repeat_track(self):
        await self.play(self.queue.current_track)

class music(commands.Cog, wavelink.WavelinkMixin):
    def __init__(self, client):
        self.client = client
        self.wavelink = wavelink.Client(bot=client)
        self.client.loop.create_task(self.start_nodes())

    @commands.Cog.listener()
    async def on_voice_state_update(self, member, before, after):
        if not member.bot and after.channel is None:
            if not [m for m in before.channel.members if not m.bot]:
                await self.get_player(member.guild).teardown()

    @wavelink.WavelinkMixin.listener()
    async def on_node_ready(self, node: wavelink.Node):
        print(f"Connect to node [{node.identifier}] finish!")

    @wavelink.WavelinkMixin.listener("on_track_stuck")
    @wavelink.WavelinkMixin.listener("on_track_end")
    @wavelink.WavelinkMixin.listener("on_track_exception")
    async def on_player_stop(self, node, payload):
        if payload.player.queue.repeat_mode == RepeatMode.ONE:
            await payload.player.repeat_track()
        else:
            await payload.player.advance()

    async def cog_check(self, ctx):
        if isinstance(ctx.channel, discord.DMChannel):
            await ctx.send("Music commands are not available in DMs.")
            return False

        return True
    
    async def start_nodes(self):
        for node in config.lavalink:
            await self.wavelink.initiate_node(**node)

    def get_player(self, obj):
        if isinstance(obj, commands.Context):
            return self.wavelink.get_player(obj.guild.id, cls=Player, context=obj)
        elif isinstance(obj, discord.Guild):
            return self.wavelink.get_player(obj.id, cls=Player)

    @commands.command(aliases=["join","connect"])
    async def connect_command(self, ctx, *, channel: t.Optional[discord.VoiceChannel]):
        player = self.get_player(ctx)
        channel = await player.connect(ctx, channel)
        await ctx.reply(embed=discord.Embed(
            title=f"เชื่อมต่อไปยังช่องเสียง `{channel.name}` เรียบร้อยค่ะ",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @connect_command.error
    async def connect_command_error(self, ctx, exc):
        if isinstance(exc, AlreadyConnectedToChannel):
            msg = await ctx.reply(embed=discord.Embed(
                title=f"เชื่อมต่อช่องเสียงที่คุณอยู่ อยู่แล้วค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))
            await asyncio.sleep(5)
            await msg.delete()
        elif isinstance(exc, NoVoiceChannel):
            msg = await ctx.reply(embed=discord.Embed(
                title=f"ไม่พบช่องเสียงที่คุณอยู่ค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))
            await asyncio.sleep(5)
            await msg.delete()

    @commands.command(aliases=["play","p","resume"])
    async def play_command(self, ctx, *, query: t.Optional[str]):
        player = self.get_player(ctx)

        if not player.is_connected:  
            channel = await player.connect(ctx)
            await ctx.reply(embed=discord.Embed(
                title=f"เชื่อมต่อไปยังช่องเสียง `{channel.name}` เรียบร้อยค่ะ",
                color=0x00ffff
            ).set_author(
                name="ดำเนินการเรียบร้อยค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        if query is None and "resume" in ctx.message.content:
            if player.queue.is_empty:
                raise QueueIsEmpty

            await player.set_pause(False)
            await ctx.reply(embed=discord.Embed(
                title=f"เล่นเพลงต่อเรียบร้อยค่ะ!",
                color=0x00ffff
            ).set_author(
                name="ดำเนินการเรียบร้อยค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        else:
            query = query.strip("<>")
            if not re.match(URL_REGEX, query):
                query = f"ytsearch:{query}"
            tracks = await self.wavelink.get_tracks(query)
            if not tracks: raise NoTracksFound
            await player.add_tracks(ctx, tracks)

            if isinstance(tracks, wavelink.TrackPlaylist): # playlist
                def generateEmbed(start):
                    current = tracks.tracks[start : start + 10]
                    embed = discord.Embed(
                        title=tracks.data["playlistInfo"]["name"],
                        url=query,
                        description=f"เพิ่มเพลงจากเพลย์ลิสต์ทั้งหมด {len(tracks.tracks)} ไปยังคิว เรียบร้อยค่ะ!",
                        color=0x00ffff
                    ).set_thumbnail(
                        url=current[0].thumb
                    ).set_author(
                        name="ดำเนินการเรียบร้อยค่ะ!",
                        icon_url=self.client.user.avatar_url,
                        url=config.author_url
                    ).set_footer(
                        text=f"นี่คือเพลงที่ {start + 1} ถึง {start + len(current)} จาก {len(tracks.tracks)} เพลงในเพลย์ลิสต์"
                    )
                    for track in current:
                        embed.add_field(
                            name=f"{tracks.tracks.index(track) + 1}) {track.title}",
                            value=f"*{track.length}* | {track.author}",
                            inline=False
                        )
                    return embed

                i = 0
                embedMessage = await ctx.reply(embed=generateEmbed(i))
                if len(tracks.tracks) > 10:
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
                        if i == 0: i = 10
                        i -= 10
                        await embedMessage.edit(embed=generateEmbed(i))
                    if em == "➡️":
                        if i == math.floor(len(tracks.tracks) / 10) * 10: i = (math.floor(len(tracks.tracks) / 10) * 10) - 10
                        i += 10
                        await embedMessage.edit(embed=generateEmbed(i))

            elif len(tracks) == 1:
                await ctx.reply(embed=discord.Embed(
                    title=tracks[0].title,
                    url=tracks[0].uri,
                    description="เพิ่มเพลงใหม่ไปยังคิว เรียบร้อยค่ะ!",
                    color=0x00ffff
                ).set_author(
                    name="ดำเนินการเรียบร้อยค่ะ!",
                    icon_url=self.client.user.avatar_url,
                    url=config.author_url
                ).set_thumbnail(
                    url=tracks[0].thumb
                ).add_field(
                    name="จากช่อง",
                    value="`{0}`".format(tracks[0].author),
                    inline=True
                ).add_field(
                    name="ระยะเวลา",
                    value="`{0}`".format(tracks[0].length),
                    inline=True
                ))
            else: # search
                await ctx.reply(embed=discord.Embed(
                    title=tracks[0].title,
                    url=tracks[0].uri,
                    description="เพิ่มเพลงใหม่ไปยังคิว เรียบร้อยค่ะ!",
                    color=0x00ffff
                ).set_author(
                    name="ดำเนินการเรียบร้อยค่ะ!",
                    icon_url=self.client.user.avatar_url,
                    url=config.author_url
                ).set_thumbnail(
                    url=tracks[0].thumb
                ).add_field(
                    name="จากช่อง",
                    value="`{0}`".format(tracks[0].author),
                    inline=True
                ).add_field(
                    name="ระยะเวลา",
                    value="`{0}`".format(tracks[0].length),
                    inline=True
                ))

    @play_command.error
    async def play_command_error(self, ctx, exc):
        if isinstance(exc, QueueIsEmpty):
            msg = await ctx.reply(embed=discord.Embed(
                title=f"คิวเพลงในขณะนี้โล่งอยู่ค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))
            await asyncio.sleep(5)
            await msg.delete()
        elif isinstance(exc, NoVoiceChannel):
            msg = await ctx.reply(embed=discord.Embed(
                title=f"ไม่พบช่องเสียงที่คุณอยู่ค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))
            await asyncio.sleep(5)
            await msg.delete()
        elif isinstance(exc, NoTracksFound):
            await ctx.reply(embed=discord.Embed(
                title=f"ไม่พบผลการค้นหาของเพลงที่คุณขอมาค่ะ!",
                description="ลองใช้ Keyword อื่นดูนะคะ หรือลองใช้เป็นลิงก์ดูค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

    @commands.command(name="pause")
    async def pause_command(self, ctx):
        player = self.get_player(ctx)

        if not player.is_connected:
            return await ctx.reply(embed=discord.Embed(
                title=f"ดูเหมือนตอนนี้บอทจะไม่ได้เชื่อมต่อช่องเสียงอยู่นะคะ?",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        if player.is_paused:
            return await ctx.reply(embed=discord.Embed(
                title=f"ขณะนี้บอทพักการเล่นอยู่แล้วค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        await player.set_pause(True)
        await ctx.reply(embed=discord.Embed(
            title=f"พักการเล่นเพลงเรียบร้อยค่ะ!",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @commands.command(name="next", aliases=["skip"])
    async def next_command(self, ctx):
        player = self.get_player(ctx)

        if not player.queue.upcoming:
            return await ctx.reply(embed=discord.Embed(
                title=f"ไม่มีเพลงถัดไปในคิวให้เล่นแล้วค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))

        await player.stop()
        await ctx.reply(embed=discord.Embed(
            title=f"กำลังเล่นเพลงถัดไปในคิวค่ะ",
            color=0x00ffff
        ).set_author(
            name="ดำเนินการเรียบร้อยค่ะ!",
            icon_url=self.client.user.avatar_url,
            url=config.author_url
        ))

    @next_command.error
    async def next_command_error(self, ctx, exc):
        if isinstance(exc, QueueIsEmpty):
            msg = await ctx.reply(embed=discord.Embed(
                title=f"คิวเพลงในขณะนี้โล่งอยู่ค่ะ",
                color=0x00ffff
            ).set_author(
                name="ไม่สามารถดำเนินการได้ค่ะ!",
                icon_url=self.client.user.avatar_url,
                url=config.author_url
            ))
            await asyncio.sleep(5)
            await msg.delete()

    @commands.command(name="previous")
    async def previous_command(self, ctx):
        player = self.get_player(ctx)

        if not player.queue.history:
            raise NoPreviousTracks

        player.queue.position -= 2
        await player.stop()
        await ctx.send("Playing previous track in queue.")

    @previous_command.error
    async def previous_command_error(self, ctx, exc):
        if isinstance(exc, QueueIsEmpty):
            await ctx.send("This could not be executed as the queue is currently empty.")
        elif isinstance(exc, NoPreviousTracks):
            await ctx.send("There are no previous tracks in the queue.")

    @commands.command(name="shuffle")
    async def shuffle_command(self, ctx):
        player = self.get_player(ctx)
        player.queue.shuffle()
        await ctx.send("Queue shuffled.")

    @shuffle_command.error
    async def shuffle_command_error(self, ctx, exc):
        if isinstance(exc, QueueIsEmpty):
            await ctx.send("The queue could not be shuffled as it is currently empty.")

    @commands.command(name="repeat")
    async def repeat_command(self, ctx, mode: str):
        if mode not in ("none", "1", "all"):
            raise InvalidRepeatMode

        player = self.get_player(ctx)
        player.queue.set_repeat_mode(mode)
        await ctx.send(f"The repeat mode has been set to {mode}.")

    @commands.command(name="queue")
    async def queue_command(self, ctx, show: t.Optional[int] = 10):
        player = self.get_player(ctx)

        if player.queue.is_empty:
            raise QueueIsEmpty

        embed = discord.Embed(
            title="Queue",
            description=f"Showing up to next {show} tracks",
            colour=ctx.author.colour,
            timestamp=dt.datetime.utcnow()
        )
        embed.set_author(name="Query Results")
        embed.set_footer(text=f"Requested by {ctx.author.display_name}", icon_url=ctx.author.avatar_url)
        embed.add_field(
            name="Currently playing",
            value=getattr(player.queue.current_track, "title", "No tracks currently playing."),
            inline=False
        )
        if upcoming := player.queue.upcoming:
            embed.add_field(
                name="Next up",
                value="\n".join(t.title for t in upcoming[:show]),
                inline=False
            )

        msg = await ctx.send(embed=embed)

    @queue_command.error
    async def queue_command_error(self, ctx, exc):
        if isinstance(exc, QueueIsEmpty):
            await ctx.send("The queue is currently empty.")

    # Requests -----------------------------------------------------------------

    @commands.group(name="volume", invoke_without_command=True)
    async def volume_group(self, ctx, volume: int):
        player = self.get_player(ctx)

        if volume < 0:
            raise VolumeTooLow

        if volume > 150:
            raise VolumeTooHigh

        await player.set_volume(volume)
        await ctx.send(f"Volume set to {volume:,}%")

    @volume_group.error
    async def volume_group_error(self, ctx, exc):
        if isinstance(exc, VolumeTooLow):
            await ctx.send("The volume must be 0% or above.")
        elif isinstance(exc, VolumeTooHigh):
            await ctx.send("The volume must be 150% or below.")

    @volume_group.command(name="up")
    async def volume_up_command(self, ctx):
        player = self.get_player(ctx)

        if player.volume == 150:
            raise MaxVolume

        await player.set_volume(value := min(player.volume + 10, 150))
        await ctx.send(f"Volume set to {value:,}%")

    @volume_up_command.error
    async def volume_up_command_error(self, ctx, exc):
        if isinstance(exc, MaxVolume):
            await ctx.send("The player is already at max volume.")

    @volume_group.command(name="down")
    async def volume_down_command(self, ctx):
        player = self.get_player(ctx)

        if player.volume == 0:
            raise MinVolume

        await player.set_volume(value := max(0, player.volume - 10))
        await ctx.send(f"Volume set to {value:,}%")

    @volume_down_command.error
    async def volume_down_command_error(self, ctx, exc):
        if isinstance(exc, MinVolume):
            await ctx.send("The player is already at min volume.")

    @commands.command(name="lyrics")
    async def lyrics_command(self, ctx, name: t.Optional[str]):
        player = self.get_player(ctx)
        name = name or player.queue.current_track.title

        async with ctx.typing():
            async with aiohttp.request("GET", LYRICS_URL + name, headers={}) as r:
                if not 200 <= r.status <= 299:
                    raise NoLyricsFound

                data = await r.json()

                if len(data["lyrics"]) > 2000:
                    return await ctx.send(f"<{data['links']['genius']}>")

                embed = discord.Embed(
                    title=data["title"],
                    description=data["lyrics"],
                    colour=ctx.author.colour,
                    timestamp=dt.datetime.utcnow(),
                )
                embed.set_thumbnail(url=data["thumbnail"]["genius"])
                embed.set_author(name=data["author"])
                await ctx.send(embed=embed)

    @lyrics_command.error
    async def lyrics_command_error(self, ctx, exc):
        if isinstance(exc, NoLyricsFound):
            await ctx.send("No lyrics could be found.")

    @commands.command(name="eq")
    async def eq_command(self, ctx, preset: str):
        player = self.get_player(ctx)

        eq = getattr(wavelink.eqs.Equalizer, preset, None)
        if not eq:
            raise InvalidEQPreset

        await player.set_eq(eq())
        await ctx.send(f"Equaliser adjusted to the {preset} preset.")

    @eq_command.error
    async def eq_command_error(self, ctx, exc):
        if isinstance(exc, InvalidEQPreset):
            await ctx.send("The EQ preset must be either 'flat', 'boost', 'metal', or 'piano'.")

    @commands.command(name="adveq", aliases=["aeq"])
    async def adveq_command(self, ctx, band: int, gain: float):
        player = self.get_player(ctx)

        if not 1 <= band <= 15 and band not in HZ_BANDS:
            raise NonExistentEQBand

        if band > 15:
            band = HZ_BANDS.index(band) + 1

        if abs(gain) > 10:
            raise EQGainOutOfBounds

        player.eq_levels[band - 1] = gain / 10
        eq = wavelink.eqs.Equalizer(levels=[(i, gain) for i, gain in enumerate(player.eq_levels)])
        await player.set_eq(eq)
        await ctx.send("Equaliser adjusted.")

    @adveq_command.error
    async def adveq_command_error(self, ctx, exc):
        if isinstance(exc, NonExistentEQBand):
            await ctx.send(
                "This is a 15 band equaliser -- the band number should be between 1 and 15, or one of the following "
                "frequencies: " + ", ".join(str(b) for b in HZ_BANDS)
            )
        elif isinstance(exc, EQGainOutOfBounds):
            await ctx.send("The EQ gain for any band should be between 10 dB and -10 dB.")

    @commands.command(name="playing", aliases=["np"])
    async def playing_command(self, ctx):
        player = self.get_player(ctx)

        if not player.is_playing:
            raise PlayerIsAlreadyPaused

        embed = discord.Embed(
            title="Now playing",
            colour=ctx.author.colour,
            timestamp=dt.datetime.utcnow(),
        )
        embed.set_author(name="Playback Information")
        embed.set_footer(text=f"Requested by {ctx.author.display_name}", icon_url=ctx.author.avatar_url)
        embed.add_field(name="Track title", value=player.queue.current_track.title, inline=False)
        embed.add_field(name="Artist", value=player.queue.current_track.author, inline=False)

        position = divmod(player.position, 60000)
        length = divmod(player.queue.current_track.length, 60000)
        embed.add_field(
            name="Position",
            value=f"{int(position[0])}:{round(position[1]/1000):02}/{int(length[0])}:{round(length[1]/1000):02}",
            inline=False
        )

        await ctx.send(embed=embed)

    @playing_command.error
    async def playing_command_error(self, ctx, exc):
        if isinstance(exc, PlayerIsAlreadyPaused):
            await ctx.send("There is no track currently playing.")

    @commands.command(name="skipto", aliases=["playindex"])
    async def skipto_command(self, ctx, index: int):
        player = self.get_player(ctx)

        if player.queue.is_empty:
            raise QueueIsEmpty

        if not 0 <= index <= player.queue.length:
            raise NoMoreTracks

        player.queue.position = index - 2
        await player.stop()
        await ctx.send(f"Playing track in position {index}.")

    @skipto_command.error
    async def skipto_command_error(self, ctx, exc):
        if isinstance(exc, QueueIsEmpty):
            await ctx.send("There are no tracks in the queue.")
        elif isinstance(exc, NoMoreTracks):
            await ctx.send("That index is out of the bounds of the queue.")

    @commands.command(name="restart")
    async def restart_command(self, ctx):
        player = self.get_player(ctx)

        if player.queue.is_empty:
            raise QueueIsEmpty

        await player.seek(0)
        await ctx.send("Track restarted.")

    @restart_command.error
    async def restart_command_error(self, ctx, exc):
        if isinstance(exc, QueueIsEmpty):
            await ctx.send("There are no tracks in the queue.")

    @commands.command(name="seek")
    async def seek_command(self, ctx, position: str):
        player = self.get_player(ctx)

        if player.queue.is_empty:
            raise QueueIsEmpty

        if not (match := re.match(TIME_REGEX, position)):
            raise InvalidTimeString

        if match.group(3):
            secs = (int(match.group(1)) * 60) + (int(match.group(3)))
        else:
            secs = int(match.group(1))

        await player.seek(secs * 1000)
        await ctx.send("Seeked.")

def setup(client):
    client.add_cog(music(client))