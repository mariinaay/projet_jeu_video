class KomodoWsServer{
    http=require("http");
    webSocketServer=require("websocket").server;
    constructor(authorizedOrigins,methodsTable,port,rooms,nonWsClientMessage){
        this.server=this.http.createServer((request,response)=>{
            console.log(nonWsClientMessage?nonWsClientMessage:"connection to websocket server must be from websocket client");
            response.writeHead(401);
            response.end();
        });
        this.server.listen(port,()=>{
            console.log(`ws server is launched | localhost:${port}`);
        });
        this.ws=new this.webSocketServer({
            httpServer:this.server,
            autoAcceptConnections:false
        });
        this.authorizedOrigins=authorizedOrigins;
        this.methodsTable=methodsTable;
        this.rooms=rooms?rooms:{};
        this.checkOrigin=(origin)=>{
            console.log(this.authorizedOrigins)
            return (this.authorizedOrigins.includes(origin));
        }

        this.startServer=()=>{
            this.ws.on("request",(request)=>{
                if(!this.checkOrigin(request.origin)){
                    console.log("connection has been refused from "+request.origin);
                    request.reject();
                    return ;
                }
                const connection=request.accept("echo-protocol",request.origin);
                connection.on("message",(message)=>{
                    if(message.type==="utf8"){
                        const Information=JSON.parse(message.utf8Data);
                        if(Information.type==="createRoom"){
                            const RoomId=Date.now().toString();
                            connection.username=Information.data.username;
                            connection.room=RoomId;
                            this.rooms[RoomId]=[connection];
                            connection.on("close",()=>{
                                delete this.rooms[RoomId];
                                console.log(rooms);
                            })
                            connection.sendUTF(JSON.stringify({
                                type:"createRoom",
                                data:{
                                    roomId:RoomId
                                }
                            }))
                            console.log(connection);
                        }
                        if(Information.type==="joinRoom"){
                            const RoomId=Information.data.roomId;
                            let error=false;
                            console.log(this.rooms[RoomId])
                            for(let user of this.rooms[RoomId]){
                                console.log(user.username+" "+Information.data.username)
                                if(user.username===Information.data.username){
                                    error=true;
                                    connection.sendUTF(JSON.stringify({
                                        type:"joinRoom",
                                        data:{
                                            error:"a player using this username is already here in room"
                                        }
                                    }))
                                }
                            }
                            if(!error){
                                connection.username=Information.data.username;
                                connection.room=RoomId;
                                this.rooms[RoomId].push(connection);
                                connection.on("close",()=>{
                                    for(let i=0;i<this.rooms[RoomId].length;i++){
                                        if(connection.username===this.rooms[RoomId][i].username)this.rooms[RoomId].splice(i,1);
                                    }
                                    console.log(this.rooms);
                                })
                                connection.sendUTF(
                                    JSON.stringify({
                                        type:"joinRoom",
                                        data:{
                                            status:"success"
                                        }
                                    })
                                )
                            }
                        }
                        if(Information.type==="infoMessage"){
                            for(let methodIndex in methodsTable){
                                if(methodIndex===Information.data.subType){
                                    this.methodsTable[methodIndex](Information,connection);
                                }
                            }
                            console.log(Information);
                            for(let i of this.rooms[connection.room]){
                                if(i.username!=connection.username && Information.data.target==="noSelfRet"||Information.data.target==="everyone"){
                                    i.sendUTF(JSON.stringify(Information));
                                    console.log(Information);
                                }
                            }
                            if(Information.data.target==="selfRet"){
                                connection.sendUTF(JSON.stringify(Information));
                            }
                        }
                    }
                });
            })
        }
    }
};

