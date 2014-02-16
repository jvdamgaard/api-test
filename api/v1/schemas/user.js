// Dependencies
var Schema = require('mongoose').Schema;
var config = require('../config');
var _ = require('lodash');

// Add all ressources to the user schema
var options = {
    ressources: {}
};
_.forEach(config.ressources, function(ressource) {
    options.ressources[ressource] = {
        post: Boolean,
        get: Boolean,
        put: Boolean,
        'delete': Boolean
    };
});

module.exports = new Schema(_.assign(options, {
    rateLimit: {
        limit: {
            type: Number,
            required: true,
            default: 1000
        },
        resetRate: {
            type: Number,
            required: true,
            default: 900000
        },
        remaining: Number,
        currentReset: Number
    },
    ressources: {
        general: {
            post: {
                type: Boolean,
                required: true,
                default: false
            },
            get: {
                type: Boolean,
                required: true,
                default: true
            },
            put: {
                type: Boolean,
                required: true,
                default: false
            },
            'delete': {
                type: Boolean,
                required: true,
                default: false
            }
        },
        users: {
            post: {
                type: Boolean,
                required: true,
                default: false
            },
            get: {
                type: Boolean,
                required: true,
                default: false
            },
            put: {
                type: Boolean,
                required: true,
                default: false
            },
            'delete': {
                type: Boolean,
                required: true,
                default: false
            }
        }
    },

    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    },
}));
