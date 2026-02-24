var boardEl = document.getElementById('board');
var statusEl = document.getElementById('status');
var chess = new Chess();
var selected = null;

var piecesSymbol = {
  r:"♜", n:"♞", b:"♝", q:"♛", k:"♚", p:"♟",
  R:"♖", N:"♘", B:"♗", Q:"♕", K:"♔", P:"♙"
};

function drawBoard(){
  boardEl.innerHTML='';
  for(var r=0;r<8;r++){
    for(var c=0;c<8;c++){
      var square = document.createElement('div');
      square.classList.add('square');
      square.classList.add((r+c)%2===0?'light':'dark');
      square.dataset.row=r;
      square.dataset.col=c;
      var piece = chess.getBoard()[r][c];
      if(piece) square.textContent = piecesSymbol[piece];
      square.onclick=function(){
        clickSquare(parseInt(this.dataset.row),parseInt(this.dataset.col));
      };
      boardEl.appendChild(square);
    }
  }
  statusEl.textContent="Turn: "+(chess.getTurn()==='w'?'White':'Black');
}

function clickSquare(r,c){
  if(selected){
    if(chess.move([selected.r,selected.c],[r,c])) selected=null;
    drawBoard();
    return;
  }
  var piece = chess.getBoard()[r][c];
  if(piece && ((chess.getTurn()==='w' && piece===piece.toUpperCase())||(chess.getTurn()==='b' && piece===piece.toLowerCase()))){
    selected={r,c};
  }
}

drawBoard();
