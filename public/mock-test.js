 /****************Global Function**********************/
 function _fn(id){
    return document.querySelector(id);
}
function _fnAll(id){
    return document.querySelectorAll(id);
}
/**********Mock right sidebar******************/
_fn('.menu-ico').addEventListener('click',()=>{
    _fn('.mock-btn-wrapper').classList.toggle('show');
    _fn('.menu-ico i').classList.toggle('rotate');
})
/*************Timer Setup********************/
var time = parseInt(_fn('.mock-header').dataset.mocktime)*60 || 3600; //in seconds
var x = setInterval(()=>{    
    var m = Math.floor(time/60);
    var s = time%60;
    _fn('.timer-content .min').innerHTML = m;
    _fn('.timer-content .sec').innerHTML= s;
    time--;
    if(m==0&&s==0){
        clearInterval(x);
        _fn('.timer-content').innerHTML = `-- : --`;        
        const instance = M.Modal.init(_fn('#modal1'), {dismissible: false});
        instance.open();
    }
    if(m==15&&s==0){
        M.toast({html: 'Last 15 min left!',inDuration:500});
    }
    if(m==5&&s==0){
        M.toast({html: 'Hurry, 5 min left!',inDuration:500});
    }
},1000) 

//Find time taken after submitMock()
    function timeTaken(){
        var totalTime = parseInt(_fn('.mock-header').dataset.mocktime)*60 || 3600;
        var m = parseInt(_fn('.timer-content .min').innerText)*60;
        var s = parseInt(_fn('.timer-content .sec').innerText);
        var ms =  totalTime - (m+s);
        m = Math.floor(ms/60);
        s = ms%60;
        return `${m}m : ${s}s`;
    }

/*************Render Mock********************/
const questionBody = JSON.parse(_fn('#mock-area').dataset.mock);
var qLength = questionBody.length;
var pos =0;
let answerArr = [];
_fn('.qBody').innerHTML = "";
_fn('.btns-right').innerHTML = "";

//Load Buttons
questionBody.forEach(e=>{       
    _fn('.btns-right').innerHTML+= `<button class="btn btn-${pos+1}" onclick="loadQuestion(${pos})">${pos+1}</button>`;
    pos++;
})

//Load Questions
pos=0;
loadQuestion(pos);
function loadQuestion(val){
    if(val>=questionBody.length){
        return false;
    }
    _fn('.qBody').innerHTML= `
    <h5>Question ${questionBody[val].q_id}:</h5>
    <div class="divider grey lighten-3"></div>
    <p>${questionBody[val].q_data}</p>
    <div class="options">
        <p>
            <label for="a">
                <input id="a" name="radio" type="radio" value="a" class="with-gap radio" />
                <span class="grey-text text-darken-3">${questionBody[val].a}</span>
            </label>
        </p>
        <p>
            <label for="b">
                <input id="b" name="radio" type="radio" value="b" class="with-gap radio"  />
                <span class="grey-text text-darken-3">${questionBody[val].b}</span>
            </label>
        </p>
        <p>
            <label for="c">
                <input id="c" name="radio" type="radio" value="c" class="with-gap radio" />
                <span class="grey-text text-darken-3">${questionBody[val].c}</span>
            </label>
        </p>
        <p>
            <label for="d">
                <input id="d" name="radio" type="radio" value="d" class="with-gap radio" />
                <span class="grey-text text-darken-3">${questionBody[val].d}</span>
            </label>
        </p>
    </div>
    <div class="divider grey lighten-3"></div>
    <div class="buttons padding-20">
        <p class="left">
            <button class="btn btn-small grey darken-2 waves-effect waves-light" onclick="if(${val>0}){loadQuestion(${val-1})}">Previous</button>
            <button class="btn btn-small grey darken-2 waves-effect waves-light" onclick="if(${val<qLength-1}){loadQuestion(${val+1})}">Next</button>            
            <button class="btn btn-small green darken-2 waves-effect waves-light" onclick="saveOption(${val+1})">Save & Next</button>
        </p>                
        <p class='right'>
            <button class="btn btn-small red darken-2 waves-effect waves-light" onclick="eraseOption(${val+1})">Erase</button>
            <button class="btn btn-small indigo darken-3 waves-effect waves-light" onclick="tagQuestion(${val+1})" >Tag</button>
        </p>                
    </div>`;

   //for checking if answer was checked 
   isAnswerChecked(val+1);        
}

