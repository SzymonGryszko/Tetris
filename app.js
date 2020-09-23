document.addEventListener('DOMContentLoaded', () => {
  
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const restartBtn = document.querySelector('#restart-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    let gameFinished = false;
    const colors = [
      '#ef476f',
      '#ffd166',
      '#06d6a0',
      '#118ab2',
      '#073b4c'
    ];

    restartBtn.addEventListener('click', () => {
      undraw()
      score = 0;
      gameFinished = false;
      for (let i = 0; i < 200; i++) {
        squares[i].classList.remove('tetromino');
        squares[i].classList.remove('taken');
        squares[i].style.backgroundColor = '';
      }

    
      currentPosition = 4;
      currentRotation = 0;
      clearInterval(timerId);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      scoreDisplay.innerHTML = score;
      draw();
      displayShape();
      timerId = setInterval(moveDown, 1000);
    })

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
      ]
    
      const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]
    
      const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
    
      const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ]
    
      const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ]


    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;
    //select random tetromino
    let random = Math.floor(Math.random()*theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    //draw the tetromino
    function draw() {
        current.forEach(index => {
          squares[currentPosition + index].classList.add('tetromino')
          squares[currentPosition + index].style.backgroundColor = colors[random];
        })
      }

    function undraw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundColor = '';
      })
    }


    //functions to Key
    function control(e) {
      if(e.keyCode === 37 && !gameFinished) {
        moveLeft()
      } else if (e.keyCode === 38 && !gameFinished) {
        rotate()
      } else if (e.keyCode === 39 && !gameFinished) {
        moveRight()
      } else if (e.keyCode === 40 && !gameFinished) {
        moveDown()
      }
    }

    document.addEventListener('keydown', control);

    function moveDown() {
      undraw();
      currentPosition += width
      draw();
      freeze();
    }

    //freeze
    function freeze() {
      if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        //start new tetromino
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        gameOver()
      }
    }

    //move to left and block at edge
    function moveLeft() {
      undraw();
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
      
      if(!isAtLeftEdge) currentPosition -= 1

      if(current.some(index => suqares[currentPosition + index].classList.contains('taken'))) {
          currentPosition += 1
      }

      draw();

    }

    //move to right and block at edge
    function moveRight() {
      undraw();
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
      
      if(!isAtRightEdge) currentPosition += 1

      if(current.some(index => suqares[currentPosition + index].classList.contains('taken'))) {
          currentPosition -= 1
      }

      draw();

    }

    function checkRotatedPosition(P){
      P = P || currentPosition
      if ((P+1) % width < 4) {    
        if (isAtRight()){
          currentPosition += 1 
          checkRotatedPosition(P)
          }
      }
      else if (P % width > 5) {
        if (isAtLeft()){
          currentPosition -= 1
        checkRotatedPosition(P)
        }
      }
    }


    //rotate tetromino
    function rotate() {
      undraw();
      currentRotation ++
      if (currentRotation === current.length) {
        currentRotation = 0;
      }
      current = theTetrominoes[random][currentRotation];
      checkRotatedPosition()
      draw();
    }

    //show next tetromino
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    const upNextTetrominoes = [
      [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
      [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
      [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
      [0, 1, displayWidth, displayWidth+1], //oTetromino
      [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    //display in mini-grid
    function displayShape() {
      displaySquares.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
      })
      upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino');
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
      })
    }

    //start button
    startBtn.addEventListener('click',  () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      } else {
        draw();
        timerId = setInterval(moveDown, 1000);
        
        displayShape();
      }
    })

    //add score
    function addScore() {
      for (let i = 0; i < 199; i += width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

        if(row.every(index => squares[index].classList.contains('taken'))) {
          score += 10;
          scoreDisplay.innerHTML = score;
          row.forEach(index => {
            squares[index].classList.remove('taken');
            squares[index].classList.remove('tetromino');
            squares[index].style.backgroundColor = '';
          })
          const squaresRemoved = squares.splice(i, width);
          squares = squaresRemoved.concat(squares)
          squares.forEach(cell => grid.appendChild(cell))
        }
      }
    }

    //game over
    function gameOver() {
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'Game Over!';
        gameFinished = true;
        clearInterval(timerId)
      }
    }



});