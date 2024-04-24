import './JsonEditor.css';
import { DownOutlined } from '@ant-design/icons';
import { Component } from 'react';
import { Tree, Input, Alert} from 'antd';
import type { TreeDataNode } from 'antd';
import { EventDataNode } from 'antd/es/tree';

interface Props {
  json_data: {}|undefined,
  onChangeOffset: (offset: number, size: number) => void
}

interface State {
  expand_keys: React.Key[],
  tree_data: TreeDataNode[],
  autoExpandParent: boolean,
  jsonDisplay: boolean
}

class JsonEditor extends Component<Props, State> {
  bit_info = new Map();
  bit_cnt = 0;

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
      autoExpandParent: true,
      jsonDisplay: true
    }

    this.onCollapseAll = this.onCollapseAll.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.onExpandAll = this.onExpandAll.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
      if(this.props.json_data !== prevProps.json_data) {
        this.updateJsonData(this.props.json_data);
      }
  }

  render() {
    return (
      <>
        <div className='JsonEditor' style={{display: this.state.jsonDisplay?"block":"none"}}>
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
            autoExpandParent={this.state.autoExpandParent}
            expandAction='doubleClick'
            expandedKeys={this.state.expand_keys}
            switcherIcon={<DownOutlined />}
            treeData={this.state.tree_data}
            onExpand={this.onExpand}
            onSelect={this.onSelect}
            />
            
          </div>
        </div>
        <Alert message="JSON Error" description="The JSON file is not created or it can not be translated to standard JSON object." type="error" style={{display:this.state.jsonDisplay?"none":"block"}} />
      </>
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
    this.setState({
      expand_keys: expandedKeys,
      autoExpandParent: false
    });
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

  updateJsonData(json_data: {}|undefined) {
    if (json_data === undefined) {
      this.setState({jsonDisplay: false});
      return;
    }
    this.bit_cnt = 0;
    let rst = this.convertJsonToTreeNode(json_data);
    this.setState({
      tree_data: rst.nodes,
      jsonDisplay: true
    });
  }

  convertJsonToTreeNode(json_object: {[key: string]: any}, search_val="", index="0") {
    let root: TreeDataNode[] = [];
    let keys: string[] = [];
    let i = 0;

    let bit_size:number|undefined;
    let block_bit_begin: number|undefined;
    let block_bit_size: number|undefined;

    for(const json_key in json_object) {
      let title_str = json_key;
      let title = <>{title_str}</>
      if (search_val !== "" && title_str.indexOf(search_val) > -1) {
        const indexOf = title_str.indexOf(search_val);
        const beforeStr = title_str.substring(0, indexOf);
        const afterStr = title_str.slice(indexOf + search_val.length);
        title = <>{beforeStr}<span style={{backgroundColor: "#ffffcc"}}>{search_val}</span>{afterStr}</>
        keys.push(index + "-" + i.toString());
      }
      if(typeof json_object[json_key] === 'string') {
        root.push({
          title: <span>"{title}" : <span style={{color: "rgb(203, 75, 22)"}}>"{json_object[json_key]}"</span></span>,
          key: index + "-" + i.toString()
        })
      }
      else if (typeof json_object[json_key] === 'number') {
        if (json_key === "value")
        {
          if(bit_size === undefined)
          {
            root.push({
              title: <span>"{title}" : <span style={{color: "rgb(38, 139, 210)"}}>{json_object[json_key]}</span> <span style={{color: "#aaaaaa"}}>0x{json_object[json_key].toString(16).padStart(2, '0')}</span></span>,
              key: index + "-" + i.toString()
            })
          }
          else {
            root.push({
              title: <span>"{title}" : <span style={{color: "rgb(38, 139, 210)"}}>{json_object[json_key]}</span> <span style={{color: "#aaaaaa"}}>0x{json_object[json_key].toString(16).padStart(Math.ceil(bit_size/4), '0').replace(/(.{2})/g, '$1 ')}</span></span>,
              key: index + "-" + i.toString()
            })
          }
        }
        else {
          root.push({
            title: <span>"{title}" : <span style={{color: "rgb(38, 139, 210)"}}>{json_object[json_key]}</span></span>,
            key: index + "-" + i.toString()
          })
        }
      }
      else if (typeof json_object[json_key] === 'object') {
        let rst = this.convertJsonToTreeNode(json_object[json_key], search_val, index + "-" + i.toString());
        root.push({
          title: <span>"{title}" :</span>,
          key: index + "-" + i.toString(),
          children: rst.nodes
        })
        keys.push(...rst.keys);

        if (rst.bit_size !== undefined)
        {
          this.bit_info.set(index + "-" + i.toString(), {bit_num: this.bit_cnt, bit_size: rst.bit_size});
          this.bit_cnt += rst.bit_size;
        }
      }

      if(json_key === "bit_size"){
        bit_size = json_object[json_key];
      }
      else if (json_key === "BLOCK_BIT_POSITION") {
        block_bit_begin = this.bit_cnt;
      }
      else if (json_key === "BLOCK_BIT_SIZE") {
        block_bit_size = json_object[json_key];
      }

      i++;
    }

    if(block_bit_begin && block_bit_size) {
      this.bit_cnt = block_bit_begin;
      bit_size = block_bit_size;
    }
    return {nodes: root, keys: keys, bit_size: bit_size};
  }

  onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (this.props.json_data === undefined) {
      return;
    }
    const { value } = e.target;
    this.bit_cnt = 0;
    let rst = this.convertJsonToTreeNode(this.props.json_data, value)
    this.setState({
      tree_data: rst.nodes,
      expand_keys: rst.keys,
      autoExpandParent: true
    })
  }

  onSelect(selectedKeys: React.Key[], info: {
    event: "select";
    selected: boolean;
    node: EventDataNode<TreeDataNode>;
    selectedNodes: TreeDataNode[];
    nativeEvent: MouseEvent;
  }) {
    console.log(`select key: ${selectedKeys}`);
    if(this.bit_info.has(selectedKeys.toString())) {
      let bit_info = this.bit_info.get(selectedKeys.toString());
      console.log(`bit_num: ${bit_info.bit_num}; bit_size: ${bit_info.bit_size}`);
      this.props.onChangeOffset(bit_info.bit_num, bit_info.bit_size);
    }
    else {
      console.log('no info');
      // clear the highlight setting.
      this.props.onChangeOffset(0, 0);
    }
    
  }

}

export default JsonEditor;