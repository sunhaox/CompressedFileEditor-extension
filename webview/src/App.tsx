import React, { Component } from 'react';
import './App.css';
import { vscode } from './utils/vscode';
import {
  VSCodeButton,
  VSCodeTextArea
} from '@vscode/webview-ui-toolkit/react'
import { 
  MessageFromWebview, 
  Message,
  COMMAND 
} from './model/message.model';

interface State {
  textAreaValue: string;
}

class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      textAreaValue: ''
    };

    this.handleMessage = this.handleMessage.bind(this);

    window.addEventListener('message', this.handleMessage);
  }

  render() {
    return (
      <div className="App">
        <div>
          <VSCodeTextArea placeholder='will show the message' readOnly value={this.state.textAreaValue}>
          </VSCodeTextArea>
          <br/>
          <VSCodeButton onClick={this.handleBtnClick}>
            Send Message To Extension
          </VSCodeButton>
        </div>
      </div>
    );
  }

  handleBtnClick() {
    const message: MessageFromWebview = {
      command: COMMAND.testMessageFromWebview,
      data: {
        message: "test message"
      },
    };
    vscode.postMessage(message);
  }

  handleMessage(event: MessageEvent) {
    const message = event.data as Message;
    switch (message.command) {
      case COMMAND.testMessageFromExtension: 
        this.setState({
          textAreaValue: message.data.message
        })
        return;
    }
  }
}

export default App;
