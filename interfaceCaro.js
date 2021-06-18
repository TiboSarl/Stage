
var centresTexture11 = [[14, 33], [14, 306], [18, 393], [21, 218], [32, 480], [36, 81], [53, 255], [54, 147], [65, 391], [67, 216], [69, 36], [78, 97], [80, 352], [91, 299], [98, 430], [111, 504], [117, 386], [124, 103], [124, 341], [125, 232], [127, 147], [160, 441], [168, 319], [178, 44], [180, 267], [182, 138], [193, 385], [209, 476], [215, 187], [217, 227], [227, 285], [235, 120], [249, 336], [254, 69], [262, 436], [265, 2], [277, 301], [278, 113], [290, 177], [295, 262], [304, 398], [309, 344], [312, 293], [335, 459], [348, 388], [359, 14], [363, 174], [364, 93], [392, 246], [395, 314], [399, 7], [408, 180], [418, 379], [427, 476], [433, 142], [451, 507], [453, 327], [464, 59], [478, 178], [482, 131], [497, 441], [498, 6], [503, 508]];
var centresTexture3 = [[10,61],[27,392],[27,440],[34,286],[38,74],[39,75],[96,348],[153,123],[153,500],[176,268],[216,45],[257,368],[272,133],[302,210],[318,121],[338,11],[341,294],[360,159],[372,425],[389,258],[409,226],[441,324],[445,443],[448,49],[475,142],[477,410],[496,469],[505,7]];
var centresTexture10 = [[6,369],[10,398],[12,255],[16,158],[19,9],[25,501],[28,325],[34,77],[38,440],[51,194],[71,240],[71,303],[75,361],[84,396],[85,11],[87,140],[93,447],[118,27],[119,255],[121,476],[144,69],[148,394],[156,261],[164,310],[172,164],[186,5],[193,106],[206,506],[214,320],[230,228],[234,391],[236,332],[246,161],[264,19],[265,64],[275,269],[283,189],[285,428],[307,61],[309,492],[318,326],[324,297],[329,229],[337,352],[343,126],[343,445],[351,436],[359,471],[364,250],[385,158],[395,20],[396,381],[400,296],[410,502],[413,56],[420,198],[440,145],[446,442],[450,338],[455,11],[463,499],[463,500],[465,53],[482,285],[483,209],[493,99],[496,460],[500,8],[501,500],[502,322],[503,401],[509,234]];

init_textures()
init()
animate()


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


function createTextureHerbe(repeatX, repeatY) {


    //console.log(herbe2);
    //console.log(herbe2)

    var wtot = herbetext.width, htot = herbetext.height;

    var w1 = wtot/2;
    var h1 = htot/4;
    console.log(w1)
    console.log(h1)




    // Create a Canvas element
    var canvasherbe = document.createElement('canvas');

    // Size the canvas to the element
    canvasherbe.width = w1 * repeatX;
    canvasherbe.height = h1 * repeatY;

    console.log(canvasherbe.width)

    //console.log(canvasherbe.height)

    // Draw image onto the canvas
    var ctx1 = canvasherbe.getContext('2d');

    herbetext.onload = FaireCanvasHerbe(repeatX,repeatY, ctx1,w1,h1)
    //var im = ctxherbe.getImageData(0,0,w1*repeatX, h1*repeatY)
    //console.log(im.data)

    function FaireCanvasHerbe(repeatX,repeatY, ctxherbe,w1,h1) {
        for (let i = 0; i < repeatX; i++) {
    
            for (let j = 0; j < repeatY; j++) {

                var wr = Math.floor(Math.random() * 2);
                var hr = Math.floor(Math.random() * 4);

                ctx1.drawImage(herbetext, w1*wr,h1*hr, w1, h1, w1 * i, j * h1, w1, w1)
    
            }
        }
    }

    

    return canvasherbe
}





/////////////////////////////////////
///////////Debut chemin//////////////
/////////////////////////////////////

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

    var temps = buildParametrisationTchebytcheff(Points.length, 0.01);
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


