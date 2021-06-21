const centresTexture11bis = await (await fetch("./centresTexture11bis.json")).json();



const centresTexture11 = await (await fetch("./centresTexture11.json")).json();
const centresTexture3 = await (await fetch("./centresTexture3.json")).json();
const centresTexture10 = await (await fetch("./centresTexture10.json")).json();
const centresTexture8 = await (await fetch("./centresTexture8.json")).json();
const centresTexture7 = await (await fetch("./centresTexture7.json")).json();


const textureHerbeBasique = false;
const numeroTexture = 11;

//// PB : DEFINE TEXTURE ET CAMERA


const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 5;
//const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 0.5;

const renderer = new THREE.WebGLRenderer();


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
promis.push(loadImg("graphics/freeTexture2.png"));
promis.push(loadImg("graphics/textureGrass8.png"));
promis.push(loadImg("graphics/fleur.png"));
promis.push(loadImg("graphics/marguerite.png"));
promis.push(loadImg("graphics/freeTexture11.png"))
promis.push(loadImg("graphics/masque_freeTexture11.png"))

/*
const pierresTexture11 = [];
for (let i = 1; i <= centresTexture11bis.length; i++) {
  pierresTexture11.push(loadImg("graphics/Texture11/Pierre" + i + ".png"));
}*/


Promise.all(promis).then((imgs) => {
  init_textures(imgs).then((textures) => {
    init(textures);
    animate();
  });
});


///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


function createTextureHerbe(fleurs, herbetext, repeatX, repeatY) {

  // Create a Canvas element
  var canvasherbe = document.createElement('canvas');

  // Draw image onto the canvas
  var ctx = canvasherbe.getContext('2d');

  var wtot = herbetext.width, htot = herbetext.height;

  var w = wtot/2;
  var h = htot/4;

  // Size the canvas to the element
  canvasherbe.width = w * repeatX;
  canvasherbe.height = h * repeatY;

  // PELOUSE //
  for (let i = 0; i < repeatX; i++) {
    for (let j = 0; j < repeatY; j++) {

        var wr = Math.floor(Math.random() * 2);
        var hr = Math.floor(Math.random() * 4);

        ctx.drawImage(herbetext, w*wr,h*hr, w, h, w * i, j * h, w, h);

    }
}

// FLEURS //
var nbFleurs = 20;
var nbSorteFleurs = fleurs.length;
var taillesFleurs = [];

for (let i = 0; i < nbSorteFleurs; i++) {
  var wf = fleurs[i].width;
  var hf = fleurs[i].height;
  taillesFleurs.push([wf,hf]);
}

for (let i = 0; i < nbSorteFleurs; i++) {
  for (let j = 0; j < nbFleurs; j++) {

    var x = Math.floor(Math.random() * w * repeatX);
    var y = Math.floor(Math.random() * h * repeatY);
  
    var max = 3;
    var min = 5;
    
    var size = Math.random() * (max-min) +min;
    ctx.drawImage(fleurs[i],0,0,taillesFleurs[i][0],taillesFleurs[i][1], x, y, taillesFleurs[i][0]/size,taillesFleurs[i][1]/size);
  }
}  

  return canvasherbe
}
/*
function createCanvasforTextureRepeat(img, repeatX, repeatY) {

  var w = img.width;
  var h = img.height;

  // Create a Canvas element
  var canvas = document.createElement('canvas');

  // Size the canvas to the element
  canvas.width = w * repeatX;
  canvas.height = h * repeatY;


  // Draw image onto the canvas
  var ctx = canvas.getContext('2d');

  for (let i = 0; i < repeatX; i++) {

      for (let j = 0; j < repeatY; j++) {
          ctx.drawImage(img, w * i, h * j);
      }
  }

  return canvas
}*/

function distancechemin(point, chemin) {
  var min = 100000000000000;
  var pc;
  var distance;

  for (let i = 0; i < chemin.length; i++) {
      pc = chemin[i];
      distance = Math.sqrt(Math.pow(pc[0] - point[0], 2) + Math.pow(pc[1] - point[1], 2));
      if (distance < min) {
          min = distance;
      }
  }

  return min;
}

