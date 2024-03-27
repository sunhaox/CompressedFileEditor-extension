import './HexEditor.css';
import React, { Component } from 'react';

interface Props {
  hexData: string[][],
  offsetHighlight: number,
  sizeByteHighlight: number
}

interface State {
  popover_display: string,
  popover_left: number,
  popover_top: number,
  popover_str: string
}

class HexEditor extends Component<Props, State> {
  private myRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      popover_display: "none",
      popover_left: 0,
      popover_top: 0,
      popover_str: ""
    }

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.myRef = React.createRef<HTMLDivElement>();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
      if (prevProps.offsetHighlight !== this.props.offsetHighlight) {
        this.scrollToAnchor();
      }
  }

  scrollToAnchor() {
    const anchor = document.getElementById('HexEditor-anchor');
    const newTop = anchor?.offsetTop;
    if (this.myRef && this.myRef.current && newTop) {
      this.myRef.current.scrollTo(0, newTop-20);
      console.log(`scroll: ${newTop}`);
    }
  }

  render() {
    var flag = 0;
    return (
      <div className='HexEditor'>
        <div className='HexEditor-header'>
          <span className='HexEditor-col-header'>00000000</span>
          <span>00</span>
          <span>01</span>
          <span>02</span>
          <span>03</span>
          <span>04</span>
          <span>05</span>
          <span>06</span>
          <span>07</span>
          <span>08</span>
          <span>09</span>
          <span>0A</span>
          <span>0B</span>
          <span>0C</span>
          <span>0D</span>
          <span>0E</span>
          <span>0F</span>
        </div>
        <div className='HexEditor-body' ref={this.myRef}>
        {
          this.props.hexData.map((hexArray, index) => (
            <div>
              <span className='HexEditor-col-header'>{(16 * index).toString(16).padStart(8, '0')}</span>
              {
                hexArray.map((hex, i) => (
                  ( (16*index+i)>=this.props.offsetHighlight && 
                    (16*index+i) < this.props.offsetHighlight + this.props.sizeByteHighlight)?
                    ( 
                      !flag++?
                      <span className='HexEditor-highlight' id='HexEditor-anchor' onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>{hex}</span>:
                      <span className='HexEditor-highlight' onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>{hex}</span>
                    ):
                    <span onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>{hex}</span>
                  ))
              }
            </div>
          ))
        }
        </div>
        <div className='HedEditor-popover' style={{
          display: this.state.popover_display, 
          left: this.state.popover_left, 
          top: this.state.popover_top
          }}>
          {this.state.popover_str}
        </div>
      </div>
    );
  }

  onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const element = event.currentTarget;
    const value = element.innerText;
    const pos = element.getBoundingClientRect();
    const left = pos.left;
    const top = pos.top;
    const bin_str = parseInt(value, 16).toString(2).padStart(8, '0').replace(/(.{4})/g, '$1 ')
    console.log(`enter: ${value}`);
    this.setState({
      popover_display: 'block',
      popover_left: left,
      popover_top: top-45,
      popover_str: bin_str
    })
  }

  onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const element = event.currentTarget;
    const value = element.innerText;
    console.log(`leave: ${value}`);
    this.setState({
      popover_display: 'none'
    })
  }
}

export default HexEditor;