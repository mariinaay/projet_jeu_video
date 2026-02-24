import { useEffect, useState } from 'react'
import * as Engine from "./web-komodo/Engine";
const ws=new Engine.KomodoWsClient("ws://localhost:3000",null,null,{
    "stdMessage":(message)=>{
      console.log(message);
    },
    "previousMessages":(message)=>{
      console.log(message);
    },
    "startGame":(message)=>{
      console.log(message);
    },
    "increaseScore":(message)=>{
      console.log(message);
    },
    "decreaseScore":(message)=>{
      console.log(message);
    }
  },()=>{
    ws.infoMessage({
      subType:"previousMessages"
    })
    console.log("test")
  });

const g1=new Engine.Game(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"],960,544,"pixelated");
function App() {
  const [count, setCount] = useState(true)
  const [attr,setAttr]=useState(["","",""]);
  useEffect(()=>{
    g1.storeIn("div");
    g1.gameLoop();
  },[])
  return (
    <>
      <div></div>
      <input type="text" onChange={(e)=>{attr[0]=e.target.value}}/>
      <input type="text" onChange={(e)=>{attr[1]=e.target.value}}/>
      <input type="text" onChange={(e)=>{attr[2]=e.target.value}}/>
      <button onClick={()=>{
        ws.createRoom(attr[0]);
      }}>test1</button>
      <button onClick={()=>{
        ws.joinRoom(attr[0],attr[1]);
      }}>test2</button>
      <button onClick={()=>{
        ws.infoMessage({
          subType:"stdMessage",
          text:attr[2],
          target:"noSelfRet"  
        })
      }}>test3</button>
      <button onClick={()=>{
        ws.infoMessage({
          subType:"startGame",
          target:"noSelfRet"
        })
      }}>test4</button>
      <button onClick={()=>{
        ws.infoMessage({
          subType:"increaseScore",
          valueToAdd:5
        })
      }}>test5</button>
      <button onClick={()=>{
        ws.infoMessage({
          subType:"decreaseScore",
          valueToSubstract:5
        })
      }}>test6</button>
    </>
  )
}

export default App
