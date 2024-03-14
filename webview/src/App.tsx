import React from 'react';
import logo from './logo.svg';
import './App.css';
import { vscode } from './utils/vscode';
import {
  VSCodeButton
} from '@vscode/webview-ui-toolkit/react'
import { 
  TestMessage, 
  COMMAND 
} from './model/message.model';

function App() {
  return (
    <div className="App">
      <div>
        <VSCodeButton onClick={handleBtnClick}>
          Test
        </VSCodeButton>
      </div>
    </div>
  );
}

function handleBtnClick() {
  const message: TestMessage = {
    command: COMMAND.testMessage,
    data: {
      message: "test message"
    },
  };
  vscode.postMessage(message);
}

export default App;
