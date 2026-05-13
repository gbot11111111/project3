let playerBullets = [];
let bg_r = 0;
let bg_g = 0;
let bg_b = 0;
let bg_a = 0;
let bg_fadespeed = 30;

let enemies = [];
let enemyBullets = [];

let state = 0; //0: main menu
               //1: instructions
               //2: gameplay
               //3: game over
               //4: win

function setup() {
  createCanvas(800, 800);
  p = new player();
}

function preload(){
  //fonts
  drunkFonts = loadFont("assets/fonts/DRUNKFONTS-Regular.otf");
  whyFont = loadFont("assets/fonts/Blink.ttf");
  typewriter = loadFont("assets/fonts/JMH Typewriter.otf");
  
  //images
  img_alien = loadImage("assets/Aliens.png");
  img_alienbullet = loadImage("assets/Alien Bullet.png");
  img_mothman = loadImage("assets/Mothman.png");
  img_mothmanbullet = loadImage("assets/Mothman Bullet.png");
  img_illuminati = loadImage("assets/Illuminati Eye.png");
  img_illuminatibullet = loadImage("assets/Illuminati Bullet.png");
  img_car = loadImage("assets/CAR.png");
  img_car_r = loadImage("assets/CAR_R.png");
  img_car_l = loadImage("assets/CAR_L.png");
  img_car_headlights = loadImage("assets/CAR W HEADLIGHTS.png");
  img_carbullet = loadImage("assets/Car Bullet.png");
  img_hp3 = loadImage("assets/HEALTH BAR FULL.png");
  img_hp2 = loadImage("assets/HEALTH BAR 2 LEFT.png");
  img_hp1 = loadImage("assets/HEALTH BAR 1 LEFT.png");
  img_hp0 = loadImage("assets/HEALTH BAR ZERO.png");

  //backgrounds
  titlescreenBG = loadImage("assets/CRYPTID ROAD TRIP BG.png");
  instScreenBG = loadImage("assets/CRYPTID ROAD TRIP INSTRUCTIONS.png");
  winBG = loadImage("assets/IMG_0019.PNG");
  roadBG = loadImage("assets/IMG_0021.GIF")

  //music
  mus_keyWest = loadSound("assets/sounds/Key West.mp3"); //Cult Member - Key West
  mus_purpleHaze = loadSound("assets/sounds/Purple Haze.mp3"); //suki, Sniper1 - Purple Haze
}

class playerBullet{
  constructor(x,y,r){
    this.x = x;
    this.y = y;
    this.r = r;
  }
  
  show(){
    //ellipse(this.x,this.y,this.r);
    image(img_carbullet, this.x-25, this.y-50, 50,50);
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
    this.y = 600;
    this.health = 150;

    this.shakeAmount = 0;
    this.maxShake = 10;
  }

  damage(number){
    backgroundFlash(255,0,0,3)
    this.shakeAmount = this.maxShake;
    this.health-=number;
  }
  
  show(){
    let decayFactor = 0.9; // How quickly the shake effect fades
    let xOffset = random(-this.shakeAmount, this.shakeAmount);
    let yOffset = random(-this.shakeAmount, this.shakeAmount);
    
    // Apply the shake by translating the canvas
    push();

    translate(xOffset, yOffset);

    if (keyIsDown(RIGHT_ARROW) === true) {

      image(img_car_r, this.x-40, this.y-115, 160,160);

    }else if (keyIsDown(LEFT_ARROW) === true) {

      image(img_car_l, this.x-75, this.y-115, 160,160);

    }else if(mouseIsPressed){
      image(img_car_headlights, this.x-75, this.y-130, 200,200);
    }else{
      image(img_car, this.x-75, this.y-130, 200,200);
    }

    pop();

    // Decay the shake amount over time
    this.shakeAmount *= decayFactor;
  }
  
  move(){
    if ((keyIsDown(RIGHT_ARROW) === true) && this.x<750) {
      this.x+=5;
    }
    if ((keyIsDown(LEFT_ARROW) === true) && this.x>5) {
      this.x-=5;
    }
  }
  
}

