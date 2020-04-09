const expressJwt = require('express-jwt')
const { PRIVATE_KEY } = require('../utils/constant')

const jwtAuth = expressJwt({
    secret: PRIVATE_KEY,
    credentialsRequired: true
}).unless({
    //whiteList
    path:['/getUserInformation', '/postUserInformation', '/home', '/getSeach', '/getCommodity', '/drt']
});

module.exports = jwtAuth;