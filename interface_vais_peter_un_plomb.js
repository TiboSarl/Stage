const centresTexture11 = await (await fetch("./centresTexture11.json")).json();
const centresTexture3 = await (await fetch("./centresTexture3.json")).json();
const centresTexture10 = await (await fetch("./centresTexture10.json")).json();
const centresTexture8 = await (await fetch("./centresTexture8.json")).json();
const centresTexture7 = await (await fetch("./centresTexture7.json")).json();


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);


var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
var controls = new THREE.OrbitControls(scene, camera);
document.body.appendChild(renderer.domElement);

const loadImg = async (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => reject(`Cannot load ${url}`);
  });

const promis = [];
promis.push(loadImg("graphics/freeTexture2.png"));

Promise.all(promis).then((imgs) => {
  init_textures(imgs).then((textures) => {
    init(textures);
    animate();
  });
});

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

// initialiser les textures
function init_textures(imgs) {

  console.log(imgs[0]);
  var textureGrassBasique = defineTexture("graphics/freeTexture2.png",10,10,true);
  var materialGrassBasique = new THREE.MeshBasicMaterial({map: textureGrassBasique,side: THREE.DoubleSide,});
  console.log(materialGrassBasique);
  return Promise.resolve([materialGrassBasique])
}

function init(textures) {

  var mapW = 10;
  var mapH = 10;

  //controls.update() doit être appelé chaque fois que la position de la caméra est modifiée manuellement
  camera.position.set(0, 4, 0);
  controls.update();

  // Ajout d'une source de lumière
  var luminosite = 1; // entre 0 et 1
  var ambiantLight = new THREE.AmbientLight(0xcccccc, luminosite);
  scene.add(ambiantLight);

  var meshGrass = definePlane(textures[0][0], 0, 0, 0, mapW, mapH, 10, 10);
  scene.add(meshGrass);
}

// Boucle principale qui se rappelle à l'infini
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

