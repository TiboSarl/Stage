init_textures()
init()
animate()
getMatriceCentres()


function getMatriceCentres(w,h) {
    var centresTexture11 = [[14,33],[14,306],[18,393],[21,218],[32,480],[36,81],[53,255],[54,147],[65,391],[67,216],[69,36],[78,97],[80,352],[91,299],[98,430],[111,504],[117,386],[124,103],[124,341],[125,232],[127,147],[160,441],[168,319],[178,44],[180,267],[182,138],[193,385],[209,476],[215,187],[217,227],[227,285],[235,120],[249,336],[254,69],[262,436],[265,2],[277,301],[278,113],[290,177],[295,262],[304,398],[309,344],[312,293],[335,459],[348,388],[359,14],[363,174],[364,93],[392,246],[395,314],[399,7],[408,180],[418,379],[427,476],[433,142],[451,507],[453,327],[464,59],[478,178],[482,131],[497,441],[498,6],[503,508]];

    T = [];

    for (let k=0; k<centresTexture11.length;k++) {
        var x = centresTexture11[k][0];
        var y = centresTexture11[k][1];

        for (let i=0;i<10; i++) {
            for (let j=0;j<10; j++) {
            var xnouveau = x + i*w;
            var ynouveau = y + j*h;
            T.push([xnouveau,ynouveau]);
            }
        }
        

    }

    return T;
}

// Fonction pour définir un maillage de plan
function definePlane(mater, x, y, z, w, h, faces = 1) {

    meshPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h, faces, faces),
        mater
    );

    meshPlane.rotation.x += -1 * Math.PI / 2
    meshPlane.position.x = x
    meshPlane.position.y = y
    meshPlane.position.z = z

    return meshPlane

}


