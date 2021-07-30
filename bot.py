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
    try:
        poupanca.start()
    except:
        pass
    activity = discord.Activity(name='?comandos | arte by: @kinsallum', type=discord.ActivityType.playing)
    await bot.change_presence(activity=activity)
    print('Bot online')

@tasks.loop(hours=24)
async def poupanca():
    with open('falbot.json', 'r') as f:
        people = json.load(f)
    
    for value in people.values():
        value['Banco'] += int(value['Banco'] * 0.01)

    with open('falbot.json', 'w') as f:
            json.dump(people, f, indent=4)
 
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
async def on_command_error(ctx,error):
    if "You are on cooldown." in str(error) and str(ctx.command) == 'lootbox':
        await ctx.send(f'{ctx.message.author.mention} faltam **{tempo_formatado(error)}** para você resgatar a lootbox grátis!')
    elif "is not found" in str(error):
        pass
    else:
        print(f'O erro foi no comando {ctx.command} e aconteceu {error}')

async def check_role(message):
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

async def get_role_color(ctx, member_id):
    member = await ctx.message.guild.fetch_member(member_id)
    for c in member.roles:
        if c == member.roles[-1]:
            role = c
    return role.color.value

@commands.guild_only()
@bot.command(aliases=['sobre'])
@commands.cooldown(1, 1, commands.BucketType.user)
async def eu(ctx, arg=''):
    cria_banco(str(ctx.message.author.id))
    await check_role(ctx.message)
    if "sobre" in ctx.message.content and arg == '':
        await ctx.send(embed=explain('sobre'))
    elif arg == '':
        arg = ctx.message.author.id
    else:
        arg = arruma_mention(arg)
        cria_banco(arg)
    pessoa = await ctx.message.guild.fetch_member(int(arg))
    with open('falbot.json', 'r') as f:
        banco = json.load(f)
    embed = discord.Embed(color=discord.Color(await get_role_color(ctx, ctx.message.author.id)))
    embed.set_author(name=pessoa.name, icon_url=pessoa.avatar_url)
    for key,item in banco[str(arg)].items():
        if key != 'Cargo' : embed.add_field(name=key, value=format(item), inline=False)
    embed.set_footer(text='by Falcão ❤️')
    await ctx.send(embed=embed)

