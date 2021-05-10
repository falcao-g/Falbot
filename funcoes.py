import json

def cria_banco(pessoa):
    assert pessoa.isnumeric()
    with open('falbot.json', 'r') as f:
            banco = json.load(f)
    try:
        banco[pessoa]
    except KeyError:
        banco[pessoa] = {'Falcoins': 0, 'Vitorias': 0, 'Divida': 0, 'Agiota': '', 'Cargo': ''}
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

def muda_divida(pessoa, dinheiro):
    with open('falbot.json','r') as f:
        banco = json.load(f)

    banco[pessoa]['Divida'] += dinheiro
    if banco[pessoa]['Divida'] <= 0:
        zera_divida(pessoa)

    with open('falbot.json', 'w') as f:
        json.dump(banco, f, indent=4)

def muda_agiota(pessoa, agiota):
    with open('falbot.json','r') as f:
        banco = json.load(f)

    banco[pessoa]['Agiota'] = agiota

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
    else:
        for c in arg:
            if c == '%':
                arg = int(int(arg[:-1]) * int(banco[str(pessoa)]['Falcoins']) / 100)
    return arg

def format(falcoins):
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
    elif banco[pessoa]['Cargo'] == 'Falcão':
        return 3

def zera_divida(pessoa):
       with open('falbot.json','r') as f:
        banco = json.load(f)

        banco[pessoa]['Divida'] = 0
        banco[pessoa]['Agiota'] = ''

        with open('falbot.json', 'w') as f:
            json.dump(banco, f, indent=4)

def checa_arquivo(pessoa, campo=''):
    with open('falbot.json','r') as f:
        banco = json.load(f)
    if campo == '':
        return banco[pessoa]
    else:
        return banco[pessoa][campo]