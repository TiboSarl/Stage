var tableauCentres = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var tableauCentresBis = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var tableauCentresBis_vrais = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const centresTexture3 = await (await fetch("./centresTexture3.json")).json();
tableauCentres[3] = centresTexture3;
const centresTexture5 = await (await fetch("./centresTexture5.json")).json();
tableauCentres[5] = centresTexture5;
const centresTexture6 = await (await fetch("./centresTexture6.json")).json();
tableauCentres[6] = centresTexture6;
const centresTexture7 = await (await fetch("./centresTexture7.json")).json();
tableauCentres[7] = centresTexture7;
const centresTexture8 = await (await fetch("./centresTexture8.json")).json();
tableauCentres[8] = centresTexture8;
const centresTexture10 = await (await fetch("./centresTexture10.json")).json();
tableauCentres[10] = centresTexture10;
const centresTexture11 = await (await fetch("./centresTexture11.json")).json();
tableauCentres[11] = centresTexture11;
const centresTexture12 = await (await fetch("./centresTexture12.json")).json();
tableauCentres[12] = centresTexture12;



const centresTexture3bis_vrais = await (await fetch("./centresTexture3bis_vrais.json")).json();
tableauCentresBis_vrais[3] = centresTexture3bis_vrais;
const centresTexture5bis_vrais = await (await fetch("./centresTexture5bis_vrais.json")).json();
tableauCentresBis_vrais[5] = centresTexture5bis_vrais;
const centresTexture8bis_vrais = await (await fetch("./centresTexture8bis_vrais.json")).json();
tableauCentresBis_vrais[8] = centresTexture8bis_vrais;
const centresTexture10bis_vrais = await (await fetch("./centresTexture10bis_vrais.json")).json();
tableauCentresBis_vrais[10] = centresTexture10bis_vrais;

// PARAMS
const textureHerbeBasique = false;
const textureCheminBasique = false;
const decalageHerbe = true;
const numeroTexture = 10;
const randomizeElevation = false;

const nbPierres = tableauCentresBis_vrais[numeroTexture].length;

const scene = new THREE.Scene();

// pour randomize elevation
var meshGrass;
var meshFloor;

// pour tracer des chemins
var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.name = "cube";
var Points = [
  [0, 0],
  [500, 1000],
  [2000, 3000],
  [4000, 2000],
  [5000, 3000],
];

var cubes = [];
var compteur = 0;

// cam et renderer
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
var controls = new THREE.OrbitControls(scene, camera);
document.body.appendChild(renderer.domElement);

// pour controle des touches
let state = {
  mouvement: { haut: false, bas: false, droite: false, gauche: false },
  mouvementcube: { haut: false, bas: false, droite: false, gauche: false },
  selectionPoints: false,
  space: false,
  rendre: false,
  dejacube: false,
};

///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

const loadImg = async (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => reject(`Cannot load ${url}`);
  });

const promis = [];
promis.push(loadImg("graphics/freeTexture2.png"));
promis.push(loadImg("graphics/textureGrass8.png"));
promis.push(loadImg("graphics/fleur.png"));
promis.push(loadImg("graphics/marguerite.png"));
promis.push(loadImg("graphics/freeTexture" + numeroTexture + ".png"));
promis.push(loadImg("graphics/masque_freeTexture" + numeroTexture + ".png"));

for (let i = 1; i <= nbPierres; i++) {
  promis.push(
    loadImg("graphics/Texture" + numeroTexture + "/Pierre" + i + ".png")
  );
}

console.log(nbPierres)

Promise.all(promis).then((imgs) => {
  init_textures(imgs).then((textures) => {
    init(textures);
    animate(textures);
  });
});

