import wavelink
from config import config

class wavelink(wavelink.WavelinkMixin):

    async def connect_nodes(client):
        client.wavelink = wavelink.Client(bot=client)
        for node in config.lavalink:
            await client.wavelink.initiate_node(**node)

    @wavelink.WavelinkMixin.listener()
    async def on_node_ready(self, node):
        print(f" Wavelink node `{node.identifier}` ready.")