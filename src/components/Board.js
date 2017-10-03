import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class Square extends React.Component {
  constructor() {
    super();
    this.state = {
      value: null,
    };
    
  }

  render() {
    let stroke;
    if(this.props.value === 'B')
      stroke = <img className='stroke' src='black.png' alt="B" />;
    else if (this.props.value === 'W')
      stroke = <img className='stroke' src='white.png' alt="W" />;
    else 
      stroke = null;

    return(
      <button className="square" onClick={() => this.props.onClick()}>
        {stroke}
      </button>
    );
  }
}

export default class Board extends React.Component {
  renderSquare(i) {
    return <Square 
      key= {i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />;
  }

  render() {
    let squares = [];
    let row   = [];

    //init board by nested loop and set length by 3
    for(var i=0;i<15;i++){
      row = [];
      for(var j=0;j<15;j++){
        row.push(this.renderSquare(i*15+j));
      }
      squares.push(<div key={i} className='board-row'>{row}</div>)
    }

    return (
      <div>
        {squares}
      </div>
    );
  }
}