///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function createTextureHerbe(fleurs, herbetext, repeatX, repeatY) {
  // Create a Canvas element
  var canvasherbe = document.createElement("canvas");

  // Draw image onto the canvas
  var ctx = canvasherbe.getContext("2d");

  var wtot = herbetext.width,
    htot = herbetext.height;

  var w = wtot / 2;
  var h = htot / 4;

  // Size the canvas to the element
  canvasherbe.width = w * repeatX;
  canvasherbe.height = h * repeatY;

  // PELOUSE //
  for (let i = 0; i < repeatX; i++) {
    for (let j = 0; j < repeatY; j++) {
      var wr = Math.floor(Math.random() * 2);
      var hr = Math.floor(Math.random() * 4);

      var decalage = Math.random();
      var decalage2 = Math.random();

      if (decalageHerbe) {
        ctx.drawImage(
          herbetext,
          w * wr,
          h * hr,
          w * decalage,
          h * decalage2,
          w * i + w * (1 - decalage),
          j * h + h * (1 - decalage2),
          w * decalage,
          h * decalage2
        );

        ctx.drawImage(
          herbetext,
          w * wr + w * decalage,
          h * hr,
          w - w * decalage,
          h * decalage2,
          w * i,
          j * h + h * (1 - decalage2),
          w - w * decalage,
          h * decalage2
        );

        ctx.drawImage(
          herbetext,
          w * wr,
          h * hr + h * decalage2,
          w * decalage,
          h * (1 - decalage2),
          w * i + w * (1 - decalage),
          j * h,
          w * decalage,
          h * (1 - decalage2)
        );

        ctx.drawImage(
          herbetext,
          w * wr + w * decalage,
          h * hr + h * decalage2,
          w - w * decalage,
          h - h * decalage2,
          w * i,
          j * h,
          w - w * decalage,
          h - h * decalage2
        );
      } else {
        ctx.drawImage(herbetext, w * wr, h * hr, w, h, w * i, j * h, w, h);
      }
    }
  }

  // FLEURS //
  var nbFleurs = 20;
  var nbSorteFleurs = fleurs.length;
  var taillesFleurs = [];

  for (let i = 0; i < nbSorteFleurs; i++) {
    var wf = fleurs[i].width;
    var hf = fleurs[i].height;
    taillesFleurs.push([wf, hf]);
  }

  for (let i = 0; i < nbSorteFleurs; i++) {
    for (let j = 0; j < nbFleurs; j++) {
      var x = Math.floor(Math.random() * w * repeatX);
      var y = Math.floor(Math.random() * h * repeatY);

      var max = 3;
      var min = 5;

      var size = Math.random() * (max - min) + min;
      ctx.drawImage(
        fleurs[i],
        0,
        0,
        taillesFleurs[i][0],
        taillesFleurs[i][1],
        x,
        y,
        taillesFleurs[i][0] / size,
        taillesFleurs[i][1] / size
      );
    }
  }

  return canvasherbe;
}

function distancechemin(point, chemin) {
  var min = 100000000000000;
  var pc;
  var distance;

  for (let i = 0; i < chemin.length; i++) {
    pc = chemin[i];
    distance = Math.sqrt(
      Math.pow(pc[0] - point[0], 2) + Math.pow(pc[1] - point[1], 2)
    );
    if (distance < min) {
      min = distance;
    }
  }

  return min;
}

function estPresent(pc, pierres) {
  var i = 0;
  while (i < pierres.length) {
    var pierre = pierres[i];
    if (pc[0] == pierre[0] && pc[1] == pierre[1]) {
      return true;
    }
    i = i + 1;
  }
  return false;
}

function trouverPierrePlusProche(point, pierres, centres) {
  var min = 100000000000000;
  var pointleplusproche = [0, 0, 0];
  for (let i = 0; i < centres.length; i++) {
    var pc = centres[i];
    var distance = Math.sqrt(
      Math.pow(pc[0] - point[0], 2) + Math.pow(pc[1] - point[1], 2)
    );
    if (distance < min && !estPresent(pc, pierres)) {
      min = distance;
      pointleplusproche = pc;
    }
  }

  return pointleplusproche;
}

function tasdepierre(point, nbPierres, centres) {
  var pierres = [];
  pierres.push(point);
  for (let i = 0; i < nbPierres; i++) {
    var pierre = trouverPierrePlusProche(point, pierres, centres);
    pierres.push(pierre);
  }
  return pierres;
}

