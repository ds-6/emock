const router = require('express').Router();
const {ensureLogin,ensureGuest} = require('../middleware/auth');
const Mock = require('../models/mock');
const User = require('../models/user');


router.get('/:id',ensureLogin,(req,res)=>{
    const id = req.params.id;
    Mock.findOne({_id:id})
    .then(result=>{
        const questionBody = result.questionBody;
        if(result.attemptedBy.includes(req.user._id)){
            User.findOne({_id:req.user.id,'attemptedMock.setNo':'10'},{attemptedMock:1})
            .then(result=>{
                const answerArr = result.attemptedMock[0].answerArr;
                const mock = result.attemptedMock[0];
                let rightArr=[]; let wrongArr=[]; let unAttemptedArr=[];
                function createArr(qID,i,ans){
                    const obj = {
                        q_id:qID,
                        q_data:questionBody[i].q_data,
                        a:questionBody[i].a,
                        b:questionBody[i].b,
                        c:questionBody[i].c,
                        d:questionBody[i].d,
                        r_a:questionBody[i].r_a,
                        c_a: ans?ans:null
                    }
                    return obj;
                }
                for(var i= 0;i<questionBody.length;i++){
                    const r_a = questionBody[i].r_a;
                    const q = questionBody[i].q_id;
                    if(i>=answerArr.length){
                        unAttemptedArr.push(createArr(q,i));
                    }
                    else{
                        for(var j=0;j<answerArr.length;j++){
                            const ans = answerArr[j].answer;
                            const qu= answerArr[j].q_id;
                            if(q==qu && r_a==ans){                            
                                rightArr.push(createArr(q,i,ans));
                            }
                            if(q==qu && r_a!=ans){                            
                                wrongArr.push(createArr(q,i,ans));
                            }
                        } 
                    }               
                }
                res.render('mock/mock-attempted',{user:req.user,rA:rightArr,wA:wrongArr,uA:unAttemptedArr,mock:mock});
            })
            .catch(err=>{
                console.log(err)
            })
        }
        else{
            res.render('mock/mock-attempt',{user:req.user,mock:result});
        }
    })
    .catch(err=>{
        res.render('error/500');
    })    
})


module.exports = router;