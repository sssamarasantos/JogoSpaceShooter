const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const instructions = document.querySelector('.instructions');
const startButton = document.querySelector('.start');
const pontuacaoFinal = document.querySelector('.pontuacao-final');
const energia = document.getElementById(1);
const energia2 = document.getElementById(2);
const energia3 = document.getElementById(3);
const pontuacao = document.getElementById('points');
let alienInterval;
let point = 0, bateu = 0;

//movimento e tiro da nave
function flyShip(event) {
    if(event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if(event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    } else if(event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

//função de subir
function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === "0px") {
        return
    } else {
        let position = parseInt(topPosition);
        position -= 25;
        yourShip.style.top = `${position}px`;
    }
}

//função de descer
function moveDown() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === "500px"){
        return
    } else {
        let position = parseInt(topPosition);
        position += 25;
        yourShip.style.top = `${position}px`;
    }
}

//funcionalidade de tiro
function fireLaser() {
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { //comparando se cada alien foi atingido, se sim, troca o src da imagem
            if(checkLaserCollision(laser, alien)) {
                point++;
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
                console.log(point);
            }
        })

        pontuacao.innerHTML = point;

        if(xPosition === 340) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`;
        }
    }, 10);
}

//função para criar inimigos aleatórios
function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //sorteio de imagens
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

//função para movimentar os inimigos
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 35) {
            if(Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                bateu++;
                if(bateu === 1){
                    energia3.style.display = 'none';
                } else if(bateu === 2) {
                    energia2.style.display = 'none';
                } else if(bateu === 3){
                    energia.style.display = 'none';
                }
                if(bateu >= 3){         
                    gameOver();
                    
                } else{
                    alien.remove();
                }
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
}

//função para  colisão
function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;
    if(laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if(laserTop <= alienTop && laserTop >= alienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

//inicio do jogo
startButton.addEventListener('click', (event) => {
    playGame();
});

function playGame() {
    startButton.style.display = 'none';
    instructions.style.display = 'none';
    pontuacaoFinal.style.display = 'none';
    pontuacao.innerHTML = point;
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

//função de game over
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    pontuacaoFinal.style.display = "block";
    setTimeout(() => {
        //alert('Fim de jogo!\nSua pontuação foi: ' + point);
        pontuacaoFinal.innerHTML = "Fim de jogo! Sua pontuação foi: " + point;
        point = 0;
        bateu = 0;
        energia.style.display = "inline-block";
        energia2.style.display = "inline-block";
        energia3.style.display = "inline-block";
        yourShip.style.top = "250px";
        startButton.style.display = "block";
        instructions.style.display = "block";
    });
}