function createTextureCheminBasique(
  chemintext,
  masquetext,
  chemin,
  centres,
  repeatX,
  repeatY
) {
  const distancemaxPierre = 1000;
  const distancemax = 450;
  const distancemaxherbe = 350;

  var w = masquetext.width;
  var h = masquetext.height;

  var canvasmasque = document.createElement("canvas");
  canvasmasque.width = w * repeatX;
  canvasmasque.height = h * repeatY;

  var ctxmasque = canvasmasque.getContext("2d");
  for (let i = 0; i < repeatX; i++) {
    for (let j = 0; j < repeatY; j++) {
      ctxmasque.drawImage(masquetext, 0, 0, w, h, w * i, j * h, w, h);
    }
  }

  var canvaschemin = document.createElement("canvas");
  canvaschemin.width = w * repeatX;
  canvaschemin.height = h * repeatY;

  var ctxchemin = canvaschemin.getContext("2d");
  for (let i = 0; i < repeatX; i++) {
    for (let j = 0; j < repeatY; j++) {
      ctxchemin.drawImage(chemintext, 0, 0, w, h, w * i, j * h, w, h);
    }
  }

  var masquedata = ctxmasque.getImageData(0, 0, w * repeatX, h * repeatY);

  var canvasnoir = document.createElement("canvas");
  canvasnoir.width = w * repeatX;
  canvasnoir.height = h * repeatY;

  var ctxnoir = canvasnoir.getContext("2d");
  var noirdata = ctxnoir.getImageData(0, 0, w * repeatX, h * repeatY);

  var germes = [];
  var point;
  for (let i = 0; i < centres.length; i++) {
    point = centres[i];
    var r1 = Math.random();
    var r2 = Math.random();
    if (distancechemin(point, chemin) < distancemaxherbe) {
      germes.push(point);
    } else if (
      distancechemin(point, chemin) > distancemaxherbe &&
      distancechemin(point, chemin) < distancemax
    ) {
      if (r1 < 0.3) [germes.push(point)];
    } else if (
      distancechemin(point, chemin) > distancemax &&
      distancechemin(point, chemin) < distancemaxPierre
    ) {
      if (r2 < 0.01) {
        var nbPierres = Math.random() * 10;
        var Pierres = tasdepierre(point, nbPierres, centres);

        for (let l = 0; l < Pierres.length; l++) {
          germes.push(Pierres[l]);
        }
      }
    }
  }

  //var canvasdata;
  var canvasdatacopy;
  for (let k = 0; k < germes.length; k++) {
    canvasdatacopy = recupPierre(
      noirdata,
      masquedata,
      germes[k],
      w * repeatX,
      h * repeatY
    );
    noirdata = canvasdatacopy;
  }

  ctxnoir.putImageData(noirdata, 0, 0);

  return [canvasnoir, canvaschemin];
}

