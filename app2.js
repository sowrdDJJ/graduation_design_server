const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const static = require('./staticDataPool');
const router = require('./routes')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cache = require('./utils/cacahe')
let {USER_FRIENDLIST} = require('./utils/constant')
const Socket = require('./utils/socket')

app.use(cookieParser())
app.use(cors({credentials: true, origin: true}))
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('./public', cache));
app.use('/', router)
static.transmission();
Socket(USER_FRIENDLIST, io)
server.listen('3000')