import discord
from discord.ext import commands, tasks
import asyncio
import json
import random
from funcoes import *
from discord.utils import get
import asyncio
from secret import secret_token

epromo = 1
elootbox = 1
eaposta = 1
status = 1

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
bot = commands.Bot(command_prefix=get_prefix, case_insensitive=True, intents=intents, help_command=None)

@bot.event
async def on_ready():
    try:
        cancela_evento.start()
        evento.start()
        muda_status.start()
    except:
        pass
    activity = discord.Activity(name='?comandos | arte by: @kinsallum', type=discord.ActivityType.playing)
    await bot.change_presence(activity=activity)
    print('Bot online')
    
@bot.event
async def on_guild_join(guild):
    if discord.utils.get(guild.roles, name="Falcão") == None:
        await guild.create_role(name="Falcão", colour=discord.Colour(0x4C4CFF))
    if discord.utils.get(guild.roles, name="Tucano") == None:
        await guild.create_role(name="Tucano", colour=discord.Colour(0xFFA500))
    if discord.utils.get(guild.roles, name="Pardal") == None:
        await guild.create_role(name="Pardal", colour=discord.Colour(0x842121))
    if discord.utils.get(guild.roles, name="Pomba") == None:
        await guild.create_role(name="Pomba", colour=discord.Colour(0xD2D4DC))

    with open('prefixes.json', 'r') as f:
        prefixes = json.load(f)
    
    prefixes[str(guild.id)] = '?'

    with open('prefixes.json', 'w') as f:
        json.dump(prefixes, f, indent=4)

@bot.event
async def on_guild_remove(guild):
    with open('prefixes.json', 'r') as f:
        prefixes = json.load(f)

    prefixes.pop(str(guild.id))

@tasks.loop(minutes=30)
async def cancela_evento():
    global elootbox
    global eaposta
    global epromo
    elootbox = 1
    eaposta = 1
    epromo = 1
    activity = discord.Activity(name='?comandos | arte by: @kinsallum', type=discord.ActivityType.playing)
    await bot.change_presence(activity=activity)

@tasks.loop(hours=2)
async def evento():
    global elootbox
    global eaposta
    global epromo
    evento = random.randint(1,100)
    if evento <= 20:
        escolha = random.randint(1,3)
        if escolha == 1:
            activity = discord.Activity(name='?comandos | Evento ativado! Apostas rendem 1.2x', type=discord.ActivityType.playing)
            await bot.change_presence(activity=activity)
            eaposta = 1.2
        elif escolha == 2:
            activity = discord.Activity(name='?comandos | Evento ativado! Lootboxs rendem 2x', type=discord.ActivityType.playing)
            await bot.change_presence(activity=activity)
            elootbox = 2
        else:
            activity = discord.Activity(name='?comandos | Evento ativado! Cargos custam metade', type=discord.ActivityType.playing)
            await bot.change_presence(activity=activity)
            epromo = 2

@tasks.loop(seconds=30)
async def muda_status():
    global elootbox
    global eaposta
    global epromo
    global status
    if eaposta == 1.2:
        if status == 1:
            activity = discord.Activity(name='?comandos | Evento ativado! Apostas rendem 1.2x', type=discord.ActivityType.playing)
            await bot.change_presence(activity=activity)
            status = 0
        else:
            activity = discord.Activity(name='?comandos | arte by: @kinsallum', type=discord.ActivityType.playing)
            await bot.change_presence(activity=activity)
            status = 1
    elif elootbox == 2:
        if status == 1:
            activity = discord.Activity(name='?comandos | Evento ativado! Lootboxs rendem 2x', type=discord.ActivityType.playing)
            await bot.change_presence(activity=activity)
            status = 0
        else:
            activity = discord.Activity(name='?comandos | arte by: @kinsallum', type=discord.ActivityType.playing)
            await bot.change_presence(activity=activity)
            status = 1
    elif epromo == 2:
        if status == 1:
            activity = discord.Activity(name='?comandos | Evento ativado! Cargos custam metade', type=discord.ActivityType.playing)
            await bot.change_presence(activity=activity)
            status = 0
        else:
            activity = discord.Activity(name='?comandos | arte by: @kinsallum', type=discord.ActivityType.playing)
            await bot.change_presence(activity=activity)
            status = 1
    else:
        activity = discord.Activity(name='?comandos | arte by: @kinsallum', type=discord.ActivityType.playing)
        await bot.change_presence(activity=activity)

