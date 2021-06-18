const centresTexture11bis = await (
  await fetch("./centresTexture11bis.json")
).json();

const centresTexture11 = await (await fetch("./centresTexture11.json")).json();
const centresTexture3 = await (await fetch("./centresTexture3.json")).json();
const centresTexture10 = await (await fetch("./centresTexture10.json")).json();
const centresTexture8 = await (await fetch("./centresTexture8.json")).json();
const centresTexture7 = await (await fetch("./centresTexture7.json")).json();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
var controls = new THREE.OrbitControls(scene, camera);
document.body.appendChild(renderer.domElement);

let state = {
  mouvement: { haut: false, bas: false, droite: false, gauche: false },
  mouvementcube: { haut: false, bas: false, droite: false, gauche: false },
  selectionPoints: false,
  space: false,
  rendre: false,
  dejacube: false,
};

const loadImg = async (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => reject(`Cannot load ${url}`);
  });

const promis = [];
for (let i = 1; i <= centresTexture11bis.length; i++) {
  promis.push(loadImg("graphics/Texture11/Pierre" + i + ".png"));
}
Promise.all(promis).then((imgs) => {
  init_textures(imgs).then((Textures) => {
    init(Textures);
    animate();
  });
});

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

function defineTextureCanvas(data, repeatX, repeatY, repeatWrapping = false) {
  const textu = new THREE.DataTexture(new Uint8Array(data.data.buffer));
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

function createCanvasforTextureRepeat(src, repeatX, repeatY) {
  // Get a reference to the image you want the pixels of and its dimensions
  var myImage1 = document.getElementById(src);

  var w1 = myImage1.width,
    h1 = myImage1.height;

  // Create a Canvas element
  var canvas1 = document.createElement("canvas");

  // Size the canvas to the element
  canvas1.width = w1 * repeatX;
  canvas1.height = h1 * repeatY;

  // Draw image onto the canvas
  var ctx1 = canvas1.getContext("2d");

  for (let i = 0; i < repeatX; i++) {
    for (let j = 0; j < repeatY; j++) {
      ctx1.drawImage(myImage1, w1 * i, j * h1);
    }
  }

  return canvas1;
}

async function createTextureHerbe(repeatX, repeatY) {
  //console.log(herbe2);
  //console.log(herbe2)
  var herbetext = document.getElementById("herbetext");
  var wtot = herbetext.width,
    htot = herbetext.height;

  var w1 = wtot / 2;
  var h1 = htot / 4;

  // Create a Canvas element
  var canvasherbe = document.createElement("canvas");

  // Size the canvas to the element
  canvasherbe.width = w1 * repeatX;
  canvasherbe.height = h1 * repeatY;

  //console.log(canvasherbe.height)

  // Draw image onto the canvas
  var ctx1 = canvasherbe.getContext("2d");

  herbetext.onload = FaireCanvasHerbe(repeatX, repeatY, ctx1, w1, h1);
  //var im = ctxherbe.getImageData(0,0,w1*repeatX, h1*repeatY)
  //console.log(im.data)

  function FaireCanvasHerbe(repeatX, repeatY, ctxherbe, w1, h1) {
    for (let i = 0; i < repeatX; i++) {
      for (let j = 0; j < repeatY; j++) {
        var wr = Math.floor(Math.random() * 2);
        var hr = Math.floor(Math.random() * 4);
        var decalage = Math.random();
        var decalage2 = Math.random();
        ctxherbe.drawImage(
          herbetext,
          w1 * wr,
          h1 * hr,
          w1 * decalage,
          h1 * decalage2,
          w1 * i + w1 * (1 - decalage),
          j * h1 + h1 * (1 - decalage2),
          w1 * decalage,
          h1 * decalage2
        );

        ctxherbe.drawImage(
          herbetext,
          w1 * wr + w1 * decalage,
          h1 * hr,
          w1 - w1 * decalage,
          h1 * decalage2,
          w1 * i,
          j * h1 + h1 * (1 - decalage2),
          w1 - w1 * decalage,
          h1 * decalage2
        );

        ctxherbe.drawImage(
          herbetext,
          w1 * wr,
          h1 * hr + h1 * decalage2,
          w1 * decalage,
          h1 * (1 - decalage2),
          w1 * i + w1 * (1 - decalage),
          j * h1,
          w1 * decalage,
          h1 * (1 - decalage2)
        );

        ctxherbe.drawImage(
          herbetext,
          w1 * wr + w1 * decalage,
          h1 * hr + h1 * decalage2,
          w1 - w1 * decalage,
          h1 - h1 * decalage2,
          w1 * i,
          j * h1,
          w1 - w1 * decalage,
          h1 - h1 * decalage2
        );
      }
    }
  }

  return Promise.resolve(canvasherbe);
}

/////////////////////////////////////
///////////Debut chemin//////////////
/////////////////////////////////////

function linspace(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + step * i);
  }
  return arr;
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

