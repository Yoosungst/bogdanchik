var canvas = {
    width: 800,
    height: 600,
};
var ctx;

var pong = new Audio('pong.mp3');
var pong2 = new Audio('pong2.mp3');
var goal = new Audio('goal.wav');
var endgame = new Audio('endgame.wav');

window.onload = function () {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousemove", function (evt) {
        var mousePos = calculateMousePos(evt);
        user.y = mousePos.y - user.height / 2;
    });

    drawRect(0, 0, canvas.width, canvas.height, '#20283d');


    ctx.globalAlpha = 0.75;
    drawRect(0, 0, canvas.width, canvas.height, 'black');
    ctx.globalAlpha = 1;
    ctx.textAlign = "center";
    drawText('FIRST TO 3 WINS', canvas.width/2, canvas.height/2, '#fbf7f3', "69px Impact");
    ctx.globalAlpha = 0.69;
    drawText('click to start', canvas.width/2, 3*canvas.height/5, '#fbf7f3', "21px Impact");
    ctx.globalAlpha = 1;

    canvas.addEventListener('click', clickFunc);
    function clickFunc(){
        game();
        canvas.removeEventListener('click', clickFunc);
    }
};

function game(){
    const framesPerSecond = 60;
    var interval = setInterval(function () {
        moveEverything();
        drawEverything();

        // конец игры

        if(enemy.score == 3 || user.score == 3){
            endgame.play();
            drawRect(0, 0, canvas.width, canvas.height, '#20283d');
            ctx.globalAlpha = 0.75;
            drawRect(0, 0, canvas.width, canvas.height, 'black');
            ctx.globalAlpha = 1;
            var winner = 'unknown';
            user.score == 3? winner = 'YOU WON': winner = 'YOU LOST'

            ctx.textAlign = "center";
            drawText(winner, canvas.width/2, canvas.height/2, '#fbf7f3', "69px Impact");
            ctx.globalAlpha = 0.69;
            
            drawText('богданчик', canvas.width/2, 3*canvas.height/5, '#fbf7f3', "21px Impact");
            ctx.globalAlpha = 1;
            clearInterval(interval);
        }

        // конец игры
        
    }, 1000 / framesPerSecond);


}

var ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    color: "#e5b083",
    Xvelocity: 6,
    Yvelocity: 6,
};

var user = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "#426e5d",
    score: 0,
};

var enemy = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "#426e5d",
    score: 0,
};

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY,
    };
}

function ballReset() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.Xvelocity = -ball.Xvelocity;
    //ball.Yvelocity=-ball.Yvelocity;
    //ball.direction = !ball.direction;

    ball.Xvelocity = 6;
    ball.Yvelocity = 6;
}

function moveEverything() {
    // движение мяча
    ball.x += ball.Xvelocity;
    ball.y += ball.Yvelocity;

    // отскакивание от потолка и пола
    if (ball.y + ball.radius > canvas.height) {
        ball.Yvelocity = -ball.Yvelocity;
        pong.play();
    } else if (ball.y - ball.radius < 0) {
        ball.Yvelocity = -ball.Yvelocity;
        pong.play();
    }

    // голы
    if (ball.x + ball.radius > canvas.width) {
        goal.play();
        user.score += 1;
        ballReset();
    } else if (ball.x - ball.radius < 0) {
        goal.play();
        enemy.score += 1;
        ballReset();
    }

    // AI -_-
    if (ball.y > enemy.y + enemy.width / 2) {
        enemy.y += 7;
    } else {
        enemy.y -= 7;
    }

    // лок платформы user в области видимости
    if (user.y + user.height > canvas.height) {
        user.y = canvas.height - user.height;
    } else if (user.y < 0) {
        user.y = 0;
    }
    // лок платформы enemy в области видимости
    if (enemy.y + enemy.height > canvas.height) {
        enemy.y = canvas.height - enemy.height;
    } else if (enemy.y < 0) {
        enemy.y = 0;
    }

    //enemy collision
    if (ball.x + ball.radius > canvas.width - enemy.width) {
        if (
            ball.y + ball.radius > enemy.y &&
            ball.y - ball.radius < enemy.y + ball.radius
        ) {
            pong2.play();
            ball.Xvelocity = -ball.Xvelocity;
            if (ball.Yvelocity > 0) {
                ball.Yvelocity += 1;
            } else {
                ball.Yvelocity -= 1;
            }
        } else if (
            ball.y + ball.radius > enemy.y + enemy.height - ball.radius &&
            ball.y - ball.radius < enemy.y + enemy.height
        ) {
            pong2.play();
            ball.Xvelocity = -ball.Xvelocity;
            if (ball.Yvelocity > 0) {
                ball.Yvelocity += 1;
            } else {
                ball.Yvelocity -= 1;
            }
        } else if (
            ball.y - ball.radius > enemy.y + ball.radius &&
            ball.y + ball.radius < enemy.y + enemy.height - ball.radius
        ) {
            pong2.play();
            ball.Xvelocity = -ball.Xvelocity;
            if (ball.Xvelocity > 0) {
                ball.Xvelocity += 1;
            } else {
                ball.Xvelocity -= 1;
            }
        } else return;
    }

    //user collision
    if (ball.x - ball.radius < user.width) {
        if (
            ball.y + ball.radius > user.y &&
            ball.y - ball.radius < user.y + ball.radius
        ) {
            pong2.play();
            ball.Xvelocity = -ball.Xvelocity;
            if (ball.Yvelocity > 0) {
                ball.Yvelocity += 1;
            } else {
                ball.Yvelocity -= 1;
            }
        } else if (
            ball.y + ball.radius > user.y + user.height - ball.radius &&
            ball.y - ball.radius < user.y + user.height
        ) {
            pong2.play();
            ball.Xvelocity = -ball.Xvelocity;
            if (ball.Yvelocity > 0) {
                ball.Yvelocity += 1;
            } else {
                ball.Yvelocity -= 1;
            }
        } else if (
            ball.y - ball.radius > user.y + ball.radius &&
            ball.y + ball.radius < user.y + user.height - ball.radius
        ) {
            pong2.play();
            ball.Xvelocity = -ball.Xvelocity;
            if (ball.Xvelocity > 0) {
                ball.Xvelocity += 1;
            } else {
                ball.Xvelocity -= 1;
            }
        } else return;
    }
}

function drawEverything() {
    drawRect(0, 0, canvas.width, canvas.height, '#20283d');
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(enemy.x, enemy.y, enemy.width, enemy.height, enemy.color);

    drawText(user.score, canvas.width/4, canvas.height/5, '#e5b083', "69px Impact");
    drawText(enemy.score, 3*canvas.width/4, canvas.height/5, '#e5b083', "69px Impact");

    drawText(user.score, canvas.width/4-3, canvas.height/5-1, '#fbf7f3', "69px Impact");
    drawText(enemy.score, 3*canvas.width/4-3, canvas.height/5-1, '#fbf7f3', "69px Impact");
    
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color, font){
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x, y);
}