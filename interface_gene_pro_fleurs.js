const scene = new THREE.Scene();

// PARAMS
const decalageHerbe = true;

// pour randomize elevation
var meshGrass;



// cam et renderer
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

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
promis.push(loadImg("graphics/fleur2.png"));
promis.push(loadImg("graphics/marguerite2.png"));
promis.push(loadImg("graphics/rose2.png"));
promis.push(loadImg("graphics/buisson2.png"));



Promise.all(promis).then((imgs) => {
  init_textures(imgs).then((textures) => {
    init(textures);
    animate(textures);
  });
});


///////////////////////////////////////////////////////////////////////////////////////////

function poisson (mean) {

  var L = Math.exp(-mean);
  var p = 1.0;
  var k = 0;

  do {
      k++;
      p *= Math.random();
  } while (p > L);

  return k - 1;
}

// temps
var temps = 0;


// tableau fleurs
var tabFleurs = [];

// nombre de sorte de fleurs
var nbSorteFleurs = 4;

// tirage aleatoire debut
var lambda_0 = 30;
var poi;
var xrand;
var yrand;
var distance;
var distanceOk;
var iteration;
var chaqueDistance;
for (let i =0; i < nbSorteFleurs; i++) {
  poi = poisson(lambda_0);
  for (let j=0; j< poi; j++) {
    distanceOk = false;
    while (!distanceOk) {
      xrand = Math.floor(Math.random() * 512 * 10);
      yrand = Math.floor(Math.random() * 512 * 10);
      iteration = 0;
      chaqueDistance = true;
      while (iteration < tabFleurs.length & chaqueDistance) {
        distance = Math.sqrt(Math.pow(tabFleurs[iteration][0] - xrand, 2) + Math.pow(tabFleurs[iteration][1] - yrand, 2));
        iteration++;
        if (distance < 270*0.1 + 270*0.1) {
          chaqueDistance = false;
        }
      }
      if (iteration == tabFleurs.length) {
        distanceOk = true;
      }
    }
    tabFleurs.push([xrand, yrand, 0.1, i, 0]);
  }

}


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

        var decalage = Math.random();
        var decalage2 = Math.random();

        if (decalageHerbe) {
          ctx.drawImage(herbetext,w * wr, h * hr, w * decalage, h * decalage2, w * i + w * (1 - decalage),
            j * h + h * (1 - decalage2), w * decalage, h * decalage2);

          ctx.drawImage(herbetext, w * wr + w * decalage, h * hr, w - w * decalage, h * decalage2, w * i,
            j * h + h * (1 - decalage2),w - w * decalage,h * decalage2);

          ctx.drawImage(herbetext,w * wr, h * hr + h * decalage2,w * decalage,h * (1 - decalage2),
            w * i + w * (1 - decalage),j * h,w * decalage,h * (1 - decalage2));

          ctx.drawImage(herbetext,w * wr + w * decalage,h * hr + h * decalage2,w - w * decalage,
            h - h * decalage2, w * i,j * h,w - w * decalage,h - h * decalage2);

        } else {
          ctx.drawImage(herbetext, w*wr,h*hr, w, h, w * i, j * h, w, h);
        }
        

    }
}

// FLEURS //
var taillesFleurs = [];

for (let i = 0; i < nbSorteFleurs; i++) {
  var wf = fleurs[i].width;
  var hf = fleurs[i].height;
  taillesFleurs.push([wf,hf]);
}



var xr;
var yr;
var rayon;
var numfleur;
var wim;
var him;
for (let i=0; i< tabFleurs.length; i++) {
  xr = tabFleurs[i][0];
  yr = tabFleurs[i][1];
  rayon = tabFleurs[i][2];
  numfleur = tabFleurs[i][3];
  wim = taillesFleurs[numfleur][0];
  him = taillesFleurs[numfleur][1];

  ctx.drawImage(fleurs[numfleur],0,0,wim,him, xr - wim*rayon/2 , yr - him*rayon/2, wim*rayon,him*rayon);

}

  return canvasherbe
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

  
  meshPlane.rotation.x += -1 * Math.PI / 2
  meshPlane.position.x = x
  meshPlane.position.y = y
  meshPlane.position.z = z

  return meshPlane

}