function buildParametrisationReguliere(nbElem, pas) {
  var T = [];
  var tToEval = [];

  for (let i = 0; i < nbElem; i++) {
    T.push(i);
  }
  var j = 0;
  while (j * pas < nbElem) {
    tToEval.push(j * pas);
    j = j + 1;
  }
  var result = [T, tToEval];
  return result;
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

function computeCheminLigneBrisee(Points) {
  var chemin = [];
  for (let i = 0; i < Points.length - 1; i++) {
    var temps = linspace(0, 1, 20);
    for (let k = 0; k < temps.length; k++) {
      var t = temps[k];
      var x = Math.floor((1 - t) * Points[i][0] + t * Points[i + 1][0]);
      var y = Math.floor((1 - t) * Points[i][1] + t * Points[i + 1][1]);
      chemin.push([x, y]);
    }
  }

  return chemin;
}

/////////////////////////////////////
/////Debut modification masque///////
/////////////////////////////////////

function distancechemin(point, chemin) {
  var min = 100000000000000;

  for (let i = 0; i < chemin.length; i++) {
    var pc = chemin[i];
    var distance = Math.sqrt(
      Math.pow(pc[0] - point[0], 2) + Math.pow(pc[1] - point[1], 2)
    );
    if (distance < min) {
      min = distance;
    }
  }

  return min;
}

function modifierMasque(canvas, chemin) {
  var distancemax = 350;
  var ctx = canvas.getContext("2d");
  var w = canvas.width;
  var h = canvas.height;

  var masquedata = ctx.getImageData(0, 0, w, h);

  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      var point = [i, j];
      var n = i * w + j;

      if (
        masquedata.data[4 * n] == 255 &&
        masquedata.data[4 * n + 1] == 0 &&
        masquedata.data[4 * n + 2] == 0
      ) {
        var distance = distancechemin(point, chemin);
        /*
                negatif = Math.random();
                if (negatif < 0.5) {
                    distancemax = distancemax - Math.random() * 100;
    
                } else {
                    distancemax = distancemax + Math.random() * 100;
                }
                */
        if (distance > distancemax) {
          var n = i * w + j;
          masquedata.data[4 * n] = 0;
          masquedata.data[4 * n + 1] = 0;
          masquedata.data[4 * n + 2] = 0;
        }
      }
    }
  }
  ctx.putImageData(masquedata, 0, 0);
  return canvas;
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
  var pointleplusproche = [0, 0];
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

async function modifierTexture(canvas, chemin, centres, imgs) {
  var distancemaxPierre = 1000;
  var distancemax = 450;
  var distancemaxherbe = 350;
  var ctx = canvas.getContext("2d");
  var w = canvas.width;
  var h = canvas.height;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < centres.length; i++) {
    var point = centres[i];
    var r1 = Math.random();
    var r2 = Math.random();
    if (distancechemin(point, chemin) < distancemaxherbe) {
      var numero = i % centresTexture11bis.length;
      afficherPierre(numero, point, canvas, imgs);
    } else if (
      distancechemin(point, chemin) > distancemaxherbe &&
      distancechemin(point, chemin) < distancemax
    ) {
      if (r1 < 0.3) {
        var numero = i % centresTexture11bis.length;
        afficherPierre(numero, point, canvas, imgs);
      }
    }
  }
  return Promise.resolve(canvas);
}

