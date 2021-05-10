import discord
import json
from discord.ext import commands
from discord.ext.commands import has_permissions
from math import sqrt
from random import randint

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
async def sugestao(ctx, *args):
    with open('suggestions.txt', 'a') as arquivo:
        sugestao = ''
        for c in args:
            sugestao += ' '
            sugestao += c
            sugestao += ' '
        arquivo.write(f'\n{sugestao}')
        arquivo.close()
    await ctx.send(f'{ctx.message.author.mention} sua sugestão foi salva com suscesso, obrigado! :smiling_face_with_3_hearts:')

@commands.guild_only()
@client.command()
@has_permissions(administrator = True)
async def prefixo(ctx, arg):
    with open('prefixes.json', 'r') as f:
        prefixes = json.load(f)
    
    prefixes[str(ctx.guild.id)] = arg

    with open('prefixes.json', 'w') as f:
        json.dump(prefixes, f, indent=4)
    
    await ctx.send(f'{ctx.message.author.mention} o prefixo do servidor foi mudado para "{arg}"  :smile:')

@commands.guild_only()
@client.command()
async def glm(ctx):
    await ctx.message.delete()
    await ctx.send('Não.')

@commands.guild_only()
@client.command()
async def lena(ctx):
    await ctx.message.delete()
    await ctx.send('Sim.')

@commands.guild_only()
@client.command()
async def luh(ctx):
    #amor da minha vida <3
    await ctx.message.delete()
    await ctx.send(':two_hearts:')

@commands.guild_only()
@client.command()
async def flor(ctx):
    await ctx.message.delete()
    await ctx.send(':cherry_blossom:')

@commands.guild_only()
@client.command()
async def falcao(ctx):
    await ctx.message.delete()
    await ctx.send(':thumbsup:')

@commands.guild_only()
@client.command()
async def gih(ctx):
    await ctx.message.delete()
    await ctx.send(':sunglasses:')

@commands.guild_only()
@client.command()
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
@client.command()
async def roll(ctx, dice):
    if dice[0] == 'd':
        dice = '1' + dice
    dice = dice.split('d')
    dice1 = dice[0]
    dice2 = dice[1]
    assert int(dice1) >= 1
    assert int(dice2) >= 1
    many = int(dice1)
    rolls = []
    for c in range(many):
        rolls.append(randint(1, int(dice2)))
    await ctx.send(f'{rolls} -> {sum(rolls)}')

@commands.guild_only()
@client.command()
async def coinflip(ctx):
    x = randint(0, 1)
    if x == 0:
        await ctx.send('head')
    else:
        await ctx.send('tail')

@commands.guild_only()
@client.command()
async def simounao(ctx):
    message = await ctx.send('✅sim 🚫não')
    await message.add_reaction('✅')
    await message.add_reaction('🚫')

@commands.guild_only()
@client.command()
async def bonk(ctx, *args):
    for c in list(args):
        try:
            if not client.get_user(int(c[3:-1])) != None:
                args.remove(c)
        except:
            args.remove(c)
    text = ''
    for c in args:
        text += c
        text += ' '
    await ctx.send(f'{text}',file=discord.File('bonk.gif'))

