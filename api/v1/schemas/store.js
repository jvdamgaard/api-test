// Dependencies
var Schema = require('mongoose').Schema;

module.exports = new Schema({
    brand: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    postal: {
        type: Number,
        required: true,
        min: 0,
        max: 9999
    },
    city: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        min: 0,
        max: 99999999
    },
    virkNumbers: [{
        type: Number,
        min: 0,
        max: 99999999
    }],
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    hasFlowers: Boolean,
    hasPetFood: Boolean,
    hasGardenStuff: Boolean,
    hasPlantingStuff: Boolean,
    isDailyOpen: Boolean,
    isNonFood: Boolean,
    isSundayOpen: Boolean,

    openingHours: [{
        open: {
            type: Date,
            required: true
        },
        close: {
            type: Date,
            required: true
        }
    }],
});
