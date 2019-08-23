//CLASS GAME
//Ce qu'on a au départ
class Game {
  constructor(mom) {
    this.nappies = [];
    this.nappiesLimit = 100;
    this.coffees = [];
    this.coffeesLimit = 20;
    this.mom = mom;
    this.currentPosition = null;
    this.lifeIntervalId = null;
    this.coffeeIntervalId = null;
    this.nappyIntervalId = null;
    this.energyBar = 100;
    this.isTouched = false;

    // actions initiales
    this.generateMom();
    this.generateItems();
    this.listenKeyboard();
    this.diminishEnergyBar();
  }

  //keyboard pour déplacer l'objet mom
  listenKeyboard() {
    window.onkeydown = evt => {
      const keyPressed = evt.code;
      if (keyPressed === "ArrowLeft" || keyPressed === "ArrowRight") {
        let direction = keyPressed === "ArrowLeft" ? "left" : "right";
        this.moveMom(direction);
      }
    };
  }

  //Créer les nappies et coffees avec intervalles différents
  generateItems() {
    setInterval(() => {
      if (this.nappies.length < this.nappiesLimit) {
        this.generateNappy();
      }
    }, 1000);

    setInterval(() => {
      if (this.coffees.length < this.coffeesLimit) {
        this.generateCoffee();
      }
    }, 4500);
  }

  //---------------------OBJET NAPPY (Obstacles à éviter)
  //Création de l'objet nappy
  generateNappy() {
    const nappy = document.createElement("span");
    nappy.classList.add("nappy");
    const colStart = Math.floor(Math.random() * 11);
    nappy.style.gridColumn = `${colStart} / ${colStart + 1}`;
    nappy.style.gridRow = `1 / 2`;
    document.getElementById("grid").appendChild(nappy);
    const indexN = this.nappies.push(nappy);

    var nappyIntervalId = setInterval(() => {
      this.moveNappy(nappy);

      //suppression de l'objet lorsqu'il sort de la grid
      //OU lorsqu'il est à la même position que l'objet MOM
      if (
        parseFloat(nappy.style.gridRow) >= 11 ||
        parseFloat(nappy.style.gridRow) == mom.style.gridRow
      ) {
        const parent1 = nappy.parentElement;
        parent1.removeChild(nappy);
        clearInterval(nappyIntervalId);
        this.nappies.splice(indexN, 1);
      }
    }, 300);
  }

  //Déplacement de l'objet nappy
  moveNappy(nappy) {
    var previousCol = Number(nappy.style.gridColumn.split("/")[0].trim());
    // prend le style de nappy, garde la propriété css grid-column,
    //sépare la chaîne retournée en un tableau avec split sur le séparateur /.
    //conserve la première cellule du tableau, retire les espaces blancs inutile et convertit en nombre ...
    var previousRow = Number(nappy.style.gridRow.split("/")[0].trim());
    nappy.style.gridColumn = previousCol;
    nappy.style.gridRow = previousRow + 1;
  }

  //----------------------OBJET COFFEE (Objets à attraper)
  //Création de l'objet coffee
  generateCoffee() {
    const coffee = document.createElement("span");
    coffee.classList.add("coffee");
    const colStart = Math.floor(Math.random() * 11);
    coffee.style.gridColumn = `${colStart} / ${colStart + 1}`;
    coffee.style.gridRow = `1 / 2`;
    //console.log(coffee);
    document.getElementById("grid").appendChild(coffee);
    const indexC = this.coffees.push(coffee);
    //console.log(this.coffees)

    let coffeeIntervalId = setInterval(() => {
      this.moveCoffee(coffee);

      //suppression de l'objet lorsqu'il sort de la grid
      //OU lorsqu'il est à la même position que l'objet MOM
      if (
        parseFloat(coffee.style.gridRow) >= 11 ||
        parseFloat(coffee.style.gridRow) == mom.style.gridRow
      ) {
        const parent = coffee.parentElement;
        parent.removeChild(coffee);
        clearInterval(coffeeIntervalId);
        this.coffees.splice(indexC, 1);
      }
    }, 100);
  }

  //Déplacement de l'objet coffee
  moveCoffee(coffee) {
    var previousCol = Number(coffee.style.gridColumn.split("/")[0].trim());
    var previousRow = Number(coffee.style.gridRow.split("/")[0].trim());
    coffee.style.gridColumn = previousCol;
    coffee.style.gridRow = previousRow + 1;

    //console.log("on est ici --->", this.currentPosition)
    // console.log(coffee.style.gridRow)

    //Collision avec MOM
    //Action '+' sur EnergyBar
    // checker si la row ET la column du coffee est la même que la row et la column de mom
    // mom a toujours la même row (10)
    if (previousRow + 1 === 10 && previousCol === this.currentPosition) {
      // console.log("bim bam boum");
      this.setEnergyBar;
    }
  }

  //-----------------------OBJET MOM
  //Créer Mom
  generateMom() {
    const mom = document.getElementById("mom");
    mom.style.gridColumn = "1/2";
    mom.style.gridRow = "10/11";
  }

