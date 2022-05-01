const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const userSchema = require('../schemas/user-schema')

async function createUser(id) {
  try {
    await userSchema.findByIdAndUpdate(id, {
      _id: id,
    }, {
      upsert: true
    })
  } catch (error) {
    console.error(`Erro ao criar usuário: ${error}`)
  }
}

async function changeDB(id, field, quantity = 1, erase = false) {
  try {
    await createUser(id)
    if (erase == true) {
      await userSchema.findByIdAndUpdate(id, {
        [field]: quantity
      })
    } else {
      await userSchema.findByIdAndUpdate(id, {
        $inc: {
          [field]: quantity
        }
      })
    }
  } catch (error) {
    console.error(`Erro ao mudar a database: ${error}`)
  }
}

async function takeAndGive(id, id2, field, field2, quantity = 1) {
  try {
    await createUser(id)
    await createUser(id2)
    await userSchema.findByIdAndUpdate(id, {$inc: { [field]: -quantity }})
    await userSchema.findByIdAndUpdate(id2, {$inc: { [field2]: quantity }})
  } catch {
    console.error(`Erro ao alterar a database no takeAndGive: ${error}`)
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
  await createUser(id)
  var user = await userSchema.findById(id)

  arg = arg.toString()
  arg = arg.toLowerCase()

  new_arg = "";
  for (c in arg) {
    if (arg[c] != "." && arg[c] != ",") {
      new_arg += arg[c];
    }
  }

  if (new_arg == "tudo") {
    new_arg = user[field];
  } else if (new_arg == "metade") {
    new_arg = parseInt(user[field] / 2);
  } else {
    for (c in new_arg) {
      if (new_arg[c] == "%") {
        new_arg = parseInt(
          (parseInt(new_arg.slice(0, -1)) * parseInt(user[field])) /
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
    await createUser(id)

    if (field == "") {
      return await userSchema.findById(id)
    } else if (rich == false) {
      return (await userSchema.findById(id))[field]
    } else {
      return await format((await userSchema.findById(id))[field])
    }
  } catch (error) {
    console.error(`Erro ao ler arquivo: ${error}`)
  }
}

async function getRoleColor(guild, member_id) {
  try {
    cor = guild.members.cache.get(member_id).displayColor
  } catch (err) {
    return "RANDOM"
  }
}

async function getMember(guild, member_id) {
  return guild.members.cache.get(member_id)
}

async function explain(instance, guild, command) {
  command = command.toLowerCase();
  embed = new MessageEmbed()
  
  if (command == "balance" || command == "sobre" || command == "credits" || command == "eu") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "BALANCE_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "BALANCE_USO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?eu`, `?sobre`, `?credits`",
        inline: false
      }
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
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?lb`",
        inline: false
      }
    ])
  } else if (command == "donation" || command == "doar" || command == "doacao") {
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
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?doar`, `?doacao`",
        inline: false
      }
    ])
  } else if (command == "cavalo" || command == "horse") {
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
        value: "/horse <1-5> <falcoins>",
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?cavalo`",
        inline: false
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
  } else if (command == "loja" || command == "store" || command == "shop") {
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
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?store`, `?shop`",
        inline: false
      }
    ])
  } else if (command == "roleta" || command == "roulette") {
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
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?roleta`",
        inline: false
      }
    ])
  } else if (command == "niquel" || command == "níquel" || command == "slot") {
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
        value: "/slot <falcoins>",
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?niquel`, `?níquel`",
        inline: false
      })
  } else if (command == "banco" || command == "bank") {
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
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?banco`",
        inline: false
      }
    ])
  } else if (command == "luta" || command == "fight") {
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
      },
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?luta`",
        inline: false
      }
    ])
  } else if (command == "caixa" || command == "crate") {
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
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?caixa`",
        inline: false
      }
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
  } else if (command == "enquete" || command == "poll") {
    embed.setColor("GOLD")
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
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?enquete`",
        inline: false
      }
    ])
  } else if (command == "roll") {
    embed.setColor("GOLD")
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
    embed.setColor("GOLD")
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
    embed.setColor("GOLD")
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
  } else if (command == "bola8" || command == "8ball") {
    embed.setColor("GOLD")
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
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?bola8`",
        inline: false
      }
    ])
  } else if (command == "cavalgada" || command == "horseduel") {
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
        value: "/horseduel <falcoins>",
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?cavalgada`",
        inline: false
      }
    ])
  } else if (command == "foto" || command == "image" || command == "imagem") {
    embed.setColor("GOLD")
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
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?imagem`, `?foto`",
        inline: false
      }
    ])
  } else if (command == "roletarussa" || command == "russianroulette") {
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
        value: "/russianroulette <falcoins>",
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?roletarussa`",
        inline: false
      }
    ])
  } else if (command == "velha" || command == "tictactoe") {
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
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?velha`",
        inline: false
      }
    ])
  } else if (command == "voto" || command == "vote") {
    embed.setColor("GREEN")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "VOTO_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: "/vote",
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?voto`",
        inline: false
      }
    ])
  } else if (command == "language") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "LANGUAGE_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: "/language [português/english]",
        inline: false,
      }
    ])
  } else if (command == "cooldowns" || command == "espera") {
    embed.setColor("RED")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "COOLDOWNS_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: "/cooldowns",
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "ALIASES"),
        value: "`?espera`",
        inline: false
      }
    ])
  } else if (command == "place") {
    embed.setColor("GOLD")
    embed.addFields([
      {
        name: "Info",
        value: instance.messageHandler.get(guild, "PLACE_INFO"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "CORES"),
        value: instance.messageHandler.get(guild, "PLACE_CORES"),
        inline: false,
      },
      {
        name: instance.messageHandler.get(guild, "USO"),
        value: instance.messageHandler.get(guild, "PLACE_USO"),
        inline: false,
      }
    ])
  } else {
    embed.setColor("PURPLE")
    embed.addFields([
      {
        name: instance.messageHandler.get(guild, "SALA_JOGOS"),
        value:
          "`balance`, `lootbox`, `donation`, `horse`, `rank`, `store`, `roulette`, `slot`, `bank`, `fight`, `crate`, `horseduel`, `russianroulette`, `tictactoe`, `vote`",
        inline: false
      },
      {
        name: instance.messageHandler.get(guild, "COMANDOS_DIVERTIDOS"),
        value: "`bonk`, `8ball`, `image`, `coinflip`, `poll`, `place`",
        inline: false
      },
      {
        name: instance.messageHandler.get(guild, "COMANDOS_UTEIS"),
        value:
          "`roll`, `prefix`, `commands`, `math`, `language`, `cooldowns`",
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
  var config = JSON.parse(fs.readFileSync("./src/config.json", "utf8"));
  if (Date.now() - config["poupanca"]["last_interest"] > config["poupanca"]["interest_time"]) {
    console.log('poupança!')
    config["poupanca"]["last_interest"] = Date.now().toString()

    var users = await userSchema.find({})
    
    for (user of users) {
      await userSchema.findByIdAndUpdate(user._id, {$inc: {'banco': Math.floor(parseInt(user['banco'] * parseFloat(config["poupanca"]["interest_rate"])))}})
    }

    json2 = JSON.stringify(config, null, 1);

    fs.writeFileSync("./src/config.json", json2, "utf8", function (err) {
      if (err) throw err;
    });
  }
}

async function placeReset() {
  var config = JSON.parse(fs.readFileSync("./src/config.json", "utf8"));
  if (Date.now() - config["place"]["last_reset"] > config["place"]["reset_time"]) {
    console.log('place!')
    config["place"]["last_reset"] = Date.now().toString()

    var place = JSON.parse(fs.readFileSync("./src/utils/json/place.json", "utf8"));

    for (let i = 0; i < place.length; i++) {
      place[i] = '⬜'
    }

    json2 = JSON.stringify(place, null, 1);

    fs.writeFileSync("./src/utils/json/place.json", json2, "utf8", function (err) {
      if (err) throw err;
    });

    json2 = JSON.stringify(config, null, 1);

    fs.writeFileSync("./src/config.json", json2, "utf8", function (err) {
      if (err) throw err;
    });
  }
}

async function convertColor(color) {
  if (color.toLowerCase() === 'white' || color.toLowerCase() === 'branco') {
    return ':white_large_square:'
  } else if (color.toLowerCase() === 'blue' || color.toLowerCase() === 'azul') {
    return ':blue_square:'
  } else if (color.toLowerCase() === 'green' || color.toLowerCase() === 'verde') {
    return ':green_square:'
  } else if (color.toLowerCase() === 'red' || color.toLowerCase() === 'vermelho') {
    return ':red_square:'
  } else if (color.toLowerCase() === 'yellow' || color.toLowerCase() === 'amarelo') {
    return ':yellow_square:'
  } else if (color.toLowerCase() === 'black' || color.toLowerCase() === 'preto') {
    return ':black_square:'
  } else if (color.toLowerCase() === 'orange' || color.toLowerCase() === 'laranja') {
    return ':orange_square:'
  } else if (color.toLowerCase() === 'purple' || color.toLowerCase() === 'roxo') {
    return ':purple_square:'
  } else if (color.toLowerCase() === 'brown' || color.toLowerCase() === 'marrom') {
    return ':brown_square:'
  } else {
    throw Error('Color not found')
  }
}

async function convertCoordinate(coordinate) {
  if (coordinate.length > 2) {
    throw Error('Coordinate is too long')
  }

  let coordinateNumber = 0

  if (coordinate.slice(0,1).toLowerCase() === 'b') {
    coordinateNumber += 9
  } else if (coordinate.slice(0,1).toLowerCase() === 'c') {
    coordinateNumber += 18
  } else if (coordinate.slice(0,1).toLowerCase() === 'd') {
    coordinateNumber += 27
  } else if (coordinate.slice(0,1).toLowerCase() === 'e') {
    coordinateNumber += 36
  } else if (coordinate.slice(0,1).toLowerCase() === 'f') {
    coordinateNumber += 45
  } else if (coordinate.slice(0,1).toLowerCase() === 'g') {
    coordinateNumber += 54
  } else if (coordinate.slice(0,1).toLowerCase() === 'h') {
    coordinateNumber += 63
  } else if (coordinate.slice(0,1).toLowerCase() === 'i') {
    coordinateNumber += 72
  } else if (coordinate.slice(0,1).toLowerCase() !== 'a') {
    throw Error('Coordinate not found')
  }

  coordinateNumber += parseInt(coordinate.slice(1,2))

  return coordinateNumber
}

module.exports = {
    createUser, changeDB, msToTime,
    specialArg, format, readFile, getRoleColor,
    getMember, explain, takeAndGive, count,
    randint, bankInterest, convertColor,
    convertCoordinate, placeReset
}
