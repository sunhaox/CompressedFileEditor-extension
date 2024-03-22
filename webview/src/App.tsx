import React, { Component } from 'react';
import './App.css';
import {
  Message,
  COMMAND 
} from './model/message.model';
import HexEditor from './components/HexEditor'
import JsonEditor from './components/JsonEditor';
import { Spin, Input } from 'antd';

interface State {
  hex_data: string[][],
  json_obj: {},
  loading: boolean,
  highlightOffset: number,
  highlightSize: number
}

class App extends Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      hex_data: Array(100).fill(['12', '33', '11', '32', '23', '03', '33', '12', '12', '33', '11', '32', '23', '03', '33', '12']),
      json_obj: {
        "GZIP_FORMAT": {
          "GZIP_HEADER": {
            "ID1": {
              "bit_size": 8,
              "value": 31,
              "description": "fixed value"
            }
          },
          "DEFLATE_BLOCK": [
            {
              "BLOCK_BIT_POSITION": 0,
              "BFINAL": {
                "bit_size": 1,
                "value": 0,
                "description": "last block marker = no"
              }
            }
          ]
        }
      },
      loading: true,
      highlightOffset: 0,
      highlightSize: 0
    };

    this.handleMessage = this.handleMessage.bind(this);
    this.onchangeOffset = this.onchangeOffset.bind(this);
    this.onchangeSize = this.onchangeSize.bind(this);

    window.addEventListener('message', this.handleMessage);
  }

  render() {
    return (
      <>
        <div className='App-loading' style={{display: this.state.loading?"block":'none'}}>
            <Spin tip="Loading">
              <div className="content" />
            </Spin>
          </div>
        <div className="App" style={{display: this.state.loading?"none":'flex'}}>
          <div className='App-frame'>
            <HexEditor hexData={this.state.hex_data} offsetHighlight={this.state.highlightOffset} sizeByteHighlight={this.state.highlightSize}></HexEditor>
          </div>
          <div className='App-frame'>
            <JsonEditor json_data={this.state.json_obj}></JsonEditor>
          </div>
        </div>
        <Input onChange={this.onchangeOffset} />
        <Input onChange={this.onchangeSize} />
      </>
    );
  }

  onchangeOffset(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    console.log(value);
    const val = Number(value);
    this.setState({
      highlightOffset: val
    });
  }

  onchangeSize(e: React.ChangeEvent<HTMLInputElement>) {
    const {value} = e.target;
    console.log(value);
    const val = Number(value);
    this.setState({
      highlightSize: val
    });
  }

  handleMessage(event: MessageEvent) {
    const message = event.data as Message;
    switch (message.command) {
      case COMMAND.testMessageFromExtension: 
        return;
      case COMMAND.hexStringMessage:
        this.setState({hex_data: message.data.message});
        return;
      case COMMAND.jsonStringMessage:
        try {
          let json_obj = JSON.parse(message.data.message)
          this.setState({
            json_obj: json_obj,
            loading: false
          })
        }
        catch (error) {
          // TODO Send error to extension
        }
        return;
    }
  }

}

export default App;
