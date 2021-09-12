import discord
from discord.ext import commands
import asyncio
import d20
import json
from discord.ext.commands import has_permissions
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager  
from funcoes import *
from time import sleep
from random import randint

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
async def on_command_error(ctx,error):
    if "is not found" in str(error):
        pass
    elif 'index out of range' in str(error):
        pass
    else:
        print(f'O erro foi no comando {ctx.command} e aconteceu {error}')

def tetris1():
    driver = webdriver.Chrome(ChromeDriverManager().install())
    driver.get('https://jstris.jezevec10.com/')
    driver.find_element_by_id('lobby').click()
    driver.find_element_by_id('createRoomButton').click()
    driver.find_element_by_id('isPrivate').click()
    sleep(1)
    driver.find_element_by_id('create').click()
    sleep(3)
    return driver.find_element_by_class_name('joinLink').get_attribute('innerHTML'), driver

@commands.guild_only()
@bot.command()
async def tetris(ctx):
    loop = asyncio.get_running_loop()
    await ctx.send(f'{ctx.message.author.mention}, Esse comando levará alguns segundos para ser executado, tenha paciência! :pray:')
    try:
        result, driver = await loop.run_in_executor(None, tetris1)
    except:
        await ctx.send("Desculpe, mas ocorreu um erro, tente novamente mais tarde :confused:")
    else:
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
async def roll(ctx, *, roll):
    try:
        result = d20.roll(roll)
        await ctx.send(f'{ctx.message.author.mention}, \n{result}')
    except d20.RollSyntaxError:
        await ctx.send(f'{ctx.message.author.mention} {roll} não é um dado válido... :rage:')

@commands.guild_only()
@bot.command()
async def bonk(ctx, *args):
    for c in list(args):
        try:
            if not bot.get_user(int(c[3:-1])) != None:
                args.remove(c)
        except:
            args.remove(c)
    text = ''
    for c in args:
        text += c
        text += ' '
    await ctx.send(f'{text}',file=discord.File('bonk.gif'))

@bot.command()
async def bola8(ctx):
    respostas = [
        "certamente.",
        "sem dúvida.",
        "sim, definitivamente.",
        "você pode contar com isso.",
        "a meu ver, sim.",
        "provavelmente.",
        "sim.",
        "absolutamente.",
        "destino nublado, tente de novo.",
        "pergunte de novo mais tarde.",
        "melhor não te dizer agora.",
        "não posso prever agora.",
        "se concentre e pergunte de novo.",
        "não conte com isso.",
        "não.",
        "minhas fontes dizem que não.",
        "cenário não muito bom.",
        "muito duvidoso.",
        "as chances não são boas."
    ]
    resposta = (f"{ctx.message.author.mention}, {respostas[randint(0, len(respostas)-1)]}")
    embed = discord.Embed(color=discord.Color(await get_role_color(ctx, ctx.message.author.id)))
    embed.set_author(name="Bola 8 mágica", icon_url="https://images.emojiterra.com/google/noto-emoji/unicode-13.1/128px/1f3b1.png")
    embed.add_field(name="Previsão:", value=resposta, inline=False )
    embed.set_footer(text='by Falcão ❤️')
    await ctx.send(embed=embed)

if __name__ == '__main__':
    bot.run(secret_token)
