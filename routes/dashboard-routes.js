const router = require('express').Router();
const {ensureLogin,ensureGuest,ensureAdmin} = require('../middleware/auth');
const User = require('../models/user');
const Mock = require('../models/mock');

router.get('/',ensureLogin,async (req,res)=>{
    let a_Mock;
    let result;
    try{
        result = await Mock.find();
        for(var i=0;i<result.length;i++){
            if(result[i].attemptedBy.includes(req.user._id)){                    
                result[i].status="Attempted";
                a_Mock = await User.findOne({_id:req.user._id,"attemptedMock.setNo":result[i].setNo},{attemptedMock:1});
                result[i].marks = a_Mock.attemptedMock[0].totalMarks;         
            }
            else{
                result[i].status = "Unattempted";
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