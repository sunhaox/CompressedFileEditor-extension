import React, { Component } from 'react';
import './App.css';
import {
  Message,
  COMMAND 
} from './model/message.model';
import HexEditor from './components/HexEditor'
import JsonEditor from './components/JsonEditor';
import { TreeDataNode } from 'antd';

interface State {
  hex_data: string[][],
  json_data: TreeDataNode[]
}

class App extends Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      hex_data: Array(100).fill(['12', '33', '11', '32', '23', '03', '33', '12', '12', '33', '11', '32', '23', '03', '33', '12']),
      json_data: [
        {
          title: 'parent 1',
          key: '0-0',
          children: [
            {
              title: 'parent 1-0',
              key: '0-0-0',
              children: [
                {
                  title: 'leaf',
                  key: '0-0-0-0',
                },
                {
                  title: 'leaf1',
                  key: '0-0-0-1',
                },
              ],
            },
            {
              title: "123",
              key: '0-0-1',
            },
          ],
        },
      ]
    };

    this.handleMessage = this.handleMessage.bind(this);

    window.addEventListener('message', this.handleMessage);
  }

  render() {
    return (
      <div className="App">
        <div className='App-frame'>
          <HexEditor hexData={this.state.hex_data}></HexEditor>
        </div>
        <div className='App-frame'>
          <JsonEditor json_data={this.state.json_data}></JsonEditor>
        </div>
      </div>
    );
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
        this.setState({json_data: this.convertJsonToTreeNode(JSON.parse(message.data.message))});
        return;
    }
  }

  convertJsonToTreeNode(json_object: {[key: string]: any}, index="0") {
    let root: TreeDataNode[] = [];
    let i = 0;
    for(const key in json_object) {
      if(typeof json_object[key] === 'string') {
        root.push({
          title: <span>"{key}" : <span style={{color: "rgb(203, 75, 22)"}}>"{json_object[key]}"</span></span>,
          key: index + "-" + i.toString()
        })
      }
      else if (typeof json_object[key] === 'number') {
        root.push({
          title: <span>"{key}" : <span style={{color: "rgb(38, 139, 210)"}}>{json_object[key]}</span></span>,
          key: index + "-" + i.toString()
        })
      }
      else if (typeof json_object[key] === 'object') {
        let children = this.convertJsonToTreeNode(json_object[key], index + "-" + i.toString());
        root.push({
          title: <span>"{key}" :</span>,
          key: index + "-" + i.toString(),
          children: children
        })
      }
      i++;
    }
    return root;
  }
}

export default App;
