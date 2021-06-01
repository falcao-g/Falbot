import discord
from discord.ext import commands, tasks
import asyncio
import json
import random
from funcoes import *
import asyncio

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
    #falbit.start()
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

@bot.event
async def on_message(message):
    role1 = discord.utils.get(message.guild.roles, name="Pardal")
    role2 = discord.utils.get(message.guild.roles, name="Tucano")
    role3 = discord.utils.get(message.guild.roles, name="Falcão")
    if checa_cargo(str(message.author.id)) == 1:
        await message.author.add_roles(role1)
    elif checa_cargo(str(message.author.id)) == 2:
        await message.author.add_roles(role2)
    elif checa_cargo(str(message.author.id)) == 3:
        await message.author.add_roles(role3)
    elif checa_cargo(str(message.author.id)) == 0 and (role1 in message.author.roles or role2 in message.author.roles or role3 in message.author.roles):
        try:
            await message.author.remove_roles(role1, role2, role3)
        except:
            pass

    await bot.process_commands(message)

@commands.guild_only()
@bot.command(aliases=['sobre'])
async def eu(ctx, arg=''):
    if "sobre" in ctx.message.content and arg == '':
        await ctx.send(embed=explain('sobre'))
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
        if key != 'Cargo':
            embed.add_field(name=key, value=format(item), inline=True)
    embed.set_footer(text='by Falcão ❤️')
    await ctx.send(embed=embed)

@commands.guild_only()
@bot.command(aliases=['ap'])
async def apostar(ctx, arg=''):
    if arg == '':
        await ctx.send(embed=explain('apostar'))

    cria_banco(str(ctx.message.author.id))
    arg = arg_especial(arg, str(ctx.message.author.id))
    if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= int(arg) and int(arg) > 0:
        sorte = random.randint(0,100)
        if sorte >= 95:
            muda_saldo(str(ctx.message.author.id), -int(arg))
            await ctx.send (f'{ctx.message.author.mention} você perdeu tudo que apostou :pensive: :fist: *Saldo atual*: {format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))}') 
        elif sorte <= 55:
            total = int(int((random.randint(10,100) * int(arg)) / 100))
            if total == 0:
                total = 1
            muda_saldo(str(ctx.message.author.id), total)
            await ctx.send (f'{ctx.message.author.mention} Parabéns! Você lucrou {format(total)} falcoins :sunglasses: *Saldo atual*: {format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))}')
            if total >= 1000000:
                muda_saldo(str(ctx.message.author.id), -int(total/20))
                await ctx.send(f'{ctx.message.author.mention} foram cobrados {format(int(total/20))} falcoins de imposto! *Saldo atual*: {format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))}')
            total = int((random.randint(10,90) * int(arg)) / 100)
            if total == 0:
                total = 1
            muda_saldo(str(ctx.message.author.id), -total)
            await ctx.send (f'{ctx.message.author.mention} você perdeu {format(total)} falcoins :slight_frown: *Saldo atual*: {format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))}')
    elif int(arg) <= 0:
        await ctx.send(f'{ctx.message.author.mention} {arg} não é um valor válido... :rage:')
    else:
        await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para esta aposta! :rage:')

@commands.guild_only()
@bot.command()
async def roleta(ctx, type='', bet=''):
    if type == '' and bet == '':
        await ctx.send(embed=explain('roleta'))
    else:    
        cria_banco(str(ctx.message.author.id))
        try:
            bet = int(arg_especial(bet, str(ctx.message.author.id)))
        except:
            await ctx.send(f'{ctx.message.author.mention} {bet} não é um valor válido... :rage:')
        if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= bet and bet > 0:
            await ctx.send('Rolando...')
            luck = random.randint(0,36)
            verde = [0]
            vermelho = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
            preto = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]
            baixos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
            altos = [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
            impar = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35]
            par = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36]
            number = [type]
            types = {'verde': verde, 'vermelho': vermelho, 'preto': preto, 'baixos': baixos, 'altos': altos, 'impar': impar, 'par': par, 'number': number}

            if type.isnumeric():
                type = number
                profit = bet * 35
            else:
                for key, value in types.items():
                    if key == type:
                        type = value
                profit = bet * 2
            
            if luck in type:
                muda_saldo(str(ctx.message.author.id), profit)
                pessoa = await ctx.message.guild.fetch_member(int(ctx.message.author.id))
                embed = discord.Embed(
                    color=discord.Color.blue()
                )
                embed.set_author(name=pessoa.name, icon_url=pessoa.avatar_url)
                embed.add_field(name='Você ganhou! :sunglasses:', value=f'O bot rolou **{luck}**')
                embed.add_field(name='\u200b', value='\u200b')
                embed.add_field(name='Lucros', value=f'{format(profit)} falcoins')
                embed.add_field(name='Saldo atual', value=f'{format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))} falcoins', inline=False)
                embed.set_footer(text='by Falcão ❤️')
                await ctx.send(embed=embed)
            else:
                muda_saldo(str(ctx.message.author.id), -bet)
                pessoa = await ctx.message.guild.fetch_member(int(ctx.message.author.id))
                embed = discord.Embed(
                    color=discord.Color(000000)
                )
                embed.set_author(name=pessoa.name, icon_url=pessoa.avatar_url)
                embed.add_field(name='Você perdeu! :pensive:', value=f'O bot rolou **{luck}**')
                embed.add_field(name='\u200b', value='\u200b')
                embed.add_field(name='Perdas', value=f'{format(bet)} falcoins')
                embed.add_field(name='Saldo atual', value=f'{format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))} falcoins', inline=False)
                embed.set_footer(text='by Falcão ❤️')
                await ctx.send(embed=embed)
        elif int(bet) <= 0:
            await ctx.send(f'{ctx.message.author.mention} {bet} não é um valor válido... :rage:')
        else:
            await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para esta aposta! :rage:')

