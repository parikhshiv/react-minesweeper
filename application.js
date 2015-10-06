var React = window.React;

var Game = React.createClass({
  getInitialState: function(){
    var board = new window.Minesweeper.Board(8, 8);
    return {board: board, gameOver: false, gameWon: false};
  },

  updateGame: function(pos, flag){
    var tile = this.state.board.grid[pos[0]][pos[1]];
    if (flag) {
      tile.toggleFlag();
    } else {
      tile.explore();
    }
    if (this.state.board.won()) {
      this.setState({board: this.state.board, gameOver: true, gameWon: true});
      alert("NICE WORK CHIEF");
      setTimeout(function() {location.reload();}, 1000);
    } else if (this.state.board.lost()) {
      this.setState({board: this.state.board, gameOver: true, gameWon: false});
      alert("PREPARE YOURSELF FOR NUCLEAR WINTER");
      setTimeout(function() {location.reload();}, 1000);
    } else {
      this.setState({board: this.state.board, gameOver: false, gameWon: false});
    }
  },

  render: function(){
    return (
      <Board board={this.state.board} updated={this.updateGame}></Board>
    );
  }
});

var Board = React.createClass({
  render: function () {
    var that=this;
    // debugger;
    return (
      <div className="board">
      {that.props.board.grid.map(function(el, idx) {
        return (<div className="row" key={idx}>
          {el.map(function(el2, idx2) {
            return <Tile key={idx2} tile={el2} pos={[idx, idx2]}
                        updated={that.props.updated} lost={that.props.board.lost()}/>;
          })}
          </div>);
        })}
        </div>
      );
    }
  });

var Tile = React.createClass({
  getInitialState: function(){
    return {display: "_",
            status: "none"};
  },

  handleClick: function (e) {
    this.props.updated(this.props.pos, e.altKey);
  },

  render: function () {
    var tiles = this.props.tile;
    var display; var status;
    if (tiles.bombed && !tiles.flagged && (tiles.explored || this.props.lost)) {
      display =  "💣";
      status = "bombed";
    } else if (tiles.flagged) {
      display = "⚑";
      status = "flagged";
      if (this.props.lost && !tiles.bombed) {
        display = tiles.adjacentBombCount();
        status="bombed";
      }
    } else if (tiles.explored) {
      display = tiles.adjacentBombCount();
      status = "explored";
    } else {
      display = "_";
    }
    return <div onClick={this.handleClick} className={"tile " + status}>{display}</div>;
  }
});

React.render(<Game/>, document.getElementById('minesweeper'));