function createTextureCheminBasique(chemintext, masquetext, chemin, centres, repeatX, repeatY) {

  const distancemax = 350;

  var w = masquetext.width;
  var h = masquetext.height;

  var canvasmasque = document.createElement('canvas');
  canvasmasque.width = w * repeatX;
  canvasmasque.height = h * repeatY;

  var ctxmasque = canvasmasque.getContext('2d');
  for (let i = 0; i < repeatX; i++) {
      for (let j = 0; j < repeatY; j++) {
          ctxmasque.drawImage(masquetext, 0, 0, w, h, w * i, j * h, w, h);
      }
  }


  var canvaschemin = document.createElement('canvas');
  canvaschemin.width = w * repeatX;
  canvaschemin.height = h * repeatY;

  var ctxchemin = canvaschemin.getContext('2d');
  for (let i = 0; i < repeatX; i++) {
      for (let j = 0; j < repeatY; j++) {
          ctxchemin.drawImage(chemintext, 0, 0, w, h, w * i, j * h, w, h);
      }
  }

  var masquedata = ctxmasque.getImageData(0,0,w*repeatX, h*repeatY);

  var canvasnoir = document.createElement('canvas');
  canvasnoir.width = w * repeatX;
  canvasnoir.height = h * repeatY;

  var ctxnoir = canvasnoir.getContext('2d');
  var noirdata = ctxnoir.getImageData(0,0,w*repeatX, h*repeatY);

  var germes = [];
  var point;
  for (let i = 0; i < centres.length; i++) {
      point = centres[i];
      if (distancechemin(point, chemin) < distancemax) {
          germes.push(point);
      }
  }
  
  //var canvasdata;
  var canvasdatacopy;
  for (let k = 0; k < germes.length; k++) {
      canvasdatacopy = recupPierre(noirdata, masquedata, germes[k], w * repeatX, h * repeatY);
      noirdata = canvasdatacopy;
    }

  ctxnoir.putImageData(noirdata, 0, 0); 

  return [canvasnoir, canvaschemin]

}

