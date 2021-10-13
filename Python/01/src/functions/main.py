from config import config

def get_prefix(client, message):
    mycursor = client.mysql.cursor(buffered=True)
    mycursor.execute(f"SELECT * FROM `guilds` WHERE `guild_id` LIKE '{message.guild.id}'")
    try:
        prefix = mycursor.fetchall()[0][2]
        if prefix is None: prefix = config.prefix
    except IndexError:
        prefix = config.prefix
    return [prefix, f"<@!{client.user.id}> ",f"<@!{client.user.id}>"]