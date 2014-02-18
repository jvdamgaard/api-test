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
        postSingle: Boolean,
        postMultiple: Boolean,
        getSingle: Boolean,
        getMultiple: Boolean,
        putSingle: Boolean,
        putMultiple: Boolean,
        deleteSingle: Boolean,
        deleteMultiple: Boolean
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
            postSingle: {
                type: Boolean,
                required: true,
                default: false
            },
            postBulk: {
                type: Boolean,
                required: true,
                default: false
            },
            getSingle: {
                type: Boolean,
                required: true,
                default: true
            },
            getMultiple: {
                type: Boolean,
                required: true,
                default: true
            },
            putSingle: {
                type: Boolean,
                required: true,
                default: false
            },
            putMultiple: {
                type: Boolean,
                required: true,
                default: false
            },
            deleteSingle: {
                type: Boolean,
                required: true,
                default: false
            },
            deleteMultiple: {
                type: Boolean,
                required: true,
                default: false
            }
        },
        users: {
            postSingle: {
                type: Boolean,
                required: true,
                default: false
            },
            postBulk: {
                type: Boolean,
                required: true,
                default: false
            },
            getSingle: {
                type: Boolean,
                required: true,
                default: false
            },
            getMultiple: {
                type: Boolean,
                required: true,
                default: false
            },
            putSingle: {
                type: Boolean,
                required: true,
                default: false
            },
            putMultiple: {
                type: Boolean,
                required: true,
                default: false
            },
            deleteSingle: {
                type: Boolean,
                required: true,
                default: false
            },
            deleteMultiple: {
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
