require('dotenv').config();
const fs = require('fs');
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');
// Dependencies
const createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  mongoose = require('mongoose'),
  helmet = require('helmet'),
  compression = require('compression'),
  {
    NODE_ENV,
    MONGO_DEV_CREDENTIALS,
    MONGO_PRODUCTION_CREDENTIALS,
    COOKIE_SECRET,
    SESSIONS_COLLECTION,
    BASE_URL
  } = process.env,
  baseUrl = NODE_ENV === 'production' ? BASE_URL : '/';
// webpush = require('web-push');s

// Push notification setup
// const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
// const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
// webpush.setVapidDetails(
//   `mailto:${process.env.EMAIL_AUTH_USER}`,
//   publicVapidKey,
//   privateVapidKey
// );


const routes = require('./routes');
const app = express();
// const app = require("https-localhost")()
app.use(helmet());

mongoose.connect(
  NODE_ENV === 'production'
    ? MONGO_PRODUCTION_CREDENTIALS
    : MONGO_DEV_CREDENTIALS,
  {
    useNewUrlParser: true,
    useFindAndModify: false
  }
);

const mongooseConnection = mongoose.connection;
mongooseConnection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.baseUrl = NODE_ENV === 'production' ? BASE_URL + '/' : '/';
app.locals.NODE_ENV = NODE_ENV;
const expiration = 14 * 24 * 60 * 60 * 1000, // 14 days
  sessionOptions = {
    secret: COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: expiration },
    store: new MongoStore({
      mongooseConnection,
      collection: SESSIONS_COLLECTION,
      ttl: expiration
    })
  };

app.get('env') === 'production' && (sessionOptions.cookie.path = baseUrl + '/');
app.use(session(sessionOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(compression()); //Compress all routes
app.use(express.urlencoded({ extended: false }));
app.use(baseUrl, express.static(path.join(__dirname, 'public')));
app.use(baseUrl, routes);

app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  NODE_ENV !== 'production' && console.error(err);

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  req.method === 'GET' ? res.render('error') : res.json(err);
});

module.exports = app;