function recupPierre(masquedata, copyMasquedata, point, w, h) {

  var ipoint = point[0];
  var jpoint = point[1];
  var n = ipoint * w + jpoint

  // point centre
  var lignehorizontal = [n]
  if (copyMasquedata.data[4*n] == 255) {
      masquedata.data[4 * n] = 255
      masquedata.data[4 * n + 1] = 255
      masquedata.data[4 * n + 2] = 255
      masquedata.data[4 * n + 3] = 255
  }

  // ligne horizontale gauche
  var ind = n
  var gauche = copyMasquedata.data[4 * (ind - 1)]
  while (gauche == 255 && ind - 1 != 0) {
      masquedata.data[4 * (ind - 1)] = 255
      masquedata.data[4 * (ind - 1) + 1] = 255
      masquedata.data[4 * (ind - 1) + 2] = 255
      masquedata.data[4 * (ind - 1) + 3] = 255
      ind = ind - 1;
      lignehorizontal.push(ind)
      gauche = copyMasquedata.data[4 * (ind - 1)]
  }

  // ligne horizontale droite
  var ind = n
  var droite = copyMasquedata.data[4 * (ind + 1)]
  while (droite == 255 && ind + 1 != 0) {
      masquedata.data[4 * (ind + 1)] = 255
      masquedata.data[4 * (ind + 1) + 1] = 255
      masquedata.data[4 * (ind + 1) + 2] = 255
      masquedata.data[4 * (ind + 1) + 3] = 255
      ind = ind + 1;
      lignehorizontal.push(ind)
      droite = copyMasquedata.data[4 * (ind + 1)]
  }

  // ligne verticale
  var lignevertical = []

  // ligne verticale bas
  var ind = n;
  var indMoins1 = ind - w;
  var bas = copyMasquedata.data[4 * indMoins1]
  while (bas == 255 && indMoins1 != 0) {
      masquedata.data[4 * indMoins1] = 255
      masquedata.data[4 * indMoins1 + 1] = 255
      masquedata.data[4 * indMoins1 + 2] = 255
      masquedata.data[4 * indMoins1 + 3] = 255
      //ind = indMoins1;
      lignevertical.push(indMoins1)
      indMoins1 = indMoins1 - w;
      bas = copyMasquedata.data[4 * indMoins1]
  }

  // ligne verticale haut
  var ind = n
  var indPlus1 = ind + w;
  var haut = copyMasquedata.data[4 * indPlus1]
  while (gauche == 255 && indPlus1 != 0) {
      masquedata.data[4 * indPlus1] = 255
      masquedata.data[4 * indPlus1 + 1] = 255
      masquedata.data[4 * indPlus1 + 2] = 255
      masquedata.data[4 * indPlus1 + 3] = 255
      //ind = indPlus1;
      lignevertical.push(indPlus1)
      indPlus1 = indPlus1 + w;
      haut = copyMasquedata.data[4 * indPlus1]
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
      bas = copyMasquedata.data[4 * indMoins1]
      while (bas == 255 && indMoins1 != 0) {
          masquedata.data[4 * indMoins1] = 255
          masquedata.data[4 * indMoins1 + 1] = 255
          masquedata.data[4 * indMoins1 + 2] = 255
          masquedata.data[4 * indMoins1 + 3] = 255
          //ind = indMoins1;
          //bastemp = indMoins1;
          indMoins1 = indMoins1 - w;
          bas = copyMasquedata.data[4 * indMoins1]
      }
      
      //ligneverticaltemp.push(bastemp);
      
      ind = lignehorizontal[k]
      indPlus1 = ind + w;
      haut = copyMasquedata.data[4 * indPlus1]
      while (haut == 255 && indPlus1 != 0) {
          masquedata.data[4 * indPlus1] = 255
          masquedata.data[4 * indPlus1 + 1] = 255
          masquedata.data[4 * indPlus1 + 2] = 255
          masquedata.data[4 * indPlus1 + 3] = 255
          //ind = indPlus1;
          //hauttemp = indPlus1;
          indPlus1 = indPlus1 + w;
          haut = copyMasquedata.data[4 * indPlus1]
      }

      //ligneverticaltemp.push(hauttemp);

  }

  // recup pixels a partir de la ligne verticale
  for (let k = 0; k < lignevertical.length; k++) {
      ind = lignevertical[k]
      gauche = copyMasquedata.data[4 * (ind - 1)]
      while (gauche == 255 && ind - 1 != 0) {
          masquedata.data[4 * (ind - 1)] = 255
          masquedata.data[4 * (ind - 1) + 1] = 255
          masquedata.data[4 * (ind - 1) + 2] = 255
          masquedata.data[4 * (ind - 1) + 3] = 255
          ind = ind - 1;
          //gauchetemp = ind;
          //lignehorizontal.push(ind)
          gauche = copyMasquedata.data[4 * (ind - 1)]
      }

      //lignehorizontaltemp.push(gauchetemp);

      ind = lignevertical[k];
      droite = copyMasquedata.data[4 * (ind + 1)]
      while (droite == 255 && ind + 1 != 0) {
          masquedata.data[4 * (ind + 1)] = 255
          masquedata.data[4 * (ind + 1) + 1] = 255
          masquedata.data[4 * (ind + 1) + 2] = 255
          masquedata.data[4 * (ind + 1) + 3] = 255
          ind = ind + 1;
          //droitetemp = ind;
          //lignehorizontal.push(ind)
          droite = copyMasquedata.data[4 * (ind + 1)]
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
  
  return masquedata

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

function defineTextureCanvas(src, repeatX, repeatY, repeatWrapping = false) {

  var textu = new THREE.CanvasTexture(src)
  if (repeatWrapping) {
      textu.wrapS = THREE.RepeatWrapping;
      textu.wrapT = THREE.RepeatWrapping;
      textu.repeat.set(repeatX, repeatY)
  } else {
      textu.wrapS = THREE.ClampToEdgeWrapping
      textu.wrapT = THREE.ClampToEdgeWrapping
  }

  return textu

}

// Fonction pour définir un maillage de plan
function definePlane(mater, x, y, z, w, h, faces = 1) {

  var meshPlane = new THREE.Mesh(new THREE.PlaneGeometry(w, h, faces, faces),mater);

  /*
  meshPlane.rotation.x += -1 * Math.PI / 2
  meshPlane.position.x = x
  meshPlane.position.y = y
  meshPlane.position.z = z
*/
  return meshPlane

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
        T.push([xnouveau, ynouveau]);
      }
    }
  }

  return T;
}


