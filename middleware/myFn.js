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
    }
}