class UFOBullet{
  constructor(x,y,a){
    this.x = x;
    this.y = y;
    this.r = 50;
    this.angle = a;
  }
  
  show(){
    stroke(0,255,0);
    noFill();
    image(img_alienbullet, this.x, this.y, 100,100);
  }
  
  move(){
    let speed = 8;
    this.x += cos(this.angle) * speed;
    this.y += sin(this.angle) * speed;
  }
  
  touchingPlayer(px, py) {

    let d = dist(px-25, py-50, this.x, this.y);
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
    this.size = 125;
    this.startingy = y;
    this. timer = 0;
    this.prevTime = 0;

    this.shakeAmount = 0;
    this.maxShake = 10;
  }

  shoot(){
    let bulletAng = atan2(p.y-50 - this.y, p.x-25 - this.x);
    let b = new UFOBullet(this.x,this.y+50, bulletAng);
    enemyBullets.push(b);
  }

  attack(){
    let currentTime = millis();
    let interval =  650;
    if (currentTime - this.prevTime > interval) {
      this.timer++;
      this.prevTime = currentTime;
      if (this.x > -1){
        this.shoot()
      }
      
    }
    
  }

  damage(number){
    backgroundFlash(0,255,0,3);
    this.shakeAmount = this.maxShake;
    this.health-=number;
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
    let decayFactor = 0.9; // How quickly the shake effect fades
    let xOffset = random(-this.shakeAmount, this.shakeAmount);
    let yOffset = random(-this.shakeAmount, this.shakeAmount);
    
    // Apply the shake by translating the canvas
    push();

    translate(xOffset, yOffset);

    image(img_alien, this.x, this.y, this.size, this.size);

    pop();

    // Decay the shake amount over time
    this.shakeAmount *= decayFactor;
      
    noStroke();
    fill(255);
    textSize(18);
    text("Health: " + this.health,this.x,this.y-10)
  }
}

class mothBullet{
  constructor(x,y,a){
    this.x = x;
    this.y = y;
    this.r = 50;
    this.angle = a;
    this.speed = random(6,10);
  }
  
  show(){
    stroke(0,255,0);
    noFill();
    image(img_mothmanbullet, this.x, this.y, 50,100);
  }
  
  move(){
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
  }
  
  touchingPlayer(px, py) {

    let d = dist(px-25, py-50, this.x, this.y);
    if (d < this.r) {
      return true;
    } else {
      return false;
    }
  }
  
}

class mothman{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.health = 100;
    this.angle = 0;
    this.dir = 0; 
    this.size = 100;
    this.startingy = y;
    this. timer = 0;
    this.prevTime = 0;

    this.shakeAmount = 0;
    this.maxShake = 10;
  }

  shoot(){
    let bulletAng = atan2(p.y-50 - this.y, p.x-25 - this.x);
    let b = new mothBullet(this.x,this.y+50, bulletAng);
    enemyBullets.push(b);
  }

  attack(){
    let currentTime = millis();
    let interval =  650;
    if (currentTime - this.prevTime > interval) {
      this.timer++;
      this.prevTime = currentTime;
      if (this.x > -1){
        this.shoot()
        
        let changeDir = random(1,3);

        if (changeDir < 2){
          if (this.dir == 0){
            this.dir = 1;
          }
          if (this.dir == 1){
            this.dir = 0;
          }
        }
      }
      
    }
    
  }

  damage(number){
    backgroundFlash(0,255,0,3);
    this.shakeAmount = this.maxShake;
    this.health-=number;
  }
  
  move(){

    let randXMod = random(2,7)

    this.angle += 0.05 + random(0,1)/10;
    
    this.y = sin(this.angle/2)*100 + this.startingy;

    if (this.dir==0){
      this.x += randXMod;
    }

    if (this.dir==1){
      this.x -= randXMod;
    }

    if (this.x>800-this.size && this.dir == 0){
      this.dir = 1;
    }

    if (this.x<0 && this.dir == 1){
      this.dir = 0;
    }
  }

  show(){
    let decayFactor = 0.9; // How quickly the shake effect fades
    let xOffset = random(-this.shakeAmount, this.shakeAmount);
    let yOffset = random(-this.shakeAmount, this.shakeAmount);
    
    // Apply the shake by translating the canvas
    push();

    translate(xOffset, yOffset);

    image(img_mothman, this.x, this.y, this.size, this.size);

    pop();

    // Decay the shake amount over time
    this.shakeAmount *= decayFactor;
      
    noStroke();
    fill(255);
    textSize(18);
    text("Health: " + this.health,this.x,this.y-10)
  }
}

