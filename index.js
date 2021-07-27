// if in dev env, load all variables in .env to process.env
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// dependencies
const express = require("express");
const app = express();
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const passportConfig = require("./configs/passport-config");
const cors = require("cors");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

// folders
const AuthRouter = require("./routes/AuthRoute");
const UserRouter = require("./routes/UserRoute");

app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // access form by name attribute in tag
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      signed: false,
    },
    store: MongoStore.create({
      mongoUrl: `${process.env.SESSION_DATABASE_URL}`,
    }),
  })
);
app.use(flash());

// db
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to MongoDB Atlas"));

passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Auth server is listening on port " + PORT);
});
