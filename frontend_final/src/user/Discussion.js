import { isAuthenticated } from '../backEnd';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import TextField from '@material-ui/core/TextField';
import Layout from '../main/Layout';

const socket = io.connect('http://localhost:4000');

export default function Discussion() {
  const {
    user: { _id, name, email, role },
  } = isAuthenticated();
  const [state, setStaet] = useState({ message: '', name });
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('message', ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
  });

  const onTextChange = (e) => {
    setStaet({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    const { name, message } = state;
    socket.emit('message', { name, message });
    setStaet({ message: '', name });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h4>
          {name}: <span>{message}</span>
        </h4>
      </div>
    ));
  };

  return (
    <Layout
      title="Discussion Board"
      description="Please disucssing with other users"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-4">
          <div className="render-chatsmall">
            <form onSubmit={onMessageSubmit}>
              <h2>
                Hi,{' '}
                <span role="img" aria-label="sheep">
                  🤨
                </span>{' '}
                {name}
              </h2>
              <p>Please type your message</p>

              <div>
                <TextField
                  name="message"
                  onChange={(e) => onTextChange(e)}
                  value={state.message}
                  id="outlined-multiline-static"
                  variant="outlined"
                  label="Message"
                />
              </div>
              <button className=" badge-info">
                Send{' '}
                <span role="img" aria-label="send">
                  ▶︎
                </span>
              </button>
            </form>
          </div>
        </div>

        <div className="col-8 ">
          <div className="render-chat">
            <h1>
              <span class="badge badge-primary">Chat Board</span>
            </h1>
            {renderChat()}
          </div>
        </div>
      </div>
    </Layout>
  );
}
