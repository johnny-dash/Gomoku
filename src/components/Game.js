import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Board from './Board.js'
import _ from 'underscore'


export default class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(225).fill(null),
        latestMove: null,
        turn : null
      }],
      stepNumber: 0,
      whitePlayerSteps: [],
      balckPlayerSteps: [], 
      xIsNext: true,
    }
  }

  handleClick (i){
    //The slice() method returns a shallow copy of a portion of an array into a new array object selected from begin to end (end not included). The original array will not be modified.
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    //pop the step in to player step queue
    if(this.state.xIsNext){
      this.state.balckPlayerSteps.push({x: i % 15, y: Math.floor(i / 15)});
    } else {
      this.state.whitePlayerSteps.push({x: i % 15, y: Math.floor(i / 15)});
    }

    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'B' : 'W';
    this.setState({
      history: history.concat([{
        squares: squares,
        latestMove: i,
        turn: !this.state.xIsNext,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner  = calculateWinner(current.squares);

    const moves   = history.map((step, move) => {
      var x = step.latestMove % 15 + 1;
      var y = Math.floor(step.latestMove / 15) + 1;
      const desc = move ? (step.turn ? 'White' : 'Black') + ' move (' + x + ',' + y +')' : 'Game start';
      return (
        <li key={move}>
          <a href= '#' onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });
    
    let status;
    if(winner){
      status         = 'Winner: ' + (this.state.xIsNext ? 'White Player' : 'Black Player');
      var cheers     = <div className='celebration'><div className='windowTitle'>{status}</div><div className="btn-custom"><a href="/">Play Again!</a></div></div>;  
    } else {
      status         = 'Next player: ' + (this.state.xIsNext ? 'Black Player' : 'White Player');
    }

    return(
      <div className='game'>
        <div className='title'>
          <span>Go Bang</span>
        </div>
        <div className='game-board'>
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className='game-info'>
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
        {cheers}
      </div>
    );
  }
}



function calculateWinner(squares) {
  var board = new Array(15);
  for(var i =0;i<15;i++){
    board[i] = new Array(15);
    for(var j=0;j<15;j++){
      board[i][j] = squares[i*15+j];
    }
  }

  //detact the horizontal lines
  for(var i =0;i<15;i++){
    var line = board[i].join('');
    var pattern = /(B{5,5})|(W{5,5})/;
    if(pattern.test(line)){
      return true;
    }
  }

  //detact the Vertical lines
  //Zip is function in underscore library that could transpose 2D array
  var tranposeBoard = _.zip.apply(_,board);
  for(var i =0;i<15;i++){
    var line = tranposeBoard[i].join('');
    var pattern = /(B{5,5})|(W{5,5})/;
    if(pattern.test(line)){
      return true;
    }
  }

  //detact the diagonal lines
  if(diagonalShift(board)) return true;
  
  var rotateBoard = matrixRotation(board);
  if(diagonalShift(rotateBoard)) return true;

  return null;
}

//get the diagonal line for a matrix
function diagonalShift(arr){
  var summax = arr.length + arr[0].length - 1; // max index of diagonal matrix
  var rotated = []; // initialize to an empty matrix of the right size
  for( var i=0 ; i<summax ; ++i ) rotated.push([]);
  // Fill it up by partitioning the original matrix.
  for( var j=0 ; j<arr[0].length ; ++j )
      for( var i=0 ; i<arr.length ; ++i ) rotated[i+j].push(arr[i][j]);
  
  for( var i=0 ; i<summax ; ++i ){
    var line = rotated[i].join('');
    var pattern = /(B{5,5})|(W{5,5})/;
    if(pattern.test(line)){
      return true;
    }
  }
  return false;
}

//rotate the matrix by 90 degree
function matrixRotation(arr){
  var rotate = new Array(15);
  for(var i =0;i<15;i++){
    rotate[i] = new Array(15);
    for(var j=0;j<15;j++){
      rotate[i][j] = arr[14-i][j];
    }
  }

  return rotate;
}


