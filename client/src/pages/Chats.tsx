import React, { useEffect, useState } from 'react'

type Socket = {
    on: (event: string, callback: (data: any) => void) => void;
    emit: (event: string, data: any) => void;
}

function Chats( {socket, chatRoom, username}: {socket: Socket, chatRoom:string, username:string} ) {
    const [chat, SetChat] = useState('')

    const Messages = () => {
        const sendMesage = {
            username,
            chatRoom,
            chat,
            time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
        }

        socket.emit('send_message', sendMesage)
    }

    useEffect(() => {
        socket.on('receive_message', (data) => {
          console.log(data);
        });
      }, []);


  return (
    <div>
        <input type="text" placeholder='Message...' value={chat} onChange={(prev) => SetChat(prev.target.value)}/>
        <button onClick={Messages}>Send</button>
    </div>
  )
}

export default Chats