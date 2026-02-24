const board = document.getElementById("board");
const info = document.getElementById("info");
const rollBtn = document.getElementById("rollBtn");

const SIZE = 15;
let cells = [];

for (let i = 0; i < SIZE * SIZE; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  board.appendChild(cell);
  cells.push(cell);
}

// -------- PATH (REAL 52 TILE LOOP) --------
const pathIndexes = [
  6,7,8,9,10,11,12,
  27,42,57,72,87,
  102,103,104,105,106,107,108,
  123,138,153,168,183,
  198,197,196,195,194,193,192,
  177,162,147,132,117,
  116,115,114,113,112,111,110,
  95,80,65,50,35,
  20,21,22,23,24
];

// Mark path visually
pathIndexes.forEach(i=>{
  cells[i].classList.add("path");
});

// Safe squares
const safeSpots = [6, 102, 198, 116];
safeSpots.forEach(i=>cells[i].classList.add("safe"));

// -------- PLAYERS --------
const colors = ["red","green","yellow","blue"];
let turnIndex = 0;
let diceValue = 0;
let canMove = false;

let players = {};

colors.forEach((color, i)=>{
  players[color] = {
    startIndex: i*13,
    tokens: [
      {pos:-1},
      {pos:-1},
      {pos:-1},
      {pos:-1}
    ]
  };
});

// -------- TOKEN RENDER --------
function render(){
  document.querySelectorAll(".token").forEach(t=>t.remove());

  colors.forEach(color=>{
    players[color].tokens.forEach((token, index)=>{
      let position;

      if(token.pos === -1){
        position = getHomePosition(color,index);
      } else {
        position = pathIndexes[(players[color].startIndex + token.pos) % 52];
      }

      const t = document.createElement("div");
      t.classList.add("token");
      t.style.background = color;
      t.style.top = "4px";
      t.style.left = "4px";

      if(color === colors[turnIndex] && canMove){
        t.onclick = ()=>moveToken(color,index);
      }

      cells[position].appendChild(t);
    });
  });
}

// -------- HOME POSITIONS --------
function getHomePosition(color,index){
  const map = {
    red:[0,1,15,16],
    green:[13,14,28,29],
    yellow:[195,196,210,211],
    blue:[182,183,197,198]
  };
  return map[color][index];
}

// -------- ROLL DICE --------
rollBtn.onclick = ()=>{
  diceValue = Math.floor(Math.random()*6)+1;
  info.innerText = colors[turnIndex].toUpperCase()+" rolled "+diceValue;
  canMove = true;
};

// -------- MOVE TOKEN --------
function moveToken(color,index){
  if(!canMove) return;

  let token = players[color].tokens[index];

  if(token.pos === -1){
    if(diceValue === 6){
      token.pos = 0;
    } else return;
  } else {
    token.pos += diceValue;
    if(token.pos >= 52){
      token.pos = -1; // simple finish reset
    }
  }

  checkCapture(color,index);

  if(diceValue !== 6){
    turnIndex = (turnIndex+1)%4;
  }

  canMove = false;
  render();
}

// -------- CAPTURE --------
function checkCapture(color,index){
  let token = players[color].tokens[index];
  let globalPos = pathIndexes[(players[color].startIndex + token.pos)%52];

  colors.forEach(other=>{
    if(other === color) return;

    players[other].tokens.forEach(t=>{
      if(t.pos >= 0){
        let otherPos = pathIndexes[(players[other].startIndex + t.pos)%52];
        if(otherPos === globalPos && !safeSpots.includes(globalPos)){
          t.pos = -1;
        }
      }
    });
  });
}

render();
