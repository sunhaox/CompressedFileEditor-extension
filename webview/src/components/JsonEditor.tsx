import './JsonEditor.css';
import { DownOutlined } from '@ant-design/icons';
import { Component } from 'react';
import { Tree, Input} from 'antd';
import type { TreeDataNode } from 'antd';
import { EventDataNode } from 'antd/es/tree';

interface Props {
  json_data: {}
}

interface State {
  expand_keys: React.Key[],
  tree_data: TreeDataNode[]
}

class JsonEditor extends Component<Props, State> {
  data_list = {};

  constructor(props: Props) {
    super(props);
    
    this.state = {
      expand_keys: ["0-0"],
      tree_data: [
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
      ],
    }

    this.onCollapseAll = this.onCollapseAll.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.onExpandAll = this.onExpandAll.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
      if(this.props.json_data !== prevProps.json_data) {
        this.updateJsonData(this.props.json_data);
      }
  }

  render() {
    return (
      <div className='JsonEditor'>
        <div className='JsonEditor-header'>
          <Input size='small' placeholder="Search" onChange={this.onSearchChange} />
          <div className='codicon codicon-collapse-all' onClick={this.onCollapseAll}></div>
          <div className='codicon codicon-expand-all' onClick={this.onExpandAll}></div>
        </div>
        <div className='JsonEditor-body'>
          <Tree
          style={{fontFamily: "Consolas, 'Courier New', monospace", minWidth:"400px"}}
          virtual={true}
          showLine
          autoExpandParent={true}
          expandAction='click'
          expandedKeys={this.state.expand_keys}
          switcherIcon={<DownOutlined />}
          treeData={this.state.tree_data}
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
    
    let nodes = this.state.tree_data;
    let keys = expandKeys(nodes);
    this.setState({expand_keys: keys})

  }

  updateJsonData(json_data: {}) {
    let rst = this.convertJsonToTreeNode(json_data);
    this.setState({tree_data: rst.nodes});
  }

  convertJsonToTreeNode(json_object: {[key: string]: any}, search_val="", index="0") {
    let root: TreeDataNode[] = [];
    let keys: string[] = [];
    let i = 0;
    for(const json_key in json_object) {
      let title_str = json_key;
      let title = <>{title_str}</>
      if (search_val !== "" && title_str.indexOf(search_val) > -1) {
        const indexOf = title_str.indexOf(search_val);
        const beforeStr = title_str.substring(0, indexOf);
        const afterStr = title_str.slice(indexOf + search_val.length);
        title = <>{beforeStr}<span style={{color: "#ff5500"}}>{search_val}</span>{afterStr}</>
        keys.push(index + "-" + i.toString());
      }
      if(typeof json_object[json_key] === 'string') {
        root.push({
          title: <span>"{title}" : <span style={{color: "rgb(203, 75, 22)"}}>"{json_object[json_key]}"</span></span>,
          key: index + "-" + i.toString()
        })
      }
      else if (typeof json_object[json_key] === 'number') {
        root.push({
          title: <span>"{title}" : <span style={{color: "rgb(38, 139, 210)"}}>{json_object[json_key]}</span></span>,
          key: index + "-" + i.toString()
        })
      }
      else if (typeof json_object[json_key] === 'object') {
        let rst = this.convertJsonToTreeNode(json_object[json_key], search_val, index + "-" + i.toString());
        root.push({
          title: <span>"{title}" :</span>,
          key: index + "-" + i.toString(),
          children: rst.nodes
        })
        keys.push(...rst.keys);
      }
      i++;
    }
    return {nodes: root, keys: keys};
  }

  onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    let rst = this.convertJsonToTreeNode(this.props.json_data, value)
    this.setState({
      tree_data: rst.nodes,
      expand_keys: rst.keys
    })
  }

}

export default JsonEditor;