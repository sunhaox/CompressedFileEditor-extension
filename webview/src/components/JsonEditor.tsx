import './JsonEditor.css';
import { DownOutlined } from '@ant-design/icons';
import { Component } from 'react';
import { Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import { EventDataNode } from 'antd/es/tree';

interface Props {
  json_data: TreeDataNode[]
}

interface State {
  expand_keys: React.Key[]
}

class JsonEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      expand_keys: ["0-0"]
    }

    this.onCollapseAll = this.onCollapseAll.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.onExpandAll = this.onExpandAll.bind(this);
  }

  render() {
    return (
      <div className='JsonEditor'>
        <div className='JsonEditor-header'>
            <div className='codicon codicon-collapse-all' onClick={this.onCollapseAll}></div>
            <div className='codicon codicon-expand-all' onClick={this.onExpandAll}></div>
        </div>
        <div className='JsonEditor-body'>
            <Tree
            style={{fontFamily: "Consolas, 'Courier New', monospace", minWidth:"400px"}}
            virtual={true}
            showLine
            expandAction='click'
            expandedKeys={this.state.expand_keys}
            switcherIcon={<DownOutlined />}
            treeData={this.props.json_data}
            onExpand={this.onExpand}
          />
        </div>
      </div>
    );
  }

  onCollapseAll() {
    this.setState({expand_keys: []});
    console.log('collapse all');
  }

  onExpand(expandedKeys: React.Key[], info: {
    node: EventDataNode<TreeDataNode>;
    expanded: boolean;
    nativeEvent: MouseEvent;
    }) {
    this.setState({expand_keys: expandedKeys})
  }

  onExpandAll() {
    function expandKeys(json_obj:TreeDataNode[]) {
      let keys: string[] = [];
      for(let item in json_obj){
        keys.push(json_obj[item]["key"].toString());
        if("children" in json_obj[item]) {
          let childrenNode = json_obj[item]["children"];
          if(childrenNode !== undefined)
          {
            keys.push(...expandKeys(childrenNode));
          }
        }
      }
      return keys;
    }
    
    let nodes = this.props.json_data;
    let keys = expandKeys(nodes);
    this.setState({expand_keys: keys})

  }

}

export default JsonEditor;