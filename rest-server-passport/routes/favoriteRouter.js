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
    .all(Verify.verifyOrdinaryUser)
    .get(function (req, res, next) {
        Favorites.find({})
            .populate('postedBy')
            .populate('dishes')
            .exec(function (err, fav) {
                if (err) throw err;
                res.json(fav);
            });
    })

    .post(function (req, res, next) {
        // check existence of Favorites
        // req.decoded._doc._id is available after verifyOrdinaryUser
        Favorites.find({postedBy: req.decoded._doc._id}, function (err, result) {
            if (err) throw err;
            
            if (result.length) { // fav exists, append
                req.body.postedBy = req.decoded._doc._id;
                result.dishes.push(req._id);
                result.save(function (err, fav) {
                    if (err) throw err;
                    console.log('Favorite dish added!');
                    res.json(fav);
                });
            } else {
                Favorites.create(req.body, function (err, fav) {
                    if (err) throw err;
                    console.log('Dish added to favorites!');
        
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('Added to favorites dish with id: ' + fav._id);
                });
            }
        });
        
    })

    .delete(function (req, res, next) {
        Favorites.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

favRouter.route('/:dishObjId')
    .all(Verify.verifyOrdinaryUser)

    .delete(function (req, res, next) {
        Favorites.find({postedBy: req.decoded._doc._id}, function (err, resp) {
            if (err) throw err;
            
            resp.dishes.id(resp.params.dishObjId).remove();

            resp.save(function (err, result) {
                if (err) throw err;
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Fav dish removed!');
            });
        });
    });

module.exports = favRouter;