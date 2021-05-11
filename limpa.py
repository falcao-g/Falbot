import discord
from discord.ext import commands
import json
from discord.ext.commands import has_permissions
from secret import secret_token

def get_prefix(client, message):
    with open('prefixes.json', 'r') as f:
        prefixes = json.load(f)
    
    try:
        return prefixes[str(message.guild.id)]
    except KeyError:
        with open('prefixes.json', 'r') as f:
            prefixes = json.load(f)
    
        prefixes[str(message.guild.id)] = '?'

        with open('prefixes.json', 'w') as f:
            json.dump(prefixes, f, indent=4)

        return prefixes[str(message.guild.id)]

intents = discord.Intents(messages=True, guilds=True, members=True, reactions=True, guild_messages=True)
client = commands.Bot(command_prefix=get_prefix, case_insensitive=True, intents=intents, help_command=None)

@commands.guild_only()
@client.command()
@has_permissions(administrator = True)
async def limpa(ctx, arg):
    await ctx.message.delete()
    canal = ctx.channel
    for c in range(int(arg)):
        messages = await canal.history(limit=1).flatten()
        await messages[0].delete()

client.run(secret_token)