///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function init_textures(imgs) {

  ///////////// HERBE /////////////
  var materialFond;

  var canvasherbe = createTextureHerbe([imgs[2],imgs[3], imgs[4], imgs[5]],imgs[1],10, 10);
  var texture = defineTextureCanvas(canvasherbe, 0, 0, false);
  texture.minFilter = THREE.LinearFilter;

  materialFond = new THREE.MeshBasicMaterial({map: texture,side: THREE.DoubleSide});
  

  return Promise.resolve([materialFond])
  
}


// Fonction d'initialisation principale
function init(textures) {

  document.addEventListener("contextmenu",function (event) {event.preventDefault();},false);

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
  const luminosite = 1  // entre 0 et 1
  const ambiantLight = new THREE.AmbientLight(0xcccccc, luminosite)
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

    state.space = false;

  } else if (state.selectionPoints) {

  
  } else if (state.rendre) {

    state.rendre = false;

  }

  temps++;

  // NAISSANCES ET MORTS
  
  
  if (temps % 10 == 0) {

    // augmenter taille et age des fleurs
    for (let i=0; i<tabFleurs.length; i++) {

      // augmente age et taille
      if (tabFleurs[i][2] < 0.8) {
        tabFleurs[i][2] += 0.1;
      }
      tabFleurs[i][4] += 1;

      // meurt a cause de l age
      if (tabFleurs[i][4] == 15) {
        tabFleurs.splice(i, 1);
        i = i-1;
      }

    }

    // meurt a cause de la taille
    tuerCroisement(tabFleurs);

    naissanceFleurs(tabFleurs);
    console.log("fin naissance")

    var selectedObject = scene.getObjectByName("pelouse");
    scene.remove(selectedObject);


    Promise.all(promis).then((imgs) => {
      init_textures(imgs).then((textures) => {
        init(textures);
      });
    });

  }

}

function tuerCroisement(tabFleurs){

  var rayoncourant;
  var rayon;

  for (let i = 0; i<tabFleurs.length;i++ ){
    let fleurcourante = tabFleurs[i];
      for (let j = 0;j<tabFleurs.length;j++){
        if (i!=j){
          let fleurj = tabFleurs[j];
          let distance = Math.sqrt(Math.pow(fleurj[0] - fleurcourante[0], 2) + Math.pow(fleurj[1] - fleurcourante[1], 2));
          rayon = fleurj[2];
          rayoncourant = fleurcourante[2];
          if (distance < (rayon*270 + rayoncourant*270)){
            if (fleurcourante[2]<=fleurj[2]){
              tabFleurs.splice(i,1)
              i=i-1;
            }
          }
        }
      }
  }

}

function naissanceFleurs(tabFleurs){

// tirage aleatoire debut
var lambda_0 = 10;
var poi;
var xrand;
var yrand;
var distance;
var distanceOk;
var iteration;
var chaqueDistance;
var taille;
  for (let i =0; i < nbSorteFleurs; i++) {
    poi = poisson(lambda_0);
    
    for (let j=0; j< poi; j++) {
      distanceOk = false;
      while (!distanceOk) {
        xrand = Math.floor(Math.random() * 512 * 10);
        yrand = Math.floor(Math.random() * 512 * 10);
        iteration = 0;
        chaqueDistance = true;
        while (iteration < tabFleurs.length & chaqueDistance) {
          distance = Math.sqrt(Math.pow(tabFleurs[iteration][0] - xrand, 2) + Math.pow(tabFleurs[iteration][1] - yrand, 2));
          taille = tabFleurs[iteration][2];
          iteration++;
          if (distance < 270*taille + 270*0.1) {
            chaqueDistance = false;
          }
        }
        if (iteration == tabFleurs.length) {
          distanceOk = true;
        }
      }
      
      tabFleurs.push([xrand, yrand, 0.1, i, 0]);
    }
  
  }
}

// Assigner des élévations aléatoires aux vertices des maillages plans
function randomize_elevation(value = 0.4, offset = 0, epsilon) {

  for (let i = 0; i < meshFloor.geometry.vertices.length; i++) {
      let random_value = Math.random()
      meshFloor.geometry.vertices[i].z = random_value * value + offset + epsilon
      meshGrass.geometry.vertices[i].z = random_value * value + offset
  }
  meshFloor.geometry.verticesNeedUpdate = true
  meshGrass.geometry.verticesNeedUpdate = true

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
