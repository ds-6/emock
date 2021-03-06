const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Mock = require('./models/mock');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const passport = require('passport');
const {ensureLogin,ensureGuest} = require('./middleware/auth');
require('dotenv').config();


const app = express();
app.listen(process.env.PORT||3000,()=>{
    console.log('I am listening...')
});

const dbURI = 'mongodb://'+process.env.MONGO_KEY+'@cluster0-shard-00-00.c3srz.mongodb.net:27017,cluster0-shard-00-01.c3srz.mongodb.net:27017,cluster0-shard-00-02.c3srz.mongodb.net:27017/cluster0?ssl=true&replicaSet=atlas-phu4tj-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
.then(result=>{
    console.log('Database is connected...');
});



app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json({limit:"2mb"}));
app.use(express.urlencoded({limit:"2mb",extended:true}));

app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[process.env.COOKIE_KEY]
}));

 app.use(passport.initialize());
 app.use(passport.session());app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[process.env.COOKIE_KEY]
}));

 app.use(passport.initialize());
 app.use(passport.session());

app.use('/auth',require('./routes/auth-routes'));
app.use('/dashboard',require('./routes/dashboard-routes'));
app.use('/take-mock',require('./routes/mock-routes'));

app.get('/', ensureGuest, async ( req, res)=>{
     try{
        const mocks = await Mock.find();
        res.render('index',{user:null,mocks});
     }catch(err){
         console.log(err);
         res.render('error/500');
     }
})


app.post('/add-mock',(req,res)=>{
    req.body.questionBody = JSON.parse(req.body.questionBody);
    new Mock(req.body).save()
    .then(result=>{
        res.redirect('/dashboard/admin');
    })
    .catch(err=>{
        res.render('error/500')
    })
})

app.get('/delete/:id', (req,res)=>{
    const id = req.params.id;
    Mock.findByIdAndDelete(id)
    .then(res.redirect('/dashboard/admin'))
    .catch(err=>{
        res.render('error/500');
    })
})

app.post('/submit-mock',async (req,res)=>{
    try {
        const pushMock = { $push: { attemptedMock: req.body } };
        await User.findOneAndUpdate({ _id: req.user._id }, pushMock);
        const mockID = req.body.mockID;
        const userID = { $push: { attemptedBy: req.user._id } };
        const result = await Mock.findOneAndUpdate({ _id: mockID }, userID);
        if (result) {
            res.json({ redirect: `/take-mock/${req.body.mockID}` });
        }

    } catch (err) {
        res.render('error/500');
    }
})