@commands.guild_only()
@bot.command()
@commands.cooldown(1, 1, commands.BucketType.user)
async def roleta(ctx, type='', bet=''):
    cria_banco(str(ctx.message.author.id))
    await check_role(ctx.message)
    if type == '' and bet == '':
        await ctx.send(embed=explain('roleta'))
    else:    
        try:
            bet = int(arg_especial(bet, str(ctx.message.author.id)))
        except:
            await ctx.send(f'{ctx.message.author.mention} {bet} não é um valor válido... :rage:')
        if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= bet and bet > 0:
            change_json(str(ctx.message.author.id), 'Falcoins', -bet)
            await ctx.send('Rolando...')
            if type == 'ímpar' : type = 'impar'
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
                change_json(str(ctx.message.author.id), 'Falcoins', profit)
                pessoa = await ctx.message.guild.fetch_member(int(ctx.message.author.id))
                embed = discord.Embed(color=discord.Color.green())
                embed.set_author(name=pessoa.name, icon_url=pessoa.avatar_url)
                embed.add_field(name='Você ganhou! :sunglasses:', value=f'O bot rolou **{luck}**')
                embed.add_field(name='\u200b', value='\u200b')
                embed.add_field(name='Lucros', value=f'{format(profit)} falcoins')
            else:
                pessoa = await ctx.message.guild.fetch_member(int(ctx.message.author.id))
                embed = discord.Embed(color=discord.Color.red())
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
@commands.cooldown(1, 1, commands.BucketType.user)
async def niquel(ctx, bet=''):
    cria_banco(str(ctx.message.author.id))
    await check_role(ctx.message)
    if bet == '':
        await ctx.send(embed=explain('niquel'))
    else:
        try:
            bet = int(arg_especial(bet, str(ctx.message.author.id)))
        except:
            await ctx.send(f'{ctx.message.author.mention} {bet} não é um valor válido... :rage:')
        if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= bet and bet > 0:
            change_json(str(ctx.message.author.id), 'Falcoins', -bet)
            emojis = [':dollar:', ':coin:', ':moneybag:', ':gem:', ':money_mouth:',':dollar:', ':coin:', ':moneybag:', ':gem:', ':money_mouth:',':dollar:', ':coin:', ':moneybag:', ':gem:', ':money_mouth:']
            emoji1, emoji2, emoji3 = random.choice(emojis), random.choice(emojis), random.choice(emojis)
            str_emojis = emoji1 + emoji2 + emoji3
            pessoa = await ctx.message.guild.fetch_member(int(ctx.message.author.id))
            embed = discord.Embed(color=discord.Color(await get_role_color(ctx, ctx.message.author.id)))
            embed.set_author(name=pessoa.name, icon_url=pessoa.avatar_url)
            embed.add_field(name='-------------------\n | :dollar: | :dollar: | :dollar: |\n-------------------', value=f'--- **GIRANDO** ---')
            embed.set_footer(text='by Falcão ❤️')
            msg = await ctx.send(embed=embed)

            emoji11, emoji22 = [':dollar:'], [':dollar:']
            for index,emoji in enumerate(emojis):
                emoji11[0], emoji22[0] = emoji, emoji
                if emoji == emoji1 and len(emoji11) == 1:
                    emoji11.append(emoji)
                elif emoji == emoji2 and index > 4 and len(emoji22) == 1:
                    emoji22.append(emoji)
                embed.set_field_at(0, name=f'-------------------\n | {emoji11[-1]} | {emoji22[-1]} | {emoji} |\n-------------------', value=f'--- **GIRANDO** ---')
                await msg.edit(embed=embed)
                if emoji == emoji3 and index > 9 : break

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
                winnings = 0
                profit = (bet * winnings) 
            change_json(str(ctx.message.author.id), 'Falcoins', int(profit))

            if profit > 0:
                embed2 = discord.Embed(color=discord.Color.green())
                embed2.add_field(name=f'-------------------\n | {emoji11[-1]} | {emoji22[-1]} | {emoji} |\n-------------------', value=f'--- **Você ganhou!** ---', inline=False)
                embed2.add_field(name='Ganhos', value=f'{format(int(profit))} falcoins')
            else:
                embed2 = discord.Embed(color=discord.Color.red())
                embed2.add_field(name=f'-------------------\n | {emoji11[-1]} | {emoji22[-1]} | {emoji} |\n-------------------', value=f'--- **Você perdeu!** ---', inline=False)
                embed2.add_field(name='Perdas', value=f'{format(bet)} falcoins')
            embed2.set_author(name=pessoa.name, icon_url=pessoa.avatar_url)
            embed2.add_field(name='Saldo atual', value=f'{format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))} falcoins')
            embed2.set_footer(text='by Falcão ❤️')
            await msg.edit(embed=embed2)
        elif int(bet) <= 0:
                await ctx.send(f'{ctx.message.author.mention} {bet} não é um valor válido... :rage:')
        else:
            await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para esta aposta! :rage:')

