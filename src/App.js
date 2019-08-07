import React, { useEffect } from 'react';
import { db } from './db'

function App() {
  const sendMessage = ({ msg, sender }) => {
    db.ref('chats/1').set({
      id:"",
      msg,
      sender,
    })
  }

  useEffect(() => {
    sendMessage({ msg: "hi", sender: "jmpark6846"})
  })
  return (
    <div className="App">
      start!
    </div>
  );
}

export default App;