@commands.guild_only()
@bot.command(aliases=['sobre'])
async def eu(ctx, arg=''):
    if "sobre" in ctx.message.content and arg == '':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Mostra os Falcoins, Vitorias e Divida, da pessoa marcada', inline=False)
        embed.add_field(name=f'Uso', value=f'?sobre @usuario')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)
    elif arg == '':
        arg = ctx.message.author.id
    else:
        arg = arg[3:-1]
        cria_banco(arg)
    cria_banco(str(ctx.message.author.id))
    pessoa = await ctx.message.guild.fetch_member(int(arg))
    with open('falbot.json', 'r') as f:
        banco = json.load(f)
    embed = discord.Embed(
        color=discord.Color(000000)
    )
    embed.set_author(name=pessoa.name, icon_url=pessoa.avatar_url)
    for key,item in banco[str(arg)].items():
        if key != 'Agiota' and key != 'Cargo':
            embed.add_field(name=key, value=format(item), inline=True)
    embed.set_footer(text='by Falcão ❤️')
    await ctx.send(embed=embed)

@commands.guild_only()
@bot.command(aliases=['ap'])
async def apostar(ctx, arg=''):
    if arg == '':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Aposta x falcoins', inline=False)
        embed.add_field(name=f'Ganhos', value=f'Até 100%', inline=False)
        embed.add_field(name=f'Uso', value=f'?apostar <falcoins>/?ap <falcoins>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    global eaposta
    cria_banco(str(ctx.message.author.id))
    arg = arg_especial(arg, str(ctx.message.author.id))
    if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= int(arg) and int(arg) > 0:
        role = discord.utils.get(ctx.guild.roles, name="Pomba")
        role1 = discord.utils.get(ctx.guild.roles, name="Pardal")
        role2 = discord.utils.get(ctx.guild.roles, name="Tucano")
        role3 = discord.utils.get(ctx.guild.roles, name="Falcão")
        if role not in ctx.message.author.roles and role1 not in ctx.message.author.roles and role2 not in ctx.message.author.roles and role3 not in ctx.message.author.roles and checa_cargo(str(ctx.message.author.id)) == 0:
            await ctx.message.author.add_roles(role)
        elif checa_cargo(str(ctx.message.author.id)) == 1:
            await ctx.message.author.add_roles(role1)
        elif checa_cargo(str(ctx.message.author.id)) == 2:
            await ctx.message.author.add_roles(role2)
        elif checa_cargo(str(ctx.message.author.id)) == 3:
            await ctx.message.author.add_roles(role3)
        sorte = random.randint(0,100)
        if sorte >= 95:
            muda_saldo(str(ctx.message.author.id), -int(arg))
            await ctx.send (f'{ctx.message.author.mention} você perdeu tudo que apostou :pensive: :fist: *Saldo atual*: {format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))}') 
        elif sorte <= 55:
            total = int(int((random.randint(10,100) * int(arg)) / 100) * eaposta)
            if checa_arquivo(str(ctx.message.author.id), 'Divida') > 0:
                comissao = int(total/10)
                total -= comissao
            if total == 0:
                total = 1
            muda_saldo(str(ctx.message.author.id), total)
            await ctx.send (f'{ctx.message.author.mention} Parabéns! Você lucrou {format(total)} falcoins :sunglasses: *Saldo atual*: {format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))}')
            if total >= 1000000:
                muda_saldo(str(ctx.message.author.id), -int(total/20))
                await ctx.send(f'{ctx.message.author.mention} foram cobrados {format(int(total/20))} falcoins de imposto! *Saldo atual*: {format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))}')
            if checa_arquivo(str(ctx.message.author.id), 'Divida') > 0:
                if comissao == 0:
                    comissao = 1
                if comissao >= checa_arquivo(str(ctx.message.author.id), 'Divida'):
                    muda_saldo(checa_arquivo(str(ctx.message.author.id),'Agiota'), checa_arquivo(str(ctx.message.author.id), 'Divida'))
                    user = bot.get_user(int(checa_arquivo(str(ctx.message.author.id), 'Agiota')))
                    await ctx.send(f'{ctx.message.author.name} pagou {format(checa_arquivo(str(ctx.message.author.id), "Divida"))} falcoins de comissão. Restando 0 de débito com {user.name}')
                    muda_divida(str(ctx.message.author.id), -int(checa_arquivo(str(ctx.message.author.id), 'Divida')))
                    zera_divida(str(ctx.message.author.id))
                else:    
                    muda_saldo(str(checa_arquivo(str(ctx.message.author.id), 'Agiota')), comissao)
                    user = bot.get_user(int(checa_arquivo(str(ctx.message.author.id), 'Agiota')))
                    muda_divida(str(ctx.message.author.id), -comissao)
                    if checa_arquivo(str(ctx.message.author.id), 'Divida') == 0:
                        zera_divida(str(ctx.message.author.id))
                    await ctx.send(f'{ctx.message.author.name} pagou {format(comissao)} falcoins de comissão. Restando {format(checa_arquivo(str(ctx.message.author.id), "Divida"))} de débito com {user.name}')
        else:
            total = int((random.randint(10,90) * int(arg)) / 100)
            if total == 0:
                total = 1
            muda_saldo(str(ctx.message.author.id), -total)
            await ctx.send (f'{ctx.message.author.mention} você perdeu {format(total)} falcoins :slight_frown: *Saldo atual*: {format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))}')
    elif int(arg) <= 0:
        await ctx.send(f'{ctx.message.author.mention} {arg} não é um valor válido... :rage:')
    else:
        await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para esta aposta! :rage:')
    await asyncio.sleep(0.5)

@commands.guild_only()
@bot.command(aliases=['lb'])
@commands.cooldown(1, 1800, commands.BucketType.user)
async def lootbox(ctx):
        global elootbox
        cria_banco(str(ctx.message.author.id))
        minimo = int(checa_arquivo(str(ctx.message.author.id), 'Falcoins')) / 100
        maximo = int(checa_arquivo(str(ctx.message.author.id), 'Falcoins')) / 20
        if minimo >= 100000:
            minimo = int(checa_arquivo(str(ctx.message.author.id), 'Falcoins')) / 100
            maximo = int(checa_arquivo(str(ctx.message.author.id), 'Falcoins')) / 100
        if minimo < 200 or maximo < 600:
            minimo = 200
            maximo = 600
        lb = random.randint(int(minimo), int(maximo)) * elootbox
        muda_saldo(str(ctx.message.author.id), lb)
        await ctx.send(f' Parabéns {ctx.message.author.mention}! Você ganhou **{lb}** falcoins :heart_eyes:')
        @bot.event
        async def on_command_error(ctx,error):
            if "You are on cooldown." in str(error):
                await ctx.send(f'{ctx.message.author.mention} faltam **{tempo_formatado(error)}** para você resgatar a lootbox grátis!')
            elif "Command not found" in str(error):
                pass
            else:
                print(error)

@commands.guild_only()
@bot.command()
async def doar(ctx, arg='', arg2=''):
    if arg == '' and arg2 == '':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Doa x Falcoins para o usuário marcado', inline=False)
        embed.add_field(name=f'Uso', value=f'?doar @usuario <falcoins>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)


    cria_banco(str(ctx.message.author.id))
    cria_banco(arg[3:-1])
    arg2 = arg_especial(arg2, str(ctx.message.author.id))
    if checa_arquivo(str(ctx.message.author.id), 'Falcoins')>= int(arg2):
        muda_saldo(str(ctx.message.author.id), -int(arg2))
        muda_saldo(arg[3:-1], int(arg2))
        await ctx.send(f'{ctx.message.author.mention} transferiu {format(arg2)} falcoins para {arg}')
        if checa_arquivo(str(ctx.message.author.id), 'Divida') > 0 and checa_arquivo(str(ctx.message.author.id), 'Agiota') == arg[3:-1]:
                if int(arg2) >= checa_arquivo(str(ctx.message.author.id), 'Divida'):
                    muda_saldo(arg[3:-1], checa_arquivo(str(ctx.message.author.id), 'Divida'))
                    user = bot.get_user(int(checa_arquivo(str(ctx.message.author.id), 'Agiota')))
                    await ctx.send(f'{ctx.message.author.name} pagou {format(checa_arquivo(str(ctx.message.author.id), "Divida"))} falcoins de comissão. Restando 0 de débito com {user.name}')
                    muda_divida(str(ctx.message.author.id), -int(checa_arquivo(str(ctx.message.author.id), 'Divida')))
                    zera_divida(str(ctx.message.author.id))
                else:    
                    muda_saldo(str(checa_arquivo(str(ctx.message.author.id), 'Agiota')), int(arg2))
                    user = bot.get_user(int(checa_arquivo(str(ctx.message.author.id), 'Agiota')))
                    muda_divida(str(ctx.message.author.id), -int(arg2))
                    if checa_arquivo(str(ctx.message.author.id), 'Divida') == 0:
                        zera_divida(str(ctx.message.author.id))
                    await ctx.send(f'{ctx.message.author.name} pagou {format(arg2)} falcoins de comissão. Restando {format(checa_arquivo(str(ctx.message.author.id), "Divida"))} de débito com {user.name}')
    else:
        await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para esta doação! :rage:')

@commands.guild_only()
@bot.command()
async def duelo(ctx, arg='', arg2=''):
    if arg == '' and arg2 == '':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Desafie seu amigo para um cara ou coroa', inline=False)
        embed.add_field(name=f'Ganhos', value=f'2x', inline=False)
        embed.add_field(name=f'Uso', value=f'?duelo @usuario <falcoins>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)


    arg = arg[3:-1]
    if str(ctx.message.author.id) != arg:
        gifs = ['4.gif', '2.gif', '3.gif', '4.gif']
        user = await ctx.message.guild.fetch_member(int(arg))
        cria_banco(str(ctx.message.author.id))
        cria_banco(str(arg))
        arg2 = arg_especial(arg2,str(ctx.message.author.id))
        if checa_arquivo(str(ctx.message.author.id),'Falcoins') >= int(arg2) and checa_arquivo(arg, 'Falcoins') >= int(arg2):
            message = await ctx.send(f'{ctx.message.author.mention} chamou {user.mention} para um duelo da sorte apostando {format(arg2)} falcoins :smiling_imp:')
            await message.add_reaction('✅')
            await message.add_reaction('🚫')

            def check(reaction, useri):
                return useri == user and (str(reaction.emoji) == '✅' or str(reaction.emoji) == '🚫')

            try:
                reaction, user = await bot.wait_for('reaction_add', timeout=15.0, check=check)
            except asyncio.TimeoutError:
                await ctx.send(f'Duelo cancelado. {user.mention} demorou muito para aceitar! :confounded:')
            else:
                if str(reaction.emoji) == '✅':
                    await ctx.send(f'Duelo aceito. {user.mention} aceitou entrar em duelo com {ctx.message.author.mention} :open_mouth:')
                    await ctx.send(file=discord.File(random.choice(gifs)))
                    ganhou = random.randint(1,2)   

                    if ganhou == 1:
                        muda_saldo(str(ctx.message.author.id), int(arg2))
                        muda_saldo(arg, -int(arg2))
                        muda_vitoria(str(ctx.message.author.id))
                        await asyncio.sleep(2)
                        await ctx.send(f'{ctx.message.author.mention} ganhou os {format(arg2)} falcoins do duelo! :stuck_out_tongue:')
                    else:
                        muda_saldo(str(ctx.message.author.id), -int(arg2))
                        muda_saldo(arg, int(arg2))
                        muda_vitoria(arg)
                        await asyncio.sleep(2)
                        await ctx.send(f'{user.mention} ganhou os {format(arg2)} falcoins do duelo! :stuck_out_tongue:')
                else:
                    await ctx.send(f'Duelo cancelado. {user.mention} recusou o duelo! :confounded:')
        else:
            await ctx.send(f'Saldo insuficiente em uma das contas! :grimacing:')
    else:
        await ctx.send(f'{ctx.message.author.mention} Você não pode duelar com você mesmo, espertinho :rage:')

@commands.guild_only()
@bot.command()
async def rank(ctx, local=True):
    with open('falbot.json', 'r') as f:
        banco = json.load(f)
    x = [str(c.id) for c in ctx.guild.members]
    chaves = []
    for chave in banco:
        if local:
            if chave in x:
                chaves.append([banco[chave]['Falcoins'], chave])
        else:
            chaves.append([banco[chave]['Falcoins'], chave])
    for num in range(len(chaves)-1,0,-1):
        for i in range(num):
                if not chaves[i][0]>chaves[i+1][0]:
                    temp = chaves[i]
                    chaves[i] = chaves[i+1]
                    chaves[i+1] = temp
    rank = [user[1] for user in chaves]
    users = [bot.get_user(int(user)) for user in rank]
    for i,c in enumerate(users):
        if c == None:
            users[i] = 'Unknown user'
    embed = discord.Embed(
        color=discord.Color.blue()
    )
    if len(rank) >= 10:
        for c in range(10):
            try:
                embed.add_field(name=f"{c+1}° - {users[c].name} falcoins:", value=f'`{format(banco[rank[c]]["Falcoins"])}`', inline=False)
            except:
                embed.add_field(name=f"{c+1}° - {users[c]} falcoins:", value=f'`{format(banco[rank[c]]["Falcoins"])}`', inline=False)
    else:
        for c,i in enumerate(users):
            try:
                embed.add_field(name=f"{c+1}° - {users[c].name} falcoins:", value=f'`{format(banco[rank[c]]["Falcoins"])}`', inline=False)
            except:
                embed.add_field(name=f"{c+1}° - {users[c]} falcoins:", value=f'`{format(banco[rank[c]]["Falcoins"])}`', inline=False)
    embed.set_footer(text='by Falcão ❤️')
    await ctx.send(embed=embed)

@commands.guild_only()
@bot.command()
async def rank_global(ctx):
    await ctx.invoke(bot.get_command('rank'), local=False)

@commands.guild_only()
@bot.command()
async def investir(ctx, arg='', arg2=''):
    if arg == '' and arg2 == '':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Tranfere a quantidade inserida para a pessoa, e ela pagará uma dívida com parte dos ganhos das apostas', inline=False)
        embed.add_field(name=f'Uso', value=f'?investir @usuario <falcoins>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    arg = arg[3:-1]
    if str(ctx.message.author.id) != arg:
        user = await ctx.message.guild.fetch_member(int(arg))
        cria_banco(str(ctx.message.author.id))
        cria_banco(arg)
        arg2 = arg_especial(arg2, str(ctx.message.author.id))
        if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= int(arg2):
            if checa_arquivo(arg, 'Divida') == 0:
                message = await ctx.send(f'{ctx.message.author.mention} quer investir {format(arg2)} falcoins em {user.mention}. Aceitas? :smiling_imp:')
                await message.add_reaction('✅')
                await message.add_reaction('🚫')

                def check(reaction, useri):
                    return useri == user and (str(reaction.emoji) == '✅' or str(reaction.emoji) == '🚫')

                try:
                    reaction, user = await bot.wait_for('reaction_add', timeout=15.0, check=check)
                except:
                    await ctx.send(f'Investimento cancelado. {user.mention} demorou muito para aceitar! :confounded:')
                else:
                    if str(reaction.emoji) == '✅':
                        role = discord.utils.get(ctx.guild.roles, name="Pardal")
                        role1 = discord.utils.get(ctx.guild.roles, name="Tucano")
                        role2 = discord.utils.get(ctx.guild.roles, name="Falcão")
                        if role not in ctx.message.author.roles and role1 not in ctx.message.author.roles and role2 not in ctx.message.author.roles:
                            divida = int(int(arg2) + int(arg2) / 4)
                        elif role in ctx.message.author.roles:
                            divida = int(int(arg2) + int(arg2) / 2)
                        elif role1 in ctx.message.author.roles:
                            divida = int(int(arg2) + (int(arg2) / 4 * 3))
                        elif role2 in ctx.message.author.roles:
                            divida = int(int(arg2) + int(arg2))
                        await ctx.send(f'Investimento aceito! {ctx.message.author.mention} depositou {format(arg2)} falcoins na conta de {user.mention}, {ctx.message.author.name} ganhará 10% de tudo que {user.name} ganhar, até cobrir a divida de {format(divida)} falcoins :open_mouth: :smiling_imp:')
                        muda_saldo(str(ctx.message.author.id), -int(arg2))
                        muda_saldo(arg, int(arg2))
                        muda_divida(arg, divida)
                        muda_agiota(arg, str(ctx.message.author.id))
                    else:
                        await ctx.send(f'Investimento cancelado. {user.mention} recusou o investimento de {format(arg2)} por {ctx.message.author.mention} :slight_frown:')
            else:
                await ctx.send(f'{ctx.message.author.mention}, {user.name} já está em uma dívida... :neutral_face:')
        else:
            await ctx.send(f'{ctx.message.author.mention} O investimento não pode ser feito, pois você não tem os falcoins suficientes! :rage:')

@commands.guild_only()
@bot.command()
async def loja(ctx):
    cria_banco(str(ctx.message.author.id))
    embed = discord.Embed(
    title='**Loja**',
    color=discord.Color.green()
    )
    embed.add_field(name=f'Item número 1: Pardal', value='Pelo custo de 500.000 falcoins você adquire um cargo de pardal no servidor, aumentando em 25% os ganhos de investimentos! (necessário ter feito alguma aposta)', inline=False)
    embed.add_field(name=f'Item número 2: Tucano',value=f'Pelo custo de 100.000.000 falcoins você adquire um cargo de tucano no servidor, aumentando em 50% os ganhos de investimentos! (necessário ser um pardal)', inline=False)
    embed.add_field(name=f'Item número 3: Falcão', value='Pelo custo de 1.000.000.000 falcoins você adquire um cargo da melhor ave do mundo no servidor, aumentando em 75% os ganhos de investimentos! (necessário ser um tucano)', inline=False)
    embed.set_footer(text='by Falcão ❤️')
    await ctx.send(embed=embed)

@commands.guild_only()
@bot.command()
async def comprar(ctx, arg=''):
    if arg == '':
        embed = discord.Embed(
            color=discord.Color.green()
        )
        embed.add_field(name=f'Info', value=f'Compra o item colocado se tiver todos os requisitos', inline=False)
        embed.add_field(name=f'Uso', value=f'?comprar <numero do item>')
        embed.set_footer(text='by Falcão ❤️')
        await ctx.send(embed=embed)

    global epromo
    if arg == "1":
        role = discord.utils.get(ctx.guild.roles, name="Pardal")
        role2 = discord.utils.get(ctx.guild.roles, name="Tucano")
        role3 = discord.utils.get(ctx.guild.roles, name="Falcão")
        if role in ctx.message.author.roles or role2 in ctx.message.author.roles or role3 in ctx.message.author.roles:
            await ctx.send(f'{ctx.message.author.mention} você já possui esse cargo! :rage:')
        else:
            if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= 500000 / epromo:
                role1 = discord.utils.get(ctx.guild.roles, name="Pomba")
                if role1 in ctx.message.author.roles:
                    custo = int(-500000 / epromo)
                    muda_saldo(str(ctx.message.author.id), custo)
                    await ctx.message.author.remove_roles(role1)
                    await ctx.message.author.add_roles(role)
                    muda_cargo(str(ctx.message.author.id), 'Pardal')
                    await ctx.send(f'Parabéns {ctx.message.author.mention}! Você comprou o cargo de Pardal :star_struck:')
                else:
                    await ctx.send(f'{ctx.message.author.mention} você precisa fazer alguma aposta antes de comprar esse cargo! :rage:')
            else:
                await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para comprar esse cargo! :rage:')
    elif arg == "2":
        role = discord.utils.get(ctx.guild.roles, name="Tucano")
        role2 = discord.utils.get(ctx.guild.roles, name="Falcão")
        if role in ctx.message.author.roles or role2 in ctx.message.author.roles:
            await ctx.send(f'{ctx.message.author.mention} você já possui esse cargo! :rage:')
        else:
            if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= 100000000 / epromo:
                role1 = discord.utils.get(ctx.guild.roles, name="Pardal")
                if role1 in ctx.message.author.roles:
                    custo = int(-100000000 / epromo)
                    muda_saldo(str(ctx.message.author.id), custo)
                    await ctx.message.author.remove_roles(role1)
                    await ctx.message.author.add_roles(role)
                    muda_cargo(str(ctx.message.author.id), 'Tucano')
                    await ctx.send(f'Parabéns {ctx.message.author.mention}! Você comprou o cargo de Tucano :star_struck:')
                else:
                    await ctx.send(f'{ctx.message.author.mention} você precisa ter o cargo de Pardal antes de comprar esse cargo! :rage:')
            else:
                await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para comprar esse cargo! :rage:')
    elif arg == "3":
        role = discord.utils.get(ctx.guild.roles, name="Falcão")
        if role in ctx.message.author.roles:
            await ctx.send(f'{ctx.message.author.mention} você já possui esse cargo! :rage:')
        else:
            if checa_arquivo(str(ctx.message.author.id), 'Falcoins')>= 1000000000 / epromo:
                role1 = discord.utils.get(ctx.guild.roles, name="Tucano")
                if role1 in ctx.message.author.roles:
                    custo = int(-1000000000 / epromo)
                    muda_saldo(str(ctx.message.author.id), custo)
                    await ctx.message.author.remove_roles(role1)
                    await ctx.message.author.add_roles(role)
                    muda_cargo(str(ctx.message.author.id),'Falcão')
                    await ctx.send(f'Parabéns {ctx.message.author.mention}! Você comprou o cargo de Falcão :star_struck:')
                else:
                    await ctx.send(f'{ctx.message.author.mention} você precisa ter o cargo de Tucano antes de comprar esse cargo! :rage:')
            else:
                await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para comprar esse cargo! :rage:') 

bot.run(secret_token)