@commands.guild_only()
@bot.command()
@commands.cooldown(1, 1, commands.BucketType.user)
async def luta(ctx, arg='', bet=''):
    cria_banco(str(ctx.message.author.id))
    await check_role(ctx.message)
    if arg == '' or bet == '':
        await ctx.send(embed=explain('luta'))
    else:
        try:
            bet = int(arg_especial(bet, str(ctx.message.author.id)))
        except:
            await ctx.send(f'{ctx.message.author.mention} {bet} não é um valor válido... :rage:')
        arg = arruma_mention(arg)
        if str(ctx.message.author.id) != arg:
            user = await ctx.message.guild.fetch_member(int(arg))
            cria_banco(str(arg))
            if checa_arquivo(str(ctx.message.author.id),'Falcoins') >= bet and checa_arquivo(arg, 'Falcoins') >= bet:
                message = await ctx.send(f'{ctx.message.author.mention} chamou {user.mention} para uma luta apostando {format(bet)} falcoins :smiling_imp:')
                await message.add_reaction('✅')
                await message.add_reaction('🚫')

                def check(reaction, useri):
                    return useri == user and (str(reaction.emoji) == '✅' or str(reaction.emoji) == '🚫')

                try:
                    reaction, user = await bot.wait_for('reaction_add', timeout=60.0, check=check)
                except asyncio.TimeoutError:
                    await ctx.send(f'Duelo cancelado. {user.mention} demorou muito para aceitar! :confounded:')
                else:
                    if str(reaction.emoji) == '✅':
                        golpes = ['instantâneo', 'stun', 'roubo de vida', 'cura', 'self', 'escudo']
                        player_1 = {'hp': 100, 'name': ctx.message.author.name, 'stunned': False, 'mention': ctx.message.author.mention, 'id': str(ctx.message.author.id), 'escudo': False}
                        player_2 = {'hp': 100, 'name': user.name, 'stunned': False, 'mention': user.mention, 'id': str(user.id), 'escudo': False}
                        luck = random.randint(1,2)
                        if luck == 1:
                            order = [player_1, player_2]
                        else:
                            order = [player_2, player_1]
                        
                        while order[0]['hp'] > 0 and order[1]['hp'] > 0:
                            for i,c in enumerate(order):
                                if order[0]['hp'] <= 0 or order[1]['hp'] <= 0 : break

                                if c['stunned'] == True:
                                    c['stunned'] = False
                                    continue

                                if c['escudo'] == True : c['escudo'] = False

                                attack = random.choice(golpes)
                                luck = random.randint(1,50)

                                if i == 0:
                                    embed, me, enemy = discord.Embed(color=discord.Color.blue()), 0, 1
                                else:
                                    embed, me, enemy = discord.Embed(color=discord.Color.orange()), 1, 0
                                embed.set_footer(text='by Falcão ❤️')

                                if attack == 'instantâneo':
                                    if order[enemy]['escudo'] != True:
                                        order[enemy]['hp'] -= luck
                                    embed.add_field(name=f'{c["name"]} ataca', value=f'[{attack}] {c["mention"]} dá **{luck}** de dano ao inimigo', inline=False)

                                elif attack == 'stun':
                                    if order[enemy]['escudo'] != True:
                                        order[enemy]['hp'] -= luck
                                        order[enemy]['stunned'] = True
                                    embed.add_field(name=f'{c["name"]} ataca', value=f'[{attack}] {c["mention"]} dá **{luck}** de dano ao inimigo e o deixa nocauteado', inline=False)

                                elif attack == 'roubo de vida':
                                    if order[enemy]['escudo'] != True:
                                        order[enemy]['hp'] -= luck
                                        order[me]['hp'] += luck
                                    embed.add_field(name=f'{c["name"]} ataca', value=f'[{attack}] {c["mention"]} rouba **{luck}** de vida do inimigo', inline=False)

                                elif attack == 'cura':
                                    order[i]['hp'] += luck
                                    embed.add_field(name=f'{c["name"]} ataca', value=f'[{attack}] {c["mention"]} se cura em **{luck}** de vida', inline=False)

                                elif attack == 'self':
                                    order[i]['hp'] -= luck
                                    embed.add_field(name=f'{c["name"]} ataca', value=f'[{attack}] {c["mention"]} acidentalmente dá **{luck}** de dano em si mesmo', inline=False)
                                
                                elif attack == 'escudo':
                                    c['escudo'] = True
                                    embed.add_field(name=f'{c["name"]} ataca', value=f'[{attack}] {c["mention"]} se protege', inline=False)

                                if order[i]['hp'] > 100 : order[i]['hp'] = 100

                                embed.add_field(name=f'HP', value=f'{order[0]["mention"]}: {order[0]["hp"]} hp\n{order[1]["mention"]}: {order[1]["hp"]} hp')
                                await ctx.send(embed=embed)
                                await asyncio.sleep(3.5)
                        
                        embed = discord.Embed(color=discord.Color.green())
                        embed.set_footer(text='by Falcão ❤️')
                        if order[0]['hp'] <= 0:
                            change_json(order[0]['id'], 'Falcoins', -bet)
                            change_json(order[1]['id'], 'Falcoins', bet)
                            change_json(order[1]['id'], 'Vitorias')
                            embed.add_field(name=f'{order[1]["name"]} ganhou', value=f'Você derrotou {order[0]["mention"]} em uma luta', inline=False)
                            embed.add_field(name=f'Saldo Atual', value=f'{format(checa_arquivo(str(order[1]["id"]), "Falcoins"))} falcoins')
                        
                        elif order[1]['hp'] <= 0:
                            change_json(order[0]['id'], 'Falcoins', bet)
                            change_json(order[1]['id'], 'Falcoins', -bet)
                            change_json(order[0]['id'], 'Vitorias')
                            embed.add_field(name=f'{order[0]["name"]} ganhou', value=f'Você derrotou {order[1]["mention"]} em uma luta', inline=False)
                            embed.add_field(name=f'Saldo Atual', value=f'{format(checa_arquivo(str(order[0]["id"]), "Falcoins"))} falcoins')

                        await ctx.send(embed=embed)
                    else:
                        await ctx.send(f'Duelo cancelado. {user.mention} recusou o duelo! :confounded:')
            else:
                await ctx.send(f'Saldo insuficiente em uma das contas! :grimacing:')
        else:
            await ctx.send(f'{ctx.message.author.mention} Você não pode lutar com você mesmo, espertinho :rage:')