class illuminatiBullet{
  constructor(x,y,a){
    this.x = x;
    this.y = y;
    this.r = 50;
    this.angle = a;
  }
  
  show(){
    stroke(0,255,0);
    noFill();
    image(img_illuminatibullet, this.x, this.y, 80,80);
  }
  
  move(){
    let speed = 8;
    this.x += cos(this.angle) * speed;
    this.y += sin(this.angle) * speed;
  }
  
  touchingPlayer(px, py) {

    let d = dist(px-25, py-50, this.x, this.y);
    if (d < this.r) {
      return true;
    } else {
      return false;
    }
  }
  
}

class Illuminati{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.health = 200;
    this.angle = 0;
    this.dir = 0; 
    this.size = 125;
    this.startingy = y;
    this. timer = 0;
    this.prevTime = 0;

    this.shakeAmount = 0;
    this.maxShake = 10;
  }

  shoot(){
    let bulletAng = atan2(p.y-50 - this.y, p.x-25 - this.x);
    let bulletTypeRandomizer = random(0,3.9);
    let b; 

    if (bulletTypeRandomizer > 2){
      b = new illuminatiBullet(this.x,this.y+50, bulletAng + (random(0,20)*(PI/180)));
    }else if (bulletTypeRandomizer > 1){
      b = new mothBullet(this.x,this.y+50, bulletAng + (random(0,20)*(PI/180)));
    }else{
      b = new UFOBullet(this.x,this.y+50, bulletAng + (random(0,20)*(PI/180)));
    }
    
    enemyBullets.push(b);

    this.x = random(this.x-100,this.x+100);
  }

  attack(){
    let currentTime = millis();
    let interval =  250;
    if (currentTime - this.prevTime > interval) {
      this.timer++;
      this.prevTime = currentTime;
      if (this.x > -1){
        this.shoot()
      }
      
    }
    
  }

  damage(number){
    backgroundFlash(0,255,0,3);
    this.shakeAmount = this.maxShake;
    this.health-=number;
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
    let decayFactor = 0.9; // How quickly the shake effect fades
    let xOffset = random(-this.shakeAmount, this.shakeAmount);
    let yOffset = random(-this.shakeAmount, this.shakeAmount);
    
    // Apply the shake by translating the canvas
    push();

    translate(xOffset, yOffset);

    image(img_illuminati, this.x, this.y, this.size, this.size);

    pop();

    // Decay the shake amount over time
    this.shakeAmount *= decayFactor;
      
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
  bg_a=100;
  bg_fadespeed = fs;
}

function drawBackground(){
  fill(color(bg_r,bg_g,bg_b,bg_a));
  rect(0,0,800,800,);
  
  if (bg_a !== 0){
    bg_a-=bg_fadespeed;
  }
}

function drawHealthbar(){
  let x = 0;
  let y = 500;
  if (p.health > 100){
    image(img_hp3,x,y,1972/5,1488/5);
  }else if (p.health > 50){
    image(img_hp2,x,y,1972/5,1488/5);
  }else if (p.health > 0){
    image(img_hp1,x,y,1972/5,1488/5);
  }else{
    image(img_hp0,x,y,1972/5,1488/5);
  }
}