// Fonction pour définir une texture
function defineTexture(src, repeatX, repeatY, repeatWrapping = false) {

    textu = new THREE.TextureLoader().load(src)
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

function defineTextureCanvas(src, repeatX, repeatY, repeatWrapping = false) {

    textu = new THREE.CanvasTexture(src)
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

function createCanvasforTextureRepeat(src, repeatX, repeatY) {

    // Get a reference to the image you want the pixels of and its dimensions
    var myImage1 = document.getElementById(src);


    var w1 = myImage1.width, h1 = myImage1.height;

    // Create a Canvas element
    var canvas1 = document.createElement('canvas');

    // Size the canvas to the element
    canvas1.width = w1 * repeatX;
    canvas1.height = h1 * repeatY;


    // Draw image onto the canvas
    var ctx1 = canvas1.getContext('2d');

    for (let i = 0; i < repeatX; i++) {

        for (let j = 0; j < repeatY; j++) {
            ctx1.drawImage(myImage1, w1 * i, j * h1);
        }
    }

    return canvas1
}

function linspace(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
        arr.push(startValue + (step * i));
    }
    return arr;
}

function lagrange(x, X, Y) {
    Somme = 0;

    for (let i = 0; i < X.length; i++) {
        lagrangei = 1;
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
    result = [T, tToEval];
    return result;
}

function mintibo(T) {
    mini = 100000;
    for (let i = 0; i < T.length; i++) {
        if (T[i] < mini) {
            mini = T[i];
        }
    }
    return mini
}

function maxtibo(T) {
    mini = -100000;
    for (let i = 0; i < T.length; i++) {
        if (T[i] > mini) {
            mini = T[i];
        }
    }
    return mini
}


function buildParametrisationTchebytcheff(nbElem, pas) {
    T = []
    tToEval1 = []

    t = 0

    for (let i = 0; i < nbElem; i++) {
        t = Math.cos(((2 * i + 1) * Math.PI) / (2 * nbElem + 2));
        T.push(t);
    }
    te = mintibo(T)
    tmax = maxtibo(T)
    while (te < tmax) {
        tToEval1.push(te);
        te = te + pas;
    }
    return [T, tToEval1];
}

function computeCheminInterpol(Points) {
    X = [];
    Y = [];
    chemin = [];
    for (let i = 0; i < Points.length; i++) {
        X.push(Points[i][0]);
        Y.push(Points[i][1]);
    }

    var temps = buildParametrisationTchebytcheff(Points.length, 0.05);
    T = temps[0];
    tToEval = temps[1];
    for (let i = 0; i < tToEval.length; i++) {
        xpoint = lagrange(tToEval[i], T, X);
        ypoint = lagrange(tToEval[i], T, Y);
        chemin.push([xpoint, ypoint]);
    }
    return chemin;
}

function computeCheminLigneBrisee(Points) {
    var chemin = []
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

function distancechemin(point, chemin) {
    min = 100000000000000;

    for (let i = 0; i < chemin.length; i++) {
        pc = chemin[i];
        distance = Math.sqrt(Math.pow(pc[0] - point[0], 2) + Math.pow(pc[1] - point[1], 2));
        if (distance < min) {
            min = distance;
        }
    }

    return min;
}


function modifierMasque(canvas, chemin) {
    distancemax = 350
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    var masquedata = ctx.getImageData(0, 0, w, h);

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            var point = [i, j];
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
    ctx.putImageData(masquedata, 0, 0);
    return canvas


}

function recupImageData(canvas) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var data = ctx.getImageData(0, 0, w, h);

    return data
}

function recupPierres(canvas, copyMasquedata) {

    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var masquedata = ctx.getImageData(0, 0, w, h);

    if (masquedata.data.length == copyMasquedata.data.length) {

        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                var n = i * w + j

                // cote gauche
                if ((n - 1) > 0) {
                    if (masquedata.data[4 * n] == 255 && masquedata.data[4 * (n - 1)] == 0 && copyMasquedata.data[4 * (n - 1)] == 255) {

                        ind = n
                        gauche = copyMasquedata.data[4 * (ind - 1)]
                        while (gauche == 255 && ind - 1 != 0) {
                            masquedata.data[4 * (ind - 1)] = 255
                            masquedata.data[4 * (ind - 1) + 1] = 255
                            masquedata.data[4 * (ind - 1) + 2] = 255
                            masquedata.data[4 * (ind - 1) + 3] = 255
                            ind = ind - 1;
                            gauche = copyMasquedata.data[4 * (ind - 1)]
                        }

                    }
                }

                // cote droit
                if ((n - 1) > 0) {

                    if (masquedata.data[4 * n] == 255 && masquedata.data[4 * (n + 1)] == 0 && copyMasquedata.data[4 * (n + 1)] == 255) {

                        ind = n
                        gauche = copyMasquedata.data[4 * (ind + 1)]
                        while (gauche == 255 && ind + 1 != 0) {
                            masquedata.data[4 * (ind + 1)] = 255
                            masquedata.data[4 * (ind + 1) - 1] = 255
                            masquedata.data[4 * (ind + 1) - 2] = 255
                            masquedata.data[4 * (ind + 1) - 3] = 255
                            ind = ind + 1;
                            gauche = copyMasquedata.data[4 * (ind + 1)]
                        }

                    }
                }
            }
        }


        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                var n = i * w + j
                var nMoins1 = (i - 1) * w + j
                var nPlus1 = (i + 1) * w + j

                // en haut
                if (nMoins1 >= 4) {
                    if (masquedata.data[4 * n] == 255 && masquedata.data[4 * nMoins1] == 0 && copyMasquedata.data[4 * nMoins1] == 255) {

                        ind = n
                        indMoins1 = n - w;
                        gauche = copyMasquedata.data[4 * indMoins1]
                        while (gauche == 255 && indMoins1 != 0) {
                            masquedata.data[4 * indMoins1] = 255
                            masquedata.data[4 * indMoins1 - 1] = 255
                            masquedata.data[4 * indMoins1 - 2] = 255
                            masquedata.data[4 * indMoins1 - 3] = 255
                            ind = indMoins1;
                            indMoins1 = indMoins1 - w;
                            gauche = copyMasquedata.data[4 * indMoins1]
                        }

                    }
                }


                // en bas
                if (nPlus1 <= masquedata.data.length) {
                    if (masquedata.data[4 * n] == 255 && masquedata.data[4 * nPlus1] == 0 && copyMasquedata.data[4 * nPlus1] == 255) {


                        ind = n
                        indPlus1 = n + w;
                        gauche = copyMasquedata.data[4 * indPlus1]
                        while (gauche == 255 && indPlus1 != 0) {
                            masquedata.data[4 * indPlus1] = 255
                            masquedata.data[4 * indPlus1 + 1] = 255
                            masquedata.data[4 * indPlus1 + 2] = 255
                            masquedata.data[4 * indPlus1 + 3] = 255
                            ind = indPlus1;
                            indPlus1 = indPlus1 + w;
                            gauche = copyMasquedata.data[4 * indPlus1]
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

    return canvas
}



function transformCanvastoThreeCoordonates(x, z) {
    var newx = z / 512 - 5;
    var newz = x / 512 - 5;
    var newy = 0.1
    coordonnees = [newx, newy, newz];
    return coordonnees;
}

function transformThreeCoordonatestoCanvas(x, z) {
    var newx = (z + 5) * 512
    var newz = (x + 5) * 512;
    coordonnees = [newx, newz];
    return coordonnees;
}

// Fonction d'initialisation des textures
function init_textures() {

    // Pour n'afficher que les edges
    wireframe_mode = false

    textureSand = defineTexture("graphics/freeTexture1.png", 10, 10, true)
    textureGrass = defineTexture("graphics/freeTexture2.png", 10, 10, true)
    textureRock1 = defineTexture("graphics/freeTexture3.png", 10, 10, true)
    textureWater = defineTexture("graphics/freeTexture4.png", 10, 10, true)
    textureRock2 = defineTexture("graphics/freeTexture5.png", 10, 10, true)
    textureMagma = defineTexture("graphics/freeTexture6.png", 10, 10, true)
    textureRock3 = defineTexture("graphics/freeTexture7.png", 10, 10, true)
    textureRock4 = defineTexture("graphics/freeTexture8.png", 10, 10, true)
    textureLeaf = defineTexture("graphics/freeTexture9.png", 10, 10, true)
    textureIce = defineTexture("graphics/freeTexture10.png", 10, 10, true)
    textureRock5 = defineTexture("graphics/freeTexture11.png", 10, 10, true)
    textureRock6 = defineTexture("graphics/freeTexture12.png", 10, 10, true)
    textureForest = defineTexture("graphics/freeTexture13.png", 10, 10, true)
    textureGround = defineTexture("graphics/freeTexture14.png", 10, 10, true)
    textureSnow = defineTexture("graphics/freeTexture15.png", 10, 10, true)



    materialSand = new THREE.MeshBasicMaterial({ map: textureSand, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });
    materialGrass = new THREE.MeshBasicMaterial({ map: textureGrass, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });
    materialRock1 = new THREE.MeshBasicMaterial({ map: textureRock1, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });
    materialWater = new THREE.MeshPhongMaterial({ map: textureWater, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0.3 })
    materialRock2 = new THREE.MeshBasicMaterial({ map: textureRock2, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });
    materialMagma = new THREE.MeshBasicMaterial({ map: textureMagma, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });
    materialRock3 = new THREE.MeshBasicMaterial({ map: textureRock3, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });
    materialRock4 = new THREE.MeshBasicMaterial({ map: textureRock4, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });
    materialLeaf = new THREE.MeshBasicMaterial({ map: textureLeaf, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });
    materialIce = new THREE.MeshBasicMaterial({ map: textureIce, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0.3 });

    materialRock6 = new THREE.MeshBasicMaterial({ map: textureRock6, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });
    materialForest = new THREE.MeshBasicMaterial({ map: textureForest, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });
    materialGround = new THREE.MeshBasicMaterial({ map: textureGround, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });
    materialSnow = new THREE.MeshBasicMaterial({ map: textureSnow, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });



    textures = defineTexture("graphics/textures.png", 1, 1)
    textures.anisotropy = 16;

    textureMask = defineTexture("graphics/masque_freeTexture11.png", 10, 10, true)

    ////////////////////////////////////////////////////////TEXTURE/////////////////////////////

    var canvas1 = createCanvasforTextureRepeat('texture', 10, 10);
    var ctx = canvas1.getContext('2d');



    var textureRock5bis = defineTextureCanvas(canvas1, 0, 0, false);
    textureRock5bis.minFilter = THREE.LinearFilter;



    ///////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////MASQUE////////////////////

    canvas = createCanvasforTextureRepeat('masque', 10, 10);
    var copyMasquedata = recupImageData(canvas);

    Points = [[0, 0], [500, 1000], [2000, 3000], [4000, 2000], [5000, 3000]];
    var chemin = computeCheminInterpol(Points);
    modifierMasque(canvas, chemin);

    recupPierres(canvas, copyMasquedata);
    var texturemasque = defineTextureCanvas(canvas, 0, 0, true);
    texturemasque.minFilter = THREE.LinearFilter;
    //////////////////////////////////////////////////////////////////////////////////////////
    materialRock5 = new THREE.MeshBasicMaterial({ alphaMap: texturemasque, alphaTest: 0.5, map: textureRock5bis, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });




}




// Fonction d'initialisation principale
function init() {

    document.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);



    space = false;



    // Déplacement dans la scène avec Z Q S D
    mouvement = { "haut": false, "bas": false, "droite": false, "gauche": false }
    mouvementcube = { "haut": false, "bas": false, "droite": false, "gauche": false }

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 68) {
            mouvement.haut = true
        } else if (event.keyCode == 81) {
            mouvement.bas = true
        } else if (event.keyCode == 90) {
            mouvement.droite = true
        } else if (event.keyCode == 83) {
            mouvement.gauche = true
        } else if (event.keyCode == 38) {
            mouvementcube.gauche = true;
        } else if (event.keyCode == 40) {
            mouvementcube.droite = true
        } else if (event.keyCode == 37) {
            mouvementcube.haut = true;
        } else if (event.keyCode == 39) {
            mouvementcube.bas = true
        }
        else if (event.keyCode == 32) {
            space = true;
        } else if (event.keyCode == 16) {
            selectionPoints = true
        } else if (event.keyCode = 13) {
            rendre = true;
        }
    })

    document.addEventListener('keyup', function (event) {
        if (event.keyCode == 68) {
            mouvement.haut = false
        } else if (event.keyCode == 81) {
            mouvement.bas = false
        } else if (event.keyCode == 90) {
            mouvement.droite = false
        } else if (event.keyCode == 83) {
            mouvement.gauche = false
        } else if (event.keyCode == 38) {
            mouvementcube.gauche = false;
        } else if (event.keyCode == 40) {
            mouvementcube.droite = false
        } else if (event.keyCode == 37) {
            mouvementcube.haut = false;
        } else if (event.keyCode == 39) {
            mouvementcube.bas = false
        }
    })


    selectionPoints = false;
    rendre = false;



    mapW = 10
    mapH = 10

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);




    // Ajout d'une source de lumière
    luminosite = 1  // entre 0 et 1
    ambiantLight = new THREE.AmbientLight(0xcccccc, luminosite)
    scene.add(ambiantLight);

    // Ajout des contrôles à la souris
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //controls.update() doit être appelé chaque fois que la position de la caméra est modifiée manuellement
    camera.position.set(0, 4, 0);
    controls.update();

    // Création des deux plans
    epsilon = 0.001

    meshGrass = definePlane(materialGrass, 0, 0, 0, mapW, mapH, 10, 10)
    scene.add(meshGrass)

    meshFloor = definePlane(materialRock5, 0, epsilon, 0, mapW, mapH, 10, 10)
    meshFloor.name = "floor"
    scene.add(meshFloor)
    pointsClick = [];
    for (let i = 0; i < chemin.length; i++) {
        x = chemin[i][0];
        z = chemin[i][1];
        newcoordinates = transformCanvastoThreeCoordonates(x, z);
        pointsClick.push(new THREE.Vector3(newcoordinates[0], newcoordinates[1], newcoordinates[2]));
    }

    geometryClick = new THREE.Geometry().setFromPoints(pointsClick);
    materialClick = new THREE.LineBasicMaterial({ color: 0x0000ff });

    lineClick = new THREE.Line(geometryClick, materialClick)
    lineClick.name = "line"
    scene.add(lineClick)


}