let wsServer=new KomodoWsServer(["http://localhost:5173"],{
    "stdMessage":(message,connection)=>{
        if(!wsServer.messages[connection.room]){
            wsServer.messages[connection.room]=[];
        }
        wsServer.messages[connection.room].push(message);
    },
    "startGame":(message,connection)=>{
        if(!wsServer.score[connection.room]){
            message.data.target="everyone"
            wsServer.score[connection.room]={};
            console.log(connection.room)
            console.log(wsServer.score);
            for(let cn of wsServer.rooms[connection.room]){
                wsServer.score[cn.room][cn.username]=0;
            }
            console.log(wsServer.score[connection.room])
            message.data.value=0;
        }else{
            message.data={
                error:"game is alreay launched !",
                target:"selfRet"
            };
        }
    },
    "previousMessages":(message,connection)=>{
        message.data.target="selfRet"
        if(wsServer.messages[connection.room]){
            message.previousMessage=wsServer.messages[connection.room];
        }
    },
    "increaseScore":(message,connection)=>{
        console.log(connection.room);
        console.log(connection.username)
        console.log(wsServer.score[connection.room][connection.username]);
        if(wsServer.score[connection.room][connection.username]!=undefined){
            message.data.target="everyone";
            wsServer.score[connection.room][connection.username]+=message.data.valueToAdd;
            message.data.value=wsServer.score[connection.room][connection.username];
        }else{
            message.data.target="selfRet";
            message.data.error="you are not in game";
        }
    },
    "decreaseScore":(message,connection)=>{
        if(wsServer.score[connection.room][connection.username]!=undefined){
            message.data.target="everyone";
            wsServer.score[connection.room][connection.username]-=message.data.valueToSubstract;
            message.data.value=wsServer.score[connection.room][connection.username];
        }else{
            message.data.target="selfRet";
            message.data.error="you are not in game";
        }
    }
},3000);
wsServer.messages={};
wsServer.score={};
wsServer.startServer();
/*
const server=http.createServer((request,response)=>{
    console.log("connection to websocket server must be from websocket client");
    response.writeHead(401);
    response.end();
});

server.listen(3000,()=>{
    console.log("connection to the server has been established");
});

const ws=new webSocketServer({
    httpServer:server,
    autoAcceptConnections:false
});

let authorizedOrigins=["http://localhost:5173"];
const rooms={}

function checkOrigin(origin){
    console.log(authorizedOrigins)
    return (authorizedOrigins.includes(origin));
}

ws.on("request",(request)=>{
    if(!checkOrigin(request.origin)){
        console.log("connection has been refused from "+request.origin);
        request.reject();
        return ;
    }
    const connection=request.accept("echo-protocol",request.origin);
    connection.on("message",(message)=>{
        if(message.type==="utf8"){
            const Information=JSON.parse(message.utf8Data);
            if(Information.type==="createRoom"){
                const RoomId=Date.now().toString();
                connection.username=Information.data.username;
                connection.room=RoomId;
                rooms[RoomId]={members:[connection],messages:[]};
                connection.on("close",()=>{
                    delete rooms[RoomId];
                    console.log(rooms);
                })
                connection.sendUTF(JSON.stringify({
                    type:"createRoom",
                    data:{
                        roomId:RoomId
                    }
                }))
                console.log(connection);
            }
            if(Information.type==="joinRoom"){
                const RoomId=Information.data.roomId;
                let error=false;
                console.log(rooms[RoomId])
                for(let user of rooms[RoomId]){
                    console.log(user.username+" "+Information.data.username)
                    if(user.username===Information.data.username){
                        error=true;
                        connection.sendUTF(JSON.stringify({
                            type:"error",
                            data:"a player using this username is already here in room"
                        }))
                    }
                }
                if(!error){
                    connection.username=Information.data.username;
                    connection.room=RoomId;
                    rooms[RoomId].push(connection);
                    connection.on("close",()=>{
                        for(let i=0;i<rooms[RoomId].length;i++){
                            if(connection.username===rooms[RoomId][i].username)rooms[RoomId].splice(i,1);
                        }
                        console.log(rooms);
                    })
                }
            }
            if(Information.type==="infoMessage"){
                for(let i of rooms[connection.room]){
                    if(i.username!=connection.username){
                        i.sendUTF(JSON.stringify(Information));
                    }
                }
            }
        }
    });
})*/