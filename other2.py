import discord
from discord.ext import commands
import asyncio
import d20
import json
from discord.ext.commands import has_permissions
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from funcoes import secret_token
from time import sleep

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
    if 'd' in message.content and 'roll' not in message.content:
        with open('prefixes.json', 'r') as f:
            prefixes = json.load(f)

        prefixe = prefixes[str(message.guild.id)]
        
        message.content = f'{prefixe}roll' + ' ' + message.content
        await bot.process_commands(message)
    else:
        await bot.process_commands(message)

def tetris1():
    driver = webdriver.Chrome(ChromeDriverManager().install())
    driver.get('https://jstris.jezevec10.com/')

    ### creates room
    lobbyB = driver.find_element_by_id('lobby')
    lobbyB.click()

    createB = driver.find_element_by_id('createRoomButton')
    createB.click()

    privateC = driver.find_element_by_id('isPrivate')
    privateC.click()

    sleep(3)

    createBF = driver.find_element_by_id('create')
    createBF.click()

    sleep(5)

    joinLink = driver.find_element_by_class_name('joinLink')
    return joinLink.get_attribute('innerHTML'), driver

@commands.guild_only()
@bot.command()
async def tetris(ctx):
    loop = asyncio.get_running_loop()
    await ctx.send(f'{ctx.message.author.mention}, Esse comando levará alguns segundos para ser executado, tenha paciência!')
    result, driver = await loop.run_in_executor(None, tetris1)
    await ctx.send(result)

    await asyncio.sleep(30)
    driver.quit()

@commands.guild_only()
@bot.command()
@has_permissions(administrator = True)
async def limpa(ctx, arg=''):
    if arg == '':
        embed = discord.Embed(color=discord.Color.red())
        embed.add_field(name=f'Info', value=f'Limpa x mensagens do canal atual', inline=False)
        embed.add_field(name=f'Uso', value=f'?limpa <numero de mensagens>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)
    else:
        await ctx.message.delete()
        canal = ctx.channel
        for c in range(int(arg)):
            messages = await canal.history(limit=1).flatten()
            await messages[0].delete()

@commands.guild_only()
@bot.command()
async def roll(ctx, *roll):
    try:
        dice = ''
        for c in roll:
            dice += c
        result = d20.roll(dice)
        await ctx.send(f'{ctx.message.author.mention}, \n{result}')
    except d20.RollSyntaxError as Exception:
        print(Exception)

bot.run(secret_token)
