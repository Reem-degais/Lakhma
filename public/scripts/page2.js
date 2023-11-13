
const socket = io();
let myname

let language_content =
 {
    "en": {
     "1": "How to play",
     "2": "How to play",
     "3": "If the color of the text is black then the answer is the background color",
     "4": "If the color of the text is not black then the answer is the text color",
     "5": "Play",
     "6": "Enter your name",
     "7": "Start"
 
    },
    "ar": {
     "1": "طريقة اللعب",
     "2": "طريقة اللعب",
     "3": " اذا كان لون النص اسود فان الاجابة الصحيحة هي لون الخلفية",
     "4": "اذا لم يكن لون النص اسود فان الاجابة هي لون النص",
     "5": "العب",
     "6": "ادخل اسمك",
     "7": "ابدا"
    }
 }
 
 function changeLanguage(lang) {
    for (let key in language_content[lang]) {
       document.getElementById(key).innerHTML = language_content[lang][key];
    }
  }
  /*----paasing player name to back end-------*/
 document.getElementById("page2").style.display='none'
  document.getElementById("loading").style.display='none'

  document.getElementById("7").addEventListener("click", function() {
       
    myname = document.getElementById("name").value
    document.getElementById("user").innerText=myname
      
     if(myname==null || myname==''){
       alert("enter your name, please")
     }

     else{
       socket.emit('find', { name: myname })
       document.getElementById("loading").style.display="block"
       document.getElementById("7").disabled=true 
     }

    })

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

/*--------------------------------------------------------------------------------*/


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
            socket.on('chat message', (msg) => {
                const item = document.createElement('li');
                item.textContent = msg;
                messages.appendChild(item);
                window.scrollTo(0, document.body.scrollHeight);
            });

