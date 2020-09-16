//
//  Seminario #1 GPC. Pintar el canvas simplemente
//

function main() {
    // Recuperar el canvas
    var canvas = document.getElementById("canvas");
    if (!canvas) {
        console.log("Fallo de carga del canvas");
        return;
    }

    // Recuperar el contexto de render
    var gl = getWebGLContext(canvas)
    if (!gl) {
        console.log("Fallo de carga del contexto del render");
        return;
    }
    //Fija el color del borrado del canvas
    gl.clearColor(0.0, 0.0, 0.3, 1.0)

    //Se borra el canvas
    gl.clear(gl.COLOR_BUGGER_BIT)
    return;
}