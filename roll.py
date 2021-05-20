import d20
import discord
import json
from discord.ext import commands
from secret import secret_token

def get_prefix(bot, message):
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
bot = commands.Bot(command_prefix=get_prefix, case_insensitive=True, intents=intents, help_command=None)

@bot.event
async def on_message(message):
    if 'd' in message.content:
        message.content = '?roll' + ' ' + message.content
        await bot.process_commands(message)

@commands.guild_only()
@bot.command()
async def roll(ctx, *roll):
    try:
        dice = ''
        for c in roll:
            dice += c
        result = d20.roll(dice)
        await ctx.send(f'{ctx.message.author.mention}, \n{result}')
    except d20.RollSyntaxError:
        pass

bot.run(secret_token)