function afficherPierre(numero, germe, canvas, imgs) {
  var ctx = canvas.getContext("2d");
  var img = imgs[numero];

  var w1 = img.width;
  var h1 = img.width;
  ctx.drawImage(img, germe[0] - w1 / 2, germe[1] - h1 / 2);
}

function modifierMasque2(canvas, chemin, masque, centres) {
  var distancemaxPierre = 1000;
  var distancemax = 450;
  var distancemaxherbe = 350;
  var ctx = canvas.getContext("2d");
  var w = canvas.width;
  var h = canvas.height;
  ctx.fillRect(0, 0, w, h);
  var canvasdata = ctx.getImageData(0, 0, w, h);
  var ctx2 = masque.getContext("2d");
  var masquedata = ctx2.getImageData(0, 0, w, h);
  var germes = [];
  for (let i = 0; i < centres.length; i++) {
    var point = centres[i];
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
  console.log("germes obtenus");

  for (let k = 0; k < germes.length; k++) {
    /*
        var r = Math.random()
        if (r < 0.95) {
            canvasdata1 = recupPierre(canvasdata, masquedata, germes[k], w, h);
            canvasdata = canvasdata1
        }*/
    var canvasdata1 = recupPierre(canvasdata, masquedata, germes[k], w, h);
    canvasdata = canvasdata1;
  }
  ctx.putImageData(canvasdata1, 0, 0);
  return canvas;
}

function recupImageData(canvas) {
  var ctx = canvas.getContext("2d");
  var w = canvas.width;
  var h = canvas.height;
  var data = ctx.getImageData(0, 0, w, h);

  return data;
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
  ind = n;
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
  lignevertical = [];

  // ligne verticale bas
  ind = n;
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
  ind = n;
  var indPlus1 = ind + w;
  gauche = copyMasquedata.data[4 * indPlus1];
  while (gauche == 255 && indPlus1 != 0) {
    masquedata.data[4 * indPlus1] = 255;
    masquedata.data[4 * indPlus1 + 1] = 255;
    masquedata.data[4 * indPlus1 + 2] = 255;
    masquedata.data[4 * indPlus1 + 3] = 255;
    //ind = indPlus1;
    lignevertical.push(indPlus1);
    indPlus1 = indPlus1 + w;
    gauche = copyMasquedata.data[4 * indPlus1];
  }

  // ligne vertical tamp
  var ligneverticaltemp = [];
  var lignehorizontaltemp = [];

  // recup pixels a partir de la ligne horizontale
  for (let k = 0; k < lignehorizontal.length; k++) {
    ind = lignehorizontal[k];
    indMoins1 = ind - w;
    bas = copyMasquedata.data[4 * indMoins1];
    var bastemp = indMoins1;
    while (bas == 255 && indMoins1 != 0) {
      masquedata.data[4 * indMoins1] = 255;
      masquedata.data[4 * indMoins1 + 1] = 255;
      masquedata.data[4 * indMoins1 + 2] = 255;
      masquedata.data[4 * indMoins1 + 3] = 255;
      //ind = indMoins1;
      bastemp = indMoins1;
      indMoins1 = indMoins1 - w;
      bas = copyMasquedata.data[4 * indMoins1];
    }

    ligneverticaltemp.push(bastemp);

    ind = lignehorizontal[k];
    indPlus1 = ind + w;
    var haut = copyMasquedata.data[4 * indPlus1];
    var hauttemp = indPlus1;
    while (haut == 255 && indPlus1 != 0) {
      masquedata.data[4 * indPlus1] = 255;
      masquedata.data[4 * indPlus1 + 1] = 255;
      masquedata.data[4 * indPlus1 + 2] = 255;
      masquedata.data[4 * indPlus1 + 3] = 255;
      //ind = indPlus1;
      hauttemp = indPlus1;
      indPlus1 = indPlus1 + w;
      haut = copyMasquedata.data[4 * indPlus1];
    }

    ligneverticaltemp.push(hauttemp);
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
      gauchetemp = ind;
      //lignehorizontal.push(ind)
      gauche = copyMasquedata.data[4 * (ind - 1)];
    }

    lignehorizontaltemp.push(gauchetemp);

    ind = lignevertical[k];
    droite = copyMasquedata.data[4 * (ind + 1)];
    while (droite == 255 && ind + 1 != 0) {
      masquedata.data[4 * (ind + 1)] = 255;
      masquedata.data[4 * (ind + 1) + 1] = 255;
      masquedata.data[4 * (ind + 1) + 2] = 255;
      masquedata.data[4 * (ind + 1) + 3] = 255;
      ind = ind + 1;
      droitetemp = ind;
      //lignehorizontal.push(ind)
      droite = copyMasquedata.data[4 * (ind + 1)];
    }

    lignehorizontaltemp.push(droitetemp);
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
        while (gauche == 255 && ind - 1 != 0) {
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

function recupPierres(canvas, copyMasquedata) {
  var ctx = canvas.getContext("2d");
  var w = canvas.width;
  var h = canvas.height;
  var masquedata = ctx.getImageData(0, 0, w, h);

  if (masquedata.data.length == copyMasquedata.data.length) {
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        var n = i * w + j;

        // cote gauche
        if (n - 1 > 0) {
          if (
            masquedata.data[4 * n] == 255 &&
            masquedata.data[4 * (n - 1)] == 0 &&
            copyMasquedata.data[4 * (n - 1)] == 255
          ) {
            var ind = n;
            var gauche = copyMasquedata.data[4 * (ind - 1)];
            while (gauche == 255 && ind - 1 != 0) {
              masquedata.data[4 * (ind - 1)] = 255;
              masquedata.data[4 * (ind - 1) + 1] = 255;
              masquedata.data[4 * (ind - 1) + 2] = 255;
              masquedata.data[4 * (ind - 1) + 3] = 255;
              ind = ind - 1;
              gauche = copyMasquedata.data[4 * (ind - 1)];
            }
          }
        }

        // cote droit
        if (n - 1 > 0) {
          if (
            masquedata.data[4 * n] == 255 &&
            masquedata.data[4 * (n + 1)] == 0 &&
            copyMasquedata.data[4 * (n + 1)] == 255
          ) {
            ind = n;
            gauche = copyMasquedata.data[4 * (ind + 1)];
            while (gauche == 255 && ind + 1 != 0) {
              masquedata.data[4 * (ind + 1)] = 255;
              masquedata.data[4 * (ind + 1) - 1] = 255;
              masquedata.data[4 * (ind + 1) - 2] = 255;
              masquedata.data[4 * (ind + 1) - 3] = 255;
              ind = ind + 1;
              gauche = copyMasquedata.data[4 * (ind + 1)];
            }
          }
        }
      }
    }

    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        var n = i * w + j;
        var nMoins1 = (i - 1) * w + j;
        var nPlus1 = (i + 1) * w + j;

        // en haut
        if (nMoins1 >= 4) {
          if (
            masquedata.data[4 * n] == 255 &&
            masquedata.data[4 * nMoins1] == 0 &&
            copyMasquedata.data[4 * nMoins1] == 255
          ) {
            ind = n;
            var indMoins1 = n - w;
            gauche = copyMasquedata.data[4 * indMoins1];
            while (gauche == 255 && indMoins1 != 0) {
              masquedata.data[4 * indMoins1] = 255;
              masquedata.data[4 * indMoins1 - 1] = 255;
              masquedata.data[4 * indMoins1 - 2] = 255;
              masquedata.data[4 * indMoins1 - 3] = 255;
              ind = indMoins1;
              indMoins1 = indMoins1 - w;
              gauche = copyMasquedata.data[4 * indMoins1];
            }
          }
        }

        // en bas
        if (nPlus1 <= masquedata.data.length) {
          if (
            masquedata.data[4 * n] == 255 &&
            masquedata.data[4 * nPlus1] == 0 &&
            copyMasquedata.data[4 * nPlus1] == 255
          ) {
            ind = n;
            var indPlus1 = n + w;
            gauche = copyMasquedata.data[4 * indPlus1];
            while (gauche == 255 && indPlus1 != 0) {
              masquedata.data[4 * indPlus1] = 255;
              masquedata.data[4 * indPlus1 + 1] = 255;
              masquedata.data[4 * indPlus1 + 2] = 255;
              masquedata.data[4 * indPlus1 + 3] = 255;
              ind = indPlus1;
              indPlus1 = indPlus1 + w;
              gauche = copyMasquedata.data[4 * indPlus1];
            }
          }
        }
      }
    }

    /*
        if (masquedata.data[i] != copyMasquedata.data[i]) {
            masquedata.data[i] = 255
        }*/
  }

  ctx.putImageData(masquedata, 0, 0);

  return canvas;
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

