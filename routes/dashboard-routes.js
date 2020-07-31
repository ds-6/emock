const router = require('express').Router();
const {ensureLogin,ensureGuest,ensureAdmin} = require('../middleware/auth');
const User = require('../models/user');
const Mock = require('../models/mock');

router.get('/',ensureLogin,async (req,res)=>{
    try{
        let result = await Mock.find();
        for(let e of result){
            if(e.attemptedBy.includes(req.user._id)){                    
                e.status="Attempted";
                let a_Mock = await User.findOne({_id:req.user._id,"attemptedMock.setNo":e.setNo},{attemptedMock:1});
                e.marks = a_Mock.attemptedMock[0].totalMarks;       
            }
            else{
                e.status = "Unattempted";
            }
        }
         res.render('dashboard',{user:req.user,mocks:result});
           
    }catch(e){
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