@commands.guild_only()
@bot.command()
@commands.cooldown(1, 1, commands.BucketType.user)
async def banco(ctx, arg='', arg2=''):
    cria_banco(str(ctx.message.author.id))
    await check_role(ctx.message)
    if arg2 == '':
        await ctx.send(embed=explain('banco'))
    else:
        if arg == 'depositar':
            try:    
                arg2 = int(arg_especial(arg2, str(ctx.message.author.id)))
            except:
                await ctx.send(f'{ctx.message.author.mention} {arg2} não é um valor válido... :rage:')
            if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= arg2 and arg2 > 0:
                change_json(str(ctx.message.author.id), 'Falcoins', -arg2)
                change_json(str(ctx.message.author.id), 'Banco', arg2)
                await ctx.send(f'Você depositou {format(arg2)} falcoins :smiley:')
                pessoa = await ctx.message.guild.fetch_member(int(ctx.message.author.id))
                embed = discord.Embed(color=discord.Color(await get_role_color(ctx, ctx.message.author.id)))
                embed.set_author(name=pessoa.name, icon_url=pessoa.avatar_url)
                embed.add_field(name=f'Saldo atual', value=f'{format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))} falcoins', inline=False)
                embed.add_field(name=f'Banco', value=f'Você tem {format(checa_arquivo(str(ctx.message.author.id), "Banco"))} falcoins no banco')
                embed.set_footer(text='by Falcão ❤️')
                await ctx.send(embed=embed)
            elif int(arg2) <= 0:
                    await ctx.send(f'{ctx.message.author.mention} {arg2} não é um valor válido... :rage:')
            else:
                await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficientes! :rage:')
        elif arg == 'sacar':
            try:    
                arg2 = int(arg_especial_banco(arg2, str(ctx.message.author.id)))
            except:
                await ctx.send(f'{ctx.message.author.mention} {arg2} não é um valor válido... :rage:')
            if checa_arquivo(str(ctx.message.author.id), 'Banco') >= arg2 and arg2 > 0:
                change_json(str(ctx.message.author.id), 'Falcoins', arg2)
                change_json(str(ctx.message.author.id), 'Banco', -arg2)
                await ctx.send(f'Você sacou {format(arg2)} falcoins :smiley:')
                pessoa = await ctx.message.guild.fetch_member(int(ctx.message.author.id))
                embed = discord.Embed(color=discord.Color(await get_role_color(ctx, ctx.message.author.id)))
                embed.set_author(name=pessoa.name, icon_url=pessoa.avatar_url)
                embed.add_field(name=f'Saldo atual', value=f'{format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))} falcoins', inline=False)
                embed.add_field(name=f'Banco', value=f'Você tem {format(checa_arquivo(str(ctx.message.author.id), "Banco"))} falcoins no banco')
                embed.set_footer(text='by Falcão ❤️')
                await ctx.send(embed=embed)
            elif int(arg2) <= 0:
                    await ctx.send(f'{ctx.message.author.mention} {arg2} não é um valor válido... :rage:')
            else:
                await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficientes no banco! :rage:')
        else:
            await ctx.send(f'{ctx.message.author.mention} {arg} não é um valor válido... :rage:')

