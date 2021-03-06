import json
import discord

secret_token = 'SECRET_TOKEN'

def cria_banco(pessoa):
    assert pessoa.isnumeric()
    with open('falbot.json', 'r') as f:
            banco = json.load(f)
    try:
        banco[pessoa]
    except KeyError:
        banco[pessoa] = {'Falcoins': 0, 'Vitorias': 0, 'Cargo': '', 'Banco': 0}
    finally:
        with open('falbot.json', 'w') as f:
            json.dump(banco, f, indent=4)

def muda_saldo(pessoa, dinheiro):
    with open('falbot.json','r') as f:
        banco = json.load(f)

    banco[pessoa]['Falcoins'] += dinheiro
    if banco[pessoa]['Falcoins'] < 0:
        banco[pessoa]['Falcoins'] = 0

    with open('falbot.json', 'w') as f:
        json.dump(banco, f, indent=4)

def muda_vitoria(pessoa):
    with open('falbot.json','r') as f:
        banco = json.load(f)

    banco[pessoa]['Vitorias'] += 1

    with open('falbot.json', 'w') as f:
        json.dump(banco, f, indent=4)

def muda_cargo(pessoa, cargo):
    with open('falbot.json','r') as f:
        banco = json.load(f)

    banco[pessoa]['Cargo'] = cargo

    with open('falbot.json', 'w') as f:
        json.dump(banco, f, indent=4)

def muda_banco(pessoa, dinheiro):
    with open('falbot.json','r') as f:
        banco = json.load(f)

    banco[pessoa]['Banco'] += dinheiro
    if banco[pessoa]['Banco'] < 0:
        banco[pessoa]['Banco'] = 0

    with open('falbot.json', 'w') as f:
        json.dump(banco, f, indent=4)

def tempo_formatado(erro):
    hora = 0
    minuto = 0
    segundo = 0
    formata = ''
    errinho = str(erro)
    for c in errinho:
        if c in '0123456789':
            formata += c
    segundo += int(formata[0:-2])
    minuto += segundo//60
    hora += minuto//60
    segundo -= minuto*60
    minuto -= hora*60
    if len(str(minuto)) == 1 and len(str(segundo)) == 1: 
        formata = f'{hora}:0{minuto}:0{segundo}'
    elif len(str(minuto)) == 1 and len(str(segundo)) == 2:
        formata = f'{hora}:0{minuto}:{segundo}'
    elif len(str(minuto)) == 2 and len(str(segundo)) == 1:
        formata = f'{hora}:{minuto}:0{segundo}'
    else:
        formata = f'{hora}:{minuto}:{segundo}'
    if len(str(hora)) == 1:
        formata = '0' + formata
    return formata

def arg_especial(arg,pessoa):
    with open('falbot.json', 'r') as f:
        banco = json.load(f)

    if arg == 'tudo':
        arg = banco[pessoa]['Falcoins']
    elif arg == 'metade':
        arg = int(banco[pessoa]['Falcoins'] / 2)
    elif '.' in arg:
        arg = arg.replace(".", "")
    elif ',' in arg:
        arg = arg.replace(",", "")
    else:
        for c in arg:
            if c == '%':
                arg = int(int(arg[:-1]) * int(banco[str(pessoa)]['Falcoins']) / 100)
    return arg

def arg_especial_banco(arg,pessoa):
    with open('falbot.json', 'r') as f:
        banco = json.load(f)

    if arg == 'tudo':
        arg = banco[pessoa]['Banco']
    elif arg == 'metade':
        arg = int(banco[pessoa]['Banco'] / 2)
    elif '.' in arg:
        arg = arg.replace(".", "")
    elif ',' in arg:
        arg = arg.replace(",", "")
    else:
        for c in arg:
            if c == '%':
                arg = int(int(arg[:-1]) * int(banco[str(pessoa)]['Banco']) / 100)
    return arg

def format(falcoins):
    if int(falcoins) < 0:
        falcoins = str(falcoins)
        pop = str(falcoins[1:])
    else:
        pop = str(falcoins)
    pop_2 = ''
    for c,i in enumerate(pop[::-1]):
        if c/3 == int(c/3) and c/3 != 0:
            pop_2 += '.'
            pop_2 += i
        else:
            pop_2 += i

    return pop_2[::-1]

def checa_cargo(pessoa):
    with open('falbot.json', 'r') as f:
        banco = json.load(f)

    if banco[pessoa]['Cargo'] == '':
        return 0
    elif banco[pessoa]['Cargo'] == 'Pardal':
        return 1
    elif banco[pessoa]['Cargo'] == 'Tucano':
        return 2
    elif banco[pessoa]['Cargo'] == 'Falc??o':
        return 3