function recupPierre(masquedata, copyMasquedata, point, w, h) {
  var ipoint = point[0];
  var jpoint = point[1];
  var n = ipoint * w + jpoint;

  // point centre
  var lignehorizontal = [n];
  if (copyMasquedata.data[4 * n] == 255) {
    masquedata.data[4 * n] = 255;
    masquedata.data[4 * n + 1] = 255;
    masquedata.data[4 * n + 2] = 255;
    masquedata.data[4 * n + 3] = 255;
  }

  // ligne horizontale gauche
  var ind = n;
  var gauche = copyMasquedata.data[4 * (ind - 1)];
  while (gauche == 255 && ind - 1 != 0) {
    masquedata.data[4 * (ind - 1)] = 255;
    masquedata.data[4 * (ind - 1) + 1] = 255;
    masquedata.data[4 * (ind - 1) + 2] = 255;
    masquedata.data[4 * (ind - 1) + 3] = 255;
    ind = ind - 1;
    lignehorizontal.push(ind);
    gauche = copyMasquedata.data[4 * (ind - 1)];
  }

  // ligne horizontale droite
  var ind = n;
  var droite = copyMasquedata.data[4 * (ind + 1)];
  while (droite == 255 && ind + 1 != 0) {
    masquedata.data[4 * (ind + 1)] = 255;
    masquedata.data[4 * (ind + 1) + 1] = 255;
    masquedata.data[4 * (ind + 1) + 2] = 255;
    masquedata.data[4 * (ind + 1) + 3] = 255;
    ind = ind + 1;
    lignehorizontal.push(ind);
    droite = copyMasquedata.data[4 * (ind + 1)];
  }

  // ligne verticale
  var lignevertical = [];

  // ligne verticale bas
  var ind = n;
  var indMoins1 = ind - w;
  var bas = copyMasquedata.data[4 * indMoins1];
  while (bas == 255 && indMoins1 != 0) {
    masquedata.data[4 * indMoins1] = 255;
    masquedata.data[4 * indMoins1 + 1] = 255;
    masquedata.data[4 * indMoins1 + 2] = 255;
    masquedata.data[4 * indMoins1 + 3] = 255;
    //ind = indMoins1;
    lignevertical.push(indMoins1);
    indMoins1 = indMoins1 - w;
    bas = copyMasquedata.data[4 * indMoins1];
  }

  // ligne verticale haut
  var ind = n;
  var indPlus1 = ind + w;
  var haut = copyMasquedata.data[4 * indPlus1];
  while (gauche == 255 && indPlus1 != 0) {
    masquedata.data[4 * indPlus1] = 255;
    masquedata.data[4 * indPlus1 + 1] = 255;
    masquedata.data[4 * indPlus1 + 2] = 255;
    masquedata.data[4 * indPlus1 + 3] = 255;
    //ind = indPlus1;
    lignevertical.push(indPlus1);
    indPlus1 = indPlus1 + w;
    haut = copyMasquedata.data[4 * indPlus1];
  }

  /*
  // ligne vertical tamp
  var ligneverticaltemp = [];
  var lignehorizontaltemp = [];
  */

  // recup pixels a partir de la ligne horizontale
  for (let k = 0; k < lignehorizontal.length; k++) {
    ind = lignehorizontal[k];
    indMoins1 = ind - w;
    bas = copyMasquedata.data[4 * indMoins1];
    while (bas == 255 && indMoins1 != 0) {
      masquedata.data[4 * indMoins1] = 255;
      masquedata.data[4 * indMoins1 + 1] = 255;
      masquedata.data[4 * indMoins1 + 2] = 255;
      masquedata.data[4 * indMoins1 + 3] = 255;
      //ind = indMoins1;
      //bastemp = indMoins1;
      indMoins1 = indMoins1 - w;
      bas = copyMasquedata.data[4 * indMoins1];
    }

    //ligneverticaltemp.push(bastemp);

    ind = lignehorizontal[k];
    indPlus1 = ind + w;
    haut = copyMasquedata.data[4 * indPlus1];
    while (haut == 255 && indPlus1 != 0) {
      masquedata.data[4 * indPlus1] = 255;
      masquedata.data[4 * indPlus1 + 1] = 255;
      masquedata.data[4 * indPlus1 + 2] = 255;
      masquedata.data[4 * indPlus1 + 3] = 255;
      //ind = indPlus1;
      //hauttemp = indPlus1;
      indPlus1 = indPlus1 + w;
      haut = copyMasquedata.data[4 * indPlus1];
    }

    //ligneverticaltemp.push(hauttemp);
  }

  // recup pixels a partir de la ligne verticale
  for (let k = 0; k < lignevertical.length; k++) {
    ind = lignevertical[k];
    gauche = copyMasquedata.data[4 * (ind - 1)];
    while (gauche == 255 && ind - 1 != 0) {
      masquedata.data[4 * (ind - 1)] = 255;
      masquedata.data[4 * (ind - 1) + 1] = 255;
      masquedata.data[4 * (ind - 1) + 2] = 255;
      masquedata.data[4 * (ind - 1) + 3] = 255;
      ind = ind - 1;
      //gauchetemp = ind;
      //lignehorizontal.push(ind)
      gauche = copyMasquedata.data[4 * (ind - 1)];
    }

    //lignehorizontaltemp.push(gauchetemp);

    ind = lignevertical[k];
    droite = copyMasquedata.data[4 * (ind + 1)];
    while (droite == 255 && ind + 1 != 0) {
      masquedata.data[4 * (ind + 1)] = 255;
      masquedata.data[4 * (ind + 1) + 1] = 255;
      masquedata.data[4 * (ind + 1) + 2] = 255;
      masquedata.data[4 * (ind + 1) + 3] = 255;
      ind = ind + 1;
      //droitetemp = ind;
      //lignehorizontal.push(ind)
      droite = copyMasquedata.data[4 * (ind + 1)];
    }

    //lignehorizontaltemp.push(droitetemp);
  }
  /*
  // et zeeeeest reparti horizontal 2e fois
  // recup pixels a partir de la ligne horizontale
  for (let k = 0; k < lignehorizontaltemp.length; k++) {
      ind = lignehorizontaltemp[k];
      indMoins1 = ind - w;
      bas = copyMasquedata.data[4 * indMoins1]
      while (bas == 255 && indMoins1 != 0) {
          masquedata.data[4 * indMoins1] = 255
          masquedata.data[4 * indMoins1 + 1] = 255
          masquedata.data[4 * indMoins1 + 2] = 255
          masquedata.data[4 * indMoins1 + 3] = 255
          //ind = indMoins1;
          indMoins1 = indMoins1 - w;
          bas = copyMasquedata.data[4 * indMoins1]
      }
      
      ind = lignehorizontaltemp[k]
      indPlus1 = ind + w;
      haut = copyMasquedata.data[4 * indPlus1]
      while (haut == 255 && indPlus1 != 0) {
          masquedata.data[4 * indPlus1] = 255
          masquedata.data[4 * indPlus1 + 1] = 255
          masquedata.data[4 * indPlus1 + 2] = 255
          masquedata.data[4 * indPlus1 + 3] = 255
          //ind = indPlus1;
          indPlus1 = indPlus1 + w;
          haut = copyMasquedata.data[4 * indPlus1]
      }

  }
  
  // et zeeeeest reparti vertical 2e fois
  // recup pixels a partir de la ligne verticale
  for (let k = 0; k < ligneverticaltemp.length; k++) {
      ind = ligneverticaltemp[k]
      gauche = copyMasquedata.data[4 * (ind - 1)]
      while ((gauche == 255 && ind - 1 != 0) ) {
          masquedata.data[4 * (ind - 1)] = 255
          masquedata.data[4 * (ind - 1) + 1] = 255
          masquedata.data[4 * (ind - 1) + 2] = 255
          masquedata.data[4 * (ind - 1) + 3] = 255
          ind = ind - 1;
          //lignehorizontal.push(ind)
          gauche = copyMasquedata.data[4 * (ind - 1)]
      }
      ind = ligneverticaltemp[k];
      droite = copyMasquedata.data[4 * (ind + 1)]
      while (droite == 255 && ind + 1 != 0) {
          masquedata.data[4 * (ind + 1)] = 255
          masquedata.data[4 * (ind + 1) + 1] = 255
          masquedata.data[4 * (ind + 1) + 2] = 255
          masquedata.data[4 * (ind + 1) + 3] = 255
          ind = ind + 1;
          //lignehorizontal.push(ind)
          droite = copyMasquedata.data[4 * (ind + 1)]
      }

  }
*/

  return masquedata;
}

