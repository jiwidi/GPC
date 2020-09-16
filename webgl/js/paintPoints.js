/* 
Seminario 1 PGC. Paint points function
*/

// Vertices shader
var VSHADER_SOURCE =
'attribute vec4 position;       \n' +
'void main() {                  \n' +
'   gl_Position = position;     \n' +
'   gl_PointSize = 10.0;        \n' +
'}                              \n';

// Fragments shader
var FSHADER_SOURCE =
'void main() {                                  \n' +
'   gl_FraColor = vec(1.0, 0.0, 0.0, 1.0);      \n' +
'}                                              \n';

function main() {
    // Get canvas where graphics are displayed
    var canvas = document.getElementById("canvas")
        
        if (!canvas) {
            console.log("Error loading canvas");
            return;
        }

        // Get render context
        var gl = getWebGLContext(canvas);
        if (!gl) {
            conlose.log("Error loading the context render");
            return;
        }

        // Load, compile and mount shaders in a 'program'
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log("Error loading shaders");
            return;
        }

        // Set clear color
        gl.clearColor(1.0, 0.0, 0.0, 1.0);
        // Clear canvas
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Localize the attribute in the vertices shader
        var coordinates = gl.getAttribLocation(gl.program, 'position');

        // Register event
        canvas.onmousedown = function(event) {click(event, gl, canvas, coordinates);};

}

// Points drawn array
// Line strips
var points = [];

function click(event, gl, canvas, coordinates) {
    // Get clicked point
    var x = event.clientX;
    var y = event.clientY;
    var rect = event.target.getBoundingClientRect();

    // Coordinate conversion
    x = ((x-rect.left) - canvas.width/2) * 2 / canvas.width;
    y = (canvas.height/2 - (y-rect.top)) * 2 / canvas.height;

    // Save point
    points.push(x);
    points.push(y);

    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Insert coordinates of points as an attribute and draw them
    for (var i=0; i < points.length; i+=2) {
        gl.vertexAttrib3f(coordinates, points[i], points[i+1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}