@commands.guild_only()
@bot.command(aliases=['lb'])
@commands.cooldown(1, 43200, commands.BucketType.user)
async def lootbox(ctx):
        cria_banco(str(ctx.message.author.id))
        await check_role(ctx.message)
        change_json(str(ctx.message.author.id), 'Falcoins', 1000)
        await ctx.send(f' Parabéns {ctx.message.author.mention}! Você ganhou **1000** falcoins :heart_eyes:')

@commands.guild_only()
@bot.command()
@commands.cooldown(1, 1, commands.BucketType.user)
async def doar(ctx, arg='', arg2=''):
    cria_banco(str(ctx.message.author.id))
    cria_banco(arruma_mention(arg))
    await check_role(ctx.message)
    if arg == '' or arg2 == '':
        await ctx.send(embed=explain('doar'))
    else:
        arg2 = arg_especial(arg2, str(ctx.message.author.id))
        if checa_arquivo(str(ctx.message.author.id), 'Falcoins')>= int(arg2):
            change_json(str(ctx.message.author.id), 'Falcoins', -int(arg2))
            change_json(arruma_mention(arg), 'Falcoins', int(arg2))
            await ctx.send(f'{ctx.message.author.mention} transferiu {format(arg2)} falcoins para {arg}')
        else:
            await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para esta doação! :rage:')

