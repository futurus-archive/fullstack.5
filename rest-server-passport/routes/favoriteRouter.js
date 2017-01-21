/**
 * Created by vunguyen on 1/20/17.
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Favorites = require('../models/favorites');

var favRouter = express.Router();
favRouter.use(bodyParser.json());

favRouter.route('/')
    .all(Verify.verifyOrdinaryUser) // req.decoded._doc._id is available after verifyOrdinaryUser
    .get(function (req, res, next) {
        var uID = req.decoded._doc._id;

        Favorites.findOne({postedBy: uID})
            .populate('postedBy')
            .populate('dishes')
            .exec(function (err, fav) {
                if (err) throw err;
                res.json(fav);
            });
    })

    .post(function (req, res, next) {
        // check existence of Favorites
        var uID = req.decoded._doc._id;
        Favorites.findOne({postedBy: uID}, function (err, result) {
            if (err) throw err;

            if (result) { // fav exists, append
                result.dishes.push(req.body._id);
                result.save(function (err, fav) {
                    if (err) throw err;

                    res.json(fav);
                });
            } else {
                Favorites.create({postedBy: uID, dishes: [req.body._id]}, function (err, fav) {
                    if (err) throw err;

                    res.json(fav);
                });
            }
            console.log('Favorite dish added!');
        });

    })

    .delete(function (req, res, next) {
        var uID = req.decoded._doc._id;
        Favorites.remove({postedBy: uID}, function (err, resp) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Favorites removed!');
        });
    });

favRouter.route('/:dishObjId')
    .all(Verify.verifyOrdinaryUser)
    .delete(function (req, res, next) {
        var uID = req.decoded._doc._id;
        Favorites.findOne({postedBy: uID}, function (err, resp) {
            if (err) throw err;
            if (resp) {
                resp.dishes.remove(req.params.dishObjId);

                resp.save(function (err, result) {
                    if (err) throw err;
                    res.json(result);
                });
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Fav dish doesn\'t exist!');
            }
        });
    });

module.exports = favRouter;