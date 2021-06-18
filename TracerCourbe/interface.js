init()
animate()

function init() {

    // Cette ligne permet d'empêcher l'apparition d'un menu déroulant ("Save as", etc) en cas de clic droit
    document.addEventListener('contextmenu', event => event.preventDefault());

    // Création d'un canvas, qui est l'objet sur lequel on dessine (en gros c'est l'équivalent de la fenêtre blanche, vide au départ, de taille 640x480 dans Game Factory)
    canvas = document.getElementById("canvas")
    canvas.width = 1920 // Dimension horizontale
    canvas.height = 1080 // Dimension verticale

    // On récupère le contexte du canvas, c'est à partir du contexte qu'on fera tout désormais (afficher une image, dessiner un segment, etc)
    ctx = canvas.getContext("2d")

    // Initialisation des variables permettant d'obtenir les coordonées de la souris
    xyMouse = {"x": 0, "y": 0}

    // Initialisation de la densité de probabilité
    densite_proba = []
    for (let i = 0; i < 100; i++) {
        densite_proba.push(0)
    }

    // Initialiser le graphe
    x0 = 50
    y0 = 550
    x1 = 1050
    y1 = 50

    // Initialisation des variables pour détecter un clic
    // On les met tous à false au départ, et on les passe à true lors du clic ou de l'appui sur une touche
    // Ils repasseront ensuite à false quand l'action correspondante aura été faite
    sourisDeplacement = false
    sourisClicGaucheEnfonce = false

    // Pour récupérer les coordonnées de la souris quand elle bouge
    canvas.addEventListener('mousemove', function(event) {
        xyMouse = getMousePos(canvas, event)
        sourisDeplacement = true
    }, false)

    // Pour récupérer les coordonnées de la souris quand on clique
    canvas.addEventListener('mousedown', function(event) {
        if (event.which == 1) {
            sourisClicGaucheEnfonce = true
        }
    }, false)

    // Pour récupérer les coordonnées de la souris quand on relâche le clic
    canvas.addEventListener('mouseup', function(event) {
        if (event.which == 1) {
            sourisClicGaucheEnfonce = false
        }
    }, false)

}


// La fonction permettant de récupérer les coordonnées du pointeur de la souris
function getMousePos(c, event) {

    var rect = c.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top

    };
}


// La fonction animate est la boucle principale, elle sera appelée automatiquement 60 fois par seconde
function animate() {

    // On efface ce qu'il y a à l'écran (sinon ça se superpose quand on se déplace), puis on redessinera tout
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dessiner les axes en noir avec une épaisseur de 1
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y0)
    ctx.lineTo(x1-5, y0+5)
    ctx.stroke()
    ctx.moveTo(x1,y0)
    ctx.lineTo(x1-5, y0-5)
    ctx.stroke()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x0, y1)
    ctx.lineTo(x0+5, y1+5)
    ctx.stroke()
    ctx.moveTo(x0, y1)
    ctx.lineTo(x0-5, y1+5)
    ctx.stroke()

    // Dessiner la courbe en bleu avec une épaisseur de 3
    ctx.strokeStyle = "#0000ff"
    ctx.lineWidth = 3

    for (let i = 0; i < densite_proba.length-1; i++) {
        ctx.beginPath()
        ctx.moveTo(x0 + (x1-x0)*i/(densite_proba.length), y0 - densite_proba[i])
        ctx.lineTo(x0 + (x1-x0)*(i+1)/(densite_proba.length), y0 - densite_proba[i+1])
        ctx.stroke()
    }

    // Mettre à jour la densité si clic enfoncé
    if (sourisClicGaucheEnfonce && xyMouse.x > x0 && xyMouse.x < x1 && xyMouse.y < y0 && xyMouse.y > y1) {
        idx = Math.floor((xyMouse.x - x0) / ((x1 - x0) / densite_proba.length))
        densite_proba[idx] = y0 - xyMouse.y
    }

    // À la fin de cette fonction, on fait requestAnimationFrame qui permet de rappeler la fonction et s'arrange pour qu'elle soit appelée 60 fois par seconde.
    requestAnimationFrame(animate)

}

