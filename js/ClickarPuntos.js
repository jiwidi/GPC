//Seminario #1 GPC


//Shader vertices
var VSHADER_SOURCE =
    'attribute vec4 posicion;       \n' +
    'void main(){                   \n' +
    '  gl_Position = posicion;      \n' +
    '  gl_PointSize = 10.0;         \n' +
    '}       \n';


var FSHADER_SOURCE =
    'void main(){                   \n' +
    '  gl_FragColor = vec4(1.0,0.0,0.0,1.0);      \n' +
    '}                              \n';


function main() {
    //Recuperar el cavas
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

    // Cargar, compilar y montar los shaders en un 'program'
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Se ha liado en la carga de los shaders")
        return;
    }
}