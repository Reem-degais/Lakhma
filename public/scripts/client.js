
const socket = io();
let myname

/* switch  language */
let language_content ={
    "en": {
     "1": "How to play",
     "2": "How to play",
     "3": "If the color of the text is black then the answer is the background color",
     "4": "If the color of the text is not black then the answer is the text color",
     "5": "Play",
     "6": "Enter your name",
     "start": "Start",
     "7": "send",
     "8": "congratulation"
 
    },
    "ar": {
     "1": "طريقة اللعب",
     "2": "طريقة اللعب",
     "3": " اذا كان لون النص اسود فان الاجابة الصحيحة هي لون الخلفية",
     "4": "اذا لم يكن لون النص اسود فان الاجابة هي لون النص",
     "5": "العب",
     "6": "ادخل اسمك",
     "start": "ابدا",
     "7": "أرسل",
     "8" : "مبروك"
    }
}
 
function changeLanguage(lang) {
    for (let key in language_content[lang]) {
        document.getElementById(key).innerHTML = language_content[lang][key];
    }
}

 
document.getElementById("page2").style.display='none'
document.getElementById("loading").style.display='none'

/*paasing player name to back end*/  
document.getElementById("start").addEventListener("click", function() {
    myname = document.getElementById("name").value
    document.getElementById("user").innerText=myname
      
    if(myname==null || myname==''){
       alert("enter your name, please")
    }

    else{
       socket.emit('find', { name: myname })
       document.getElementById("loading").style.display="block"
       document.getElementById("start").disabled=true 
    }

})

/* find the oppenent and start game */
socket.on("find", (e) => {
    let allPlayersArray = e.allPlayers
        
    document.getElementById("page1").style.display="none"
    document.getElementById("page2").style.display="block"
    
        
    let oppName
    let value
    const foundObject = allPlayersArray.find(obj => obj.p1.p1name == `${myname}` || obj.p2.p2name == `${myname}`);
    foundObject.p1.p1name == `${myname}` ? oppName = foundObject.p2.p2name : oppName = foundObject.p1.p1name
    foundObject.p1.p1name == `${myname}` ? value = foundObject.p1.p1value : value = foundObject.p2.p2value
    document.getElementById("opp").innerText = oppName
    document.getElementById("first").innerText = foundObject.p1.p1name
        
})


/* chatting box */
const form = document.getElementById('chatt');
const input = document.getElementById('input-mas');
const messages = document.getElementById('messages');

/*send message to server*/
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

/* receive message from server */
socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});


/* functions to generate random card */
function innerText(){
    const texts=["Red", "Blue", "Green", "Yellow", "Black", "Orange", "Purple", "Pink"];
    const randomIndexx = Math.floor(Math.random() * 8);
    const text = texts[randomIndexx];
    return text;
}

function backColor(){
    const colorss = [ "Green", "Yellow", "White","Pink"]
    const randomIndexx = Math.floor(Math.random() * 4);
    const baColor = colorss[randomIndexx];
    return baColor;
}

function color() {
    const colors = ["red", "blue", "black", "orange", "purple","black"]
    const randomIndex = Math.floor(Math.random() * 5);
    const textColor = colors[randomIndex];
    return textColor;
}


let timeleft = 3;
let keys = ""
let text =""
let coLor =""
let back =""
let intext =""
let sco1=5
let sco2=5

/* to know which card is pressed */
document.querySelectorAll(".card").forEach(e=>{
    e.addEventListener("click", function () {
        let value = this.className
        coLor =color();
        back =backColor();
        intext =innerText();
        socket.emit("playing", {value: value, id: e.id, name: myname, coLor: coLor, back: back, intext: intext })

})})

/* to know which choice is pressed */
document.querySelectorAll(".choice").forEach(e=>{
    e.addEventListener('click', function() {
        keys = this.id
        socket.emit("choosing", { keys: keys} )
})})
   