@commands.guild_only()
@bot.command(aliases=['níquel'])
async def niquel(ctx, bet=''):
    if bet == '':
        await ctx.send(embed=explain('niquel'))
    else:
        cria_banco(str(ctx.message.author.id))
        try:
            bet = int(arg_especial(bet, str(ctx.message.author.id)))
        except:
            await ctx.send(f'{ctx.message.author.mention} {bet} não é um valor válido... :rage:')
        if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= bet and bet > 0:
            emojis = [':dollar:', ':coin:', ':moneybag:', ':gem:', ':money_mouth:',':dollar:', ':coin:', ':moneybag:', ':gem:', ':money_mouth:',':dollar:', ':coin:', ':moneybag:', ':gem:', ':money_mouth:']
            emoji1 = random.choice(emojis)
            emoji2 = random.choice(emojis)
            emoji3 = random.choice(emojis)
            str_emojis = emoji1 + emoji2 + emoji3
            pessoa = await ctx.message.guild.fetch_member(int(ctx.message.author.id))
            embed = discord.Embed(
                color=discord.Color.blue()
            )
            embed.set_author(name=pessoa.name, icon_url=pessoa.avatar_url)
            embed.add_field(name='-------------------\n | :dollar: | :dollar: | :dollar: |\n-------------------', value=f'--- **GIRANDO** ---')
            embed.set_footer(text='by Falcão ❤️')
            msg = await ctx.send(embed=embed)

            emoji11 = [':dollar:']
            emoji22 = [':dollar:']
            for index,emoji in enumerate(emojis):
                emoji11[0] = emoji
                emoji22[0] = emoji
                if emoji == emoji1 and len(emoji11) == 1:
                    emoji11.append(emoji)
                elif emoji == emoji2 and index > 4 and len(emoji22) == 1:
                    emoji22.append(emoji)
                embed.set_field_at(0, name=f'-------------------\n | {emoji11[-1]} | {emoji22[-1]} | {emoji} |\n-------------------', value=f'--- **GIRANDO** ---')
                await msg.edit(embed=embed)
                if emoji == emoji3 and index > 9:
                    break
            dollar = str_emojis.count(':dollar:')
            coin = str_emojis.count(':coin:')
            moneybag = str_emojis.count(':moneybag:')
            gem = str_emojis.count(':gem:')
            money_mouth = str_emojis.count(':money_mouth:')

            if dollar == 3:
                winnings = 4
                profit = bet * winnings
            elif coin == 3:
                winnings = 3
                profit = bet * winnings
            elif moneybag == 3:
                winnings = 7
                profit = bet * winnings
            elif gem == 3:
                winnings = 15
                profit = bet * winnings
            elif money_mouth == 3:
                winnings = 2.5
                profit = bet * winnings
            elif dollar == 2:
                winnings = 2
                profit = bet * winnings
            elif coin == 2:
                winnings = 2
                profit = bet * winnings
            elif moneybag == 2:
                winnings = 3.5
                profit = bet * winnings
            elif gem == 2:
                winnings = 7
                profit = bet * winnings
            elif money_mouth == 2:
                winnings = 0.5
                profit = bet * winnings 
            else:
                winnings = -1
                profit = (bet * winnings) 
            muda_saldo(str(ctx.message.author.id), int(profit))

            if profit > 0:
                embed.set_field_at(0, name=f'-------------------\n | {emoji11[-1]} | {emoji22[-1]} | {emoji} |\n-------------------', value=f'--- **Você ganhou!** ---', inline=False)
                embed.add_field(name='Ganhos', value=f'{int(profit)} falcoins')
                embed.add_field(name='Saldo atual', value=f'{format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))} falcoins')
                await msg.edit(embed=embed)
            else:
                embed.set_field_at(0, name=f'-------------------\n | {emoji11[-1]} | {emoji22[-1]} | {emoji} |\n-------------------', value=f'--- **Você perdeu!** ---', inline=False)
                embed.add_field(name='Perdas', value=f'{int(profit)} falcoins')
                embed.add_field(name='Saldo atual', value=f'{format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))} falcoins')
                await msg.edit(embed=embed)
        elif int(bet) <= 0:
                await ctx.send(f'{ctx.message.author.mention} {bet} não é um valor válido... :rage:')
        else:
            await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para esta aposta! :rage:')
    
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
        lb = random.randint(int(minimo), int(maximo))
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
    if arg == '' or arg2 == '':
        await ctx.send(embed=explain('doar'))

    cria_banco(str(ctx.message.author.id))
    cria_banco(arg[3:-1])
    arg2 = arg_especial(arg2, str(ctx.message.author.id))
    if checa_arquivo(str(ctx.message.author.id), 'Falcoins')>= int(arg2):
        muda_saldo(str(ctx.message.author.id), -int(arg2))
        muda_saldo(arg[3:-1], int(arg2))
        await ctx.send(f'{ctx.message.author.mention} transferiu {format(arg2)} falcoins para {arg}')
    else:
        await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para esta doação! :rage:')