/////////////////////////////////////
/////Debut modification masque///////
/////////////////////////////////////


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
            n = i * w + j;

            if (masquedata.data[4 * n] == 255 && masquedata.data[4 * n + 1] == 0 && masquedata.data[4 * n + 2] == 0) {
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
    return canvas


}

function modifierMasque2(canvas, chemin, masque, centres) {

    distancemax = 350
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    ctx.fillRect(0, 0, w, h)
    canvasdata = ctx.getImageData(0, 0, w, h);
    var ctx2 = masque.getContext('2d');
    var masquedata = ctx2.getImageData(0, 0, w, h);
    var germes = [];
    for (let i = 0; i < centres.length; i++) {
        point = centres[i];
        if (distancechemin(point, chemin) < distancemax) {
            germes.push(point);
        }
    }
    console.log("germes obtenus")

    for (let k = 0; k < germes.length; k++) {
        canvasdata1 = recupPierre(canvasdata, masquedata, germes[k], w, h);
        canvasdata = canvasdata1
    }
    ctx.putImageData(canvasdata1, 0, 0);
    return canvas

}

function recupImageData(canvas) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var data = ctx.getImageData(0, 0, w, h);

    return data
}


function recupPierre(masquedata, copyMasquedata, point, w, h) {

    ipoint = point[0];
    jpoint = point[1];
    n = ipoint * w + jpoint

    // point centre
    lignehorizontal = [n]
    if (copyMasquedata.data[4*n] == 255) {
        masquedata.data[4 * n] = 255
        masquedata.data[4 * n + 1] = 255
        masquedata.data[4 * n + 2] = 255
        masquedata.data[4 * n + 3] = 255
    }

    // ligne horizontale gauche
    ind = n
    gauche = copyMasquedata.data[4 * (ind - 1)]
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
    ind = n
    droite = copyMasquedata.data[4 * (ind + 1)]
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
    lignevertical = []

    // ligne verticale bas
    ind = n;
    indMoins1 = ind - w;
    bas = copyMasquedata.data[4 * indMoins1]
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
    ind = n
    indPlus1 = ind + w;
    gauche = copyMasquedata.data[4 * indPlus1]
    while (gauche == 255 && indPlus1 != 0) {
        masquedata.data[4 * indPlus1] = 255
        masquedata.data[4 * indPlus1 + 1] = 255
        masquedata.data[4 * indPlus1 + 2] = 255
        masquedata.data[4 * indPlus1 + 3] = 255
        //ind = indPlus1;
        lignevertical.push(indPlus1)
        indPlus1 = indPlus1 + w;
        gauche = copyMasquedata.data[4 * indPlus1]
    }


    // ligne vertical tamp
    ligneverticaltemp = [];
    lignehorizontaltemp = [];
    
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
            bastemp = indMoins1;
            indMoins1 = indMoins1 - w;
            bas = copyMasquedata.data[4 * indMoins1]
        }
        
        ligneverticaltemp.push(bastemp);
        
        ind = lignehorizontal[k]
        indPlus1 = ind + w;
        haut = copyMasquedata.data[4 * indPlus1]
        while (haut == 255 && indPlus1 != 0) {
            masquedata.data[4 * indPlus1] = 255
            masquedata.data[4 * indPlus1 + 1] = 255
            masquedata.data[4 * indPlus1 + 2] = 255
            masquedata.data[4 * indPlus1 + 3] = 255
            //ind = indPlus1;
            hauttemp = indPlus1;
            indPlus1 = indPlus1 + w;
            haut = copyMasquedata.data[4 * indPlus1]
        }

        ligneverticaltemp.push(hauttemp);

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
            gauchetemp = ind;
            //lignehorizontal.push(ind)
            gauche = copyMasquedata.data[4 * (ind - 1)]
        }

        lignehorizontaltemp.push(gauchetemp);

        ind = lignevertical[k];
        droite = copyMasquedata.data[4 * (ind + 1)]
        while (droite == 255 && ind + 1 != 0) {
            masquedata.data[4 * (ind + 1)] = 255
            masquedata.data[4 * (ind + 1) + 1] = 255
            masquedata.data[4 * (ind + 1) + 2] = 255
            masquedata.data[4 * (ind + 1) + 3] = 255
            ind = ind + 1;
            droitetemp = ind;
            //lignehorizontal.push(ind)
            droite = copyMasquedata.data[4 * (ind + 1)]
        }

        lignehorizontaltemp.push(droitetemp);

    }

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

    
    return masquedata

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

