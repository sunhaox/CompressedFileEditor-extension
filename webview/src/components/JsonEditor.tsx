import './JsonEditor.css';
import { DownOutlined } from '@ant-design/icons';
import { Component } from 'react';
import { Tree } from 'antd';
import type { TreeDataNode } from 'antd';

interface Props {
  json_data: TreeDataNode[]
}

interface State {
  expand_keys: string[]
}

class JsonEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      expand_keys: []
    }

    this.collapseAll = this.collapseAll.bind(this);
  }

  render() {
    return (
      <div className='JsonEditor'>
        <div className='JsonEditor-header'>
            <div className='codicon codicon-collapse-all' onClick={this.collapseAll}></div>
            <div className='codicon codicon-expand-all'></div>
        </div>
        <div className='JsonEditor-body'>
            <Tree
            style={{fontFamily: "Consolas, 'Courier New', monospace", minWidth:"400px"}}
            virtual={true}
            showLine
            expandAction='click'
            switcherIcon={<DownOutlined />}
            treeData={this.props.json_data}
          />
        </div>
      </div>
    );
  }

  collapseAll() {

    this.setState({expand_keys: []});
    console.log('collapse all');
  }
}

export default JsonEditor;