import './HexEditor.css';
import { Component } from 'react';

interface State {
  hexData: string[][];
}

class HexEditor extends Component<State> {

  render() {
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
        <div className='HexEditor-body'>
        {
          this.props.hexData.map((hexArray, index) => (
            <div>
              <span className='HexEditor-col-header'>{(16 * index).toString(16).padStart(8, '0')}</span>
              {
                hexArray.map(hex => (
                  <span>{hex}</span>
                  ))
              }
            </div>
          ))
        }
        </div>
      </div>
    );
  }
}

export default HexEditor;