function dupliquer(centres, Xrepeat, Yrepeat, w, h) {
  var T = [];

  for (let k = 0; k < centres.length; k++) {
    var x = centresTexture3[k][0];
    var y = centresTexture3[k][1];

    for (let i = 0; i < Xrepeat; i++) {
      for (let j = 0; j < Yrepeat; j++) {
        var xnouveau = x + i * w;
        var ynouveau = y + j * h;
        T.push([xnouveau, ynouveau]);
      }
    }
  }

  return T;
}

// Fonction d'initialisation des textures
function init_textures(imgs) {
  ////////////////////////////////////// HERBES ////////////////////
  // Get a reference to the image you want the pixels of and its dimensions

  ///////////////////////////////////////////////////////////////////////////////
  // Pour n'afficher que les edges
  var wireframe_mode = false;

  var textureGrassBasique = defineTexture(
    "graphics/freeTexture2.png",
    10,
    10,
    true
  );
  var materialGrassBasique = new THREE.MeshBasicMaterial({
    map: textureGrassBasique,
    side: THREE.DoubleSide,
    wireframe: wireframe_mode,
  });

  const loadGrass = async () => {
    var canvasherbe = await createTextureHerbe(10, 10);
    var ctx = await canvasherbe.getContext("2d");
    var data = await ctx.getImageData(0, 0, 5120, 5120);
    console.log(data.data);
    var textureGrass = defineTextureCanvas(data, 0, 0, false);
    textureGrass.minFilter = THREE.LinearFilter;
    textureGrass.needsUpdate = true;
    var materialGrass = new THREE.MeshBasicMaterial({
      map: textureGrass,
      side: THREE.DoubleSide,
      wireframe: false,
    });

    console.log("herbe chargée");
    //document.body.appendChild(canvasherbe);
    return Promise.resolve([materialGrass, textureGrass]);
  };

  //console.log(materialGrassBasique)

  var tex = defineTexture("graphics/textures.png", 1, 1);
  tex.anisotropy = 16;

  var textureMask = defineTexture(
    "graphics/masque_freeTexture11.png",
    10,
    10,
    true
  );

  ////////////////////////////////////////////////////////TEXTURE/////////////////////////////

  //var canvas1 = createCanvasforTextureRepeat('texture', 10, 10);
  var canvas1 = document.createElement("canvas");
  canvas1.width = 512 * 10;
  canvas1.height = 512 * 10;

  var Points = [
    [0, 0],
    [500, 1000],
    [2000, 3000],
    [4000, 2000],
    [5000, 3000],
  ];
  var chemin = computeCheminInterpol(Points);

  var centres = dupliquer(centresTexture3, 10, 10, 512, 512);

  const loadChemin = async () => {
    let canvas = await modifierTexture(canvas1, chemin, centres, imgs);
    var ctx1 = await canvas.getContext("2d");

    var data1 = await ctx1.getImageData(0, 0, 5120, 5120);
    console.log(data1.data);

    var textureRock5bis = defineTextureCanvas(data1, 0, 0, false);
    textureRock5bis.minFilter = THREE.LinearFilter;
    textureRock5bis.needsUpdate = true;
    var materialRock5 = new THREE.MeshBasicMaterial({
      map: textureRock5bis,
      side: THREE.DoubleSide,
      wireframe: false,
    });

    console.log("chemin chargé");
    //document.body.appendChild(canvas);

    return Promise.resolve([materialRock5, textureRock5bis]);
  };

  /*
    ///////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////MASQUE////////////////////

    var canvas = createCanvasforTextureRepeat('masque', 10, 10);

    var myImage1 = document.getElementById('masque');


    var w1 = myImage1.width, h1 = myImage1.height;


    var canvas2 = document.createElement('canvas');

    // Size the canvas to the element
    canvas2.width = canvas1.width;
    canvas2.height = canvas1.height;

    Points = [[0, 0], [500, 1000], [2000, 3000], [4000, 2000], [5000, 3000]];
    var chemin = computeCheminInterpol(Points);

    var centres = dupliquer(centresTexture3, 10, 10, w1, h1);
    console.log("modifierMasque2")
    canvas2 = modifierMasque2(canvas2, chemin, canvas, centres)
    */

  /*
    canvas = createCanvasforTextureRepeat('masque', 10, 10);

    var copyMasquedata = recupImageData(canvas);

    Points = [[0, 0], [500, 1000], [2000, 3000], [4000, 2000], [5000, 3000]];
    var chemin = computeCheminInterpol(Points);
    modifierMasque(canvas, chemin);

    recupPierres(canvas, copyMasquedata);
    */

  /*
    var texturemasque = defineTextureCanvas(canvas2, 0, 0, true);
    texturemasque.minFilter = THREE.LinearFilter;
    */
  //////////////////////////////////////////////////////////////////////////////////////////
  console.log("avant chargement");
  var promis2 = [loadGrass(), loadChemin()];
  return Promise.all(promis2);
}