/*************If answer was checked for particular question********************/
function isAnswerChecked (val){
    const check = answerArr.find(v=>{
        return v.q_id == val;
    })
    if(check){
        switch(check.answer){
            case "a":
                _fn('input#a').checked = true;
                break;
            case "b":
                _fn('input#b').checked = true;
                break;
            case "c":
                _fn('input#c').checked = true;
                break;
            case "d":
                _fn('input#d').checked = true;
                break;         
        }
    }        
}

/*************Checked Value Finder********************/
function findChecked(){
    let check;
    _fnAll('.radio').forEach(e=>{
        if(e.checked){
            check = e.value;
        }
    })
    return check;
}    

/*************if answer is present ?********************/ 
function isAnswerPresent (val,option){
    answerArr.find((current,index)=>{
        if(current.q_id==val && option=="update"){
            answerArr[index] = {q_id:val,answer:choosenOption};
            return true;
        }
        if(current.q_id==val && option=="splice"){
            answerArr.splice(index,1);
            return true;
        }
    })
}  

/*************Save Option********************/
function saveOption(val,option){
    if(findChecked()){
        let obj;
        const choosenOption = findChecked();
        const isPresent = isAnswerPresent(val,"update");
        if(isPresent== undefined){
            obj = {
                q_id:val,
                answer:choosenOption
            };
            answerArr.push(obj);
        }
        if(option=="tag"){
            _fn(`.btn-${val}`).classList.remove('oColor','gColor');
            _fn(`.btn-${val}`).classList.add('iColor');
        }
        else{
            _fn(`.btn-${val}`).classList.remove('oColor','iColor');
            _fn(`.btn-${val}`).classList.add('gColor');
        }        
        loadQuestion(val);
        console.log(answerArr);
    }
}

/*************Erase Option********************/
    function eraseOption(val){
        //find if checked value present in answerArr
        isAnswerPresent(val,"splice");
        _fnAll('.radio').forEach(e=>{
            e.checked = false;            
        })
        _fn(`.btn-${val}`).classList.remove('gColor','oColor','iColor');
    }

/*************Tag Question********************/
    function tagQuestion(val){
        if(findChecked()){
            saveOption(val,"tag");
        }
        else{
            _fn(`.btn-${val}`).classList.add('oColor');
            loadQuestion(val);
        }
    }

/*************Submit Mock********************/
    function submitMock(){
        var total = 0;
        var wrong = 0;
        for(var i= 0;i<questionBody.length;i++){
            const r_a = questionBody[i].r_a;
            const q = questionBody[i].q_id;
            for(var j=0;j<answerArr.length;j++){
                const ans = answerArr[j].answer;
                const qu= answerArr[j].q_id;
                if(q==qu && r_a==ans){
                    total++;
                }else if(q==qu && r_a!=ans){
                    wrong++;
                }
            }
        }
        total = total*parseInt(_fn('.mock-header').dataset.fullmark) - wrong*parseInt(_fn('.mock-header').dataset.negmark)
        //fetch post

        const attemptedOBJ= {            
            "mockID": _fn('.mock-header').dataset.mockid,
            "category":_fn('.mock-header').dataset.category,
            "setNo":_fn('.mock-header').dataset.setno,
            "mockName": _fn('.mock-header').dataset.mockname,
            "totalMarks": total,
            "answerArr":answerArr,
            "timeTaken":timeTaken()
        }
        console.log(attemptedOBJ);
        fetch('/submit-mock',{
            method:'POST',
            credentials: 'include',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(attemptedOBJ)
        })
        .then(res=>res.json())
        .then(data=>{
            window.location.href = data.redirect;
        })
        .catch(err=>{
            console.log(err)
        })
    }