@commands.guild_only()
@bot.command()
@commands.cooldown(1, 1, commands.BucketType.user)
async def cavalo(ctx, arg='', bet=''):
    cria_banco(str(ctx.message.author.id))
    await check_role(ctx.message)
    if arg == '' or bet == '':
        await ctx.send(embed=explain('cavalo'))
    else:
        if ctx.message.mentions == []:
            try:
                bet = int(arg_especial(bet, str(ctx.message.author.id)))
            except:
                await ctx.send(f'{ctx.message.author.mention} {bet} não é um valor válido... :rage:')
            if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= bet and bet > 0:
                change_json(str(ctx.message.author.id), 'Falcoins', -bet)
                if arg in '12345':
                    pessoa = await ctx.message.guild.fetch_member(int(ctx.message.author.id))
                    horse1, horse2, horse3, horse4, horse5 = '- - - - -', '- - - - -', '- - - - -', '- - - - -', '- - - - -'
                    embed = discord.Embed(color=discord.Color(await get_role_color(ctx, ctx.message.author.id)))
                    embed.add_field(name=f'Cavalo', value=f':checkered_flag: {horse1} :horse_racing:\n\u200b\n:checkered_flag: {horse2} :horse_racing:\n\u200b\n:checkered_flag: {horse3} :horse_racing:\n\u200b\n:checkered_flag: {horse4} :horse_racing:\n\u200b\n:checkered_flag: {horse5} :horse_racing:')
                    embed.set_author(name=pessoa.name, icon_url=pessoa.avatar_url)
                    embed.set_footer(text='by Falcão ❤️')
                    msg = await ctx.send(embed=embed)

                    for c in range(0, 21):
                        run = random.randint(1,5)
                        if run == 1:
                            horse1 = horse1[:-2]
                        elif run == 2:
                            horse2 = horse2[:-2]
                        elif run == 3:
                            horse3 = horse3[:-2]
                        elif run == 4:
                            horse4 = horse4[:-2]
                        else:
                            horse5 = horse5[:-2]
                                
                        embed.set_field_at(0, name=f'Cavalo', value=f':checkered_flag: {horse1} :horse_racing:\n\u200b\n:checkered_flag: {horse2} :horse_racing:\n\u200b\n:checkered_flag: {horse3} :horse_racing:\n\u200b\n:checkered_flag: {horse4} :horse_racing:\n\u200b\n:checkered_flag: {horse5} :horse_racing:')
                        await msg.edit(embed=embed)

                        if horse1 == '' or horse2 == '' or horse3 == '' or horse4 == '' or horse5 == '' : break

                    if horse1 == '' : winner = '1'
                    elif horse2 == '' : winner = '2'
                    elif horse3 == '' : winner = '3'
                    elif horse4 == '' : winner = '4'
                    else : winner = '5'

                    if arg in winner:
                        change_json(str(ctx.message.author.id), 'Falcoins', bet*5)
                        embed2 = discord.Embed(color=discord.Color.green())
                        embed2.add_field(name=f'Cavalo {winner} ganhou!', value=f'Você ganhou {format(bet*5)} falcoins', inline=False)
                    else:
                        embed2 = discord.Embed(color=discord.Color.red())
                        embed2.add_field(name=f'Cavalo {winner} ganhou!', value=f'Você perdeu {format(bet)} falcoins', inline=False)
                    
                    embed2.add_field(name=f'Saldo atual', value=f'{format(checa_arquivo(str(ctx.message.author.id), "Falcoins"))} falcoins', inline=False)
                    embed.set_author(name=pessoa.name, icon_url=pessoa.avatar_url)
                    embed2.set_footer(text='by Falcão ❤️')
                    await ctx.send(embed=embed2)
                else:
                    await ctx.send(f'{ctx.message.author.mention} {arg} não é um cavalo válido... :rage:')
            elif int(bet) <= 0:
                await ctx.send(f'{ctx.message.author.mention} {bet} não é um valor válido... :rage:')
            else:
                await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para esta aposta! :rage:')
        else:
            arg = arruma_mention(arg)
            if str(ctx.message.author.id) != arg:
                user = await ctx.message.guild.fetch_member(int(arg))
                cria_banco(str(arg))
                bet = int(arg_especial(bet,str(ctx.message.author.id)))
                if checa_arquivo(str(ctx.message.author.id),'Falcoins') >= bet and checa_arquivo(arg, 'Falcoins') >= bet:
                    message = await ctx.send(f'{ctx.message.author.mention} chamou {user.mention} para uma cavalgada apostando {format(bet)} falcoins :smiling_imp:')
                    await message.add_reaction('✅')
                    await message.add_reaction('🚫')

                    def check(reaction, useri):
                        return useri == user and (str(reaction.emoji) == '✅' or str(reaction.emoji) == '🚫')

                    try:
                        reaction, user = await bot.wait_for('reaction_add', timeout=60.0, check=check)
                    except asyncio.TimeoutError:
                        await ctx.send(f'Cavalgada cancelado. {user.mention} demorou muito para aceitar! :confounded:')
                    else:
                        if str(reaction.emoji) == '✅':
                            player_1 = '- - - - -'
                            player_2 = '- - - - -'
                            embed = discord.Embed(color=discord.Color.green())
                            embed.add_field(name=f'Duelo', value=f':checkered_flag: {player_1} :horse_racing: {ctx.message.author.mention}\n:checkered_flag: {player_2} :horse_racing: {user.mention}')
                            embed.set_footer(text='by Falcão ❤️')
                            msg = await ctx.send(embed=embed)

                            for c in range(0, 9):
                                await asyncio.sleep(0.4)
                                run = random.randint(1,2)
                                if run == 1:
                                    player_1 = player_1[:-2]
                                else:
                                    player_2 = player_2[:-2]
                                
                                embed.set_field_at(0, name=f'Duelo', value=f':checkered_flag: {player_1} :horse_racing: {ctx.message.author.mention}\n:checkered_flag: {player_2} :horse_racing: {user.mention}')
                                await msg.edit(embed=embed)

                                if player_1 == '' or player_2 == '' : break

                            if player_1 == '':
                                winner = await ctx.message.guild.fetch_member(ctx.message.author.id)
                                change_json(str(winner.id), 'Falcoins', bet)
                                change_json(str(user.id), 'Falcoins', -bet)
                                change_json(str(winner.id), 'Vitorias')
                            else:
                                winner = await ctx.message.guild.fetch_member(int(arg))
                                change_json(str(winner.id), 'Falcoins', bet)
                                change_json(str(ctx.message.author.id), 'Falcoins', -bet)
                                change_json(str(winner.id), 'Vitorias')

                            embed2 = discord.Embed(color=discord.Color.green())
                            embed2.add_field(name=f'{winner.name} ganhou!', value=f'Você ganhou {format(bet)} falcoins', inline=False)
                            embed2.add_field(name=f'Saldo atual', value=f'{format(checa_arquivo(str(winner.id), "Falcoins"))} falcoins', inline=False)
                            embed2.set_footer(text='by Falcão ❤️')
                            await ctx.send(embed=embed2)
                        else:
                            await ctx.send(f'Duelo cancelado. {user.mention} recusou a cavalgada! :confounded:')
                else:
                    await ctx.send(f'Saldo insuficiente em uma das contas! :grimacing:')
            else:
                await ctx.send(f'{ctx.message.author.mention} Você não pode cavalgar com você mesmo, espertinho :rage:')

