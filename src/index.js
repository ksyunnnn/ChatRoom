import React, { useState, useEffect, useRef } from "react";
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

const useInput = init => {
  const [value, setValue] = useState(init);
  const handleValue = e => {
    setValue(e.target.value);
  };

  return {
    value,
    onChange: handleValue
  };
};

const useHistory = roomId => {
  const [history, setHistory] = useState([]);

  const getHistory = roomId => {
    setHistory(data.rooms.filter(v => v.id === roomId)[0].history);
  };

  const addHistory = text => {
    const newMessage = {
      id: new Date().getUTCMilliseconds(),
      media: "https://picsum.photos/160/?image=355",
      name: "U",
      text
    };
    setHistory(pre => [...pre, newMessage]);
  };

  useEffect(() => {
    getHistory(roomId);
  }, [roomId]);

  return {
    history,
    addHistory
  };
};

const useRoom = initRoomId => {
  const [currentRoomId, setCurrentRoomId] = useState(initRoomId);
  const [currentRoom, setCurrentRoom] = useState({
    id: null,
    name: "",
    history: []
  });

  const selectCurrentRoom = roomId => setCurrentRoomId(roomId);

  const { history: currentHistory, addHistory: addCurrentHistory } = useHistory(
    currentRoomId
  );

  useEffect(() => {
    const newRoom = data.rooms.filter(v => v.id === currentRoomId)[0];
    setCurrentRoom(newRoom);
  }, [currentRoomId]);

  return { currentRoom, selectCurrentRoom, currentHistory, addCurrentHistory };
};

const App = () => {
  const {
    currentRoom,
    selectCurrentRoom,
    currentHistory,
    addCurrentHistory
  } = useRoom("1");

  const messageInput = useInput("");
  const textareaEl = useRef(null);

  const [submittable, setSubmittable] = useState(false);
  useEffect(() => {
    setSubmittable(
      messageInput.value !== "" &&
        messageInput.value.replace(/\s/g, "").length > 0
    );
  }, [messageInput.value]);

  const submitForm = e => {
    e.preventDefault();
    if (!submittable) return;
    addCurrentHistory(messageInput.value);
    messageInput.onChange({ target: { value: "" } });
  };

  const enterSubmit = e => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault(); // preventDefaultしないと改行が残ってしまう
      submitForm(e);
    }
  };

  return (
    <div className="App">
      <div className="card">
        <aside className="menu">
          {data.rooms.map(v => (
            <li
              key={v.id}
              onClick={() => {
                selectCurrentRoom(v.id);
                textareaEl.current.focus();
              }}
            >
              {v.name}
            </li>
          ))}
        </aside>

        <main>
          <div className="room">
            <div className="header">{currentRoom.name}</div>
            <div className="history">
              {currentHistory.map(v => (
                <Message key={v.id} {...v} />
              ))}
            </div>

            <div className="action-tools">
              <form onSubmit={submitForm}>
                <textarea
                  {...messageInput}
                  onKeyDown={enterSubmit}
                  ref={textareaEl}
                />
                <button disabled={!submittable}>submit</button>
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
