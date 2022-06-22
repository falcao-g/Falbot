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

  if (new_arg == "tudo" || new_arg == 'all' ) {
    new_arg = user[field];
  } else if (new_arg == "metade" || new_arg == 'half') {
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
    return cor
  } catch (err) {
    return "RANDOM"
  }
}

async function getMember(guild, member_id) {
  return guild.members.cache.get(member_id)
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
      user_db = await userSchema.findById(user._id)

      if (user_db.limite_banco > user_db.banco) {
        user_db.banco += Math.floor(parseInt(user_db.banco * parseFloat(config["poupanca"]["interest_rate"])))
      }

      if (user_db.banco > user_db.limite_banco) {
        user_db.banco = user_db.limite_banco
      }

      user_db.save()
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

async function rankPerks(rank, instance, guild) {
  perks = ''

  if (rank.perks.includes('bank')) {
    perks += instance.messageHandler.get(guild, "RANKUP_BANK")
  } else if (rank.perks.includes('caixa')) {
      perks += instance.messageHandler.get(guild, "RANKUP_CAIXA")
  } else if (rank.perks.includes('lootbox')) {
      perks += instance.messageHandler.get(guild, "RANKUP_LOOTBOX")
  }

  return perks
}

module.exports = {
    createUser, changeDB, msToTime,
    specialArg, format, readFile, getRoleColor,
    getMember, takeAndGive, count,
    randint, bankInterest, convertColor,
    convertCoordinate, placeReset, rankPerks
}