def checa_arquivo(pessoa, campo=''):
    with open('falbot.json','r') as f:
        banco = json.load(f)
    if campo == '':
        return banco[pessoa]
    else:
        return banco[pessoa][campo]

def arruma_mention(arg):
    pessoa = ''
    for c in arg:
        if c.isnumeric():
            pessoa += c
    return pessoa

def explain(command, guild_id=''):
    command = command.lower()

    if command == 'eu':
        embed = discord.Embed(color=discord.Color.green())
        embed.add_field(name=f'Info', value=f'Mostra seus Falcoins, Vitorias e Divida, caso tenha uma', inline=False)
        embed.add_field(name=f'Uso', value=f'?eu')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'sobre':
        embed = discord.Embed(color=discord.Color.green())
        embed.add_field(name=f'Info', value=f'Mostra os Falcoins, Vitorias e Divida, da pessoa marcada', inline=False)
        embed.add_field(name=f'Uso', value=f'?sobre @usuario')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'lootbox':
        embed = discord.Embed(color=discord.Color.green())
        embed.add_field(name=f'Info', value=f'Resgata sua lootbox gr??tis (dispon??vel a cada 30 minutos)', inline=False)
        embed.add_field(name=f'Uso', value=f'?lootbox/?lb')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'doar':
        embed = discord.Embed(color=discord.Color.green())
        embed.add_field(name=f'Info', value=f'Doa x Falcoins para o usu??rio marcado', inline=False)
        embed.add_field(name=f'Uso', value=f'?doar @usuario <falcoins>')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'cavalo':
        embed = discord.Embed(color=discord.Color.green())
        embed.add_field(name=f'Info', value=f'Adivinhe qual cavalo ?? o vencedor', inline=False)
        embed.add_field(name=f'Ganhos', value=f'**5x**', inline=False)
        embed.add_field(name=f'Uso', value=f'**?cavalo <1-5> <falcoins>**', inline=False)
        embed.add_field(name=f'Duelo', value=f'Voc?? pode desafiar um amigo para um duelo', inline=False)
        embed.add_field(name=f'Ganhos', value=f'**O vencedor leva tudo**', inline=False)
        embed.add_field(name=f'Uso', value=f'**?cavalo <@usuario> <falcoins>**', inline=False)
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'rank':
        embed = discord.Embed(color=discord.Color.green())
        embed.add_field(name=f'Info', value=f'Mostra o rank do servidor atual', inline=False)
        embed.add_field(name=f'Uso', value=f'?rank')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'rank_global':
        embed = discord.Embed(color=discord.Color.green())
        embed.add_field(name=f'Info', value=f'Mostra o rank global', inline=False)
        embed.add_field(name=f'Uso', value=f'?rank_global')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'loja':
        embed = discord.Embed(color=discord.Color.green())
        embed.add_field(name=f'Info', value=f'Mostra os cargos dispon??veis para compra', inline=False)
        embed.add_field(name=f'Uso', value=f'?loja')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'comprar':
        embed = discord.Embed(color=discord.Color.green())
        embed.add_field(name=f'Info', value=f'Compra o item colocado', inline=False)
        embed.add_field(name=f'Uso', value=f'?comprar <numero do item>')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'roleta':
        embed = discord.Embed(color=discord.Color.green())
        embed.add_field(name=f'Tipos de aposta', value=f'**<preto/vermelho/verde>, <0-36>, <altos/baixos>, <par/impar>**')
        embed.add_field(name=f'Info', value=f'**preto/vermelho/verde** se o bot rolar um n??mero com a sua cor, voc?? ganha\n**0-36** se o bot rolar seu n??mero, voc?? ganha\n**altos/baixos** baixos 1-18, altos 19-36\n**impar/par impar** = 1, 3, 5 ..., 35, par = 2, 4, 6, ..., 36', inline=False)
        embed.add_field(name=f'Ganhos', value=f'**preto/vermelho/verde** - 2x\n**0-36** - 35x\n**altos/baixos** - 2x\n**impar/par** - 2x', inline=False)
        embed.add_field(name=f'N??meros', value=f'Verde: **0**\nPreto: **2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35**\nVermelho: ** 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36**',inline=False)
        embed.add_field(name=f'Uso', value=f'?roleta <tipo de aposta> <falcoins>')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'niquel':
        embed = discord.Embed(color=discord.Color.green())
        embed.add_field(name=f'Info', value=f'Ca??a-n??quel', inline=False)
        embed.add_field(name=f'Ganhos', value=f':money_mouth: :money_mouth: :grey_question: - **0.5x**\n:coin: :coin: :grey_question: - **2x**\n:dollar: :dollar: :grey_question: - **2x**\n:money_mouth: :money_mouth: :money_mouth: - **2.5x**\n:coin: :coin: :coin: - **3x**\n:moneybag: :moneybag: :grey_question: - **3.5x**\n:dollar: :dollar: :dollar: - **4x**\n:gem: :gem: :grey_question: - **7x**\n:moneybag: :moneybag: :moneybag: - **7x**\n:gem: :gem: :gem: - **15x**', inline=False)
        embed.add_field(name=f'Uso', value=f'?niquel <falcoins>')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'banco':
        embed = discord.Embed(color=discord.Color.green())
        embed.add_field(name=f'Info', value=f'Guarda ou tira seus falcoins do banco', inline=False)
        embed.add_field(name=f'Ganhos', value=f'O valor depositado aumenta em 1% por dia', inline=False)  
        embed.add_field(name=f'Uso', value=f'?banco <depositar/sacar> <falcoins>', inline=False)
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'luta':
        embed = discord.Embed(color=discord.Color.green())
        embed.add_field(name=f'Info', value=f'Desafia um usu??rio para uma luta at?? a morte', inline=False)
        embed.add_field(name=f'Ganhos', value=f'**O vencedor leva tudo**', inline=False)
        embed.add_field(name=f'Habilidades', value=f'**inst??ntaneo:** d?? um dano x na hora\n**stun:** d?? um dano x e deixa o inimigo paralizado por 1 turno\n**cura:** se cura em x de vida\n**roubo de vida:** rouba uma quantidade x de vida do inimigo\n**self:** d?? um dano x a si mesmo\n\n**O bot escolhe os ataques aleatoriamente**',inline=False)
        embed.add_field(name=f'Uso', value=f'**?luta @usu??rio <falcoins>**')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'prefixo':
        embed = discord.Embed(color=discord.Color.red())
        embed.add_field(name=f'Info', value=f'Muda o prefixo do servidor atual (s?? usu??rios com a permiss??o de admin podem usar)', inline=False)
        embed.add_field(name=f'Uso', value=f'?prefixo <prefixo>')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'limpa':
        embed = discord.Embed(color=discord.Color.red())
        embed.add_field(name=f'Info', value=f'Limpa x mensagens do canal atual', inline=False)
        embed.add_field(name=f'Uso', value=f'?limpa <numero de mensagens>')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'tetris':
        embed = discord.Embed(color=discord.Color.red())
        embed.add_field(name=f'Info', value=f'Cria uma sala privada no Jstris pra voc??', inline=False)
        embed.add_field(name=f'Uso', value=f'?tetris')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'math':
        embed = discord.Embed(color=discord.Color.red())
        embed.add_field(name=f'Info', value=f'Faz um c??lculo de matem??tica', inline=False)
        embed.add_field(name=f'Uso', value=f'?math <conta>')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'simounao':
        embed = discord.Embed(color=discord.Color.red())
        embed.add_field(name=f'Info', value=f'Cria uma enquete com sim e n??o', inline=False)
        embed.add_field(name=f'Uso', value=f'?simounao')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'roll':
        embed = discord.Embed(color=discord.Color.red())
        embed.add_field(name=f'Info', value=f'Rola dados pra voc??', inline=False)
        embed.add_field(name=f'Usos', value=f'?roll <dados>/<dados>')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'flipcoin':
        embed = discord.Embed(color=discord.Color.red())
        embed.add_field(name=f'Info', value=f'Faz um cara ou coroa', inline=False)
        embed.add_field(name=f'Uso', value=f'?flipcoin')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    elif command == 'bonk':
        embed = discord.Embed(color=discord.Color.red())
        embed.add_field(name=f'Info', value=f'Manda algu??m para a horny jail', inline=False)
        embed.add_field(name=f'Uso', value=f'?bonk @usu??rio')
        embed.set_footer(text='by Falc??o ??????')
        return embed

    else:
        with open('prefixes.json', 'r') as f:
            prefixes = json.load(f)

        embed = discord.Embed(color=discord.Color.blue())
        embed.add_field(name=f':game_die: Comandos para a sala de jogos', value='`eu`, `sobre`, `lootbox`, `doar`, `cavalo`, `rank`, `rank_global`, `loja`, `comprar`, `roleta`, `niquel`, `banco`', inline=False)
        embed.add_field(name=f':gear: Outros comandos', value=f'`prefixo`, `comandos/help`, `limpa`, `tetris`, `math`, `simounao`, `roll`, `flipcoin`, `bonk`', inline=False)
        embed.add_field(name=f'???', value=f'O seu prefixo ??: **{prefixes[str(guild_id)]}**', inline=False)
        embed.add_field(name=f'???', value=f'Use **?ajuda <comando>** para obter maiores detalhes de um comando espec??fico', inline=False)
        embed.add_field(name=f'???', value=f'O bot tamb??m aceita "metade", "tudo" e porcentagens no lugar de valores de aposta', inline=False)
        embed.set_footer(text='by Falc??o ??????')
        return embed