function new_image(src) {
  img = new Image();
  img.src = src;
  return img;
}

// Fonction d'initialisation principale
function init(Textures) {
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
    } else if ((event.keyCode = 13)) {
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

  // Ajout des contrôles à la souris

  //controls.update() doit être appelé chaque fois que la position de la caméra est modifiée manuellement
  camera.position.set(0, 4, 0);
  controls.update();

  // Création des deux plans
  var epsilon = 0.001;

  // Ajout d'une source de lumière
  var luminosite = 1; // entre 0 et 1
  var ambiantLight = new THREE.AmbientLight(0xcccccc, luminosite);
  scene.add(ambiantLight);

  var meshGrass = definePlane(Textures[0][0], 0, 0, 0, mapW, mapH, 10, 10);
  scene.add(meshGrass);
  var meshFloor = definePlane(
    Textures[1][0],
    0,
    epsilon,
    0,
    mapW,
    mapH,
    10,
    10
  );
  meshFloor.name = "floor";
  scene.add(meshFloor);

  var Points = [
    [0, 0],
    [500, 1000],
    [2000, 3000],
    [4000, 2000],
    [5000, 3000],
  ];
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

  console.log(scene);
}

// Boucle principale qui se rappelle à l'infini
async function animate() {
  requestAnimationFrame(animate);
  controls.update();
  console.log(state);

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
    console.log(coordonnespoint);
    Points.push(coordonnespoint);

    var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    cubes.push(new THREE.Mesh(geometry, material));
    cubes[compteur].name = "cube" + compteur;
    cubes[compteur].position.x = xenter;
    cubes[compteur].position.z = zenter;
    scene.add(cubes[compteur]);
    compteur = compteur + 1;

    state.space = false;
  } else if (state.selectionPoints) {
    var compteur = 0;
    for (let i = 0; i < compteur; i++) {
      var selectedObject = scene.getObjectByName("cube" + i);
      scene.remove(selectedObject);
    }

    var cubes = [];
    compteur = 0;
    var selectedObject = scene.getObjectByName("line");
    scene.remove(selectedObject);

    var selectedObject = scene.getObjectByName("floor");
    scene.remove(selectedObject);
    if (!state.dejacube) {
      var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      var cube = new THREE.Mesh(geometry, material);
      cube.name = "cube";
      scene.add(cube);
    }

    console.log("construction de chemin");
    state.dejacube = true;
    state.selectionPoints = false;
    var Points = [];
  } else if (state.rendre) {
    ////////////////////////////////////////////////////////TEXTURE/////////////////////////////

    var canvas1 = createCanvasforTextureRepeat("texture", 10, 10);

    var textureRock5bis = defineTextureCanvas(canvas1, 0, 0, false);
    textureRock5bis.minFilter = THREE.LinearFilter;

    ///////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////MASQUE////////////////////

    var canvas = createCanvasforTextureRepeat("masque", 10, 10);

    var myImage1 = document.getElementById("masque");

    var w1 = myImage1.width,
      h1 = myImage1.height;

    var canvas2 = document.createElement("canvas");

    // Size the canvas to the element
    canvas2.width = canvas1.width;
    canvas2.height = canvas1.height;

    var chemin = computeCheminInterpol(Points);

    var centres = dupliquer(centresTexture11bis, 10, 10, w1, h1);
    console.log("modifierMasque2");
    var canvas2 = modifierMasque2(canvas2, chemin, canvas, centres);
    var texturemasque = defineTextureCanvas(canvas2, 0, 0, true);
    texturemasque.minFilter = THREE.LinearFilter;
    //////////////////////////////////////////////////////////////////////////////////////////
    var materialRock5 = new THREE.MeshBasicMaterial({
      alphaMap: texturemasque,
      alphaTest: 0.5,
      map: textureRock5bis,
      side: THREE.DoubleSide,
      wireframe: wireframe_mode,
      shininess: 0,
    });
    var meshFloor = definePlane(
      materialRock5,
      0,
      epsilon,
      0,
      mapW,
      mapH,
      10,
      10
    );
    meshFloor.name = "floor";
    scene.add(meshFloor);
    var pointsClick = [];
    for (let i = 0; i < chemin.length; i++) {
      x = chemin[i][0];
      z = chemin[i][1];
      newcoordinates = transformCanvastoThreeCoordonates(x, z);
      pointsClick.push(
        new THREE.Vector3(
          newcoordinates[0],
          newcoordinates[1],
          newcoordinates[2]
        )
      );
    }

    geometryClick = new THREE.Geometry().setFromPoints(pointsClick);
    materialClick = new THREE.LineBasicMaterial({ color: 0x0000ff });

    lineClick = new THREE.Line(geometryClick, materialClick);
    lineClick.name = "line";
    scene.add(lineClick);
    state.rendre = false;
    var selectedObject = scene.getObjectByName("cube");
    scene.remove(selectedObject);
    state.dejacube = false;

    for (let i = 0; i < compteur; i++) {
      var selectedObject = scene.getObjectByName("cube" + i);
      scene.remove(selectedObject);
    }
  }
}