function createTextureCheminEvolue(
  masquetext,
  imgs,
  chemin,
  centres,
  centres_vrais,
  wtot,
  htot,
  repeatX,
  repeatY
) {
  const distancemaxPierre = 1000;
  const distancemax = 450;
  const distancemaxherbe = 350;

  // masque
  var w = masquetext.width;
  var h = masquetext.height;

  var canvasmasque = document.createElement("canvas");
  canvasmasque.width = w * repeatX;
  canvasmasque.height = h * repeatY;

  var ctxmasque = canvasmasque.getContext("2d");
  for (let i = 0; i < repeatX; i++) {
    for (let j = 0; j < repeatY; j++) {
      ctxmasque.drawImage(masquetext, 0, 0, w, h, w * i, j * h, w, h);
    }
  }

  // canvas des pierres
  var canvas = document.createElement("canvas");
  canvas.width = wtot * repeatX;
  canvas.height = htot * repeatY;

  var ctx = canvas.getContext("2d");

  var germes = [];
  var point;
  var point_vrai;
  for (let i = 0; i < centres_vrais.length; i++) {
    point_vrai = centres_vrais[i];
    point = centres[i];

    var r1 = Math.random();
    var r2 = Math.random();

    if (distancechemin(point_vrai, chemin) < distancemaxherbe) {
      germes.push(point_vrai);
    } else if (
      distancechemin(point_vrai, chemin) > distancemaxherbe &&
      distancechemin(point_vrai, chemin) < distancemax
    ) {
      if (r1 < 0.3) [germes.push(point_vrai)];
    } else if (
      distancechemin(point_vrai, chemin) > distancemax &&
      distancechemin(point_vrai, chemin) < distancemaxPierre
    ) {
      if (r2 < 0.01) {
        var nbPierresTas = Math.random() * 10;
        var Pierres = tasdepierre(point_vrai, nbPierresTas, centres_vrais);
        for (let l = 0; l < Pierres.length; l++) {
          germes.push(Pierres[l]);
        }
      }
    }
  }

  var numeroPierre;
  var x;
  var y;
  var imw;
  var imh;
  var image;
  for (let k = 0; k < germes.length; k++) {
    numeroPierre = germes[k][2] % nbPierres;
    image = imgs[numeroPierre];
    imw = image.width;
    imh = image.height;

    x = germes[k][0] - imh / 2;
    y = germes[k][1] - imw / 2;

    if ((x > 0) & (y > 0)) {
      ctx.drawImage(image, 0, 0, imw, imh, y, x, imw, imh);
    }
  }

  return [canvasmasque, canvas];
}

function recupPierreImage(canvas, img, point, w, h) {}

// Fonction pour définir une texture
function defineTexture(src, repeatX, repeatY, repeatWrapping = false) {
  var textu = new THREE.TextureLoader().load(src);
  if (repeatWrapping) {
    textu.wrapS = THREE.RepeatWrapping;
    textu.wrapT = THREE.RepeatWrapping;
    textu.repeat.set(repeatX, repeatY);
  } else {
    textu.wrapS = THREE.ClampToEdgeWrapping;
    textu.wrapT = THREE.ClampToEdgeWrapping;
  }

  return textu;
}

function defineTextureCanvas(src, repeatX, repeatY, repeatWrapping = false) {
  var textu = new THREE.CanvasTexture(src);
  if (repeatWrapping) {
    textu.wrapS = THREE.RepeatWrapping;
    textu.wrapT = THREE.RepeatWrapping;
    textu.repeat.set(repeatX, repeatY);
  } else {
    textu.wrapS = THREE.ClampToEdgeWrapping;
    textu.wrapT = THREE.ClampToEdgeWrapping;
  }

  return textu;
}