  //Déplacer Mom
  moveMom(direction) {
    const mom = document.getElementById("mom");
    this.currentPosition = Number(mom.style.gridColumn.split("/")[0].trim());
    if (direction === "right" && this.currentPosition + 1 < 11) {
      mom.style.gridColumn = `${this.currentPosition + 1} / ${this
        .currentPosition + 2}`;
    } else if (direction === "left" && this.currentPosition - 1 > 0) {
      mom.style.gridColumn = `${this.currentPosition - 1} / ${
        this.currentPosition
      }`;
    }
  }

  //=================Collision avec MOM

  //Animations GIF
  createGifNappy(nappy) {
    const parent = nappy.parentElement;
    const img = document.createElement("img");
    img.src = "./images/oh.gif";
    img.classList.add("oh");
    parent.appendChild(img);
    window.setTimeout(() => {
      img.remove();
    }, 500);
  }

  createGifCoffee(coffee) {
    const parent = coffee.parentElement;
    const img = document.createElement("img");
    img.src = "./images/coffee-yay.gif";
    img.classList.add("yay");
    parent.appendChild(img);
    window.setTimeout(() => {
      img.remove();
    }, 500);
  }

  detectCollision() {
    const mom = document.getElementById("mom");
    //Nappy => Action '-' sur setEnergyBar

    this.nappies.forEach(nappy => {
      if (
        parseFloat(mom.style.gridRow) === parseFloat(nappy.style.gridRow) &&
        parseFloat(mom.style.gridColumn) === parseFloat(nappy.style.gridColumn)
      ) {
        if (!this.isTouched) {
          console.log("toucheds");
          this.isTouched = true;
          this.setEnergyBar(-20);
          this.createGifNappy(nappy);

          setTimeout(() => {
            this.isTouched = false;
          }, 1000);
        }
      }
    });

    this.coffees.forEach(coffee => {
      if (
        parseFloat(mom.style.gridRow) === parseFloat(coffee.style.gridRow) &&
        parseFloat(mom.style.gridColumn) === parseFloat(coffee.style.gridColumn)
      ) {
        if (!this.isTouched) {
          console.log("toucheds");
          this.isTouched = true;
          this.setEnergyBar(10);
          this.createGifCoffee(coffee);
          setTimeout(() => {
            this.isTouched = false;
          }, 1000);
        }
      }
    });
  }

  setEnergyBar(value) {
    const bar = document.querySelector(".progress");

    this.energyBar += value;
    if (this.energyBar >= 100) this.energyBar = 100;
    if (this.energyBar <= 0) {
      clearInterval(this.lifeIntervalId);
      this.energyBar === 0;
      this.endGame();
    }
    bar.style.width = this.energyBar + "%";

    if (this.energyBar >= 70) bar.classList.add("ok");
    else if (this.energyBar < 70 && this.energyBar >= 40)
      bar.classList.add("warning");
    else bar.classList.add("danger");
  }

  diminishEnergyBar() {
    // const btn = e.target || e.srcElement;
    this.lifeIntervalId = window.setInterval(() => {
      var ratio = (100 * 5) / 100;
      this.setEnergyBar(-ratio);
    }, 2500);
  }

  endGame() {
    var popUp = document.querySelector(".popup");
    console.log(popUp);
    popUp.classList.add("is-active");
    popUp.innerHTML = `<div id="endGame">
    <h3>You have survived ! </h3>
    <button id="btn-restart" onClick="window.location.reload()"> RESTART </button>
    </div>`;
    window.clearInterval(this.coffeeIntervalId);
    window.clearInterval(this.nappyIntervalId);
    window.clearInterval(this.lifeIntervalId);
    // alert("GAME OVER");
  }
}

//===============New Game ===> new timer

//const game = new Game(window.prompt("mummy's name ?"));

if (document.querySelector("#grid.game")) {
  const game = new Game("Aida");
  console.log(game);
  setInterval(() => game.detectCollision(), 11);
}

//   this.intervalId = setInterval(()=>{
//     this.currentTime += 1}
//     ,1000);}

// var minDec      = document.getElementById('minDec');
// var minUni      = document.getElementById('minUni');
// var secDec      = document.getElementById('secDec');
// var secUni      = document.getElementById('secUni');
// this.currentTime = 0;

// getMinutes(){
//   return Math.floor(this.currentTime/60)
// };
// getSeconds(){
//   return Math.floor(this.currentTime%60)
// }
// function printTime() {
//   setInterval(()=> printSeconds(), 1000);
//   setInterval(()=> printMinutes(), 1000);
//   }

//   function printMinutes() {
//   let min = chronometer.twoDigitsNumber(chronometer.getMinutes());
//   minDec.innerHTML = min[0];
//   minUni.innerHTML = min[1];
//   }

//   function printSeconds() {
//     let sec = chronometer.twoDigitsNumber(chronometer.getSeconds());
//     secDec.innerHTML = sec[0];
//     secUni.innerHTML = sec[1];
//   }
