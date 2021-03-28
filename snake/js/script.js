window.onload = function () {
    //GLOBAL
    var canvas  = document.querySelector("#game_canvas");
    var context = canvas.getContext("2d");
    var resetBtn = document.getElementsByTagName("button")[0];
    resetBtn.addEventListener("click", function() {
    	window.location.reload();
	});
	canvas.width = 700;
    canvas.height = 700;
    var snake_body = [];
    var SNAKE_BIT_SIDE_LENGTH = 25;
    var snake_head;
    var MAX_X = (canvas.width / SNAKE_BIT_SIDE_LENGTH) - 1;
    var MAX_Y = MAX_X;
	var MIN_X = 0;
	var MIN_Y = MIN_X;
    var apple;
    var waitingInput = [];
    var GAME_GRID = []
    for(x=0; x<(MAX_X+1); x++){
        GAME_GRID.push([]);
        for(y=0; y<(MAX_Y+1); y++){
            GAME_GRID[x].push(0);
        }
    }    
	var DIRECTION = {UP:1, DOWN:2, LEFT:3, RIGHT:4};
    
	var SnakeHead = function (x, y) {
 	   this.x = x;
    	this.y = y;
	    this.prevX = this.x;
    	this.prevY = this.y;
	    this.direction = DIRECTION.RIGHT;
    	this.display = function () {
        	context.fillStyle = "green";
	        context.fillRect(this.x*SNAKE_BIT_SIDE_LENGTH, this.y*SNAKE_BIT_SIDE_LENGTH,
    	             SNAKE_BIT_SIDE_LENGTH, SNAKE_BIT_SIDE_LENGTH);
    	}  
        
    	this.move = function () {
            changeDirection();
	    	this.prevX = this.x;
	    	this.prevY = this.y;
		    switch (this.direction) {
    		    case DIRECTION.UP:
        		    this.y -= 1;
            		if (this.y < MIN_Y) {
                		gameOver();//Kill snake
		            }
    		        break;
        		case DIRECTION.DOWN:
            	    this.y += 1;
            		if (this.y > MAX_Y) {
                		gameOver();//wrap snake back around
		            }
    	        	break;
	    	    case DIRECTION.LEFT:
            	    this.x -= 1;
            		if (this.x < MIN_X) {
                		gameOver();//wrap snake back around
	            	}
	    	        break;
    	    	case DIRECTION.RIGHT:
        	        this.x += 1;
                    if (this.x > MAX_X) {
	                	gameOver();//wrap snake back around
	    	        }
            		break;
            }
            
            if (GAME_GRID[this.y][this.x] === 1) { // we hit an apple
				GAME_GRID[this.y][this.x] = 0; // so we aren't hitting invisible apples later on
			    apple.body = true
                snake_body.push(apple);
			    apple = new Apple(getValidRandomPosition());
			    apple.display();
			}
            
            if (GAME_GRID[this.y][this.x] === 1) {
		    	snake_body.push(apple);
	    		GAME_GRID[this.y][this.x] = 0;
		    	apple = new Apple(getValidRandomPosition());
	    		apple.display();
		    	if(snake_body.length === GAME_GRID.length*GAME_GRID.length){
    		    	win();
				}
			} else if (GAME_GRID[this.y][this.x] === 2) {
    			gameOver();
			}
	    }
	}
    var moveSnakeBody = function () {
	    if(snake_body.length < 2){ //we only have the head
    	    return;
	    }
    	for (var i = 0; i < snake_body.length - 1; i++) { 
        	//move each snake body part up to the previous
	        //position of the part ahead of it
    	    snake_body[i+1].setPosition(snake_body[i].prevX, snake_body[i].prevY);
	    }
    	for (var i = 0; i < snake_body.length; i++) {
        	//update snake_body positions on GAME_GRID with
	        //2's so that we can tell if the snake runs into
    	    //itself
        	GAME_GRID[snake_body[i].y][snake_body[i].x] = 2;
	        GAME_GRID[snake_body[i].prevY][snake_body[i].prevX] = 0;
    	}
	}

    var displaySnakeBody = function () {
 	   for(var i = 0; i < snake_body.length; i++){
    	    snake_body[i].display();
	    }
	}
    
    var Apple = function (position) {
	    this.x = position.x;
    	this.y = position.y;
        this.body = false;
	    this.prevX = this.x;
    	this.prevY = this.y;
	    GAME_GRID[this.y][this.x] = 1;
    	this.display = function () {
            context.fillStyle = "green"
            if (!this.body){
        		context.fillStyle = "red"
            }
	   		context.fillRect(this.x*SNAKE_BIT_SIDE_LENGTH, this.y*SNAKE_BIT_SIDE_LENGTH,
    	             SNAKE_BIT_SIDE_LENGTH, SNAKE_BIT_SIDE_LENGTH);
	    }
    	this.setPosition = function (x, y) {
        	this.prevX = this.x;
	        this.prevY = this.y;
    	    this.x = x;
        	this.y = y;
	    }
	}
    
	var getValidRandomPosition = function () {
	    var position;
    	do {
        	position = {
            	x: Math.floor((Math.random()*MAX_X)),
	            y: Math.floor((Math.random()*MAX_Y))
    	    }
	    } while (GAME_GRID[position.y][position.x] !== 0);
    	return position;
	}
    document.addEventListener("keydown", function (e) { 
	    if (e.keyCode) {
    	    waitingInput.push(e.keyCode);
	    } else {
    	    waitingInput.push(e.which);
	    }
    });
	var changeDirection = function () {
	    switch(waitingInput[0]){ //switch on the value of keypressed
            case 38: //up
                if (snake_head.direction !== DIRECTION.DOWN) {
                    snake_head.direction = DIRECTION.UP;
                }
                break;
            case 40: //down
             	if (snake_head.direction !== DIRECTION.UP) {
                    snake_head.direction = DIRECTION.DOWN;
                }
                break;
            case 37: //left
            	if (snake_head.direction !== DIRECTION.RIGHT) {
                    snake_head.direction = DIRECTION.LEFT;
                }
                break;
            case 39: //right
         	   if (snake_head.direction !== DIRECTION.LEFT) {
                    snake_head.direction = DIRECTION.RIGHT;
                }
                break;
        }
        waitingInput.shift();
    };

    //CONSTANT
    var FRAME_RATE = 1000/60; //20 fps
    var MOVE_RATE = 1000/10;

    var draw_bg = function(){
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    var setup = (function () {
		snake_head = new SnakeHead(10, 10);
        snake_body.push(snake_head);
        apple = new Apple(getValidRandomPosition());
		draw_bg();
    })();
    
    var draw  = function () {
        draw_bg();
        apple.display();
        displaySnakeBody();	
    };
    
	var move = function () {
        snake_head.move();
        moveSnakeBody();
    };
    
    var endGame = function () {
		window.clearInterval(draw_interval);
	}
    
    var win = function () {
		endGame();
        context.font = "50px Arial";
		context.textAlign = "center";
        context.fillStyle = "#FF0000";
		context.fillText("You Win!", canvas.width/2, canvas.height/2);
	}
    
    var gameOver = function () {
        endGame();
        context.font = "50px Arial";
		context.textAlign = "center";
        context.fillStyle = "#FF0000";
        context.fillText("Game Over! Score: "+(snake_body.length-1), canvas.width/2, canvas.height/2);
    }

    var draw_interval = setInterval(draw, FRAME_RATE);
    var move_interval = setInterval(move, MOVE_RATE);
};