@commands.guild_only()
@bot.command()
@commands.cooldown(1, 1, commands.BucketType.user)
async def rank(ctx, local=True):
    cria_banco(str(ctx.message.author.id))
    await check_role(ctx.message)
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
    embed = discord.Embed(color=discord.Color(await get_role_color(ctx, ctx.message.author.id)))
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
@commands.cooldown(1, 1, commands.BucketType.user)
async def rank_global(ctx):
    await ctx.invoke(bot.get_command('rank'), local=False)

@commands.guild_only()
@bot.command()
@commands.cooldown(1, 1, commands.BucketType.user)
async def caixa(ctx, arg='', amount=''):
    cria_banco(str(ctx.message.author.id))
    await check_role(ctx.message)
    if arg == '' or amount == '':
        await ctx.send(embed=explain('caixa'))
    else:
        if checa_arquivo(str(ctx.message.author.id), 'Caixas') >= int(amount) or checa_arquivo(str(ctx.message.author.id), 'Chaves') >= int(amount):
            change_json(str(ctx.message.author.id), 'Caixas', -int(amount))
            change_json(str(ctx.message.author.id), 'Chaves', -int(amount))
            for c in range(int(amount)):
                luck = random.randint(0, 100)
                if luck <= 60:
                    chaves, caixas, falcoins = random.randint(0, 1), random.randint(0, 1), random.randint(500, 15000)
                    change_json(str(ctx.message.author.id), 'Falcoins', falcoins)
                    change_json(str(ctx.message.author.id), 'Caixas', caixas)
                    change_json(str(ctx.message.author.id), 'Chaves', chaves)
                else:
                    chaves, caixas, falcoins = 0, 0, 0
                embed = discord.Embed(color=await get_role_color(ctx, ctx.message.author.id))
                embed.set_author(name=ctx.message.author.name, icon_url=ctx.message.author.avatar_url)
                embed.add_field(name='Caixa', value=f'Você ganhou {chaves} chaves\nVocê ganhou {falcoins} falcoins\nVocê ganhou {caixas} caixas')
                embed.set_footer(text='by Falcão ❤️')
                await ctx.send(embed=embed)
        else:
            await ctx.send(f'{ctx.message.author.mention} você não tem caixas e/ou chaves o suficiente para esta ação! :rage:')

