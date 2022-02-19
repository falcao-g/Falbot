const fs = require("fs");
const { MessageEmbed } = require("discord.js");

function createUser(id) {
  try {
    var users = JSON.parse(fs.readFileSync("falbot.json", "utf8"))

    if (users[id] == undefined ) {
      users[id] = {
        Falcoins: 10000,
        Vitorias: 0,
        Banco: 0,
        Caixas: 0,
        Chaves: 0,
        Lootbox: 1000,
        voto: 0
      }
  
      json = JSON.stringify(users, null, 2);
      fs.writeFileSync("falbot.json", json, "utf8")
      return true
    }
    return false
  } catch (error) {
    console.error(`Erro ao criar usuário: ${error}`)
  }
}

function changeJSON(id, field, quantity = 1, erase = false) {
  try {
    createUser(id)
    var users = JSON.parse(fs.readFileSync("falbot.json", "utf8"))
    if (erase == true) {
      users[id][field] = quantity
    } else {
      users[id][field] += quantity
    }
    json = JSON.stringify(users, null, 2)
    fs.writeFileSync("falbot.json", json, "utf8") 
  } catch (error) {
    console.error(`Erro ao alterar JSON: ${error}`)	
  }
}

function takeAndGive(id, id2, field, field2, quantity = 1) {
  try {
    createUser(id)
    createUser(id2)
    var users = JSON.parse(fs.readFileSync("falbot.json", "utf8"))
    users[id][field] -= quantity;
    users[id2][field2] += quantity;
    json = JSON.stringify(users, null, 2);
    fs.writeFileSync("falbot.json", json, "utf8")
  } catch (error) {
    console.error(`Erro ao alterar JSON no takeAndGive: ${error}`)
  }
}

async function msToTime(ms) {
  let time = "";

  let n = 0;
  if (ms >= 31536000000) {
    n = Math.floor(ms / 31536000000);
    time = `${n}y `;
    ms -= n * 31536000000;
  }

  if (ms >= 2592000000) {
    n = Math.floor(ms / 2592000000);
    time += `${n}mo `;
    ms -= n * 2592000000;
  }

  if (ms >= 604800000) {
    n = Math.floor(ms / 604800000);
    time += `${n}w `;
    ms -= n * 604800000;
  }

  if (ms >= 86400000) {
    n = Math.floor(ms / 86400000);
    time += `${n}d `;
    ms -= n * 86400000;
  }

  if (ms >= 3600000) {
    n = Math.floor(ms / 3600000);
    time += `${n}h `;
    ms -= n * 3600000;
  }

  if (ms >= 60000) {
    n = Math.floor(ms / 60000);
    time += `${n}m `;
    ms -= n * 60000;
  }

  n = Math.ceil(ms / 1000);
  time += n === 0 ? "" : `${n}s`;

  return time.trimEnd();
}

async function specialArg(arg, id, field) {
  createUser(id)
  var users = JSON.parse(fs.readFileSync("falbot.json", "utf8"));

  arg = arg.toString()
  arg = arg.toLowerCase()

  new_arg = "";
  for (c in arg) {
    if (arg[c] != "." && arg[c] != ",") {
      new_arg += arg[c];
    }
  }

  if (new_arg == "tudo") {
    new_arg = users[id][field];
  } else if (new_arg == "metade") {
    new_arg = parseInt(users[id][field] / 2);
  } else {
    for (c in new_arg) {
      if (new_arg[c] == "%") {
        new_arg = parseInt(
          (parseInt(new_arg.slice(0, -1)) * parseInt(users[id][field])) /
            100
        );
      }
    }
  }
  if (parseInt(new_arg) < 0 || isNaN(parseInt(new_arg))) {
    throw Error("Argumento inválido!");
  } else {
    return parseInt(new_arg);
  }
}

async function format(falcoins) {
  if (parseInt(falcoins) < 0) {
    falcoins = falcoins.toString();
    pop = falcoins.slice(1);
  } else {
    pop = falcoins.toString();
  }
  pop_reverse = pop.split("").reverse().join("");
  pop_2 = "";
  for (c in pop_reverse) {
    if (c / 3 == parseInt(c / 3) && c / 3 != 0) {
      pop_2 += ".";
      pop_2 += pop_reverse[c];
    } else {
      pop_2 += pop_reverse[c];
    }
  }
  return pop_2.split("").reverse().join("");
}