@commands.guild_only()
@bot.command()
async def duelo(ctx, arg='', arg2=''):
    if arg == '' or arg2 == '':
        await ctx.send(embed=explain('duelo'))

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
async def loja(ctx):
    cria_banco(str(ctx.message.author.id))
    embed = discord.Embed(
    title='**Loja**',
    color=discord.Color.verde()
    )
    embed.add_field(name=f'Item número 1: Pardal', value='Pelo custo de 500.000 falcoins você adquire um cargo de pardal no servidor', inline=False)
    embed.add_field(name=f'Item número 2: Tucano',value=f'Pelo custo de 100.000.000 falcoins você adquire um cargo de tucano no servidor', inline=False)
    embed.add_field(name=f'Item número 3: Falcão', value='Pelo custo de 1.000.000.000 falcoins você adquire um cargo da melhor ave do mundo no servidor', inline=False)
    embed.set_footer(text='by Falcão ❤️')
    await ctx.send(embed=embed)

@commands.guild_only()
@bot.command()
async def comprar(ctx, arg=''):
    if arg == '':
        await ctx.send(embed=explain('comprar'))

    if arg == "1":
        role = discord.utils.get(ctx.guild.roles, name="Pardal")
        role2 = discord.utils.get(ctx.guild.roles, name="Tucano")
        role3 = discord.utils.get(ctx.guild.roles, name="Falcão")
        if role in ctx.message.author.roles or role2 in ctx.message.author.roles or role3 in ctx.message.author.roles:
            await ctx.send(f'{ctx.message.author.mention} você já possui esse cargo! :rage:')
        else:
            if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= 500000:
                custo = -500000
                muda_saldo(str(ctx.message.author.id), custo)
                await ctx.message.author.add_roles(role)
                muda_cargo(str(ctx.message.author.id), 'Pardal')
                await ctx.send(f'Parabéns {ctx.message.author.mention}! Você comprou o cargo de Pardal :star_struck:')
            else:
                await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para comprar esse cargo! :rage:')
    elif arg == "2":
        role = discord.utils.get(ctx.guild.roles, name="Tucano")
        role2 = discord.utils.get(ctx.guild.roles, name="Falcão")
        if role in ctx.message.author.roles or role2 in ctx.message.author.roles:
            await ctx.send(f'{ctx.message.author.mention} você já possui esse cargo! :rage:')
        else:
            if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= 100000000:
                role1 = discord.utils.get(ctx.guild.roles, name="Pardal")
                if role1 in ctx.message.author.roles:
                    custo = -100000000
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
            if checa_arquivo(str(ctx.message.author.id), 'Falcoins')>= 1000000000:
                role1 = discord.utils.get(ctx.guild.roles, name="Tucano")
                if role1 in ctx.message.author.roles:
                    custo = -1000000000
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
