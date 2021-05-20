import discord
import json
from discord.ext import commands
from discord.ext.commands import has_permissions
from math import sqrt
from random import randint
from random import choice
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

@commands.guild_only()
@bot.command()
@has_permissions(administrator = True)
async def prefixo(ctx, arg=''):
    if arg == '':
        embed = discord.Embed(
            color=discord.Color.red()
        )
        embed.add_field(name=f'Info', value=f'Muda o prefixo do servidor atual (só usuários com a permissão de admin podem usar)', inline=False)
        embed.add_field(name=f'Uso', value=f'?prefixo <prefixo>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)
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
async def luh(ctx):
    #amor da minha vida <3
    await ctx.message.delete()
    await ctx.send(':two_hearts:')

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
        await ctx.send('head')
    else:
        await ctx.send('tail')

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
@bot.command(aliases=['help'])
async def comandos(ctx, command=''):
    with open('prefixes.json', 'r') as f:
        prefixes = json.load(f)

    command = command.lower()

    if command == 'eu':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Mostra seus Falcoins, Vitorias e Divida, caso tenha uma', inline=False)
        embed.add_field(name=f'Uso', value=f'?eu')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'sobre':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Mostra os Falcoins, Vitorias e Divida, da pessoa marcada', inline=False)
        embed.add_field(name=f'Uso', value=f'?sobre @usuario')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'lootbox':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Resgata sua lootbox grátis (disponível a cada 30 minutos)', inline=False)
        embed.add_field(name=f'Uso', value=f'?lootbox/?lb')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'doar':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Doa x Falcoins para o usuário marcado', inline=False)
        embed.add_field(name=f'Uso', value=f'?doar @usuario <falcoins>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'apostar':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Aposta x falcoins', inline=False)
        embed.add_field(name=f'Ganhos', value=f'Até 100%', inline=False)
        embed.add_field(name=f'Uso', value=f'?apostar <falcoins>/?ap <falcoins>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'duelo':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Desafie seu amigo para um cara ou coroa', inline=False)
        embed.add_field(name=f'Ganhos', value=f'2x', inline=False)
        embed.add_field(name=f'Uso', value=f'?duelo @usuario <falcoins>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'rank':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Mostra o rank do servidor atual', inline=False)
        embed.add_field(name=f'Uso', value=f'?rank')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'rank_global':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Mostra o rank global', inline=False)
        embed.add_field(name=f'Uso', value=f'?rank_global')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'loja':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Mostra os cargos disponíveis para compra e seus requerimentos', inline=False)
        embed.add_field(name=f'Uso', value=f'?loja')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'comprar':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Compra o item colocado se tiver todos os requisitos', inline=False)
        embed.add_field(name=f'Uso', value=f'?comprar <numero do item>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'investir':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Tranfere a quantidade inserida para a pessoa, e ela pagará uma dívida com parte dos ganhos das apostas', inline=False)
        embed.add_field(name=f'Uso', value=f'?investir @usuario <falcoins>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'prefixo':
        embed = discord.Embed(
            color=discord.Color.red()
        )
        embed.add_field(name=f'Info', value=f'Muda o prefixo do servidor atual (só usuários com a permissão de admin podem usar)', inline=False)
        embed.add_field(name=f'Uso', value=f'?prefixo <prefixo>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'limpa':
        embed = discord.Embed(
            color=discord.Color.red()
        )
        embed.add_field(name=f'Info', value=f'Limpa x mensagens do canal atual', inline=False)
        embed.add_field(name=f'Uso', value=f'?limpa <numero de mensagens>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'tetris':
        embed = discord.Embed(
            color=discord.Color.red()
        )
        embed.add_field(name=f'Info', value=f'Cria uma sala privada no Jstris pra você', inline=False)
        embed.add_field(name=f'Uso', value=f'?tetris')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'math':
        embed = discord.Embed(
            color=discord.Color.red()
        )
        embed.add_field(name=f'Info', value=f'Faz um cálculo de matemática', inline=False)
        embed.add_field(name=f'Uso', value=f'?math <conta>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'simounao':
        embed = discord.Embed(
            color=discord.Color.red()
        )
        embed.add_field(name=f'Info', value=f'Cria uma enquete com sim e não', inline=False)
        embed.add_field(name=f'Uso', value=f'?simounao')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'roll':
        embed = discord.Embed(
            color=discord.Color.red()
        )
        embed.add_field(name=f'Info', value=f'Rola dados pra você', inline=False)
        embed.add_field(name=f'Usos', value=f'?roll <dados>/<dados>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'flipcoin':
        embed = discord.Embed(
            color=discord.Color.red()
        )
        embed.add_field(name=f'Info', value=f'Faz um cara ou coroa', inline=False)
        embed.add_field(name=f'Usos', value=f'?flipcoin')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    elif command == 'bonk':
        embed = discord.Embed(
            color=discord.Color.red()
        )
        embed.add_field(name=f'Info', value=f'Manda alguém para a horny jail', inline=False)
        embed.add_field(name=f'Usos', value=f'?bonk @usuário')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    else:    
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f':game_die: Comandos para a sala de jogos', value='`eu`, `sobre`, `lootbox`, `doar`, `apostar`, `duelo`, `rank`, `rank_global`, `loja`, `comprar`, `investir`', inline=False)
        embed.add_field(name=f':gear: Outros comandos', value=f'`prefixo`, `comandos/help`, `limpa`, `tetris`, `math`, `simounao`, `roll`, `flipcoin`, `bonk`', inline=False)
        embed.add_field(name=f'⠀', value=f'O seu prefixo é: **{prefixes[str(ctx.guild.id)]}**', inline=False)
        embed.add_field(name=f'⠀', value=f'Use **?help <comando>** para obter maiores detalhes de um comando específico', inline=False)
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

bot.run(secret_token)