function dupliquer(centres, Xrepeat, Yrepeat, w, h) {

    T = [];

    for (let k = 0; k < centres.length; k++) {
        var x = centresTexture10[k][0];
        var y = centresTexture10[k][1];

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
function init_textures() {


    ////////////////////////////////////// HERBES ////////////////////
    // Get a reference to the image you want the pixels of and its dimensions
    herbetext = document.getElementById('herbetext');


    ///////////////////////////////////////////////////////////////////////////////
    // Pour n'afficher que les edges
    wireframe_mode = false

    var canvasherbe = createTextureHerbe(10, 10);
    var textureGrass = defineTextureCanvas(canvasherbe, 0, 0, false);
    textureGrass.minFilter = THREE.LinearFilter;

    var textureGrassBasique = defineTexture("graphics/freeTexture2.png", 10, 10, true)

    materialGrassBasique = new THREE.MeshBasicMaterial({ map: textureGrassBasique, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });
    materialGrass = new THREE.MeshBasicMaterial({ map: textureGrass, side: THREE.DoubleSide, wireframe: wireframe_mode, shininess: 0 });


    //console.log(materialGrassBasique)

    textures = defineTexture("graphics/textures.png", 1, 1)
    textures.anisotropy = 16;

    textureMask = defineTexture("graphics/masque_freeTexture11.png", 10, 10, true)

    ////////////////////////////////////////////////////////TEXTURE/////////////////////////////

    var canvas1 = createCanvasforTextureRepeat('texture', 10, 10);

    var textureRock5bis = defineTextureCanvas(canvas1, 0, 0, false);
    textureRock5bis.minFilter = THREE.LinearFilter;



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

    var centres = dupliquer(centresTexture10, 10, 10, w1, h1);
    console.log("modifierMasque2")
    canvas2 = modifierMasque2(canvas2, chemin, canvas, centres)



    /*
    canvas = createCanvasforTextureRepeat('masque', 10, 10);

    var copyMasquedata = recupImageData(canvas);

    Points = [[0, 0], [500, 1000], [2000, 3000], [4000, 2000], [5000, 3000]];
    var chemin = computeCheminInterpol(Points);
    modifierMasque(canvas, chemin);

    recupPierres(canvas, copyMasquedata);
    */


    var texturemasque = defineTextureCanvas(canvas2, 0, 0, true);
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
    dejacube = false;
    compteur = 0

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

        for (let i = 0; i < compteur; i++) {
            var selectedObject = scene.getObjectByName("cube" + i);
            scene.remove(selectedObject);
        }

        cubes = [];
        compteur = 0;
        var selectedObject = scene.getObjectByName("line");
        scene.remove(selectedObject);

        var selectedObject = scene.getObjectByName("floor");
        scene.remove(selectedObject);
        if (!dejacube) {
            geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
            material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            cube = new THREE.Mesh(geometry, material);
            cube.name = "cube";
            scene.add(cube);
        }



        console.log("construction de chemin")
        dejacube = true
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

        var canvas = createCanvasforTextureRepeat('masque', 10, 10);

        var myImage1 = document.getElementById('masque');


        var w1 = myImage1.width, h1 = myImage1.height;


        var canvas2 = document.createElement('canvas');

        // Size the canvas to the element
        canvas2.width = canvas1.width;
        canvas2.height = canvas1.height;

        var chemin = computeCheminInterpol(Points);

        var centres = dupliquer(centresTexture10, 10, 10, w1, h1);
        console.log("modifierMasque2")
        canvas2 = modifierMasque2(canvas2, chemin, canvas, centres)
        var texturemasque = defineTextureCanvas(canvas2, 0, 0, true);
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
        dejacube = false;

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