// Fonction pour définir un maillage de plan
function definePlane(mater, x, y, z, w, h, faces = 1) {
  var meshPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h, faces, faces),
    mater
  );

  meshPlane.rotation.x += (-1 * Math.PI) / 2;
  meshPlane.position.x = x;
  meshPlane.position.y = y;
  meshPlane.position.z = z;

  return meshPlane;
}

function mintibo(T) {
  var mini = 100000;
  for (let i = 0; i < T.length; i++) {
    if (T[i] < mini) {
      mini = T[i];
    }
  }
  return mini;
}

function maxtibo(T) {
  var mini = -100000;
  for (let i = 0; i < T.length; i++) {
    if (T[i] > mini) {
      mini = T[i];
    }
  }
  return mini;
}

function buildParametrisationTchebytcheff(nbElem, pas) {
  var T = [];
  var tToEval1 = [];

  var t = 0;

  for (let i = 0; i < nbElem; i++) {
    t = Math.cos(((2 * i + 1) * Math.PI) / (2 * nbElem + 2));
    T.push(t);
  }
  var te = mintibo(T);
  var tmax = maxtibo(T);
  while (te < tmax) {
    tToEval1.push(te);
    te = te + pas;
  }
  return [T, tToEval1];
}

function lagrange(x, X, Y) {
  var Somme = 0;

  for (let i = 0; i < X.length; i++) {
    var lagrangei = 1;
    for (let j = 0; j < X.length; j++) {
      if (i != j) {
        lagrangei = lagrangei * ((x - X[j]) / (X[i] - X[j]));
      }
    }
    Somme = Somme + lagrangei * Y[i];
  }
  return Somme;
}

function computeCheminInterpol(Points) {
  var X = [];
  var Y = [];
  var chemin = [];
  for (let i = 0; i < Points.length; i++) {
    X.push(Points[i][0]);
    Y.push(Points[i][1]);
  }

  var temps = buildParametrisationTchebytcheff(Points.length, 0.01);
  var T = temps[0];
  var tToEval = temps[1];
  for (let i = 0; i < tToEval.length; i++) {
    var xpoint = lagrange(tToEval[i], T, X);
    var ypoint = lagrange(tToEval[i], T, Y);

    var rx = Math.random() * 100;
    var ry = Math.random() * 100;
    var negx = Math.random();
    var negy = Math.random();
    if (negx < 0.5) {
      rx = -rx;
    }
    if (negy < 0.5) {
      ry = -ry;
    }

    chemin.push([xpoint, ypoint]);
  }
  return chemin;
}

function dupliquer(centres, Xrepeat, Yrepeat, w, h) {
  var T = [];

  for (let k = 0; k < centres.length; k++) {
    var x = centres[k][0];
    var y = centres[k][1];

    for (let i = 0; i < Xrepeat; i++) {
      for (let j = 0; j < Yrepeat; j++) {
        var xnouveau = x + i * w;
        var ynouveau = y + j * h;
        T.push([xnouveau, ynouveau, k]);
      }
    }
  }

  return T;
}

function transformCanvastoThreeCoordonates(x, z) {
  var newx = z / 512 - 5;
  var newz = x / 512 - 5;
  var newy = 0.1;
  var coordonnees = [newx, newy, newz];
  return coordonnees;
}

function transformThreeCoordonatestoCanvas(x, z) {
  var newx = (z + 5) * 512;
  var newz = (x + 5) * 512;
  var coordonnees = [newx, newz];
  return coordonnees;
}

