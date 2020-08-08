module.exports= {
    createArr: function createArr(qID,qBody, i, ans) {
        const obj = {
            q_id: qID,
            q_data: qBody[i].q_data,
            a: qBody[i].a,
            b: qBody[i].b,
            c: qBody[i].c,
            d: qBody[i].d,
            r_a: qBody[i].r_a,
            c_a: ans ? ans : null
        }
        return obj;
    },
    findRank: function findRank(m,userID){
        const marksArr = [];
        var studentMarks;
        for(const val of m){
            marksArr.push(val.attemptedMock[0].totalMarks);
            if(userID== `${val._id}`){
                studentMarks = val.attemptedMock[0].totalMarks;
            }
        }
        marksArr.sort((a,b)=>{
            return b-a ;
        })
        return {
            rank:marksArr.indexOf(studentMarks)+1,
            totalCandidates: marksArr.length
        };
    }
}