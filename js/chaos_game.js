//Deseneaza fractalii obtinuti prin algoritmul jocul haosului
//Adaptat dupa https://www.lesscake.com/fractals-chaos-game


//goleste canvasul la fiecare rulare. Aceasta optiune nu este necesara in cazul Mandelbrot si Julia pentru ca acestea
//suprascriu toti pixelii din canvas. In cazul simularilor curente, pixelii din canvas nu sunt desenati decat daca
//sunt afectati de algoritmii

function clearCanvas() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//functia deseneaza pixelii din jocul haosului in functie de parametrii primiti.
//stype reprezinta tipul de poligon in care se va ancora algoritmul
//in cazul in care stype este square, exista mai multe posibilitati determinate de parametrul version

function doChaosGame(stype, version = 1) {
  var shape = [];

//numarul de iteratii ale algoritmului
  const iterationCount = 150000;

//coordonatele stocate ale poligoanelor
  if (stype == 'triangle') {
    shape = [
          { x: 250, y: 0 },
          { x: 500, y: 400 },
          { x: 0, y: 400 },
    ];
  } else if (stype == 'square') {
   shape = [
        { x: 0, y: 0 },
        { x: 0, y: 500 },
        { x: 500, y: 500 },
        { x: 500, y: 0 },
      ];
  } else if (stype == 'pentagon') {
     shape = [
        { x: 250, y:0 },
        { x:500, y:200 },
        { x:420, y:500 },
        { x:80, y:500 },
        { x:0, y:200 },
      ];
  }

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  clearCanvas();

//culoarea cu care se vor desena colturile poligonului
  ctx.fillStyle = "#ff0000";

//deseneaza colturile poligonului
  for (i = 0; i < shape.length; i++) {
      ctx.fillRect(shape[i].x-2, shape[i].y-2, 5, 5);
  }

//alege un punct la intamplare de la care va porni algoritmul
  let point = {
        x: Math.round(Math.random() * 300),
        y: Math.round(Math.random() * 300),
  };

  let count = 0;
  let previousRand = null;

//culoarea cu care se vor desena punctele fractalului
  ctx.fillStyle = "#f7d3bb";


//bucla principala a iteratiei
  while (count < iterationCount) {

      //alegerea aleatoare a coltului poligonului
      let currentRand = Math.floor(Math.random() * shape.length);

      //in cazul in care poligonul este triunghi, nu exista constrangeri suplimentare
      if (stype == 'triangle') {
          let corner = shape[currentRand];
          point.x = (point.x + corner.x) / 2;
          point.y = (point.y + corner.y) / 2;
          ctx.fillRect(point.x, point.y, 1, 1);
          count++;

      //in cazul in care poligonul este patrat, iar versiunea este 1, algoritmul va continua cu alegerea intamplatoare a punctelor
      //aceasta versiune nu va produce o figura fractala
      } else if (stype == 'square' && version == 1) {
          let corner = shape[currentRand];
          point.x = (point.x + corner.x) / 2;
          point.y = (point.y + corner.y) / 2;
          ctx.fillRect(point.x, point.y, 1, 1);
          count++;

      //in cazul in care poligonul este patrat, iar versiunea este 2, algoritmul nu permite alegerea aceluiasi colt al poligonului
      //de doua ori la rand

      } else if (stype == 'square' && version == 2) {
        if (currentRand !== previousRand) {
          previousRand = currentRand;

          let corner = shape[currentRand];
          point.x = (point.x + corner.x) / 2;
          point.y = (point.y + corner.y) / 2;
          ctx.fillRect(point.x, point.y, 1, 1);
          count++;
        }
      //in cazul in care poligonul este patrat, iar versiunea este 3, algoritmul nu permite alegerea aceluiasi colt al poligonului
      //de doua ori la rand, nici a unui colt vecin in sens antiorar

      } else if (stype == 'square'  && version == 3) {
         if ((previousRand + 1) % 4 !== currentRand) {
          previousRand = currentRand;

          let corner = shape[currentRand];
          point.x = (point.x + corner.x) / 2;
          point.y = (point.y + corner.y) / 2;
          ctx.fillRect(point.x, point.y, 1, 1);
          count++;
        }
      //in cazul in care poligonul este patrat, iar versiunea este 4, algoritmul nu permite alegerea aceluiasi colt al poligonului
      //de doua ori la rand, nici a unui colt vecin aflat la doua colturi distanta

      } else if (stype == 'square'  && version == 4) {
          if ((previousRand + 2) % 4 !== currentRand) {
          previousRand = currentRand;

          let corner = shape[currentRand];
          point.x = (point.x + corner.x) / 2;
          point.y = (point.y + corner.y) / 2;
          ctx.fillRect(point.x, point.y, 1, 1);
          count++;
        }
      //in cazul in care poligonul este pentagon, nu se pot alege puncte vecine, nici imediate nici la doua colturi distanta

      } else if (stype == 'pentagon') {
        if ((previousRand + 1) % 5 !== currentRand && (previousRand + 4) % 5 !== currentRand) {
          previousRand = currentRand;

          let corner = shape[currentRand];
          point.x = (point.x + corner.x) / 2;
          point.y = (point.y + corner.y) / 2;
          ctx.fillRect(point.x, point.y, 1, 1);
          count++;

        }
      }

  }
}