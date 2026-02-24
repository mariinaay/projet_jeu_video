class KomodoWsClient{
  constructor(wsURL,connectionOpenedMethod,connectionClosedMethod,methodsTable,roomJoinedCallback){
    this.ws=new WebSocket(wsURL,"echo-protocol");
    this.methodsTable=methodsTable;
    this.roomJoinedCallback=roomJoinedCallback
    if(connectionOpenedMethod){
      this.ws.onopen=connectionOpenedMethod;
    }
    if(connectionClosedMethod){
      this.ws.onclose=connectionClosedMethod;
    }
    if(this.methodsTable){
      this.ws.onmessage=(message)=>{
        const messageJSON=JSON.parse(message.data);
        if(messageJSON.type==="joinRoom" || messageJSON.type==="createRoom"){
          this.roomJoinedCallback();
        }
        const methodToCall=messageJSON.data.subType;
        if(methodToCall){
          this.methodsTable[methodToCall](messageJSON);
        }else{
          console.log(JSON.parse(message.data));
        }
      }
    }
  }

  createRoom(username){
    this.ws.send(JSON.stringify({
      type:"createRoom",
      data:{
        username:username
      }
    }));
  }

  joinRoom(username,roomId){
    this.ws.send(JSON.stringify({
      type:"joinRoom",
      data:{
        username:username,
        roomId:roomId
      }
    }));
  }

  infoMessage(dataJSON){
    this.ws.send(JSON.stringify({
      type:"infoMessage",
      data:dataJSON
    }));
  }

};
export default KomodoWsClient;