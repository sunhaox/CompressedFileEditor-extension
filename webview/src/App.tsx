import React, { Component } from 'react';
import './App.css';
import { vscode } from './utils/vscode';
import {
  Button
} from 'antd'
import ReactJson from '@microlink/react-json-view'
import { 
  MessageFromWebview, 
  Message,
  COMMAND 
} from './model/message.model';
import HexDump from './components/HexDump'

interface State {
  hex_data: string[][];
}

class App extends Component<{}, State> {
  my_json_object = {};

  constructor(props: {}) {
    super(props);
    this.state = {
      hex_data: [['12', '33', '11', '32', '23', '03', '33', '12', '12', '33', '11', '32', '23', '03', '33', '12'],
                ['12', '33', '11', '32', '23', '03', '33', '12', '12', '33', '11', '32', '23', '03', '33', '12'],
                ['12', '33', '11', '32', '23', '03', '33', '12', '12', '33', '11']]
    };

    this.handleMessage = this.handleMessage.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);

    window.addEventListener('message', this.handleMessage);

    this.my_json_object = {
      "key": "value",
      "number": 123,
      "obj": {
        'string': "1233",
        'number': 1233,
        'bool': true
      }
    }
  }

  render() {
    return (
      <div className="App">
        <div className='App-frame'>
          <HexDump hexData={this.state.hex_data}></HexDump>
        </div>
        <div className='App-frame'>
          <ReactJson src={this.my_json_object} />
        </div>
        <div className='App-frame'>
          <Button onClick={this.handleBtnClick}>Click</Button>
        </div>
      </div>
    );
  }

  handleBtnClick() {
    
    let new_data = [['12', '33', '11', '32', '23', '03', '33', '12', '12', '33', '11', '32', '23', '03', '33', '12'],
                     ['11', '32', '23', '03', '33', '12', 'ab', '12', '12', '33', '11', '32', '23', '03', '33', '12'],
                     ['12', '33', '11', '32', '23', '03', '33', '12', '12', '33', '11']];
    this.setState({hex_data: new_data});
  }

  handleMessage(event: MessageEvent) {
    const message = event.data as Message;
    switch (message.command) {
      case COMMAND.testMessageFromExtension: 
        return;
      case COMMAND.hexStringMessage:
        this.setState({hex_data: message.data.message});
    }
  }
}

export default App;