// Assigner des élévations aléatoires aux vertices des maillages plans
function randomize_elevation(value = 0.4, offset = 0) {
  for (let i = 0; i < meshFloor.geometry.vertices.length; i++) {
    let random_value = Math.random();
    meshFloor.geometry.vertices[i].z = random_value * value + offset + epsilon;
    meshGrass.geometry.vertices[i].z = random_value * value + offset;
  }

  meshFloor.geometry.verticesNeedUpdate = true;
  meshGrass.geometry.verticesNeedUpdate = true;
}

// Récupérer l'élévation correspondant à une position au sol donnée
function zPos(x, y) {
  let caseX = Math.floor(x);
  let caseY = Math.floor(y);
  let u = (x + 100) % 1;
  let v = (y + 100) % 1;

  let indexFace = 200 * (caseZ + 50) + 2 * (caseX + 50) + (u + v > 1);
  if (meshFloor.geometry.faces[indexFace] === undefined) {
    return 0;
  }
  let pt1 = meshFloor.geometry.vertices[meshFloor.geometry.faces[indexFace].a];
  let pt2 = meshFloor.geometry.vertices[meshFloor.geometry.faces[indexFace].b];
  let pt3 = meshFloor.geometry.vertices[meshFloor.geometry.faces[indexFace].c];

  if (u + v < 1) {
    return pt1.z + (pt3.z - pt1.z) * u + (pt2.z - pt1.z) * v;
  } else {
    return pt1.z + pt3.z - pt2.z + (pt2.z - pt1.z) * u + (pt2.z - pt3.z) * v;
  }
}
