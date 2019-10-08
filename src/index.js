import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const Message = ({ media, name, text }) => (
  <div className="message">
    <img className="media" src={media} alt="user-media" />
    <span className="name">{name}</span>
    <p className="text">{text}</p>
  </div>
);

const data = {
  rooms: [
    {
      id: "1",
      name: "Room A",
      history: [
        {
          id: "1",
          media: "https://picsum.photos/160/?image=238",
          name: "Mike",
          text: "Hi, there."
        }
      ]
    },
    {
      id: "2",
      name: "Room B",
      history: [
        {
          id: "1",
          media: "https://picsum.photos/160/?image=355",
          name: "Kana",
          text: "Hello."
        },
        {
          id: "2",
          media: "https://picsum.photos/160/?image=355",
          name: "Kana",
          text: "おなかすいた"
        }
      ]
    }
  ]
};

const useRoom = init => {
  const [currentRoomName, setCurrentRoomName] = useState(init);
  const [currentRoom, setCurrentRoom] = useState({
    id: null,
    name: "",
    history: []
  });

  useEffect(() => {
    const newRoom = data.rooms.filter(v => v.name === currentRoomName)[0];
    setCurrentRoom(newRoom);
  }, [currentRoomName]);

  return { currentRoom, setCurrentRoomName };
};

const App = () => {
  const { currentRoom, setCurrentRoomName } = useRoom("Room A");
  const handleRoom = name => setCurrentRoomName(name);

  const submitForm = e => {
    e.preventDefault();
    alert("WIP🙏");
  };

  return (
    <div className="App">
      <div className="card">
        <aside className="menu">
          {data.rooms.map(v => (
            <li key={v.id} onClick={() => handleRoom(v.name)}>
              {v.name}
            </li>
          ))}
        </aside>

        <main>
          <div className="room">
            <div className="header">{currentRoom.name}</div>
            <div className="history">
              {currentRoom.history.map(v => (
                <Message key={v.id} {...v} />
              ))}
            </div>

            <div className="action-tools">
              <form onSubmit={submitForm}>
                <input />
                <button>submit</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
