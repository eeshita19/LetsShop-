var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    User = require('./models/user'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seedDB = require('./seeds');

var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    authRoutes = require('./routes/auth');

var campground = require("./models/campground");
var List  = require("./models/list")

var dotenv = require("dotenv");
dotenv.config();
// const { cloudinaryConfig, uploader } = require('./config/cloudinaryConfig');

// const { multerUploads, dataUri } = require('./config/multer');

const middlewareObj = require("./middleware/index")

mongoose.connect('mongodb://rahul:abcde6@ds317808.mlab.com:17808/orderfrom', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

//seedDB();
//passport setup

app.use(
    require('express-session')({
        secret: ' Yelpcamp authentication',
        resave: false,
        saveUninitialized: false,
    }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


//lnding page
app.get('/', function(req, res) {
    res.render('landing');
});

app.use('/', authRoutes);
app.use('/campgrounds/:id/comments/', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

var multer = require('multer');
var storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});
var imageFilter = function(req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'rahulkk',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get('/:username/:campground/upload', (req, res) => {
    res.render('listupload.ejs', { username: req.params.username, campground: req.params.campground });
});

app.post('/:username/:campground/upload', upload.single('image'),(req, res) => {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        // add cloudinary url for the image to the campground object under image property
        // console.log(result)
        campground.findById(req.params.campground, function (err, campground) {
            if (err) {
                console.log(err);
                res.redirect("/campgrounds");
            }
            else {
                const listObj = {
                    username: req.user.username,
                    link: result.secure_url
                }
                List.create(listObj, async function (err, list) {
                    if (err) {
                        req.flash("error", "Something went wrong");
                        console.log("ERROR: " + err);
                    }
                    else {
                        // list.author.id = req.user._id;
                        // list.author.username = req.user.username;
                        // list.author.link = result.secure_url
                        console.log(list);
                        campground.lists.push(list);
                        console.log(`Campground from past ${list}`)
                        await campground.save();
                        // console.log(`Campground from future ${list}`);
                        req.flash("success", "Successfully added comment");
                        res.redirect("/campgrounds/" + campground._id);
                    }
                });
            }
        });
        
    });
});


app.get('/:id/dashboard',middlewareObj.isLoggedIn,(req, res) => {
    campground.findById(req.params.id).populate("lists").exec((err, camp) => { 
        res.render("dashboard", { camp: camp });
    })
});


//====================

app.listen(3000, function() {
    console.log('yelpcamp started');
});
