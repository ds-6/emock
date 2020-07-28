const router = require('express').Router();
const {ensureLogin,ensureGuest} = require('../middleware/auth');
const Mock = require('../models/mock');


router.get('/:id',ensureLogin,(req,res)=>{
    const id = req.params.id;
    Mock.findOne({_id:id})
    .then(result=>{
        res.render('mock-attempt',{user:req.user,mock:result});
    })
    .catch(err=>{
        res.render('error/500');
    })    
})


module.exports = router;