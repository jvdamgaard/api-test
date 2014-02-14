// Dependencies
var config = require('../config.json');
var _ = require('lodash');
var sort = require('../sort');

// Models
var Page = require('../models/page');

// Constants
var BASE_URL = '/v' + config.version.major + '/pages/:pageId/images';

var getParrent = function(id, callback) {
    if (!id) {
        return callback('Missing id');
    }
    Page.findById(id, callback);
};

module.exports = function(app) {

    /////////////
    /// CREATE //
    /////////////

    // Create a single image on a page
    app.post(BASE_URL, function(req, res) {
        getParrent(req.params.pageId, function(err, page) {
            if (err) {
                return res.json(400, err);
            }
            page.images.push(req.body);
            page.save(function(err) {
                if (err) {
                    return res.json(400, err);
                }
                return res.json(201, _.last(page.images));
            });
        });
    });

    ///////////
    /// READ //
    ///////////

    // Read a list of images on a page
    app.get(BASE_URL, function(req, res) {
        getParrent(req.params.pageId, function(err, page) {
            if (err) {
                return res.json(400, err);
            }
            page.images = sort(page.images, req);
            res.json(page.images);
        });
    });

    // Read a single image by id on a page
    app.get(BASE_URL + '/:id', function(req, res) {
        getParrent(req.params.pageId, function(err, page) {
            if (err) {
                return res.json(400, err);
            }
            var image = _.find(page.images, function(image) {
                return image['_id'] == req.params.id;
            });
            if (!image) {
                return res.json(400, {
                    error: 'No image with id `' + req.params.id + '` for page with id `' + req.params.pageId + '`'
                });
            }
            res.json(image);
        });
    });

    /////////////
    /// UPDATE //
    /////////////

    // Update a list of images on a page
    app.put(BASE_URL, function(req, res) {
        getParrent(req.params.pageId, function(err, page) {
            if (err) {
                return res.json(400, err);
            }

            if (!_.isArray(req.body)) {
                return res.json(404, {
                    error: 'Body of request has to be an array when bulk updating'
                });
            }

            var errors = [];
            _.forEach(req.body, function(body) {
                if (!body._id) {
                    return errors.push({
                        error: 'No id was specified for ' + JSON.stringify(body)
                    });
                }
                var image = _.find(page.images, function(image) {
                    return image['_id'] == body.id;
                });

                if (!image) {
                    return errors.push(err);
                }
                image = _.assign(image, body);
            });
            if (errors.length) {
                return res.json(400, errors);
            }
            page.save(function(err) {
                if (err) {
                    return res.json(400, err);
                }
                return res.json(page.images);
            });
        });

    });

    // Update a single images by id on a page
    app.put(BASE_URL + '/:id', function(req, res) {
        getParrent(req.params.pageId, function(err, page) {
            if (err) {
                return res.json(400, err);
            }
            var image = _.find(page.images, function(image) {
                return image['_id'] == req.params.id;
            });
            if (!image) {
                return res.json(400, {
                    error: 'No image with id `' + req.params.id + '` for page with id `' + req.params.pageId + '`'
                });
            }
            image = _.assign(image, req.body);
            page.save(function(err) {
                if (err) {
                    return res.json(400, err);
                }
                return res.json(image);
            });
        });
    });

    /////////////
    /// DELETE //
    /////////////

    // Delete all images on a page
    app.delete(BASE_URL, function(req, res) {
        getParrent(req.params.pageId, function(err, page) {
            if (err) {
                return res.json(400, err);
            }
            page.images = [];
            page.save(function(err) {
                if (err) {
                    return res.json(400, err);
                }
                return res.json(200);
            });
        });
    });

    // Delete a single image by id on a page
    app.delete(BASE_URL + '/:id', function(req, res) {
        getParrent(req.params.pageId, function(err, page) {
            if (err) {
                return res.json(400, err);
            }
            var len = page.images.length;
            page.images = _.remove(page.images, function(image) {
                return image['_id'] != req.params.id;
            });
            if (len === page.images.length || len === 0) {
                return res.json(400, {
                    error: 'No image with id `' + req.params.id + '` for page with id `' + req.params.pageId + '`'
                });
            }
            page.save(function(err) {
                if (err) {
                    return res.json(400, err);
                }
                return res.json(200);
            });
        });
    });
};