///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function init_textures(imgs) {
  ///////////// HERBE /////////////
  var materialFond;

  if (textureHerbeBasique) {
    const texture = defineTexture(imgs[0].src, 10, 10, true);
    materialFond = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
  } else {
    var canvasherbe = createTextureHerbe([imgs[2], imgs[3]], imgs[1], 10, 10);
    var texture = defineTextureCanvas(canvasherbe, 0, 0, false);
    texture.minFilter = THREE.LinearFilter;

    materialFond = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
  }

  /////////// CHEMIN /////////

  var materialChemin;

  if (textureCheminBasique) {
    var chemin = computeCheminInterpol(Points);
    var centres = dupliquer(tableauCentres[numeroTexture], 10, 10, 512, 512);

    var tabresult = createTextureCheminBasique(
      imgs[4],
      imgs[5],
      chemin,
      centres,
      10,
      10
    );
    var canvascheminMasque = tabresult[0];
    var canvaschemin = tabresult[1];

    const textureChemin = defineTextureCanvas(canvaschemin, 0, 0, false);
    textureChemin.minFilter = THREE.LinearFilter;

    const textureCheminMasque = defineTextureCanvas(
      canvascheminMasque,
      0,
      0,
      false
    );
    textureCheminMasque.minFilter = THREE.LinearFilter;

    materialChemin = new THREE.MeshBasicMaterial({
      alphaMap: textureCheminMasque,
      alphaTest: 0.5,
      map: textureChemin,
      side: THREE.DoubleSide,
    });
  } else {
    var chemin = computeCheminInterpol(Points);
    var centres = dupliquer(tableauCentresBis[numeroTexture], 10, 10, 512, 512);
    var centres_vrais = dupliquer(
      tableauCentresBis_vrais[numeroTexture],
      10,
      10,
      512,
      512
    );

    var images = imgs.splice(6, nbPierres);

    /*
    var centres = [];
    for (let i=0; i<images.length; i++) {
      var im = images[i];
      console.log(im)
      var w = im.width;
      var h = im.height;
      var centrey = centresTexture3bis[i][1] + w / 2;
      var centrex = centresTexture3bis[i][0] + h/ 2;
      if (centrex > 512) {
        centrex = centrex - 512;
      }
      if (centrey > 512) {
        centrey = centrey - 512;
      }
      centres.push([centrex, centrey]);
    }
    console.log(centres)
    console.log(images.length)*/

    var tabresult = createTextureCheminEvolue(
      imgs[5],
      images,
      chemin,
      centres,
      centres_vrais,
      512,
      512,
      10,
      10
    );
    var canvascheminMasque = tabresult[0];
    var canvaschemin = tabresult[1];

    const textureChemin = defineTextureCanvas(canvaschemin, 0, 0, false);
    textureChemin.minFilter = THREE.LinearFilter;

    const textureCheminMasque = defineTextureCanvas(
      canvascheminMasque,
      0,
      0,
      false
    );
    textureCheminMasque.minFilter = THREE.LinearFilter;

    materialChemin = new THREE.MeshBasicMaterial({
      alphaMap: textureCheminMasque,
      alphaTest: 0.5,
      map: textureChemin,
      side: THREE.DoubleSide,
    });
  }

  return Promise.resolve([materialFond, materialChemin]);
}

