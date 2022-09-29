const express = require('express');
const boom = require('express-boom');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const winston = require('winston');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swagger = require('./swagger.json');
const {
  usersRouter,
  sizesRouter,
  productsRouter,
  categoriesRouter,
  commentsRouter,
  replyCommentsRouter,
  authRouter,
  ordersRouter
} = require('./routers');
const mongoose = require('mongoose');
const { database, up } = require('migrate-mongo');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const passport = require('passport');
const CustomStrategy = require('passport-custom').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { authStrategies } = require('./middlewares/auth/');

const loggerOptions = {
  transports:
    process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.Console(),
          new winston.transports.File({ filename: 'stdout.log' })
        ]
      : [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
};

// Settings
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});
app.use(
  cors({
    origin: [process.env.CLIENT_URL]
  })
);
app.use(boom());
bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  '/swagger',
  swaggerUi.serve,
  swaggerUi.setup(swagger, { explorer: true })
);
expressWinston.requestWhitelist.push('body');
app.use(expressWinston.logger(loggerOptions));
app.use(expressWinston.errorLogger(loggerOptions));
app.use(fileUpload());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport JS
passport.use('custom', new CustomStrategy(authStrategies.verifyCustom));
passport.use(
  new GoogleStrategy(authStrategies.googleSettings, authStrategies.verifyGoogle)
);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

// DB connect
mongoose.connect(process.env.MONGO_URL, async (error) => {
  if (error) {
    console.error(error);
  }

  const { db } = await database.connect();
  await up(db);
});

// Routes
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/sizes', sizesRouter);
app.use('/categories', categoriesRouter);
app.use('/comments', commentsRouter);
app.use('/replyComments', replyCommentsRouter);
app.use('/auth', authRouter);
app.use('/orders', ordersRouter);
app.disable('etag');

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 5000, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log(`Server started at http://localhost:${process.env.PORT}`);
    console.log(
      `Open swagger ui at http://localhost:${process.env.PORT}/swagger`
    );
  });
}

module.exports = app;
