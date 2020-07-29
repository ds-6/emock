const router = require('express').Router();
const {ensureLogin,ensureGuest,ensureAdmin} = require('../middleware/auth');
const Mock = require('../models/mock');

router.get('/',ensureLogin, (req,res)=>{
    Mock.find()
    .then(result=>{
        result.forEach(e=>{
            if(e.attemptedBy.includes(req.user._id)){
                e.status="Attempted";
            }
           else e.status = "Unattempted" 
        })
        res.render('dashboard',{user:req.user,mocks:result});
    })
    .catch(err=>{
        res.render('error/404')
    });   
})
router.get('/admin', (req,res)=>{
    Mock.find().sort({createdAt:-1})
    .then(result=>{
        res.render('admin',{user:req.user,mocks:result})
    })
    .catch(err=>{
        res.render('error/404')
    });   
})

module.exports = router;