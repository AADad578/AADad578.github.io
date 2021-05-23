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
	var score = 0;
    var score2 = 0;
    var bounces = 0;
    var highBounces = 0;
    var paddle = {
		'x': canvas.width/2,
    	'y': canvas.height - 20,
	    'width': 100,
    	'height': 15,
	    'velocity': 10.0,
    	'move': 0 
	};
    var paddle2 = {
	    'x': canvas.width/2,
	    'y': 5,
    	'width': 100,
	    'height': 15,
    	'velocity': 10.0,
	    'move': 0 
	};
    var ball = {
    	'x': canvas.width/2,
	    'y': canvas.height/2,
    	'velocity_x': 3.0,
	    'velocity_y': 3.0,
    	'radius': 10
	};
    //CONSTANT
    var FRAME_RATE = 1000/60; //20 fps
	var MOVE_RATE = 250/60;
    var draw_bg = function(){
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0, 0, canvas.width, canvas.height);
    };
    var drawPaddle = function(){
        context.fillStyle = "red";
        context.fillRect(paddle['x'], paddle['y'], paddle['width'], paddle['height'])
		context.fillStyle = "blue";
        context.fillRect(paddle2['x'], paddle2['y'], paddle2['width'], paddle2['height'])
    };
    var bKeys = [];
    document.addEventListener("keydown", function (e) { 
        if (bKeys.includes(e.which) === false) {
            bKeys.push(e.which);
        }
    });
    document.addEventListener("keyup", function (e) { 
		bKeys.pop(e.which);
    });
    var movePaddle = function(){
        for (i=0;i<bKeys.length;i++) {
            if (bKeys[i] == 37) {
                if (paddle2['x'] > 0) {
                	paddle2['x'] -= paddle2['velocity']/4;
                }
                else{
                    if(bKeys.includes(37)){
	                    bKeys.pop(37);
                    }
                }
            }
            if(bKeys[i] == 39) {
                if (paddle2['x'] < canvas.width-paddle2['width']) {
                	paddle2['x'] += paddle2['velocity']/4;
                }
                else{
                    if(bKeys.includes(39)){
	                    bKeys.pop(39);
                    }
                }
            }
            if (bKeys[i] == 65) {
                if (paddle['x'] > 0) {
                	paddle['x'] -= paddle['velocity']/4;
                }
                else{
                    if(bKeys.includes(65)){
	                    bKeys.pop(65);
                    }
                }
            }
            if(bKeys[i] == 68) {
                if (paddle['x'] < canvas.width-paddle['width']) {
                	paddle['x'] += paddle['velocity']/4;
                }
                else{
                    if(bKeys.includes(68)){
	                    bKeys.pop(68);
                    }
                }
            }
		}
    }
    var drawBall = function(){
        context.fillStyle = "white";
        context.beginPath();
		context.arc(ball['x'], ball['y'], ball['radius'], 0, 2 * Math.PI);
		context.fill();
		context.fillStyle = "black";
        context.beginPath();
		context.arc(ball['x'], ball['y'], ball['radius']-1, 0, 2 * Math.PI);
		context.fill();
    };
    var moveBall = function(){
        ball['x'] = ball['x'] + ball['velocity_x']/4
 	   	ball['y'] = ball['y'] + ball['velocity_y']/4
    	if (ball['x'] + ball['radius'] >= canvas.width || ball['x'] - ball['radius'] <= 0){
        	ball['velocity_x'] = -ball['velocity_x'];
    	}
	}
    
    var checkCollisions = function(){
        if(ball['x'] >= paddle['x'] && ball['x'] <= paddle['x'] + paddle['width']) {
	        if(ball['y'] + ball['radius'] >= paddle['y']) {
    	        var x = Math.random()*0.5
                ball['velocity_y'] = -ball['velocity_y'] - x
                paddle['velocity'] += x
                paddle2['velocity'] += x
        	    if(x < 0.5) { 
            	    ball['velocity_x'] += Math.random() * 3;
                    console.log(ball['velocity_x']);
                }
	            else{
    	            ball['velocity_x'] -= Math.random() * 3;
                    console.log(ball['velocity_x']);
                }
        	    ball['y'] = paddle['y'] - ball['radius'];
                bounces++;
            }
        }
	    if(ball['x'] >= paddle2['x'] && ball['x'] <= paddle2['x'] + paddle['width']){
    	    if(ball['y'] - ball['radius'] <= paddle2['y']+paddle2['height']){
        	    var x = Math.random()*0.5
                ball['velocity_y'] = -ball['velocity_y'] + x
				paddle['velocity'] += x
                paddle2['velocity'] += x
        	    if(x < 0.5) { 
            	    ball['velocity_x'] += Math.random() * 3;
                    console.log(ball['velocity_x']);
                }
	            else{
    	            ball['velocity_x'] -= Math.random() * 3;
                    console.log(ball['velocity_x']);
                }

        	    ball['y'] = paddle2['y'] + ball['radius'] + paddle2['height'];
                bounces++;
            }
        }
        if (ball['y'] - ball['radius'] <= 0) {
            bounces = 0;
        	score2++;
	        ball['y'] = canvas.width/2;
    	    ball['x'] = canvas.height/2;
        	ball['velocity_x'] = 3.0;
	        ball['velocity_y'] = 3.0;
        }
    	if (ball['y'] + ball['radius'] >= canvas.height) {
            bounces = 0;
        	score++
	        ball['y'] = canvas.width/2;
    	    ball['x'] = canvas.height/2;
        	ball['velocity_x'] = 3.0;
	        ball['velocity_y'] = -3.0;
        }
    }
    
    var setup = (function () {
		draw_bg();
    })();
    
    var draw  = function () {
        draw_bg();
    	//moveBall();
        drawBall();
    	//movePaddle();
        drawPaddle();
	    //checkCollisions();
        context.font = "20px Arial";
        context.fillStyle = "#FFFFFF";
        context.fillText("Score P1: " + score.toString(), 20, 40);
        context.fillText("Score P2: " + score2.toString(), 20, canvas.height-30);
        context.fillText("Current Streak: " + bounces.toString(), 20, canvas.height/2-20);
		if(bounces > highBounces){
            highBounces = bounces;
        }
        context.fillText("Highest Streak: " + highBounces.toString(), 20, canvas.height/2+20);
    };
	var move = function () {
        moveBall();
        movePaddle();
        checkCollisions();
    }
    var draw_interval = setInterval(draw, FRAME_RATE);
    var draw_interval = setInterval(move, MOVE_RATE);
};