///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function init_textures(imgs) {

  ///////////// HERBE /////////////
  var materialFond;

  if (textureHerbeBasique) {

    const texture = defineTexture(imgs[0].src,10,10,true);
    materialFond = new THREE.MeshBasicMaterial({map: texture,side: THREE.DoubleSide});
  } else {

    var canvasherbe = createTextureHerbe([imgs[2],imgs[3]],imgs[1],10, 10);
    var texture = defineTextureCanvas(canvasherbe, 0, 0, false);
    texture.minFilter = THREE.LinearFilter;



    //const texture = defineTexture(textureGrass,10,10,true);
    materialFond = new THREE.MeshBasicMaterial({map: texture,side: THREE.DoubleSide});
  }


  /////////// CHEMIN /////////
  const wireframe_mode = false

  var Points = [
    [0, 0],
    [500, 1000],
    [2000, 3000],
    [4000, 2000],
    [5000, 3000],
  ];

  var chemin = computeCheminInterpol(Points);
  var centres = dupliquer(centresTexture11bis, 10, 10, 512, 512);
  
  var tabresult = createTextureCheminBasique(imgs[4],imgs[5], chemin, centres, 10, 10);
  var canvascheminMasque = tabresult[0];
  var canvaschemin = tabresult[1];


  const textureChemin = defineTextureCanvas(canvaschemin, 0, 0, false);
  textureChemin.minFilter = THREE.LinearFilter;

  const textureCheminMasque = defineTextureCanvas(canvascheminMasque, 0, 0, false);
  textureCheminMasque.minFilter = THREE.LinearFilter;
  
  const materialChemin = new THREE.MeshBasicMaterial({alphaMap : textureCheminMasque, alphaTest : 0.5, map: textureChemin,wireframe: wireframe_mode,  side: THREE.DoubleSide});


  return Promise.resolve([materialFond, materialChemin])
  
}


// Fonction d'initialisation principale
function init(textures) {

  document.addEventListener("contextmenu",function (event) {event.preventDefault();},false);

  var space = false;

  // Déplacement dans la scène avec Z Q S D
  var mouvement = { "haut": false, "bas": false, "droite": false, "gauche": false }
  var mouvementcube = { "haut": false, "bas": false, "droite": false, "gauche": false }

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

  // Ajout d'une source de lumière
  const luminosite = 1  // entre 0 et 1
  const ambiantLight = new THREE.AmbientLight(0xcccccc, luminosite)
  scene.add(ambiantLight);

  // POSITION CAM ?????????
  //camera.position.set(0, 4, 0);

  controls.update();
  //const geometry = new THREE.PlaneGeometry( 1, 1);
  //const plane = new THREE.Mesh( geometry, textures[0]);

  const epsilon = 0.001;

  const plane = definePlane(textures[0], 0, 0, 0, mapW, mapH, 10, 10);
  scene.add(plane);

  const planeChemin = definePlane(textures[1], 0, epsilon, 0, mapW, mapH, 10, 10);
  scene.add(planeChemin);

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
  }
}

