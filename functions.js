const fs = require("fs");
const { MessageEmbed } = require("discord.js");

async function createUser(id) {
  var users = JSON.parse(fs.readFileSync("falbot.json", "utf8"))

  if (users[id] == undefined) {
    users[id] = {
      Falcoins: 0,
      Vitorias: 0,
      Cargo: "",
      Banco: 0,
      Caixas: 0,
      Chaves: 0,
      Lootbox: 1000,
    }

    json = JSON.stringify(users, null, 2);
    fs.writeFile("falbot.json", json, "utf8", function (err) {
      if (err) throw err;
    });
    return true
  }
  return false
}

async function changeRole(id, role) {
  fs.readFile("falbot.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      users = JSON.parse(data);
      users[id]["Cargo"] = role;
      json = JSON.stringify(users, null, 2);
      fs.writeFile("falbot.json", json, "utf8", function (err) {
        if (err) throw err;
      });
    }
  });
}

async function changeJSON(id, field, quantity = 1) {
  fs.readFile("falbot.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      users = JSON.parse(data);
      users[id][field] += quantity;
      json = JSON.stringify(users, null, 2);
      fs.writeFile("falbot.json", json, "utf8", function (err) {
        if (err) throw err;
      });
    }
  });
}

async function takeAndGive(id, id2, field, field2, quantity = 1) {
  fs.readFile("falbot.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      users = JSON.parse(data);
      users[id][field] -= quantity;
      users[id2][field2] += quantity;
      json = JSON.stringify(users, null, 2);
      fs.writeFile("falbot.json", json, "utf8", function (err) {
        if (err) throw err;
      });
    }
  });
}

async function takeAndGiveButNot(id, id2, field, field2, quantity = 1, quantity2 = quantity) {
  fs.readFile("falbot.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      users = JSON.parse(data);
      users[id][field] -= quantity;
      users[id2][field2] += quantity2;
      json = JSON.stringify(users, null, 2);
      fs.writeFile("falbot.json", json, "utf8", function (err) {
        if (err) throw err;
      });
    }
  });
}

async function takeAndTake(id, id2, field, field2, quantity = 1) {
  fs.readFile("falbot.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      users = JSON.parse(data);
      users[id][field] -= quantity;
      users[id2][field2] -= quantity;
      json = JSON.stringify(users, null, 2);
      fs.writeFile("falbot.json", json, "utf8", function (err) {
        if (err) throw err;
      });
    }
  });
}

async function takeAndGiveAndWin(id, id2, field, field2, quantity = 1) {
  fs.readFile("falbot.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      users = JSON.parse(data);
      users[id][field] -= quantity;
      users[id2][field2] += quantity;
      users[id2]['Vitorias'] += 1;
      json = JSON.stringify(users, null, 2);
      fs.writeFile("falbot.json", json, "utf8", function (err) {
        if (err) throw err;
      });
    }
  });
}

async function changeJSON3(id, field, field2, field3, quantity = 1, quantity2 = 1, quantity3 = 1) {
  fs.readFile("falbot.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      users = JSON.parse(data);
      users[id][field] += quantity;
      users[id][field2] += quantity2;
      users[id][field3] += quantity3;
      json = JSON.stringify(users, null, 2);
      fs.writeFile("falbot.json", json, "utf8", function (err) {
        if (err) throw err;
      });
    }
  });
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

async function specialArg(arg, id) {
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
    new_arg = users[id]["Falcoins"];
  } else if (new_arg == "metade") {
    new_arg = parseInt(users[id]["Falcoins"] / 2);
  } else {
    for (c in new_arg) {
      if (new_arg[c] == "%") {
        new_arg = parseInt(
          (parseInt(new_arg.slice(0, -1)) * parseInt(users[id]["Falcoins"])) /
            100
        );
      }
    }
  }
  return parseInt(new_arg);
}