socket.on("playing", (e) => {
    const foundObject = (e.allPlayers).find(obj => obj.p1.p1name == `${myname}` || obj.p2.p2name == `${myname}`);
    ResetGame()
    switchButtonText()
    p1id = foundObject.p1.p1card
    p2id = foundObject.p2.p2card
    turn1 = foundObject.p1.p1name
    turn2 = foundObject.p2.p2name
    COlor = foundObject.coLor
    BAck = foundObject.back
    TExt = foundObject.intext
    
    /*exchage turns*/
    if ((foundObject.sum) % 2 == 0) {
        document.getElementById("second").innerText = turn2 + "'s turn"
        document.getElementById("first").innerText=""
        
    }
    
    else {
        document.getElementById("first").innerText = turn1 + "'s turn"
        document.getElementById("second").innerText=""
    }
    
    /*player 1 turn */
    if (p1id != '') {
        
        document.getElementById(`${p1id}`).style.display ="none"
        document.getElementById('random-card').style.color = COlor
        document.getElementById('random-card').style.backgroundColor=BAck
        document.getElementById('random-card').innerText=TExt
        button1(COlor)
        button2(BAck)
        button3()
        switchButtonText()
        const timer = setInterval(() => {
            timeleft--;
            if (timeleft < 0) {
              clearInterval(timer);
              ResetTimer();
              document.getElementById(`${p1id}`).style.display="block"
              document.getElementById('choice1').style.border="2px solid red"
              document.getElementById('choice2').style.border="2px solid red"
              document.getElementById('choice3').style.border="2px solid red" 
            }
            
            else{
                document.getElementById("timer").innerHTML=`00:${timeleft}`
                if(keys!=""){
                    clearInterval(timer);
                    ResetTimer();
                    
                    if(COlor=="black"){
                        if(document.getElementById(keys).innerText==BAck){
                        document.getElementById(keys).style.border="2px solid green" 
                        sco1--
                        }
                        
                        else {
                        document.getElementById(keys).style.border="2px solid red"
                        document.getElementById(`${p1id}`).style.display="block"       
                        }

                    }
                
                    else{
                        if(document.getElementById(keys).innerText==COlor){
                            document.getElementById(keys).style.border="2px solid green"
                            sco1-- 
                        }
                        
                        else {
                            document.getElementById(keys).style.border="2px solid red"
                            document.getElementById(`${p1id}`).style.display="block"
                        }
                    }
                    
                }

            }
            keys=""
            winner(sco1, sco2,turn1,turn2) 
        },1000)
      
    }
    
    /*player 2 turn */
    if (p2id != '') {
        
        document.getElementById(`${p2id}`).style.display ="none"
        
        
        document.getElementById('random-card').style.color=COlor
        document.getElementById('random-card').style.backgroundColor=BAck
        document.getElementById('random-card').innerText=TExt
        button1(COlor)
        button2(BAck)
        button3()
        
        const timer = setInterval(() => {
            timeleft--;
            if (timeleft < 0) {
                clearInterval(timer);
                ResetTimer();
                document.getElementById(`${p2id}`).style.display="block" 
                document.getElementById('choice1').style.border="2px solid red"
                document.getElementById('choice2').style.border="2px solid red"
                document.getElementById('choice3').style.border="2px solid red"
            }
            
            else{
                document.getElementById("timer").innerHTML=`00:${timeleft}`
                if(keys!=""){
                    clearInterval(timer);
                    ResetTimer();
                    
                    if(COlor=="black"){
                        if(document.getElementById(keys).innerText==BAck){
                            document.getElementById(keys).style.border="2px solid green" 
                            sco2--
                        }
                        
                        else {
                            document.getElementById(keys).style.backgroundColor="red"
                            document.getElementById(`${p2id}`).style.display="block"   
                        }

                    }
                
                    else{
                        if(document.getElementById(keys).innerText==COlor){
                            document.getElementById(keys).style.border="2px solid green"
                            sco2-- 
                        }
                        else {
                            document.getElementById(keys).style.border="2px solid red"
                            document.getElementById(`${p2id}`).style.display="block"
                            
                        }
                    }
                }

            }
            keys=""
            winner(sco1, sco2,turn1,turn2) 
        },1000) 
    }
})

socket.on("choosing", (e)=>{
    keys= e.key
})

/* functions to update choices innertext*/
function button1(bu1) {
    let b = bu1
    document.getElementById("choice1").innerText=b
} 
function button2(bu2){
    let b = bu2
    document.getElementById("choice2").innerText=b
}  
function button3(){
    const choices = [ "Black", "Brown", "Gray"]
    const randomIndexx = Math.floor(Math.random() * choices.length);
    const othchi = choices[randomIndexx];
    document.getElementById("choice3").innerText=othchi 
}

/* to reset the timer*/
function ResetTimer(){
    timeleft = 3;
    return timeleft
}
 
/* to reset choices values */
function ResetGame() {
    document.getElementById("choice1").style.border=""
    document.getElementById("choice2").style.border=""
    document.getElementById("choice3").style.border=""
}       

/* to exchange buttons position */
function changeButtonPosition() {
    const buttons1 = document.getElementById("choice1");
    const buttons2 = document.getElementById("choice2");
    const buttons3 = document.getElementById("choice3");
  
    const temp = buttons1.style.left;
    buttons1.style.left = buttons2.style.left;
    buttons2.style.left = buttons3.style.left;
    buttons3.style.left = temp;
}  

function switchButtonText() {
    const button1 = document.getElementById('choice1');
    const button2 = document.getElementById('choice2');
    const button3 = document.getElementById('choice3');
  
    const temp = button1.textContent;
    button1.textContent = button2.textContent;
    button2.textContent = button3.textContent;
    button3.textContent = temp;
  }

/*to find the winner */
function winner(pl1,pl2,win1,win2) {
    if(pl1==0){
        openPopup('the-winner')
        document.getElementById('who-is-winner').innerText= win1 +" is the winner"
    } 
    
    if (pl2==0){
        openPopup('the-winner')
        document.getElementById('who-is-winner').innerText= win2 +" is the winner"
    }
}

function openPopup(pop) {
    document.getElementById(pop).style.display = "block";
}
  
function closePopup(pop) {
    document.getElementById(pop).style.display = "none";
}