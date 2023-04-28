const mongoose = require('mongoose');

const moneyRequestSchema = new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
        date: {
            type: Date,
            default: Date.now
        },
    },
    {
        timestamps: true,
    }
);

const MoneyRequest = mongoose.model('MoneyRequest', moneyRequestSchema);

module.exports = MoneyRequest;
