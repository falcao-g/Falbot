import discord
import json
from discord.ext import commands
from discord.ext.commands import has_permissions
from math import sqrt
from random import randint
from random import choice
from funcoes import secret_token, explain

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

@commands.guild_only()
@bot.command()
@has_permissions(administrator = True)
async def prefixo(ctx, arg=''):
    if arg == '':
        await ctx.send(embed=explain('prefixo'))
    else:
        with open('prefixes.json', 'r') as f:
            prefixes = json.load(f)
    
        prefixes[str(ctx.guild.id)] = arg

        with open('prefixes.json', 'w') as f:
            json.dump(prefixes, f, indent=4)
    
        await ctx.send(f'{ctx.message.author.mention} o prefixo do servidor foi mudado para "{arg}"  :smile:')

@commands.guild_only()
@bot.command()
async def glm(ctx):
    await ctx.message.delete()
    await ctx.send('Não.')

@commands.guild_only()
@bot.command()
async def lena(ctx, ruido, *args):
    mensagem = ''
    for c in args:
        mensagem += c
        mensagem += ' '

    if ruido == '0':
        vezes = randint(int(len(mensagem) / 5), int(len(mensagem) / 3))
    if ruido == '1':
        vezes = randint(int(len(mensagem) / 3), int(len(mensagem) / 2))
    if ruido == '2':
        vezes = randint(int(len(mensagem) / 2), int(len(mensagem) * 1))
    if ruido == '3':
        vezes = randint(int(len(mensagem) * 1), int(len(mensagem) * 1.5))
    if ruido == '4':
        vezes = randint(int(len(mensagem) * 1.5), int(len(mensagem) * 3))

    mensagemm = []
    for c in mensagem:
        mensagemm.append(c)

    for c in range(vezes):
        mensagemm.insert(randint(0,len(mensagemm)-1), choice('abcdefghijklmnopqrstuvwxyz'))

    mensagem = ''
    for c in mensagemm:
        mensagem += c

    await ctx.send(mensagem)

@commands.guild_only()
@bot.command()
async def flor(ctx):
    await ctx.message.delete()
    await ctx.send(':cherry_blossom:')

@commands.guild_only()
@bot.command()
async def falcao(ctx):
    await ctx.message.delete()
    await ctx.send(':thumbsup:')

@commands.guild_only()
@bot.command()
async def gih(ctx):
    await ctx.message.delete()
    await ctx.send(':sunglasses:')

@commands.guild_only()
@bot.command()
async def math(ctx, *args):
    num = ''
    for b in args:
        for c in b:
            if c == ' ' or c.lower() in 'abcdefghijklmnopuvwxyz':
                continue
            elif c == '=' and '!=' not in b:
                num += '=='
            elif c == '≥':
                num += '>='
            elif c == '≤':
                num += '<='
            else:
                num += c
    await ctx.send(f'O resultado é: {eval(num)}')

@commands.guild_only()
@bot.command()
async def coinflip(ctx):
    x = randint(0, 1)
    if x == 0:
        await ctx.send('cara')
    else:
        await ctx.send('coroa')

@commands.guild_only()
@bot.command()
async def simounao(ctx):
    message = await ctx.send('✅sim 🚫não')
    await message.add_reaction('✅')
    await message.add_reaction('🚫')

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

@commands.guild_only()
@bot.command(aliases=['help','ajuda'])
async def comandos(ctx, command=''):
    await ctx.send(embed=explain(command, ctx.guild.id))

bot.run(secret_token)