@commands.guild_only()
@bot.command()
@commands.cooldown(1, 1, commands.BucketType.user)
async def loja(ctx):
    cria_banco(str(ctx.message.author.id))
    await check_role(ctx.message)
    embed = discord.Embed(title='**Loja**', color=discord.Color(await get_role_color(ctx, ctx.message.author.id)))
    embed.add_field(name=f'Item número 1: Pardal', value='Pelo custo de 100.000 falcoins você adquire um cargo de pardal', inline=False)
    embed.add_field(name=f'Item número 2: Tucano',value=f'Pelo custo de 1.000.000 falcoins você adquire um cargo de tucano', inline=False)
    embed.add_field(name=f'Item número 3: Falcão', value='Pelo custo de 10.000.000 falcoins você adquire um cargo da melhor ave do mundo', inline=False)
    embed.add_field(name=f'Item número 4: Caixa', value=f'Pelo custo de 5.000 falcoins você compra uma caixa que pode ser aberta usando uma chave', inline=False)
    embed.add_field(name=f'Item número 5: Chave', value=f'Pelo custo de 20.000 falcoins você compra uma chave que pode ser usada para abrir uma caixa', inline=False)
    embed.set_footer(text='by Falcão ❤️')
    await ctx.send(embed=embed)

@commands.guild_only()
@bot.command()
@commands.cooldown(1, 1, commands.BucketType.user)
async def comprar(ctx, arg=''):
    cria_banco(str(ctx.message.author.id))
    await check_role(ctx.message)
    if arg == '':
        await ctx.send(embed=explain('comprar'))
    else:
        if arg == "1":
            role, role2, role3 = discord.utils.get(ctx.guild.roles, name="Pardal"), discord.utils.get(ctx.guild.roles, name="Tucano"), discord.utils.get(ctx.guild.roles, name="Falcão")
            if role in ctx.message.author.roles or role2 in ctx.message.author.roles or role3 in ctx.message.author.roles:
                await ctx.send(f'{ctx.message.author.mention} você já possui esse cargo! :rage:')
            else:
                if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= 100000:
                    change_json(str(ctx.message.author.id), 'Falcoins', -100000)
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
                if checa_arquivo(str(ctx.message.author.id), 'Falcoins') >= 1000000:
                    role1 = discord.utils.get(ctx.guild.roles, name="Pardal")
                    if role1 in ctx.message.author.roles:
                        change_json(str(ctx.message.author.id), 'Falcoins', -1000000)
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
                if checa_arquivo(str(ctx.message.author.id), 'Falcoins')>= 10000000:
                    role1 = discord.utils.get(ctx.guild.roles, name="Tucano")
                    if role1 in ctx.message.author.roles:
                        change_json(str(ctx.message.author.id), 'Falcoins', -10000000)
                        await ctx.message.author.remove_roles(role1)
                        await ctx.message.author.add_roles(role)
                        muda_cargo(str(ctx.message.author.id),'Falcão')
                        await ctx.send(f'Parabéns {ctx.message.author.mention}! Você comprou o cargo de Falcão :star_struck:')
                    else:
                        await ctx.send(f'{ctx.message.author.mention} você precisa ter o cargo de Tucano antes de comprar esse cargo! :rage:')
                else:
                    await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para comprar esse cargo! :rage:')
        elif arg == "4":
            if checa_arquivo(str(ctx.message.author.id), 'Falcoins')>= 5000:
                change_json(str(ctx.message.author.id), 'Falcoins', -5000)
                change_json(str(ctx.message.author.id), 'Caixas')
                await ctx.send(f'Parabéns {ctx.message.author.mention}! Você comprou uma caixa :star_struck:')
            else:
                await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para comprar esse item! :rage:')
        elif arg == "5":
            if checa_arquivo(str(ctx.message.author.id), 'Falcoins')>= 20000:
                change_json(str(ctx.message.author.id), 'Falcoins', -20000)
                change_json(str(ctx.message.author.id), 'Chaves')
                await ctx.send(f'Parabéns {ctx.message.author.mention}! Você comprou uma chave :star_struck:')
            else:
                await ctx.send(f'{ctx.message.author.mention} você não tem falcoins suficiente para comprar esse item! :rage:')    

if __name__ == '__main__':
    bot.run(secret_token)
