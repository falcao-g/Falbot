const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const userSchema = mongoose.Schema({
    _id: reqString,
    falcoins: {
        type: Number,
        default: 10000
    },
    vitorias: {
        type: Number,
        default: 0
    },
    banco: {
        type: Number,
        default: 0
    },
    caixas: {
        type: Number,
        default: 0
    },
    chaves: {
        type: Number,
        default: 0
    },
    lootbox: {
        type: Number,
        default: 1000
    },
    lastVote: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number,
        default: 1
    },
    limite_banco: {
        type: Number,
        default: 100000
    },
    voteReminder: {
        type: Boolean,
        default: false
    },
    lastReminder: {
        type: Number,
        default: 0
    }
}, {
    versionKey: false,
    timestamps: true
})
                                    
module.exports = mongoose.model('users', userSchema)