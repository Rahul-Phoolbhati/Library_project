const express = require("express");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
// compression
const compression = require("compression");
// helmet for vulnerabilities
const helmet = require("helmet");
// rate limit
const RateLimit = require("express-rate-limit");

const app = express();

const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
});
  // Apply rate limiter to all requests // of 20 mins
app.use(limiter);

// databases connect
const mongoDB = process.env.Mongo_uri;

main()
.then(()=>console.log("conneceted"))
.catch((err)=>console.error(err));
async function main(){
    await mongoose.connect(mongoDB);
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(compression());

app.use(
    helmet.contentSecurityPolicy({
      directives: {
        "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
      },
    })
);

app.use(express.static(path.join(__dirname, "public")));

// view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog"); 


//  using routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use('/catalog', catalogRouter);


app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {

    const stat = err.status || 500;
    if(req.app.get("env")==="develpment"){
        res.locals.message = err.message;
        res.locals.error = err;
    }
    else{
        if(stat>=500){
            res.locals.message = "Something Went Wrong !";
        }
        else{
            res.locals.message = err.message;
        }
        res.locals.error = {};
    }
    
  res.locals.status= err.status || 500;
  // render the error page
  
  res.status(err.status || 500);
  res.render("error");
    
});
  
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("running on port 3000");
})