async function readFile(id, field = "") {
  try {
    createUser(id)
    var users = JSON.parse(fs.readFileSync("falbot.json", "utf8"));

    if (field == "") {
      return users[id];
    } else {
      return users[id][field];
    }
  } catch (error) {
    console.error(`Erro ao ler arquivo: ${error}`)
  }
}

async function getRoleColor(message, member_id) {
  member = message.guild.members.cache.get(member_id);
  return member.displayColor;
}

async function getMember(message, member_id) {
  member = message.guild.members.cache.get(member_id);
  return member;
}

async function explain(command) {
  command = command.toLowerCase();
  embed = new MessageEmbed()
  
  if (command == "eu") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: "Mostra suas informações",
        inline: false,
      },
      {
        name: "Uso",
        value: "/eu",
        inline: false,
      },
    ])
  } else if (command == "sobre") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: "Mostra as informações do usuário mencionado",
        inline: false,
      },
      {
        name: "Uso",
        value: "/sobre @usuario",
        inline: false,
      },
    ])
  } else if (command == "lootbox" || command == "lb") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: "Resgata sua lootbox grátis (disponível a cada 12 horas)",
        inline: false,
      },
      {
        name: "Uso",
        value: "/lootbox",
        inline: false,
      },
    ])
  } else if (command == "doar") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: "Doa x Falcoins para o usuário mencionado",
        inline: false,
      },
      {
        name: "Valores aceitos",
        value: "Os valores em falcoins podem tanto ser números, quanto porcentagens, 'tudo' ou 'metade'",
        inline: false,
      },
      {
        name: "Uso",
        value: "/doar <@usuario> <falcoins>",
        inline: false,
      },
    ])
  } else if (command == "cavalo") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: "Adivinhe qual cavalo é o vencedor",
        inline: false,
      },
      {
        name: "Ganhos",
        value: "**5x**",
        inline: false,
      },
      {
        name: "Valores aceitos",
        value: "Os valores em falcoins podem tanto ser números, quanto porcentagens, 'tudo' ou 'metade'",
        inline: false,
      },
      {
        name: "Uso",
        value: "/cavalo <1-5> <falcoins>",
        inline: false,
      }
    ])
  } else if (command == "rank") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: "Mostra o rank local ou global",
        inline: false,
      },
      {
        name: "Uso",
        value: "/rank [escopo]",
        inline: false,
      },
    ])
  } else if (command == "loja") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: "Mostra os itens disponíveis para compra",
        inline: false,
      },
      {
        name: "Valores aceitos",
        value: "Os valores em falcoins podem tanto ser números, quanto porcentagens, 'tudo' ou 'metade'",
        inline: false,
      },
      {
        name: "Uso",
        value: "/loja [numero] [quantidade] - numero e quantidade só são obrigatórios caso você queira comprar algo",
        inline: false,
      },
    ])
  } else if (command == "roleta") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Tipos de aposta",
        value:
          "**<preto/vermelho/verde>, <0-36>, <altos/baixos>, <par/impar>**",
        inline: false,
      },
      {
        name: "Info",
        value:
          "**preto/vermelho/verde** se o bot rolar um número com a sua cor, você ganha\n**0-36** se o bot rolar seu número, você ganha\n**altos/baixos** baixos 1-18, altos 19-36\n**impar/par impar** = 1, 3, 5 ..., 35, par = 2, 4, 6, ..., 36",
        inline: false,
      },
      {
        name: "Ganhos",
        value:
          "**preto/vermelho/verde** - 2x\n**0-36** - 35x\n**altos/baixos** - 2x\n**impar/par** - 2x",
        inline: false,
      },
      {
        name: "Números",
        value:
          "Verde: **0**\nPreto: **2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35**\nVermelho: ** 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36**'",
        inline: false,
      },
      {
        name: "Valores aceitos",
        value: "Os valores em falcoins podem tanto ser números, quanto porcentagens, 'tudo' ou 'metade'",
        inline: false,
      },
      {
        name: "Uso",
        value: "/roleta <tipo de aposta> <falcoins>",
        inline: false,
      },
    ])
  } else if (command == "niquel" || command == "níquel") {
    embed.setColor("GREEN")
    embed.addFields({
        name: "Info",
        value: "Caça-níquel",
        inline: false,
      },
      {
        name: "Ganhos",
        value:
          ":money_mouth: :money_mouth: :grey_question: - **0.5x**\n:coin: :coin: :grey_question: - **2x**\n:dollar: :dollar: :grey_question: - **2x**\n:money_mouth: :money_mouth: :money_mouth: - **2.5x**\n:coin: :coin: :coin: - **2.5x**\n:moneybag: :moneybag: :grey_question: - **3x**\n:dollar: :dollar: :dollar: - **3x**\n:gem: :gem: :grey_question: - **5x**\n:moneybag: :moneybag: :moneybag: - **7x**\n:gem: :gem: :gem: - **10x**",
        inline: false,
      },
      {
        name: "Valores aceitos",
        value: "Os valores em falcoins podem tanto ser números, quanto porcentagens, 'tudo' ou 'metade'",
        inline: false,
      },
      {
        name: "Uso",
        value: "/niquel <falcoins>",
        inline: false,
      })
  } else if (command == "banco") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: "Guarda ou tira seus falcoins do banco",
        inline: false,
      },
      {
        name: "Ganhos",
        value: "O valor depositado aumenta em 1% ao dia",
        inline: false,
      },
      {
        name: "Valores aceitos",
        value: "Os valores em falcoins podem tanto ser números, quanto porcentagens, 'tudo' ou 'metade'",
        inline: false,
      },
      {
        name: "Uso",
        value: "/banco <depositar/sacar> <falcoins>",
        inline: false,
      },
    ])
  } else if (command == "luta") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: "Desafia um usuário para uma luta até a morte",
        inline: false,
      },
      {
        name: "Ganhos",
        value: "**O vencedor leva tudo**",
        inline: false,
      },
      {
        name: "Habilidades",
        value:
          "**instântaneo:** dá um dano x na hora\n**stun:** dá um dano x e deixa o inimigo paralizado por 1 turno\n**cura:** se cura em x de vida\n**roubo de vida:** rouba uma quantidade x de vida do inimigo\n**self:** dá um dano x a si mesmo\n**escudo:** se protege de todo e qualquer dano por 1 rodada\n\n**O bot escolhe os ataques aleatoriamente**",
        inline: false,
      },
      {
        name: "Valores aceitos",
        value: "Os valores em falcoins podem tanto ser números, quanto porcentagens, 'tudo' ou 'metade'",
        inline: false,
      },
      {
        name: "Uso",
        value: "/luta @usuario <falcoins>",
        inline: false,
      }
    ])
  } else if (command == "caixa") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value:
          "Gasta 1 chave e 1 caixa para ter a chance de ganhar alguns prêmios, você pode comprar caixas e chaves na loja",
        inline: false,
      },
      {
        name: "Ganhos",
        value: "Você pode ganhar `caixas`, `chaves`, `falcoins`",
        inline: false,
      },
      {
        name: "Uso",
        value: "/caixa [quantidade]",
        inline: false,
      },
    ])
  } else if (command == "prefix") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value:
          "Muda o prefixo do servidor atual (só usuários com a permissão de admin podem usar)",
        inline: false,
      },
      {
        name: "Uso",
        value: "/prefix <prefixo>",
        inline: false,
      },
    ])
  } else if (command == "limpa") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value:
          "Limpa x mensagens do canal atual (só usuários com a permissão de administrador podem usar)",
        inline: false,
      },
      {
        name: "Uso",
        value: "/limpa <numero de mensagens>",
        inline: false,
      },
    ])
  } else if (command == "math") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: "Faz um cálculo de matemática",
        inline: false,
      },
      {
        name: "Uso",
        value: "/math <expressão>",
        inline: false,
      },
    ])
  } else if (command == "enquete") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: "Cria uma bonita pequena enquete",
        inline: false,
      },
      {
        name: "Uso",
        value: "/enquete",
        inline: false,
      },
    ])
  } else if (command == "roll") {
    embed.setColor("RED")
    embed.addFields([
        {
          name: "Info",
          value: "Rola dados para você",
          inline: false,
        },
        {
          name: "Uso",
          value: "/roll <dados>",
          inline: false,
        },
      ])
  } else if (command == "coinflip") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: "Faz um cara ou coroa",
        inline: false,
      },
      {
        name: "Uso",
        value: "/coinflip [quantidade]",
        inline: false,
      },
    ])
  } else if (command == "bonk") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: "Manda alguém para a horny jail",
        inline: false,
      },
      {
        name: "Uso",
        value: "/bonk <@usuario>",
        inline: false,
      },
    ])
  } else if (command == "bola8") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: "Prevê o seu futuro",
        inline: false,
      },
      {
        name: "Uso",
        value: "/bola8 <pergunta>",
        inline: false,
      },
    ])
  } else if (command == "cavalgada") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: "Desafia outros usuários para uma corrida de cavalos",
        inline: false,
      },
      {
        name: "Ganhos",
        value: "**O vencedor leva tudo**",
        inline: false,
      },
      {
        name: "Valores aceitos",
        value: "Os valores em falcoins podem tanto ser números, quanto porcentagens, 'tudo' ou 'metade'",
        inline: false,
      },
      {
        name: "Uso",
        value: "/cavalo <falcoins>",
        inline: false,
      },
    ])
  } else if (command == "foto") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: "Envia uma foto aleatória sobre o termo especificado",
        inline: false,
      },
      {
        name: "Uso",
        value: "?foto <termo>",
        inline: false,
      },
      {
        name: "Exemplo",
        value: "?foto cachorro",
        inline: false,
      },
    ])
  } else if (command == "roletarussa") {
    embed.setColor("GREEN")
    embed.addFields([
    {
      name: "Info",
      value: "jogue com seus amigos, usuarios podem entrar reagindo a mensagem",
      inline: false,
    },
    {
      name: "Ganhos",
        value: "**O vencedor leva tudo**",
        inline: false,
      },
      {
        name: "Valores aceitos",
        value: "Os valores em falcoins podem tanto ser números, quanto porcentagens, 'tudo' ou 'metade'",
        inline: false,
      },
      {
        name: "Uso",
        value: "?roletarussa <falcoins>",
        inline: false,
      }
    ])
  } else if (command == "velha") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: "Desafia outro usuário para um jogo da velha",
        inline: false,
      },
      {
        name: "Ganhos",
        value: "**O vencedor leva tudo**",
        inline: false,
      },
      {
        name: "Valores aceitos",
        value: "Os valores em falcoins podem tanto ser números, quanto porcentagens, 'tudo' ou 'metade'",
        inline: false,
      },
      {
        name: "Uso",
        value: "/velha <@usuario> <falcoins>",
        inline: false,
      },
    ])
  } else if (command == "voto") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: "Resgata sua recompensa por votar no bot no top.gg",
        inline: false,
      },
      {
        name: "Uso",
        value: "/lootbox",
        inline: false,
      },
    ])
  } else {
    embed.setColor("BLUE")
    embed.addFields([
      {
        name: ":game_die: Comandos para a sala de jogos",
        value:
          "`eu`, `sobre`, `lootbox`, `doar`, `cavalo`, `rank`, `loja`, `roleta`, `niquel`, `banco`, `luta`, `caixa`, `cavalgada`, `roletarussa`, `velha`, `voto`",
        inline: false,
      },
      {
        name: ":gear: Outros comandos",
        value:
          "`prefix`, `comandos/help`, `limpa`, `math`, `enquete`, `roll`, `coinflip`, `bonk`, `bola8`, `foto`",
        inline: false,
      },
      {
        name: '\u200b',
        value: `Use /prefix para ver seu prefixo`,
        inline: false,
      },
      {
        name: "\u200B",
        value:
          'Use /help <comando> para ver a descrição de um comando específico',
        inline: false,
      },
    ])
  }
  embed.setFooter({text: 'by Falcão ❤️'});
  return embed;
}

