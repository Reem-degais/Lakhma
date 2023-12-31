const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { start } = require('repl');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

/*to import css file*/
app.use(express.static(join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'game.html'));
})

app.get('/page1.js', function (req, res) {
	res.sendFile(join(__dirname ,'/public/scripts/client.js'));
});

/* array to store playerss information*/
let arr=[]
let playingArray=[]

/*start socket io connection*/
io.on('connection', (socket) => {
    /*chatting event*/
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
    
    /*find event to start game and get players information*/
    socket.on("find",(e)=>{

        if(e.name!=null){

            arr.push(e.name)

            if(arr.length>=2){
                let p1obj={
                    p1name:arr[0],
                    p1value:"card one",
                    p1card:""
                }
                let p2obj={
                    p2name:arr[1],
                    p2value:"card three",
                    p2card:""
                    
                }

                let obj={
                    p1:p1obj,
                    p2:p2obj,
                    sum:1,
                    coLor:"",
                    back:"",
                    intext:""
                }
                playingArray.push(obj)

                arr.splice(0,2)

                io.emit("find",{allPlayers:playingArray})

            }

        }
    })
    
    /*playing event to manage the game */
    socket.on("playing",(e)=>{
        
        if(e.value=="card one flex-center"){
            let objToChange=playingArray.find(obj=>obj.p1.p1name==e.name)

            objToChange.p1.p1card=e.id
            objToChange.p2.p2card=''
            objToChange.sum++
            objToChange.coLor=e.coLor
            objToChange.back=e.back
            objToChange.intext=e.intext
            
        }
        else if (e.value=="card three flex-center"){
            let objToChange=playingArray.find(obj=>obj.p2.p2name==e.name)
            
            objToChange.p2.p2card=e.id
            objToChange.p1.p1card=''
            objToChange.sum++
            objToChange.coLor=e.coLor
            objToChange.back=e.back
            objToChange.intext=e.intext
            }
        
        
        console.log(playingArray)
        io.emit("playing",{allPlayers:playingArray})

    })

    socket.on("choosing",(e)=>{
            
        let keys=e.keys
          io.emit("choosing", {key: keys})
          console.log(keys)
      })
})
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
})