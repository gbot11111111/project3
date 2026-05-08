let playerBullets = [];
let bg_r = 0;
let bg_g = 0;
let bg_b = 0;
let bg_fadespeed = 30;

let enemies = [];
let enemyBullets = [];

function setup() {
  createCanvas(800, 800);
  p = new player();

  ufo = new UFO(372,200);
  enemies.push(ufo);
}

function preload(){
  img_alien = loadImage("assets/Aliens.png");
  img_car = loadImage("assets/CAR.png");
}

class playerBullet{
  constructor(x,y,r){
    this.x = x;
    this.y = y;
    this.r = r;
  }
  
  show(){
    ellipse(this.x,this.y,this.r);
  }
  
  move(){
    this.y-=10;
  }
  
  touchingEnemy(ex, ey) {
    let d = dist(ex, ey, this.x, this.y);
    if (d < this.r) {
      return true;
    } else {
      return false;
    }
  }
  
}

class player{
  constructor(health, armor){
    this.x = 375;
    this.y = 730;
    this.health = 100;
  }

  damage(number){
    this.health-=number;
  }
  
  show(){
    rect(this.x,this.y,50);
    //image(img_alien, this.x, this.y, 50,50);
  }
  
  move(){
    if (keyIsDown(RIGHT_ARROW) === true) {
      this.x+=5;
    }
    if (keyIsDown(LEFT_ARROW) === true) {
      this.x-=5;
    }
  }
  
}

class UFOBullet{
  constructor(x,y,r){
    this.x = x;
    this.y = y;
    this.r = r;
  }
  
  show(){
    stroke(0,255,0);
    noFill();
    ellipse(this.x,this.y,this.r);
  }
  
  move(){
    this.y+=10;
  }
  
  touchingPlayer(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.r) {
      return true;
    } else {
      return false;
    }
  }
  
}

class UFO{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.health = 100;
    this.angle = 0;
    this.dir = 0; 
    this.size = 100;
    this.startingy = y;
  }

  shoot(){
    // backgroundFlash(0,200,0,15)
    // let b = new UFOBulletBullet(this.x+25,this.y-25,50);
    // enemyBullets.push(b);
  }

  damage(number){
    this.health-=number;
    
    backgroundFlash(0,200,0,15)

    let b = new UFOBullet(this.x+50,this.y+50,50);
    enemyBullets.push(b);

  }
  
  move(){
    this.angle += 0.05;
    
    this.y = sin(this.angle)*100 + this.startingy;

    if (this.dir==0){
      this.x += 2;
    }

    if (this.dir==1){
      this.x -= 2;
    }

    if (this.x>800-this.size && this.dir == 0){
      this.dir = 1;
    }

    if (this.x<0 && this.dir == 1){
      this.dir = 0;
    }
  }

  show(){
    image(img_alien, this.x, this.y, 100,100);
      
    noStroke();
    fill(255);
    textSize(18);
    text("Health: " + this.health,this.x,this.y-10)
  }
}

function backgroundFlash(r,g,b,fs){
  bg_r=r;
  bg_g=g;
  bg_b=b;
  bg_fadespeed = fs;
}

function drawBackground(){
  background(color(bg_r,bg_g,bg_b));
  
  if (bg_r !== 0){
    bg_r-=bg_fadespeed;
  }
  if (bg_g !== 0){
    bg_g-=bg_fadespeed;
  }
  if (bg_b !== 0){
    bg_b-=bg_fadespeed;
  }
}

function draw() {
  
  drawBackground();
  
  noStroke();
  fill(255);
  textSize(18);
  text("Health: " + p.health,50,50);

  stroke(255);
  noFill();
  
  p.show()
  p.move()
  
  for (let i = 0; i < playerBullets.length; i++) {
    playerBullets[i].move();
    playerBullets[i].show();

    for (let j = 0; j < enemies.length; j++) {

      if (playerBullets[i].touchingEnemy(enemies[j].x+enemies[j].size/2, enemies[j].y+enemies[j].size/2)){
        //remove from array
        playerBullets.splice(i,1);
        console.log("hit");

        enemies[j].damage(10);

        if (enemies[j].health == 0){
          enemies.splice(j,1);
        }
      }
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].move();
    enemies[i].show();
  }

  for (let i = 0; i < enemyBullets.length; i++) {
    enemyBullets[i].move();
    enemyBullets[i].show();

      if (enemyBullets[i].touchingPlayer(p.x+25, p.y+25)){
        //remove from array
        enemyBullets.splice(i,1);
        console.log("player hit");

        p.damage(10);

        // if (enemies[j].health == 0){
        //   enemies.splice(j,1);
        // }
      }
  }
}

function mousePressed(){
  backgroundFlash(200,0,0,15)

  let pb = new playerBullet(p.x+25,p.y-25,50);
  playerBullets.push(pb);
}


