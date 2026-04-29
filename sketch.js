let playerBullets = [];
let bg_r = 0;
let bg_g = 0;
let bg_b = 0;
let bg_fadespeed = 30;

let enemies = [];

function setup() {
  createCanvas(800, 800);
  p = new player();

  ufo = new UFO();
  enemies.push(ufo);
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
    this.armor = 100;
  }
  
  show(){
    rect(this.x,this.y,50);
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

class UFO{
  constructor(){
    this.x = 375;
    this.y = 200;
    this.health = 100;
  }
  
  show(){
    triangle(
      this.x,this.y,
      this.x+50, this.y,
      this.x+25,this.y+50,50);
      
    noStroke();
    fill(255);
    textSize(18);
    text("Health: " + this.health,this.x,this.y-10)
  }
  
  move(){

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
  text("Health: " + p.health,50,50)
  text("Armor: " + p.armor,50,70)

  stroke(255);
  noFill();
  
  p.show()
  p.move()
  
  for (let i = 0; i < playerBullets.length; i++) {
    playerBullets[i].move();
    playerBullets[i].show();

    for (let j = 0; j < enemies.length; j++) {

      if (playerBullets[i].touchingEnemy(enemies[j].x+25, enemies[j].y+25)){
        //remove from array
        playerBullets.splice(i,1);
        console.log("hit");
      }
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].move();
    enemies[i].show();
  }

}

function mousePressed(){
  backgroundFlash(200,0,0,15)

  let pb = new playerBullet(p.x+25,p.y-25,25);
  playerBullets.push(pb);
}


