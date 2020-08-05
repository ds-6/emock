const router = require('express').Router();
const {ensureLogin,ensureGuest,ensureAdmin} = require('../middleware/auth');
const User = require('../models/user');
const Mock = require('../models/mock');
require('dotenv').config();

router.get('/',ensureLogin,async (req,res)=>{
    try{
        if(req.user.googleID==process.env.GOOGLE_ADMIN_ID){
            req.user.isAdmin = true;
        }
        let result = await Mock.find();
        for(let e of result){
            if(e.attemptedBy.includes(req.user._id)){   
                console.log(e._id)                 
                e.status="Attempted";
                let a_Mock = await User.findOne({_id:req.user._id,"attemptedMock.mockID":`${e._id}`},{'attemptedMock.$':1});
                console.log(a_Mock)
                if(a_Mock){
                    e.marks = a_Mock.attemptedMock[0].totalMarks;
                }    
            }
            else{
                e.status = "Unattempted";
            }
        }
         res.render('dashboard',{user:req.user,mocks:result});
           
    }catch(e){
        console.log(e)
        res.render('error/500');
    }
    //const final = await Promise.all([a_Mock,result]);
    //console.log(final);
})


router.get('/admin', (req,res)=>{
    Mock.find().sort({createdAt:-1})
    .then(result=>{
        res.render('admin',{user:req.user,mocks:result})
    })
    .catch(err=>{
        res.render('error/500')
    });   
})

module.exports = router;