function inntex(){
    const ta=["Red", "Blue", "Green", "Yellow", "Black", "Orange", "Purple", "Pink"];
    const randomIndexx = Math.floor(Math.random() * 8);
      const tex = ta[randomIndexx];
      return tex;
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


let timeleft = 4;
let keys = ""
let text =""
let co =""
let ba =""
let te =""
let sco1=5
let scol2=5

document.querySelectorAll(".card").forEach(e=>{
    e.addEventListener("click", function () {
        let value = this.className
        console.log(value)
        let co =color();
        let ba =backColor();
        let te =inntex();
        console.log(co)
        console.log(ba)
        console.log(te)
        console.log(e.id)
        socket.emit("playing", {value: value, id: e.id, name: myname, co: co, ba: ba, te: te })

    })})

        document.querySelectorAll(".choice").forEach(e=>{
        e.addEventListener('click', function() {
            keys = this.id
            console.log(keys)
        socket.emit("choosing", { keys: keys} )})})
   
    socket.on("playing", (e) => {
        const foundObject = (e.allPlayers).find(obj => obj.p1.p1name == `${myname}` || obj.p2.p2name == `${myname}`);
        ResetGame()
    p1id = foundObject.p1.p1move
    p2id = foundObject.p2.p2move
    turn1 = foundObject.p1.p1name
    turn2 = foundObject.p2.p2name
    cal = foundObject.co
    bac = foundObject.ba
    tee = foundObject.te
    /*exchage turns*/
    if ((foundObject.sum) % 2 == 0) {
        document.getElementById("second").innerText = turn2 + "'s turn"
        document.getElementById("first").innerText=""
        
    }
    else {
        document.getElementById("first").innerText = turn1 + "'s turn"
        document.getElementById("second").innerText=""
    }

    if (p1id != '') {
        
        document.getElementById(`${p1id}`).style.display ="none"
        
        
        document.getElementById('random-card').style.color = cal
        document.getElementById('random-card').style.backgroundColor=bac
        document.getElementById('random-card').innerText=tee
        button1(cal)
        button2(bac)
        button3()
        changeButtonPosition()
        const timer = setInterval(() => {
            timeleft--;
            if (timeleft < 0) {
              clearInterval(timer);
              ResetTimer();
              console.log(timeleft)
              console.log('Time is up!');
              /*displayMessage('Time is up!');*/
              
              document.getElementById(`${p1id}`).style.display="block" 
            }
            else{
                document.getElementById("timer").innerHTML=`00:${timeleft}`
                 if(keys!=""){
                    clearInterval(timer);
                    ResetTimer();
                    console.log(keys)
                    if(cal=="black"){
                        if(document.getElementById(keys).innerText==bac){
                            document.getElementById(keys).style.border="2px solid green" 
                            sco1--
                        }
                        else /*if(keys=="choice1" || keys=="choice3")*/{
                            document.getElementById(keys).style.border="2px solid red"
                            document.getElementById(`${p1id}`).style.display="block"
                           
                        }

                    }
                else{
                        if(document.getElementById(keys).innerText==cal){
                            document.getElementById(keys).style.border="2px solid green"
                            sco1-- 
                        }
                        else /*if(keys=="choice2" || keys=="choice3")*/{
                            document.getElementById(keys).style.border="2px solid red"
                            document.getElementById(`${p1id}`).style.display="block"
                            
                        }
                    }
                    
                    
                 }

            }
            console.log(sco1)
            keys=""
            winner(sco1, scol2) 
        },1000)
      
    }

    if (p2id != '') {
        
        document.getElementById(`${p2id}`).style.display ="none"
        
        
        document.getElementById('random-card').style.color=cal
        document.getElementById('random-card').style.backgroundColor=bac
        document.getElementById('random-card').innerText=tee
        button1(cal)
        button2(bac)
        button3()
        changeButtonPosition()
        const timer = setInterval(() => {
            timeleft--;
            if (timeleft < 0) {
              clearInterval(timer);
              ResetTimer();
              console.log(timeleft)
              console.log('Time is up!');
              /*displayMessage('Time is up!');*/
              
              document.getElementById(`${p2id}`).style.display="block" 
            }
            else{
                document.getElementById("timer").innerHTML=`00:${timeleft}`
                 if(keys!=""){
                    clearInterval(timer);
                    ResetTimer();
                    console.log(keys)
                    if(cal=="black"){
                        if(document.getElementById(keys).innerText==bac){
                            document.getElementById(keys).style.border="2px solid green" 
                            scol2--
                        }
                        else /*if(keys=="choice1" || keys=="choice3")*/{
                            document.getElementById(keys).style.backgroundColor="red"
                            document.getElementById(`${p2id}`).style.display="block"
                            
                        }

                    }
                else{
                        if(document.getElementById(keys).innerText==cal){
                            document.getElementById(keys).style.border="2px solid green"
                            scol2-- 
                        }
                        else /*if(keys=="choice2" || keys=="choice3")*/{
                            document.getElementById(keys).style.border="2px solid red"
                            document.getElementById(`${p2id}`).style.display="block"
                            
                        }
                    }
                    
                    
                 }

            }
            console.log(scol2)
            keys=""
            winner(sco1, scol2) 
        },1000)
        
    }
    })

    socket.on("choosing", (e)=>{
        keys= e.key
        console.log(keys)
    })

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
    
    function ResetTimer(){
        timeleft = 4;
        return timeleft
       }
            function displayMessage(message) {
                // Display the message
                const messageElement = document.getElementById('message');
                messageElement.innerText = message;
              }  
    function ResetGame() {
        
        document.getElementById("choice1").style.border=""
        document.getElementById("choice2").style.border=""
        document.getElementById("choice3").style.border=""
    }       

    function changeButtonPosition() {
        const buttons1 = document.getElementById("choice1");
        const buttons2 = document.getElementById("choice2");
        const buttons3 = document.getElementById("choice3");
  
        const temp = buttons1.style.left;
        buttons1.style.left = buttons2.style.left;
        buttons2.style.left = buttons3.style.left;
        buttons3.style.left = temp;
      }  
     function winner(pl1,pl2) {
        if(pl1==0){
        alert ("player 1 the winer")
        location. reload()} 
        if (pl2==0){
            alert("player  the winer")
            location. reload() 
        }
     }

     function openPopup() {
        document.getElementById("popup").style.display = "block";
      }
  
      function closePopup() {
        document.getElementById("popup").style.display = "none";
      }