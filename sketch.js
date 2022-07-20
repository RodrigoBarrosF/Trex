var PLAY = 1
var END = 0
var gameState = PLAY
var gameOverImg;
var restartImg;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var jumpSound , checkPointSound, dieSound;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3"); 
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkpoint.mp3");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,windowHeight-90,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);

  trex.scale = 0.5;
  
  ground = createSprite(windowWidth/2,windowHeight,1200,10);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(windowWidth/2,windowHeight/2-20, 400,20);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  restart = createSprite(windowWidth/2,windowHeight/2+20);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  invisibleGround = createSprite(200,windowHeight+17,600,40);
  invisibleGround.visible = false;

  obstaclesGroup = new Group ();
  cloudsGroup = new Group ();

  trex.debug = true;
  trex.setCollider("circle",0,0,40);
  score=0;
  
  //console.log("Hello" + 5);
  
}

function draw() {
  background(180);
  text(""+ score, 20,30)
  
  if(gameState===PLAY){
  gameOver.visible = false;
  restart.visible = false;
  score = score + Math.round(getFrameRate()/60);

  if(score > 0 && score%100 === 0){ 
    checkPointSound.play()
  }

    //gerar as nuvens
  spawnClouds();
  
  //gerar obstáculos no chão
  spawnObstacles();

    ground.velocityX = -4; 
  //score = score + Math.round(frameCount/60)
    if(touches.length>0 || keyDown("space")&& trex.y >= 600) {
      trex.velocityY = -13;
       jumpSound.play();
      touches+[];
    }
    
    trex.velocityY = trex.velocityY + 0.8
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }
  }

  else if(gameState===END){
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    ground.velocityX = 0
    gameOver.visible = true;
    restart.visible = true;

      if(mousePressedOver(restart)){
       //console.log("ReiniciAR O JOGO"); 
       reset(); 
      }
  
  }


  
  trex.collide(invisibleGround);
  
  
  drawSprites();
}

function reset(){ 
  gameState = PLAY; 
  gameOver.visible = false; 
  restart.visible = false; 
  obstaclesGroup.destroyEach(); 
  cloudsGroup.destroyEach(); 
  score = 0; 
  trex.changeAnimation("running", trex_running); }

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(windowWidth,windowHeight-20,10,40);
   obstacle.velocityX = -6;

   
    // //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribua dimensão e tempo de vida aos obstáculos         
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    cloud = createSprite(windowWidth,100,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribua tempo de vida à variável
    cloud.lifetime = 200;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
  
}