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

async function readFile(id, field = "", rich = false) {
  try {
    createUser(id)
    var users = JSON.parse(fs.readFileSync("falbot.json", "utf8"));

    if (field == "") {
      return users[id];
    } else if (rich == false) {
      return users[id][field];
    } else {
      return await format(users[id][field]);
    }
  } catch (error) {
    console.error(`Erro ao ler arquivo: ${error}`)
  }
}

async function getRoleColor(guild, member_id) {
  return guild.members.cache.get(member_id).displayColor
}

async function getMember(guild, member_id) {
  return guild.members.cache.get(member_id)
}

async function explain(instance, guild, command) {
  command = command.toLowerCase();
  embed = new MessageEmbed()
  
  if (command == "eu") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "EU_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: "/eu",
        inline: false,
      },
    ])
  } else if (command == "sobre") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "SOBRE_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "SOBRE_INFO"),
        inline: false,
      },
    ])
  } else if (command == "lootbox" || command == "lb") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "LB_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: "/lootbox",
        inline: false,
      },
    ])
  } else if (command == "doar") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "DOAR_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "DOAR_USO"),
        inline: false,
      },
    ])
  } else if (command == "cavalo") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "CAVALO_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "GANHOS"),
        value: "**5x**",
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: "/cavalo <1-5> <falcoins>",
        inline: false,
      }
    ])
  } else if (command == "rank") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "RANK_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "RANK_USO"),
        inline: false,
      },
    ])
  } else if (command == "loja") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "LOJA_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "LOJA_USO"),
        inline: false,
      },
    ])
  } else if (command == "roleta") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: instance.messageHandler.get(guild, "TIPOS_APOSTAS"),
        value: instance.messageHandler.get(guild, "ROLETA_TIPOS"),
        inline: false,
      },
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "ROLETA_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "GANHOS"),
        value: instance.messageHandler.get(guild, "ROLETA_GANHOS"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "NUMEROS"),
        value: instance.messageHandler.get(guild, "ROLETA_NUMEROS"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "ROLETA_USO"),
        inline: false,
      },
    ])
  } else if (command == "niquel" || command == "níquel") {
    embed.setColor("GREEN")
    embed.addFields({
        name: "Info",
        value: instance.messageHandler.get(guild, "NIQUEL_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "GANHOS"),
        value:
          ":money_mouth: :money_mouth: :grey_question: - **0.5x**\n:coin: :coin: :grey_question: - **2x**\n:dollar: :dollar: :grey_question: - **2x**\n:money_mouth: :money_mouth: :money_mouth: - **2.5x**\n:coin: :coin: :coin: - **2.5x**\n:moneybag: :moneybag: :grey_question: - **3x**\n:dollar: :dollar: :dollar: - **3x**\n:gem: :gem: :grey_question: - **5x**\n:moneybag: :moneybag: :moneybag: - **7x**\n:gem: :gem: :gem: - **10x**",
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: "/niquel <falcoins>",
        inline: false,
      })
  } else if (command == "banco") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "BANCO_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "GANHOS"),
        value: instance.messageHandler.get(guild, "BANCO_GANHOS"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "BANCO_USO"),
        inline: false,
      },
    ])
  } else if (command == "luta") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "LUTA_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "GANHOS"),
        value: instance.messageHandler.get(guild, "VENCEDOR_TUDO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "HABILIDADES"),
        value: instance.messageHandler.get(guild, "LUTA_HABILIDADES"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "LUTA_USO"),
        inline: false,
      }
    ])
  } else if (command == "caixa") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "CAIXA_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "GANHOS"),
        value: instance.messageHandler.get(guild, "CAIXA_GANHOS"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "CAIXA_USO"),
        inline: false,
      },
    ])
  } else if (command == "prefix") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "PREFIX_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "PREFIX_USO"),
        inline: false,
      },
    ])
  } else if (command == "math") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "MATH_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "MATH_USO"),
        inline: false,
      },
    ])
  } else if (command == "enquete") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "ENQUETE_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "ENQUETE_USO"),
        inline: false,
      },
    ])
  } else if (command == "roll") {
    embed.setColor("RED")
    embed.addFields([
        {
          name: "Info",
          value: instance.messageHandler.get(guild, "ROLL_INFO"),
          inline: false,
        },
        {
          name: instance.messageHandler.get(guild, "USO"),
          value: instance.messageHandler.get(guild, "ROLL_USO"),
          inline: false,
        },
      ])
  } else if (command == "coinflip") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "COINFLIP_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "COINFLIP_USO"),
        inline: false,
      },
    ])
  } else if (command == "bonk") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "BONK_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "BONK_USO"),
        inline: false,
      },
    ])
  } else if (command == "bola8") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "BOLA8_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "BOLA8_USO"),
        inline: false,
      },
    ])
  } else if (command == "cavalgada") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "CAVALGADA_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "GANHOS"),
        value: instance.messageHandler.get(guild, "VENCEDOR_TUDO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: "/cavalo <falcoins>",
        inline: false,
      },
    ])
  } else if (command == "foto") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "FOTO_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "FOTO_USO"),
        inline: false,
      },
    ])
  } else if (command == "roletarussa") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "ROLETARUSSA_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "GANHOS"),
        value: instance.messageHandler.get(guild, "VENCEDOR_TUDO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: "/roletarussa <falcoins>",
        inline: false,
      }
    ])
  } else if (command == "velha") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "VELHA_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "GANHOS"),
        value: instance.messageHandler.get(guild, "VENCEDOR_TUDO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "VELHA_USO"),
        inline: false,
      },
    ])
  } else if (command == "voto") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "VOTO_INFO"),
        inline: false,
      },
      {
        name: "Uso",
        value: "/voto",
        inline: false,
      },
    ])
  } else {
    embed.setColor("BLUE")
    embed.addFields([
      {
        name: instance.messageHandler.get(guild, "SALA_JOGOS"),
        value:
          "`eu`, `sobre`, `lootbox`, `doar`, `cavalo`, `rank`, `loja`, `roleta`, `niquel`, `banco`, `luta`, `caixa`, `cavalgada`, `roletarussa`, `velha`, `voto`",
        inline: false
      },
      {
        name: instance.messageHandler.get(guild, "COMANDOS_DIVERTIDOS"),
        value: "`bonk`, `bola8`, `foto`, `coinflip`, `roll`, `enquete`",
        inline: false
      },
      {
        name: instance.messageHandler.get(guild, "COMANDOS_UTEIS"),
        value:
          "`prefix`, `comandos/help`, `math`",
        inline: false
      },
      {
        name: "\u200B",
        value: instance.messageHandler.get(guild, "COMANDOS_INFO"),
        inline: false
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
