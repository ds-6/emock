const router = require('express').Router();
const {ensureLogin,ensureGuest} = require('../middleware/auth');
const {createArr,findRank}= require('../middleware/myFn')
const Mock = require('../models/mock');
const User = require('../models/user');

router.get('/instructions/:id',ensureLogin ,async (req,res)=>{
    const id = req.params.id;
    try{
        res.render('mock/instructions',{id});
    }catch(err){
        res.render('error/500');
    }
    
})

router.get('/:id', ensureLogin, async (req, res) => {
    try {
        const id = req.params.id;
        const m= await User.find({'attemptedMock.mockID': id}).select({'attemptedMock.mockID.$': 1 });
        const rank = findRank(m,req.user._id); //middleware fn
        const result = await Mock.findOne({ _id: id });        
        const questionBody = result.questionBody;
        if (result.attemptedBy.includes(req.user._id)) {
            const a_mock = await User.findOne({ _id: req.user.id, 'attemptedMock.mockID': `${id}` }, { 'attemptedMock.$': 1 });
            const answerArr = a_mock.attemptedMock[0].answerArr;
            const mock = a_mock.attemptedMock[0];
            let rightArr = []; let wrongArr = []; let unAttemptedArr = [];         
            for (var i = 0; i < questionBody.length; i++) {
                const r_a = questionBody[i].r_a;
                const q = questionBody[i].q_id;
                    for (var j = 0; j < answerArr.length; j++) {
                        const ans = answerArr[j].answer;
                        const qu = answerArr[j].q_id;
                        if (q == qu && r_a == ans) {
                            rightArr.push(createArr(q,questionBody ,i, ans));
                        }
                        if (q == qu && r_a != ans) {
                            wrongArr.push(createArr(q,questionBody, i, ans));
                        }                                               
                    }                     
                    if(!answerArr.some(e=>e.q_id==q)){
                        unAttemptedArr.push(createArr(q,questionBody, i));
                    }
            }
            //console.log(result)
            res.render('mock/mock-attempted', { user: req.user, rA: rightArr, wA: wrongArr, uA: unAttemptedArr, mock: mock,rank });
        }
        else {
            res.render('mock/mock-attempt', { user: req.user, mock: result });
        }
    }catch (err) {
        console.log(err)
       res.render('error/500');
    }
})

module.exports = router;