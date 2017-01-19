#!/usr/bin/env node
/**
 * Created by vunguyen on 1/15/17.
 */
module.exports = {
    'secretKey': '12345-67890-09876-54321',
    'mongoUrl' : 'mongodb://localhost:27017/conFusion',
    'facebook': {
        clientID: '1769837316671991',
        clientSecret: '2d696de362dbf29a1a1860a3c36c85aa',
        callbackURL: 'https://' + process.env.IP + ':' + process.env.PORT + '/users/facebook/callback' // localhost:3443
    }
}