@commands.guild_only()
@client.command(aliases=['help'])
async def comandos(ctx):
    embed = discord.Embed(
        title='Comandos para sala de jogos',
        color=discord.Color.green()
    )
    embed.add_field(name=f"?eu", value=f'Mostra os seus dados', inline=False)
    embed.add_field(name=f"?lootbox", value=f'Resgata sua lootbox grátis(disponível a cada 30 minutos)', inline=False)
    embed.add_field(name=f"?sobre [@pessoa]", value=f'Mostra os dados sobre a pessoa marcada', inline=False)
    embed.add_field(name="?doar [@pessoa] [valor]", value='Doa o valor inserido para a pessoa marcada (paga sua dívida com ela, caso tenha uma)', inline=False)
    embed.add_field(name=f"?apostar [valor]", value=f'Aposta o valor ou porcentagem indicado, com ganhos até 100%!', inline=False)
    embed.add_field(name=f"?duelo [@pessoa] [valor]", value=f'Duela com a pessoa marcada. apostando o valor indicado', inline=False)
    embed.add_field(name=f"?rank", value=f'Retorna a tabela de ranking do servidor atual por falcoins', inline=False)
    embed.add_field(name=f"?rank_global", value=f'Retorna a tabela de ranking global por falcoins', inline=False)
    embed.add_field(name=f"?loja", value=f"Retorna a tabela de compras e seus valores", inline=False)
    embed.add_field(name=f"?comprar [Número do item]", value=f"Compra o item citado no parametro se você tem os requisitos")
    embed.add_field(name=f"?investir [@pessoa] [Quantidade]", value=f"Tranfere a quantidade inserida para a pessoa, e ela pagará uma dívida com parte dos ganhos das apostas", inline=False)
    embed.add_field(name=f'?3', value=f'A cada 24h te dá 3 falcoins!', inline=False)
    embed.add_field(name=f'Exemplos', value=f'?sobre @Falcão = retorna os dados do usuário Falcão \n ?eu = retorna os seus dados de usuário \n ?lootbox = Resgata a lootbox se disponível \n ?apostar 10 = aposta 10 falcoins, podendo lucar ou perder \n ?duelo @Falcão 100 = aposta 100 falcoins com falcão em um duelo da sorte \n ?rank = Retorna os 10 primeiros em quantidade de falcoins do servidor \n ?rank_global = Retorna os 10 primeiros em quantidade de falcoins global \n ?loja = Retorna a tabela para compras \n ?comprar 1 = Se tiver todos os requisitos, compra o item número 1 \n ?investir @Falcão 200 = Empresta 200 falcoins a falcão, ao quitar a dívida, você ganhará uma porcentagem a mais dependendo do seu cargo \n ?doar @Falcão 100 = doa 100 falcoins para o usuário Falcão', inline=False)
    embed.set_footer(text='by Falcão ❤️')
    await ctx.send(embed=embed)

    embed1 = discord.Embed(
        title='Outros comandos',
        color=discord.Color.red()
    )
    embed1.add_field(name=f"?prefixo [Prefixo desejado]", value=f'Muda o prefixo do bot no servidor, OBS: só administradores podem usar', inline=False)
    embed1.add_field(name=f"?sugestao [...]", value=f'Anota sua sugestão para o bot!', inline=False)
    embed1.add_field(name=f'?help/?comandos', value=f'Devolve a lista de comandos que você está vendo agora', inline=False)
    embed1.add_field(name=f'?limpa [num. de msgs]', value=f'Limpa o numero de mensagens especificado no canal atual, OBS: só administradores podem usar', inline=False)
    embed1.add_field(name=f'?tetris', value=f'Cria uma sala privada no jstris para você!', inline=False)
    embed1.add_field(name=f'?math', value=f'Faz contas matemáticas para você!', inline=False)
    embed1.add_field(name=f'?simounao', value=f'Cria uma enquete com sim e não', inline=False)
    embed1.add_field(name=f'?roll', value=f'Rola um dado de n lados', inline=False)
    embed1.add_field(name=f'?flipcoin', value=f'Gira uma moeda e retorna cara ou coroa', inline=False)
    embed1.add_field(name=f'?bonk [pessoa]', value=f'Use para mandar seus amigos para a horny jail!', inline=False)
    embed1.add_field(name=f'Exemplos', value=f'?prefixo ! = muda o prefixo do Falbot no servidor para ! \n ?Limpa 10 = o bot vai excluir a mensagem invocando o comando juntamente com as 10 anteriores \n ?math 5**5 faz 5 elevado a 5 \n ?roll 5d20 rola cinco dados de 20 lados \n ?bonk @Falcão manda o usuário Falcão para a horny jail')
    embed1.set_footer(text='by Falcão ❤️')
    await ctx.send(embed=embed1)


client.run(secret_token)