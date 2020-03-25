// window.requestAnimFrame = (function() {
//     return window.requestAnimationFrame ||
//         window.webkitRequestAnimationFrame ||
//         window.mozRequestAnimationFrame ||
//         function(callback) {
//             window.setTimeout(callback, 1000 / 60);
//         };
// })();

//全局变量
let canvas = document.getElementsByTagName("canvas")[0];
let ctx = canvas.getContext("2d");
let canvasWidth = 600,
    canvasHeight = 600;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

let  worldGrip = 20,
    pixelSideLength = canvasWidth / worldGrip;

var fps = 3;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

function tick() {
    requestAnimationFrame(tick);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
        // 这里不能简单then=now，否则还会出现上边简单做法的细微时间差问题。例如fps=10，每帧100ms，而现在每16ms（60fps）
        // 执行一次draw。16*7=112>100，需要7次才实际绘制一次。这个情况下，实际10帧需要112*10=1120ms>1000ms才绘制完成。
        then = now - (delta % interval);
        draw(); // ... Code for Drawing the Frame ...
    }
}
tick();



class Snake {
    constructor(x, y) {
        this.head = {x,y};
        this.direction = "right";
        this.directionControl = "right";
        this.body = [{x:x-1,y:y},{x:x-2,y:y}];
    }
}

Snake.prototype.move = function () {
    this.body.pop();
    this.body.unshift({x:this.head.x, y:this.head.y});
    if (this.directionControl === "right" && this.direction !== "left"){
        this.direction = "right";
    }
    if (this.directionControl === "left" && this.direction !== "right"){
        this.direction = "left";
    }
    if (this.directionControl === "up" && this.direction !== "down"){
        this.direction = "up";
    }
    if (this.directionControl === "down" && this.direction !== "up"){
        this.direction = "down";
    }
    switch (this.direction) {
        case "right":
            this.head = {x: this.head.x + 1, y: this.head.y};
            break;
        case "left":
            this.head = {x: this.head.x - 1, y: this.head.y};
            break;
        case "up":
            this.head = {x: this.head.x, y: this.head.y - 1};
            break;
        case "down":
            this.head = {x: this.head.x, y: this.head.y + 1};
            break;
        default :
            this.head = {x:this.head.x + 1, y:this.head.y};
    }
};
Snake.prototype.isDead = function () {
    return this.head.x < 0 || this.head > canvasWidth || this.head.y < 0 || this.head.y > canvasHeight;
};
Snake.prototype.isCatchFood = function () {
    let xOffset = 0,yOffset = 0;
    // switch (this.direction) {
    //     case "right":
    //         xOffset = 1;
    //         break;
    //     case "left":
    //         xOffset = -1;
    //         break;
    //     case "up":
    //         yOffset = -1;
    //         break;
    //     case "down":
    //         yOffset = 1;
    //         break;
    //     default :
    //         this.head = {x:this.head.x + 1, y:this.head.y};
    // }
    return this.head.x +xOffset === food.x && this.head.y + yOffset === food.y;
};
Snake.prototype.eatFood = function () {
    food = new Food(randomInt(0,19),randomInt(0,19));
    this.body.push({x:-1,y:-1});
    fps ++;
    interval = 1000/fps;
};

class Food{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function drawPixel({x, y},r,g,b) {
    ctx.fillStyle = colorRgb(r,g,b);
    ctx.fillRect(x * pixelSideLength, y * pixelSideLength ,pixelSideLength, pixelSideLength);
}


let snake_player = new Snake(2,4)
let food = new Food(5,7)


document.onkeydown = function (event) {
    let e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && (e.keyCode === 87 || e.keyCode ===38) && snake_player.direction !== "down"){
        snake_player.directionControl = "up";
    }
    if (e && (e.keyCode === 83 || e.keyCode ===40) && snake_player.direction !== "up"){
        snake_player.directionControl = "down";
    }
    if (e && (e.keyCode === 65 || e.keyCode ===37) && snake_player.direction !== "right"){
        snake_player.directionControl = "left";
    }
    if (e && (e.keyCode === 68 || e.keyCode ===39) && snake_player.direction !== "left"){
        snake_player.directionControl = "right";
    }
};

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    snake_player.move();
    if (snake_player.isCatchFood()){
        snake_player.eatFood();
    }
    for (let i = 0; i < snake_player.body.length; i++){
        drawPixel(snake_player.body[i],13,144,134);
    }
    drawPixel(snake_player.head,46,46,46);

    drawPixel(food,255,0,0);
}





//定义rgb颜色
function colorRgb(r,g,b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}
//定义argb颜色
function colorArgb(a,r,g,b) {
    return "argb("+ a + "," + r + "," + g + "," + b + ")";
}
//生成随机整数函数
function randomInt(from, to){
    return parseInt(Math.random() * (to - from + 1) + from);
}
//生成随机浮点数函数
function randomFloat(from, to){
    return Math.random() * (to - from + 1) + from;
}

//勾股定理  输入直角边求斜边
function  dist(a,b) {
    return Math.sqrt(a*a + b*b);
}

//判断是否在两者之间
function between(x, min, max) {
    return x >= min && x <= max;
}

function isInCircle(position,center,radius) {
    if (dist(Math.abs(position.x - center.x),Math.abs(position.y - center.y)) <= radius){
        return true;
    }
    else {
        return false;
    }
}