// Fonction d'initialisation principale
function init(textures) {
  document.addEventListener(
    "contextmenu",
    function (event) {
      event.preventDefault();
    },
    false
  );

  // Déplacement dans la scène avec Z Q S D
  document.addEventListener("keydown", function (event) {
    if (event.keyCode == 68) {
      state.mouvement.haut = true;
    } else if (event.keyCode == 81) {
      state.mouvement.bas = true;
    } else if (event.keyCode == 90) {
      state.mouvement.droite = true;
    } else if (event.keyCode == 83) {
      state.mouvement.gauche = true;
    } else if (event.keyCode == 38) {
      state.mouvementcube.gauche = true;
    } else if (event.keyCode == 40) {
      state.mouvementcube.droite = true;
    } else if (event.keyCode == 37) {
      state.mouvementcube.haut = true;
    } else if (event.keyCode == 39) {
      state.mouvementcube.bas = true;
    } else if (event.keyCode == 32) {
      state.space = true;
    } else if (event.keyCode == 16) {
      state.selectionPoints = true;
    } else if (event.keyCode == 13) {
      state.rendre = true;
    }
  });

  document.addEventListener("keyup", function (event) {
    if (event.keyCode == 68) {
      state.mouvement.haut = false;
    } else if (event.keyCode == 81) {
      state.mouvement.bas = false;
    } else if (event.keyCode == 90) {
      state.mouvement.droite = false;
    } else if (event.keyCode == 83) {
      state.mouvement.gauche = false;
    } else if (event.keyCode == 38) {
      state.mouvementcube.gauche = false;
    } else if (event.keyCode == 40) {
      state.mouvementcube.droite = false;
    } else if (event.keyCode == 37) {
      state.mouvementcube.haut = false;
    } else if (event.keyCode == 39) {
      state.mouvementcube.bas = false;
    }
  });

  var mapW = 10;
  var mapH = 10;

  // Ajout d'une source de lumière
  const luminosite = 1; // entre 0 et 1
  const ambiantLight = new THREE.AmbientLight(0xcccccc, luminosite);
  scene.add(ambiantLight);

  // Ajout des contrôles à la souris
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  //controls.update() doit être appelé chaque fois que la position de la caméra est modifiée manuellement
  camera.position.set(0, 4, 0);
  controls.update();

  // Creation de deux plans
  const epsilon = 0.001;

  meshGrass = definePlane(textures[0], 0, 0, 0, mapW, mapH, 10, 10);
  meshGrass.name = "pelouse";
  scene.add(meshGrass);

  meshFloor = definePlane(textures[1], 0, epsilon, 0, mapW, mapH, 10, 10);
  meshFloor.name = "floor";
  scene.add(meshFloor);

  // Ajout de la ligne du chemin
  var chemin = computeCheminInterpol(Points);
  var pointsClick = [];
  for (let i = 0; i < chemin.length; i++) {
    var x = chemin[i][0];
    var z = chemin[i][1];
    var newcoordinates = transformCanvastoThreeCoordonates(x, z);
    pointsClick.push(
      new THREE.Vector3(newcoordinates[0], newcoordinates[1], newcoordinates[2])
    );
  }

  var geometryClick = new THREE.Geometry().setFromPoints(pointsClick);
  var materialClick = new THREE.LineBasicMaterial({ color: 0x0000ff });

  var lineClick = new THREE.Line(geometryClick, materialClick);
  lineClick.name = "line";
  scene.add(lineClick);

  if (randomizeElevation) {
    randomize_elevation(0.4, 0, epsilon);
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

  if (state.mouvement.bas) {
    scene.position.x += 0.1;
  } else if (state.mouvement.haut) {
    scene.position.x -= 0.1;
  } else if (state.mouvement.droite) {
    scene.position.z += 0.1;
  } else if (state.mouvement.gauche) {
    scene.position.z -= 0.1;
  } else if (state.mouvementcube.haut) {
    cube.position.x -= 0.03;
  } else if (state.mouvementcube.bas) {
    cube.position.x += 0.03;
  } else if (state.mouvementcube.droite) {
    cube.position.z += 0.03;
  } else if (state.mouvementcube.gauche) {
    cube.position.z -= 0.03;
  } else if (state.space) {
    var xenter = cube.position.x;
    var zenter = cube.position.z;
    var coordonnespoint = transformThreeCoordonatestoCanvas(xenter, zenter);
    Points.push(coordonnespoint);

    var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cubeAffichage = new THREE.Mesh(geometry, material);
    cubes.push(cubeAffichage);
    cubes[compteur].name = "cube" + compteur;
    cubes[compteur].position.x = xenter;
    cubes[compteur].position.z = zenter;
    scene.add(cubes[compteur]);
    compteur = compteur + 1;

    state.space = false;
  } else if (state.selectionPoints) {
    for (let i = 0; i < compteur; i++) {
      var selectedObject = scene.getObjectByName("cube" + i);
      scene.remove(selectedObject);
    }

    var selectedObject = scene.getObjectByName("line");
    scene.remove(selectedObject);

    var selectedObject = scene.getObjectByName("floor");
    scene.remove(selectedObject);

    if (!state.dejacube) {
      scene.add(cube);
    }

    console.log("construction de chemin");
    state.dejacube = true;
    state.selectionPoints = false;
    Points = [];
    cubes = [];
    compteur = 0;
  } else if (state.rendre) {
    var selectedObject = scene.getObjectByName("pelouse");
    scene.remove(selectedObject);

    Promise.all(promis).then((imgs) => {
      init_textures(imgs).then((textures) => {
        init(textures);
      });
    });

    state.rendre = false;
  }
}

// Assigner des élévations aléatoires aux vertices des maillages plans
function randomize_elevation(value = 0.4, offset = 0, epsilon) {
  for (let i = 0; i < meshFloor.geometry.vertices.length; i++) {
    let random_value = Math.random();
    meshFloor.geometry.vertices[i].z = random_value * value + offset + epsilon;
    meshGrass.geometry.vertices[i].z = random_value * value + offset;
  }
  meshFloor.geometry.verticesNeedUpdate = true;
  meshGrass.geometry.verticesNeedUpdate = true;
}

/*
// Récupérer l'élévation correspondant à une position au sol donnée
function zPos(x, y) {

  let caseX = Math.floor(x)
  let caseY = Math.floor(y)
  let u = (x + 100) % 1
  let v = (y + 100) % 1

  let indexFace = 200 * (caseZ + 50) + 2 * (caseX + 50) + (u + v > 1)
  if (meshFloor.geometry.faces[indexFace] === undefined) {
      return 0
  }
  let pt1 = meshFloor.geometry.vertices[meshFloor.geometry.faces[indexFace].a]
  let pt2 = meshFloor.geometry.vertices[meshFloor.geometry.faces[indexFace].b]
  let pt3 = meshFloor.geometry.vertices[meshFloor.geometry.faces[indexFace].c]

  if (u + v < 1) {
      return pt1.z + (pt3.z - pt1.z) * u + (pt2.z - pt1.z) * v
  } else {
      return pt1.z + pt3.z - pt2.z + (pt2.z - pt1.z) * u + (pt2.z - pt3.z) * v
  }

}
*/