function draw() {

  if (state == 0) {
    titleScreen();
    if (!mus_keyWest.isPlaying()){
      mus_keyWest.play();
    }
    
  } else if (state == 1) {
    instructionScreen();

  } else if (state == 2) {

    runGame();
    
    if (!mus_purpleHaze.isPlaying()){
      mus_purpleHaze.play();
    }
    if (mus_keyWest.isPlaying()){
      mus_keyWest.stop();
    }
  }else if (state == 3) {
    gameOver();
  }else if (state == 4){
    madeItOut();
  }
  
}

function mousePressed(){
  if (state == 0) {
    state = 1; 
  } else if (state == 1) {
    //stage 1
    ufo = new UFO(-70,100);
    enemies.push(ufo);

    state = 2;

  }else if (state == 2){
    let pb = new playerBullet(p.x+25,p.y-25,50);
    playerBullets.push(pb);
  }
  else if (state == 3){
    state = 0;
    p.health = 150;
    enemies = [];
  }
  else if (state == 4){
    state = 0;
    p.health = 150;
    enemies = [];
  }
}

function gameOver(){
  background(0);
  image(instScreenBG,0,0,800,800);
  noStroke();
  fill("#1BD63D");
  textFont(drunkFonts);
  textSize(120);
  text("GAME OVER", 110,400);
  
  fill("#187829");
  textFont(typewriter);
  textSize(18);
  text("Press top button to restart", 280,430);
}

function madeItOut() {
  background(0);
  image(winBG,0,0,800,800);
  noStroke();
  fill("#1BD63D");
  textFont(drunkFonts);
  textSize(70);
  text("YOU MADE IT OUT", 80,350);
  
  fill("#187829");
  textFont(typewriter);
  textSize(18);
  text("You can now take the road home", 250,380);
}

function runGame(){
  
  background(0);
  image(roadBG,0,0,800,800);
  drawBackground();
  drawHealthbar();
  
  noStroke();
  fill(255);
  textSize(18);
  text("Health: " + p.health, 230,710);

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

          //spawn next phase
          if (enemies[j] instanceof UFO){
            mm = new mothman(-70,100);
            enemies.push(mm);
            p.health = 150;
          }else if (enemies[j] instanceof mothman){
            il = new Illuminati(-70,100);
            enemies.push(il);
            p.health = 150;
          }
          else if (enemies[j] instanceof Illuminati){
            state = 4;
          }

          //remove from array
          enemies.splice(j,1);
        }
      }
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].move();
    enemies[i].show();
    enemies[i].attack();
  }

  for (let i = 0; i < enemyBullets.length; i++) {
    enemyBullets[i].move();
    enemyBullets[i].show();

      if (enemyBullets[i].touchingPlayer(p.x, p.y)){
        //remove from array
        enemyBullets.splice(i,1);

        console.log("player hit");
        p.damage(10);

        if (p.health == 0){
          state = 3;
        }
      }
  }
}

function titleScreen() {
  image(titlescreenBG, 0,0,800,800);
  noStroke();
  fill("#1BD63D");
  textFont(drunkFonts);
  textSize(120);
  text("CRYPTID", 160,200);
  fill("#187829");
  textFont(whyFont);
  textSize(70);
  text("R  O  A  D   T  R  I  P", 120,280);
  fill(0);
  textFont(whyFont);
  textSize(30);
  text("Tap with thumb to start", 250,520);
}

function instructionScreen() {
  image(instScreenBG, 0,0,800,800);
  
  noStroke();
  fill("#1BD63D");
  textFont(whyFont);
  textSize(80);
  text("INSTRUCTIONS", 50,300);
  
  fill("#187829");
  textFont(typewriter);
  textSize(18);
  text("Move the joystick left and right to steer", 80,380);
  text("Shoot the enemies with the button at the top of the joystick", 80, 410);
  text("Avoid enemy bullets and hit enemies enough times to win", 80, 440);
  text("Survive your first cryptid road trip", 80, 470);
  
  fill("#1BD63D");
  text("Press the button with your thumb again to start!", 80, 530);
  
}