async function specialArgBank(arg, id) {
  var users = JSON.parse(fs.readFileSync("falbot.json", "utf8"));

  arg = arg.toLowerCase()

  new_arg = "";
  for (c in arg) {
    if (arg[c] != "." && arg[c] != ",") {
      new_arg += arg[c];
    }
  }

  if (new_arg == "tudo") {
    new_arg = users[id]["Banco"];
  } else if (new_arg == "metade") {
    new_arg = parseInt(users[id]["Banco"] / 2);
  } else {
    for (c in new_arg) {
      if (new_arg[c] == "%") {
        new_arg = parseInt(
          (parseInt(new_arg.slice(0, -1)) * parseInt(users[id]["Banco"])) / 100
        );
      }
    }
  }
  return parseInt(new_arg);
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

async function checkRole(id) {
  var users = JSON.parse(fs.readFileSync("falbot.json", "utf8"));

  if (users[id]["Cargo"] == "") {
    return 0;
  } else if (users[id]["Cargo"] == "Pardal") {
    return 1;
  } else if (users[id]["Cargo"] == "Tucano") {
    return 2;
  } else if (users[id]["Cargo"] == "Falcão") {
    return 3;
  }
}

async function readFile(id, field = "") {
  var users = JSON.parse(fs.readFileSync("falbot.json", "utf8"));

  if (field == "") {
    return users[id];
  } else {
    return users[id][field];
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

  if (command == "eu") {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .addFields([
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
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "sobre") {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .addFields([
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
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "lootbox") {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .addFields([
        {
          name: "Info",
          value: "Resgata sua lootbox grátis (disponível a cada 12 horas)",
          inline: false,
        },
        {
          name: "Uso",
          value: "/lootbox\n/lb",
          inline: false,
        },
      ])
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "doar") {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .addFields([
        {
          name: "Info",
          value: "Doa x Falcoins para o usuário mencionado",
          inline: false,
        },
        {
          name: "Uso",
          value: "/doar <@usuario> <falcoins>",
          inline: false,
        },
      ])
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "cavalo") {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .addFields([
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
          name: "Uso",
          value: "/cavalo <1-5> <falcoins>",
          inline: false,
        }
      ])
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "rank") {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .addFields([
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
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "loja") {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .addFields([
        {
          name: "Info",
          value: "Mostra os itens disponíveis para compra",
          inline: false,
        },
        {
          name: "Uso",
          value: "/loja [numero] [quantidade] - numero e quantidade só são obrigatórios caso você queira comprar algo",
          inline: false,
        },
      ])
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "roleta") {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .addFields([
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
          name: "Uso",
          value: "/roleta <tipo de aposta> <falcoins>",
          inline: false,
        },
      ])
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "niquel") {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .addFields(
        {
          name: "Info",
          value: "Caça-níquel",
          inline: false,
        },
        {
          name: "Ganhos",
          value:
            ":money_mouth: :money_mouth: :grey_question: - **0.5x**\n:coin: :coin: :grey_question: - **1x**\n:dollar: :dollar: :grey_question: - **1.5x**\n:money_mouth: :money_mouth: :money_mouth: - **2x**\n:coin: :coin: :coin: - **2.5x**\n:moneybag: :moneybag: :grey_question: - **3x**\n:dollar: :dollar: :dollar: - **3.5x**\n:gem: :gem: :grey_question: - **4x**\n:moneybag: :moneybag: :moneybag: - **4.5x**\n:gem: :gem: :gem: - **5x**",
          inline: false,
        },
        {
          name: "Uso",
          value: "/niquel <falcoins>",
          inline: false,
        })
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "banco") {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .addFields([
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
          name: "Uso",
          value: "/banco <depositar/sacar> <falcoins>",
          inline: false,
        },
      ])
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "luta") {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .addFields([
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
          name: "Uso",
          value: "/luta @usuario <falcoins>",
          inline: false,
        }
      ])
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "caixa") {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .addFields([
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
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "prefix") {
    const embed = new MessageEmbed()
      .setColor("RED")
      .addFields([
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
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "limpa") {
    const embed = new MessageEmbed()
      .setColor("RED")
      .addFields([
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
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "tetris") {
    const embed = new MessageEmbed()
      .setColor("RED")
      .addFields([
        {
          name: "Info",
          value: "Cria uma sala privada no jstris para você!",
          inline: false,
        },
        {
          name: "Uso",
          value: "/tetris",
          inline: false,
        },
      ])
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "math") {
    const embed = new MessageEmbed()
      .setColor("RED")
      .addFields([
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
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "voto") {
    const embed = new MessageEmbed()
      .setColor("RED")
      .addFields([
        {
          name: "Info",
          value: "Cria uma bonita pequena enquete",
          inline: false,
        },
        {
          name: "Uso",
          value: "/voto",
          inline: false,
        },
      ])
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "roll") {
    const embed = new MessageEmbed()
      .setColor("RED")
      .addFields([
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
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "coinflip") {
    const embed = new MessageEmbed()
      .setColor("RED")
      .addFields([
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
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "bonk") {
    const embed = new MessageEmbed()
      .setColor("RED")
      .addFields([
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
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "bola8") {
    const embed = new MessageEmbed()
      .setColor("RED")
      .addFields([
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
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "duelo") {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .addFields([
        {
          name: "Info",
          value: "Desafia outro usuário para um duelo de cavalos",
          inline: false,
        },
        {
          name: "Ganhos",
          value: "**O vencedor leva tudo**",
          inline: false,
        },
        {
          name: "Uso",
          value: "/duelo <@usuario>",
          inline: false,
        },
      ])
      .setFooter("by Falcão ❤️");
    return embed;
  } else if (command == "cria") {
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .addFields([
        {
          name: "Info",
          value: "Cria seu registro no bot",
          inline: false,
        },
        {
          name: "Uso",
          value: "/cria",
          inline: false,
        },
      ])
      .setFooter("by Falcão ❤️");
    return embed;
  } else {
    const embed = new MessageEmbed()
      .setColor("BLUE")
      .addFields([
        {
          name: ":game_die: Comandos para a sala de jogos",
          value:
            "`eu`, `sobre`, `lootbox`, `doar`, `cavalo`, `rank`, `loja`, `roleta`, `niquel`, `banco`, `luta`, `caixa`, `cria`, `duelo`",
          inline: false,
        },
        {
          name: ":gear: Outros comandos",
          value:
            "`prefix`, `comandos/help`, `limpa`, `math`, `voto`, `roll`, `coinflip`, `bonk`, `bola8`",
          inline: false,
        },
        {
          name: "\u200B",
          value: `Use /prefix para ver seu prefixo`,
          inline: false,
        },
        {
          name: "\u200B",
          value:
            'O bot também aceita "metade", "tudo" e porcentagens no lugar de valores de aposta',
          inline: false,
        },
      ])
      .setFooter("by Falcão ❤️");
    return embed;
  }
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
  console.log('poupança!')
  var users = JSON.parse(fs.readFileSync("falbot.json", "utf8"));
  for (user in users) {
    users[user]['Banco'] += Math.floor(parseInt(users[user]['Banco'] * 0.01))
  }
  json = JSON.stringify(users, null, 2);
  fs.writeFile("falbot.json", json, "utf8", function (err) {
    if (err) throw err;
  });
}

module.exports = {
    createUser, changeRole, changeJSON,
    msToTime, specialArg, specialArgBank, 
    format, checkRole, readFile, getRoleColor,
    getMember, explain, takeAndGive, count,
    takeAndGiveAndWin, takeAndTake, changeJSON3,
    takeAndGiveButNot, randint, bankInterest
};