// Boucle principale qui se rappelle à l'infini
function animate() {

    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    if (mouvement.bas) {
        scene.position.x += 0.1
    } else if (mouvement.haut) {
        scene.position.x -= 0.1
    } else if (mouvement.droite) {
        scene.position.z += 0.1
    } else if (mouvement.gauche) {
        scene.position.z -= 0.1
    } else if (mouvementcube.haut) {
        cube.position.x -= 0.03;
    } else if (mouvementcube.bas) {
        cube.position.x += 0.03
    } else if (mouvementcube.droite) {
        cube.position.z += 0.03;
    } else if (mouvementcube.gauche) {
        cube.position.z -= 0.03;
    } else if (space) {
        xenter = cube.position.x;
        zenter = cube.position.z;
        coordonnespoint = transformThreeCoordonatestoCanvas(xenter, zenter);
        console.log(coordonnespoint);
        Points.push(coordonnespoint);

        geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        cubes.push(new THREE.Mesh(geometry, material));
        cubes[compteur].name = "cube" + compteur;
        cubes[compteur].position.x = xenter;
        cubes[compteur].position.z = zenter;
        scene.add(cubes[compteur]);
        compteur = compteur + 1

        space = false;

    } else if (selectionPoints) {
        compteur = 0;
        cubes = [];
        var selectedObject = scene.getObjectByName("line");
        scene.remove(selectedObject);

        var selectedObject = scene.getObjectByName("floor");
        scene.remove(selectedObject);

        geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        cube = new THREE.Mesh(geometry, material);
        cube.name = "cube";

        scene.add(cube);
        console.log("construction de chemin")

        selectionPoints = false
        Points = []
    } else if (rendre) {

        ////////////////////////////////////////////////////////TEXTURE/////////////////////////////

        var canvas1 = createCanvasforTextureRepeat('texture', 10, 10);
        var ctx = canvas1.getContext('2d');



        var textureRock5bis = defineTextureCanvas(canvas1, 0, 0, false);
        textureRock5bis.minFilter = THREE.LinearFilter;



        ///////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////MASQUE////////////////////

        canvas = createCanvasforTextureRepeat('masque', 10, 10);
        var copyMasquedata = recupImageData(canvas);

        var chemin = computeCheminInterpol(Points);
        modifierMasque(canvas, chemin);

        recupPierres(canvas, copyMasquedata);
        var texturemasque = defineTextureCanvas(canvas, 0, 0, true);
        texturemasque.minFilter = THREE.LinearFilter;
        //////////////////////////////////////////////////////////////////////////////////////////
        materialRock5 = new THREE.MeshBasicMaterial({ alphaMap: texturemasque, alphaTest: 0.5, map: textureRock5bis, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });
        meshFloor = definePlane(materialRock5, 0, epsilon, 0, mapW, mapH, 10, 10)
        meshFloor.name = "floor"
        scene.add(meshFloor)
        pointsClick = [];
        for (let i = 0; i < chemin.length; i++) {
            x = chemin[i][0];
            z = chemin[i][1];
            newcoordinates = transformCanvastoThreeCoordonates(x, z);
            pointsClick.push(new THREE.Vector3(newcoordinates[0], newcoordinates[1], newcoordinates[2]));
        }

        geometryClick = new THREE.Geometry().setFromPoints(pointsClick);
        materialClick = new THREE.LineBasicMaterial({ color: 0x0000ff });

        lineClick = new THREE.Line(geometryClick, materialClick)
        lineClick.name = "line"
        scene.add(lineClick)
        rendre = false
        var selectedObject = scene.getObjectByName("cube");
        scene.remove(selectedObject);

        for (let i = 0; i < compteur; i++) {
            var selectedObject = scene.getObjectByName("cube" + i);
            scene.remove(selectedObject);
        }


    }
}


// Assigner des élévations aléatoires aux vertices des maillages plans
function randomize_elevation(value = 0.4, offset = 0) {

    for (let i = 0; i < meshFloor.geometry.vertices.length; i++) {
        let random_value = Math.random()
        meshFloor.geometry.vertices[i].z = random_value * value + offset + epsilon
        meshGrass.geometry.vertices[i].z = random_value * value + offset
    }
    meshFloor.geometry.verticesNeedUpdate = true
    meshGrass.geometry.verticesNeedUpdate = true

}


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