async function count(array, string) {
  var amount = 0
  for (let i = 0; i <= array.length; i++) {
    if (array[i-1] === string) {
      amount += 1
    }
  }
  return amount
}

function randint(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}

async function bankInterest() {
  var config = JSON.parse(fs.readFileSync("./config/config.json", "utf8"));
  if (Date.now() - config["poupanca"]["last_interest"] > config["poupanca"]["interest_time"]) {
    console.log('poupança!')
    config["poupanca"]["last_interest"] = Date.now().toString()

    var users = JSON.parse(fs.readFileSync("falbot.json", "utf8"));

    for (user in users) {
      users[user]['Banco'] += Math.floor(parseInt(users[user]['Banco'] * parseFloat(config["poupanca"]["interest_rate"])))
    }

    json = JSON.stringify(users, null, 2);
    json2 = JSON.stringify(config, null, 1);

    fs.writeFileSync("falbot.json", json, "utf8", function (err) {
      if (err) throw err;
    });

    fs.writeFileSync("./config/config.json", json2, "utf8", function (err) {
      if (err) throw err;
    });
  }
}

module.exports = {
    createUser, changeJSON, msToTime,
    specialArg, format, readFile, getRoleColor,
    getMember, explain, takeAndGive, count,
    randint, bankInterest
}
