//toon shading//Toon Shading
var T_VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'attribute vec4 a_Normal;\n' +
'uniform mat4 u_MvpMatrix;\n' +
'uniform mat4 u_NormalMatrix;\n' +
'uniform mat4 u_ModelMatrix;\n' +
'varying vec4 v_Position;\n' +
//'varying vec4 v_Color;\n' +
'varying vec3 v_Normal;\n' +
'void main() {\n' +
'  gl_Position = u_MvpMatrix * a_Position;\n' +
'  v_Position = u_ModelMatrix * a_Position;\n' +
'  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
'}\n';

// Fragment shader program
var T_FSHADER_SOURCE =
'#ifdef GL_ES\n' +
'precision mediump float;\n' +
'#endif\n' +
'struct Light{\n' +
'vec4 pos;\n' +
'vec3 amb;\n' +
'vec3 diff;\n' +
'vec3 spec;\n' +
'vec3 ke;\n' +
'vec3 ka;\n' +
'vec3 kd;\n' +
'vec3 ks;\n' +
'float kshiny;\n' +
'};\n' +
'uniform Light li[8];\n' +
'uniform int attAdjustable;\n' +
'uniform vec4 u_eyePosWorld; \n' +  // Camera/eye location in world coords.
'varying vec3 v_Normal;\n' +
'varying vec4 v_Position;\n' + 
//'varying vec4 v_Color;\n' +
'void main() {\n' +
'  struct param{\n' +
'  vec3 direct;\n' +
'  float distance;\n' +
'  float att;\n' +
'  float dotl;\n' +
'  vec3 h;\n' +
'  float doth;\n' +
'  float vdoth;\n' +
'  float alpha;\n' +
'  float D;\n' +
'  float G;\n' +
'};\n' +
'  param pa[8];\n' +
'  float cook;\n' +
'  vec3 normal = normalize(v_Normal);\n' + //Nn
'  vec3 eyeDirection = normalize(u_eyePosWorld.xyz - v_Position.xyz); \n' + //Vn
'  float NdotV = dot(normal, eyeDirection);\n' +
'  for (int i = 0; i< 6; i++){\n' +
'  pa[i].direct = normalize(li[i].pos.xyz - v_Position.xyz);\n' + //Ln
'  pa[i].distance = length(u_eyePosWorld.xyz - v_Position.xyz);\n' +
'  pa[i].dotl = dot(pa[i].direct, normal);\n' + // Nn.Ln
'  pa[i].h = normalize(pa[i].direct + eyeDirection); \n' + // H
'  pa[i].doth = dot(pa[i].h, normal);\n' + // Nn.H
'  pa[i].vdoth = dot(eyeDirection, pa[i].h);\n' + // Vn.H
'  pa[i].alpha = acos(pa[i].doth);\n' +
'  pa[i].D = 100.0 * exp(-(pa[i].alpha* pa[i].alpha)/(0.2*0.2));\n' +
'  pa[i].G = min(1.0, min((2.0*pa[i].doth*NdotV/pa[i].vdoth), (2.0*pa[i].doth*pa[i].dotl/pa[i].vdoth)));\n' +
'  cook = cook + (pa[i].D*pa[i].G)/ (3.14*NdotV);\n' +
'  if(attAdjustable == 1) pa[i].att = 1.0;\n' +
'  else if(attAdjustable == 2) pa[i].att = 1.0/(1.0+0.1*pa[i].distance);\n' +
'  else if(attAdjustable == 3) pa[i].att = 1.0/(1.0+ 0.1*pow(pa[i].distance, 2.0));}\n' +
'  cook = cook/3.14;\n' +
'  vec3 emissive = li[0].ke + li[1].ke + li[2].ke + li[3].ke +li[4].ke+ li[5].ke; \n' +
'  vec3 ambient = li[0].amb * li[0].ka + li[1].amb * li[1].ka + li[2].amb * li[2].ka + li[3].amb*li[3].ka+ li[4].amb * li[4].ka + li[5].amb*li[5].ka;\n' +
'  vec3 diffuse = li[0].diff * li[0].kd * pa[0].dotl * pa[0].att + li[1].diff * li[1].kd * pa[1].dotl * pa[1].att + li[2].diff * li[2].kd * pa[2].dotl * pa[2].att + li[3].diff * li[3].kd * pa[3].dotl * pa[3].att + li[4].diff * li[4].kd * pa[4].dotl * pa[4].att + li[5].diff * li[5].kd * pa[5].dotl * pa[5].att;\n' +
'  vec3 speculr = pa[0].att*li[0].spec * li[0].ks * pow(pa[0].doth, li[0].kshiny) + pa[1].att*li[1].spec * li[1].ks  * pow(pa[1].doth, li[1].kshiny*0.2)+ pa[2].att*li[2].spec * li[2].ks * pow(pa[2].doth, li[2].kshiny) + pa[3].att*li[3].spec * li[3].ks * pow(pa[3].doth, li[3].kshiny)+ pa[4].att*li[4].spec * li[4].ks * pow(pa[4].doth, li[4].kshiny)+ pa[5].att*li[5].spec * li[5].ks * pow(pa[5].doth, li[5].kshiny);\n' +
'  gl_FragColor = vec4((emissive + ambient + diffuse + speculr*cook), 1);\n' +
'}\n';
//Gouraud Shading
var G_VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'attribute vec4 a_Normal;\n' +
'attribute vec4 a_Color;\n' +
'uniform float u_time;\n' +
'uniform mat4 u_MvpMatrix;\n' +
'uniform mat4 u_NormalMatrix;\n' +
'uniform mat4 u_ModelMatrix;\n' +
'uniform vec3 u_LightPosition;\n' +
'uniform vec4 u_eyePosWorld;\n' +
'varying vec4 v_Position;\n' +
'varying vec4 v_Color;\n' +
'struct Light{\n' +
'vec4 pos;\n' +
'vec3 amb;\n' +
'vec3 diff;\n' +
'vec3 spec;\n' +
'vec3 ke;\n' +
'vec3 ka;\n' +
'vec3 kd;\n' +
'vec3 ks;\n' +
'float kshiny;\n' +
'};\n' +
'uniform Light li[8];\n' +

'void main() {\n' +
'  v_Position = u_ModelMatrix * a_Position;\n' +
'  vec4 position = a_Position;\n' +
'  float dist = length( vec3(position));\n' +
'  float y = sin(dist*40.0 + u_time);\n' +
//'  vec3 lightDirection = vec3(0, 1.5, 1.5);\n' +
'  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
//'  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
//'  vec3 ambi = vec3(0.4, 0.4, 0.4);\n' +
//'  vec3 lightColor = vec3 (0.8, 0.8, 0.8);\n' +
'  gl_Position = u_MvpMatrix * (a_Position + vec4(y*0.8, y*0.2, y*0.4, 0));\n' +
//'  v_Color = vec4((nDotL*lightColor + ambi)* a_Color.rgb * y, a_Color.a);\n' +

'  struct param{\n' +
'  vec3 direct;\n' +
'  float dotl;\n' +
'  vec3 h;\n' +
'  float doth;\n' +
'};\n' +
'  param pa[8];\n' +
'  vec3 eyeDirection = normalize(u_eyePosWorld.xyz - v_Position.xyz); \n' +
'  for (int i = 0; i< 6; i++){\n' +
'  pa[i].direct = normalize(li[i].pos.xyz - v_Position.xyz);\n' +
'  pa[i].dotl = max(dot(pa[i].direct, normal), 0.0);\n' +
'  pa[i].h = normalize(pa[i].direct + eyeDirection); \n' +
'  pa[i].doth = max(dot(pa[i].h, normal), 0.0); }\n' +
'  vec3 emissive = li[0].ke + li[1].ke + li[2].ke + li[3].ke +li[4].ke+ li[5].ke; \n' +
'  vec3 ambient = li[0].amb * li[0].ka + li[1].amb * li[1].ka + li[2].amb * li[2].ka + li[3].amb*li[3].ka+ li[4].amb * li[4].ka + li[5].amb*li[5].ka;\n' +
'  vec3 diffuse = li[0].diff * li[0].kd * pa[0].dotl + li[1].diff * li[1].kd * pa[1].dotl + li[2].diff * li[2].kd * pa[2].dotl + li[3].diff * li[3].kd * pa[3].dotl+ li[4].diff * li[4].kd * pa[4].dotl+ li[5].diff * li[5].kd * pa[5].dotl;\n' +
'  vec3 speculr = li[0].spec * li[0].ks * pow(pa[0].doth, li[0].kshiny) + li[1].spec * li[1].ks * pow(pa[1].doth, li[1].kshiny) + li[2].spec * li[2].ks * pow(pa[2].doth, li[2].kshiny) + li[3].spec * li[3].ks * pow(pa[3].doth, li[3].kshiny)+ li[4].spec * li[4].ks * pow(pa[4].doth, li[4].kshiny)+ li[5].spec * li[5].ks * pow(pa[5].doth, li[5].kshiny);\n' +
'  v_Color = vec4((emissive + ambient + diffuse + speculr)*a_Color.rgb, a_Color.a);\n' +

'}\n';
// Fragment shader program
var G_FSHADER_SOURCE =
'#ifdef GL_ES\n' +
'precision mediump float;\n' +
'#endif\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'  gl_FragColor = v_Color;\n' +
'}\n';
//Phong Shading
// Vertex shader program
var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'attribute vec4 a_Normal;\n' +
'uniform mat4 u_MvpMatrix;\n' +
'uniform mat4 u_NormalMatrix;\n' +
'uniform mat4 u_ModelMatrix;\n' +
'varying vec4 v_Position;\n' +

//'varying vec4 v_Color;\n' +
'varying vec3 v_Normal;\n' +
'void main() {\n' +
'  gl_Position = u_MvpMatrix * a_Position;\n' +
'  v_Position = u_ModelMatrix * a_Position;\n' +
'  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
//'  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
//'  v_Color = a_Color;\n' +
'}\n';

// Fragment shader program
var FSHADER_SOURCE =
'#ifdef GL_ES\n' +
'precision mediump float;\n' +
'#endif\n' +
'struct Light{\n' +
'vec4 pos;\n' +
'vec3 amb;\n' +
'vec3 diff;\n' +
'vec3 spec;\n' +
'vec3 ke;\n' +
'vec3 ka;\n' +
'vec3 kd;\n' +
'vec3 ks;\n' +
'float kshiny;\n' +
'};\n' +
'uniform Light li[8];\n' +
'uniform int attAdjustable;\n' +
'uniform vec4 u_eyePosWorld; \n' +  // Camera/eye location in world coords.
'varying vec3 v_Normal;\n' +
'varying vec4 v_Position;\n' + 
//'varying vec4 v_Color;\n' +
'void main() {\n' +
'  struct param{\n' +
'  vec3 direct;\n' +
'  float distance;\n' +
'  float att;\n' +
'  float dotl;\n' +
'  vec3 h;\n' +
'  float doth;\n' +
'};\n' +
'  param pa[8];\n' +
'  vec3 normal = normalize(v_Normal);\n' +
'  vec3 eyeDirection = normalize(u_eyePosWorld.xyz - v_Position.xyz); \n' +
//'  vec3 viewDir = normalize(v_Position);\n' +
'  for (int i = 0; i< 6; i++){\n' +
'  pa[i].direct = normalize(li[i].pos.xyz - v_Position.xyz);\n' +
'  pa[i].distance = length(u_eyePosWorld.xyz - v_Position.xyz);\n' +
'  pa[i].dotl = max(dot(pa[i].direct, normal), 0.0);\n' +
'  pa[i].h = normalize(pa[i].direct + eyeDirection); \n' +
//'  pa[i].h = normalize(pa[i].direct + viewDir); \n' +	// pa[i].h -> halfDir
'  pa[i].doth = max(dot(pa[i].h, normal), 0.0);\n' +	// pa[i].doth -> specangle
'  if(attAdjustable == 1) pa[i].att = 1.0;\n' +
'  else if(attAdjustable == 2) pa[i].att = 1.0/(1.0+0.1*pa[i].distance);\n' +
'  else if(attAdjustable == 3) pa[i].att = 1.0/(1.0+0.1*pow(pa[i].distance, 2.0));}\n' +
'  vec3 emissive = li[0].ke + li[1].ke + li[2].ke + li[3].ke +li[4].ke+ li[5].ke; \n' +
'  vec3 ambient = li[0].amb * li[0].ka + li[1].amb * li[1].ka + li[2].amb * li[2].ka + li[3].amb*li[3].ka+ li[4].amb * li[4].ka + li[5].amb*li[5].ka;\n' +
'  vec3 diffuse = li[0].diff * li[0].kd * pa[0].dotl * pa[0].att + li[1].diff * li[1].kd * pa[1].dotl * pa[1].att + li[2].diff * li[2].kd * pa[2].dotl * pa[2].att + li[3].diff * li[3].kd * pa[3].dotl * pa[3].att + li[4].diff * li[4].kd * pa[4].dotl * pa[4].att + li[5].diff * li[5].kd * pa[5].dotl * pa[5].att;\n' +
'  vec3 speculr = pa[0].att*li[0].spec * li[0].ks * pow(pa[0].doth, li[0].kshiny) + pa[1].att*li[1].spec * li[1].ks * pow(pa[1].doth, li[1].kshiny) + pa[2].att*li[2].spec * li[2].ks * pow(pa[2].doth, li[2].kshiny) + pa[3].att*li[3].spec * li[3].ks * pow(pa[3].doth, li[3].kshiny)+ pa[4].att*li[4].spec * li[4].ks * pow(pa[4].doth, li[4].kshiny)+ pa[5].att*li[5].spec * li[5].ks * pow(pa[5].doth, li[5].kshiny);\n' +
'  gl_FragColor = vec4((emissive + ambient + diffuse + speculr), 1);\n' +
'}\n';
var TEXTURE_VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'attribute vec4 a_Normal;\n' +
'attribute vec2 a_TexCoord;\n' +
'uniform mat4 u_MvpMatrix;\n' +
'uniform mat4 u_NormalMatrix;\n' +
'varying float v_NdotL;\n' +
'varying vec2 v_TexCoord;\n' +
'void main() {\n' +
'  vec3 lightDirection = vec3(0.0, 1.0, 1.0);\n' + // Light direction(World coordinate)
'  gl_Position = u_MvpMatrix * a_Position;\n' +
'  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
'  v_NdotL = max(dot(normal, lightDirection), 0.0);\n' +
'  v_TexCoord = a_TexCoord;\n' +
'}\n';
var TEXTURE_FSHADER_SOURCE =
'#ifdef GL_ES\n' +
'precision mediump float;\n' +
'#endif\n' +
'uniform sampler2D u_Sampler;\n' +
'varying vec2 v_TexCoord;\n' +
'varying float v_NdotL;\n' +
'void main() {\n' +
'  vec4 color = texture2D(u_Sampler, v_TexCoord);\n' +
'  gl_FragColor = vec4(color.rgb * v_NdotL, color.a);\n' +
'}\n';

var g_EyeX = 0.20, g_EyeY = 2.55, g_EyeZ = 8.25; 
var g_LookAtX = 0.0, g_LookAtY = 0.0, g_LookAtZ = 0.0;

var canvas;
var floatsPerVertex = 3;
var currentAngle = 0.0; // Current rotation angle (degrees)
var ANGLE_STEP = 45.0;  
var MOVE_STEP = 0.15;
var LOOK_STEP = 0.02;
var PHI_NOW = 0;
var THETA_NOW = 0;
var LAST_UPDATE = -1;
var isDrag=false;
var xMclik=0.0, yMclik=0.0;   
var xMdragTot=0.0, yMdragTot=0.0;  
var c30 = Math.sqrt(0.75), sq2 = Math.sqrt(2.0);

var headLight = 0, sphereLight = 0, cubeLight = 0, torusLight = 0, cylinderLight =0, lightMat = 1;
var lightSpecStep = new Float32Array([0, 0, 0]);
var lampADSVar = new Float32Array(10);
var switchShadingProgram;
var userLightPos = new Float32Array([0.2, 0, 6]);


function main(){
	canvas = document.getElementById('webgl');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight-200;

	canvas.onmousedown  = function(ev){myMouseDown( ev, gl, canvas) }; 
	canvas.onmousemove =  function(ev){myMouseMove( ev, gl, canvas) };          
	canvas.onmouseup =    function(ev){myMouseUp(   ev, gl, canvas)};
	document.onkeydown = function(ev){ keydown(ev, gl, canvas); };
	document.onkeypress = function(ev){ keypress(ev, gl, canvas); };
	var gl = getWebGLContext(canvas);
	if(!gl){
		console.log('Failed to get the rendering context for WebGL');
		return;
	}
	var solidProgram = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
	var gouraudProgram = createProgram(gl, G_VSHADER_SOURCE, G_FSHADER_SOURCE);
	var toonProgram = createProgram(gl, T_VSHADER_SOURCE, T_FSHADER_SOURCE);
	//var objProgram = createProgram(gl, OBJ_VSHADER_SOURCE, OBJ_FSHADER_SOURCE);
	var texProgram = createProgram(gl, TEXTURE_VSHADER_SOURCE, TEXTURE_FSHADER_SOURCE);
	if (!solidProgram || !texProgram || !gouraudProgram|| !toonProgram) {
		console.log('Failed to intialize shaders.');
		return;
	}
	solidProgram.a_Position = gl.getAttribLocation(solidProgram, 'a_Position');
	solidProgram.a_Normal = gl.getAttribLocation(solidProgram, 'a_Normal');
	solidProgram.u_MvpMatrix = gl.getUniformLocation(solidProgram, 'u_MvpMatrix');
	solidProgram.u_NormalMatrix = gl.getUniformLocation(solidProgram, 'u_NormalMatrix');
	solidProgram.u_ModelMatrix = gl.getUniformLocation(solidProgram, 'u_ModelMatrix');
	solidProgram.attAdjustable = gl.getUniformLocation(solidProgram, 'attAdjustable');

	toonProgram.a_Position = gl.getAttribLocation(toonProgram, 'a_Position');
	toonProgram.a_Normal = gl.getAttribLocation(toonProgram, 'a_Normal');
	toonProgram.u_MvpMatrix = gl.getUniformLocation(toonProgram, 'u_MvpMatrix');
	toonProgram.u_NormalMatrix = gl.getUniformLocation(toonProgram, 'u_NormalMatrix');
	toonProgram.u_ModelMatrix = gl.getUniformLocation(toonProgram, 'u_ModelMatrix');
	toonProgram.attAdjustable = gl.getUniformLocation(toonProgram, 'attAdjustable');

	gouraudProgram.a_Position = gl.getAttribLocation(gouraudProgram, 'a_Position');
	gouraudProgram.a_Normal = gl.getAttribLocation(gouraudProgram, 'a_Normal');
	gouraudProgram.a_Color = gl.getAttribLocation(gouraudProgram, 'a_Color');
	gouraudProgram.u_MvpMatrix = gl.getUniformLocation(gouraudProgram, 'u_MvpMatrix');
	gouraudProgram.u_NormalMatrix = gl.getUniformLocation(gouraudProgram, 'u_NormalMatrix');
	gouraudProgram.u_ModelMatrix = gl.getUniformLocation(gouraudProgram, 'u_ModelMatrix');
	gouraudProgram.u_time = gl.getUniformLocation(gouraudProgram, 'u_time');

	texProgram.a_Position = gl.getAttribLocation(texProgram, 'a_Position');
	texProgram.a_Normal = gl.getAttribLocation(texProgram, 'a_Normal');
	texProgram.a_TexCoord = gl.getAttribLocation(texProgram, 'a_TexCoord');
	texProgram.u_MvpMatrix = gl.getUniformLocation(texProgram, 'u_MvpMatrix');
	texProgram.u_NormalMatrix = gl.getUniformLocation(texProgram, 'u_NormalMatrix');
	texProgram.u_Sampler = gl.getUniformLocation(texProgram, 'u_Sampler');

	if (solidProgram.a_Position < 0 || solidProgram.a_Normal < 0 
//|| solidProgram.a_Color < 0 
|| !solidProgram.u_MvpMatrix || !solidProgram.u_NormalMatrix || !solidProgram.u_ModelMatrix ||
texProgram.a_Position < 0 || texProgram.a_Normal < 0 || texProgram.a_TexCoord < 0 ||
!texProgram.u_MvpMatrix || !texProgram.u_NormalMatrix || !texProgram.u_Sampler) { 
		console.log('Failed to get the storage location of attribute or uniform variable'); 
	return;
}

var cube = initVertexBuffersForCube(gl);
var ground = initVertexBuffersForGround(gl);
var axes = initVertexBuffersForAxes(gl);
var sphere = initVertexBuffersForSphere(gl);
var cylinder = initVertexBuffersForCylinder(gl);
var torus = initVertexBuffersForTorus(gl);
if (!cube || !ground || !axes || !sphere || !cylinder || !torus) {
	console.log('Failed to set the vertex information');
	return;
}
var image = new Image();  // Create a image object
var image1 = new Image();  // Create a image object

image.src = 'dirt.jpg';
image1.src = 'image1.png';
var texture1 = initTextures(gl, texProgram, image1);
var texture = initTextures(gl, texProgram, image);
if (!texture) {
	console.log('Failed to intialize the texture.');
	return;
}
var textureImg1 = initTexturesForImg1(gl, texProgram);
if (!textureImg1) {
	console.log('Failed to intialize the texture.');
	return;
}

//var model = initVertexBuffers(gl, objProgram);

gl.enable(gl.DEPTH_TEST);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

//readOBJFile('cube.obj', gl, model, 0.1, true);
var viewProjMatrix = new Matrix4();
var time = 0;

var tick = function() {

	var attAdjustable = contr.ATT;
	var isToon = contr.isToon, isGouraud = contr.isGouraud, modelTex = contr.Minions_img;
currentAngle = animate(currentAngle);  // Update current rotation angle
time += 0.05;
gl.useProgram(gouraudProgram);
gl.uniform1f(gouraudProgram.u_time, time);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffers
// Draw a cube in single color
gl.viewport(0, 0, canvas.width*0.6, canvas.height);
viewProjMatrix.setPerspective(40.0, 0.6*canvas.width/canvas.height, 1.0, 100.0);
viewProjMatrix.lookAt(
	g_EyeX, g_EyeY, g_EyeZ, 
	g_LookAtX, g_LookAtY, g_LookAtZ, 
	0, 1, 0);
gl.useProgram(toonProgram);
gl.uniform1i(toonProgram.attAdjustable, attAdjustable);

var lampEyeLookCamera = new Float32Array([g_EyeX, g_EyeY, g_EyeZ, g_EyeX, g_EyeY, g_EyeZ]);
gl.useProgram(solidProgram);
var lampADSGround = new Float32Array([0.4, 0.4, 0.4, 1, 1, 1, 1, 1, 1, 1]);
setLight(gl, solidProgram, 0, lampADSGround, lampEyeLookCamera, 12, headLight);
gl.uniform1i(solidProgram.attAdjustable, attAdjustable);
lampADSVar = ([contr.ambiRed, contr.ambiGreen, contr.ambiBlue, contr.diffRed, contr.diffGreen, contr.diffBlue, contr.specRed, contr.specGreen, contr.specBlue, contr.shiny]);
// Draw a cube with texture
//drawGround(gl, solidProgram, ground,  viewProjMatrix);
drawAxes(gl, solidProgram, axes,  viewProjMatrix);
//drawObj(gl, objProgram, currentAngle, viewProjMatrix, model);

if(!modelTex){
drawTexCube(gl, texProgram, cube, textureImg1, viewProjMatrix);
drawTexSphere(gl, texProgram, sphere, textureImg1, viewProjMatrix);}
else {drawTexCube(gl, texProgram, cube, texture1, viewProjMatrix);
	drawTexSphere(gl, texProgram, sphere, texture1, viewProjMatrix);}
drawSolidCube(gl, solidProgram, cube, currentAngle, viewProjMatrix, userLightPos);
//drawCylinder(gl, solidProgram, cylinder,  viewProjMatrix);
drawTorus(gl, solidProgram, torus,  viewProjMatrix);
if(isGouraud && !isToon){
	drawCylinder(gl, gouraudProgram, cylinder,  viewProjMatrix);
	drawSphere(gl, gouraudProgram, sphere, currentAngle, viewProjMatrix);

}
else if(isToon && !isGouraud){
	drawCylinder(gl, toonProgram, cylinder,  viewProjMatrix);
	drawSphere(gl, toonProgram, sphere, currentAngle, viewProjMatrix);
}
else if(!isToon || !isGouraud){
	drawCylinder(gl, solidProgram, cylinder,  viewProjMatrix);
	drawSphere(gl, solidProgram, sphere, currentAngle, viewProjMatrix);

}
drawTexGround(gl, texProgram, ground, texture, viewProjMatrix);
//drawSphere(gl, solidProgram, sphere, currentAngle, viewProjMatrix);

window.requestAnimationFrame(tick, canvas);
};
tick();
}




function drawSolidCube(gl, program, o, currentAngle, viewProjMatrix, lampeyelook) {
gl.useProgram(program);   // Tell that this program object is used
//set light
var lampEyeLookSolidCube = new Float32Array([g_EyeX, g_EyeY, g_EyeZ, lampeyelook[0], lampeyelook[1], lampeyelook[2]]);
var lampADSSolidCube = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
setLight(gl, program, 1, lampADSVar, lampEyeLookSolidCube, 13, cubeLight);
// Assign the buffer objects and enable the assignment
initAttributeVariable(gl, program.a_Position, o.vertexBuffer); // Vertex coordinates
initAttributeVariable(gl, program.a_Normal, o.normalBuffer);   // Normal
if(program.a_Color != undefined)
initAttributeVariable(gl, program.a_Color, o.colorBuffer);   // Color
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);  // Bind indices
//tank
//base 1
g_modelMatrix.setScale(0.8, 0.15, 0.7);
g_modelMatrix.translate(0, 5, 0);
g_modelMatrix.rotate(currentAngle*0.15, 0, 1, 0);
g_modelMatrix.translate(currentAngle*0.01, 0, 1);
pushMatrix(g_modelMatrix);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);  
//base 2
g_modelMatrix = popMatrix();
g_modelMatrix.scale(0.7, 0.8, 0.5);
g_modelMatrix.translate(0, 2, 0);
g_modelMatrix.rotate(currentAngle*0.1, 0, 1, 0);
pushMatrix(g_modelMatrix);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);   // Draw
//base 3
g_modelMatrix = popMatrix();
g_modelMatrix.scale(0.5, 0.9, 0.7);
g_modelMatrix.translate(0, 2, 0);
g_modelMatrix.rotate(currentAngle*0.15, 0, 1, 0);
pushMatrix(g_modelMatrix);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);
//barrel
g_modelMatrix = popMatrix();
pushMatrix(g_modelMatrix);
g_modelMatrix.rotate(currentAngle*0.2, 0, 0, 1);
g_modelMatrix.scale(1.2, 0.2, 0.1);
g_modelMatrix.translate(1.3, 10.0, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);
//tree truck
g_modelMatrix.setScale(0.2, 0.5, 0.2);
g_modelMatrix.translate(-7.0, 1.05, -37.5);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);

}

function drawAxes(gl, program, o, viewProjMatrix) {
gl.useProgram(program);   // Tell that this program object is used
// Assign the buffer objects and enable the assignment
initAttributeVariable(gl, program.a_Position, o.vertexBuffer); // Vertex coordinates
if(program.a_Color != undefined)
initAttributeVariable(gl, program.a_Color, o.colorBuffer);   // Color
initAttributeVariable(gl, program.a_Normal, o.normalBuffer);   // Normal
gl.bindBuffer(gl.ARRAY_BUFFER, null);  // Bind indices

g_modelMatrix.setScale(1, 1, 1);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

gl.drawArrays(gl.LINES, 0, o.numIndices); 
}

function drawSphere(gl, program, o, angle, viewProjMatrix) {
gl.useProgram(program);   // Tell that this program object is used
//if(program.Light !=undefined && program.u_eyePosWorld != undefined){
	var lampEyeLookSphere = new Float32Array([g_EyeX, g_EyeY, g_EyeZ, -10, 0, 10]);
	var lamp1EyeLookSphere = new Float32Array([0, 0, 10, -10, 0, 10]);
	var lampADSSphere = new Float32Array([0.4, 0.4, 0.4, 1, 1, 1, 1, 1, 1, 1]);

	setLight(gl, program, 1, lampADSVar, lampEyeLookSphere, 1, sphereLight);
//setLight(gl, program, 2, lampADSVar, lamp1EyeLookSphere, 4, sphereLight);
//}
// Assign the buffer objects and enable the assignment
initAttributeVariable(gl, program.a_Position, o.vertexBuffer); // Vertex coordinates
if(program.a_Color != undefined)
initAttributeVariable(gl, program.a_Color, o.colorBuffer);   // Color
initAttributeVariable(gl, program.a_Normal, o.normalBuffer);   // Normal
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);  // Bind indices

//Car ball 1
g_modelMatrix.setScale(0.2, 0.2, 0.3);
g_modelMatrix.translate(currentAngle*0.05, 0, 0);
g_modelMatrix.translate(-4, 4.5, -8);
g_modelMatrix.translate(25, 0, -16);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);  
//ball 2
g_modelMatrix.translate(13, 0, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);

//tree ball
g_modelMatrix = popMatrix();
pushMatrix(g_modelMatrix);
g_modelMatrix.scale(1, 1, 1.2);
g_modelMatrix.translate(0, 0, 1.4);
g_modelMatrix.rotate(currentAngle, 0, 0, 1);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);

//ground ball
g_modelMatrix = popMatrix();
pushMatrix(g_modelMatrix);
g_modelMatrix.scale(1, 1, 1.2);
g_modelMatrix.translate(5, 4, -4);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);

}

var i = 1;
function switchPhongBlinnPhong(){
	if(i%2){console.log('Phong-->BlinnPhong'); i++;}
	else {console.log('BlinnPhong->Phong'); i++;}
	contr.specRed = (contr.specRed == 1)? 10: 1;
	contr.specGreen = (contr.specGreen == 1)? 10: 1;
	contr.specBlue = (contr.specBlue == 1)? 10: 1;
	contr.shiny = (contr.shiny == 1)?  10: 1;
}
function drawCylinder(gl, program, o, viewProjMatrix) {
gl.useProgram(program);   // Tell that this program object is used 
//light setting
var lampEyeLookCylinder = new Float32Array([g_EyeX, g_EyeY, g_EyeZ, -20, 15 , 10]);
setLight(gl, program, 1, lampADSVar, lampEyeLookCylinder, 2, cylinderLight);
// Assign the buffer objects and enable the assignment
initAttributeVariable(gl, program.a_Position, o.vertexBuffer); // Vertex coordinates
if(program.a_Color != undefined)
initAttributeVariable(gl, program.a_Color, o.colorBuffer);   // Color
initAttributeVariable(gl, program.a_Normal, o.normalBuffer);   // Normal
gl.bindBuffer(gl.ARRAY_BUFFER, null);  // Bind indices
//tank head
g_modelMatrix = popMatrix();
pushMatrix(g_modelMatrix);
g_modelMatrix.translate(0.3, 2, 0);
g_modelMatrix.scale(0.5, 1.2, 0.5);
g_modelMatrix.rotate(-90, 1, 0, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices); 
//tree leaves 1
g_modelMatrix.setScale(0.5,0.3,0.3);
g_modelMatrix.rotate(-90.0, 1,0,0);
g_modelMatrix.translate(-2.8, 25, 4.3);
g_modelMatrix.rotate(currentAngle, 0, 0, 1);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices); 
//tree leaves 2
g_modelMatrix.translate(0, 0, 1.8);
g_modelMatrix.scale(0.8,0.8,0.8);
//g_modelMatrix.scale(0.8-currentAngle*0.003,0.8-currentAngle*0.003,0.8-currentAngle*0.003);
g_modelMatrix.rotate(-currentAngle*0.2, 0, 1, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices); 
//tree leaves 3
g_modelMatrix.translate(0, 0, 1.8);
g_modelMatrix.scale(0.8,0.8,0.8);
g_modelMatrix.rotate(-currentAngle*0.2, 0, 1, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices); 
//tree leaves 4
g_modelMatrix.translate(0, 0, 1.8);
g_modelMatrix.scale(0.8,0.8,0.8);
g_modelMatrix.rotate(-currentAngle*0.2, 0, 1, 0);
pushMatrix(g_modelMatrix);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices); 
}

function drawTorus(gl, program, o, viewProjMatrix) {

gl.useProgram(program);   // Tell that this program object is used
//light setting
var lampEyeLookTorus = new Float32Array([g_EyeX, g_EyeY, g_EyeZ, 6, 7, 8]);
var lampADSTorus = new Float32Array([1, 1, 1, 1, 1, 1, 2, 2, 2, 1]);
setLight(gl, program, 1, lampADSTorus, lampEyeLookTorus, 14, torusLight);
// Assign the buffer objects and enable the assignment
initAttributeVariable(gl, program.a_Position, o.vertexBuffer); // Vertex coordinates
if(program.a_Color != undefined)
initAttributeVariable(gl, program.a_Color, o.colorBuffer);   // Color
initAttributeVariable(gl, program.a_Normal, o.normalBuffer);   // Normal
gl.bindBuffer(gl.ARRAY_BUFFER, null);  // Bind indices
//tank
//tire 1
g_modelMatrix.setScale(0.15,0.15,1);
g_modelMatrix.translate(-3.8, 3.0, -0.1);
g_modelMatrix.translate(currentAngle*0.08, 0, 0.5);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices); 
//tire2
g_modelMatrix.translate(2.5, 0, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices);
//tire 3
g_modelMatrix.translate(2.5, 0, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices);  
//tire 4
g_modelMatrix.translate(2.5, 0, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices); 

//Car tire
//segment 1
//tire 1
g_modelMatrix.setScale(0.2,0.2,0.2);
g_modelMatrix.translate(currentAngle*0.05, 0, 0);
g_modelMatrix.translate(-10, 1, -9);
g_modelMatrix.translate(-3.5, 1.8, -0.25);
g_modelMatrix.translate(25, 0, -24);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices); 
//tire2
g_modelMatrix.translate(0, 0, -3);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices);
//tire 3
g_modelMatrix.translate(6, 0, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices);  
//tire 4
g_modelMatrix.translate(0, 0, 3);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices); 

//truck segment 2
//tire 1
g_modelMatrix.translate(7, 0, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices); 
//tire2
g_modelMatrix.translate(0, 0, -3);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices);
//tire 3
g_modelMatrix.translate(6, 0, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices);  
//tire 4
g_modelMatrix.translate(0, 0, 3);
g_modelMatrix.rotate(-currentAngle*0.2, 0, 1, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices); 
//truck segment 3
//tire 1
g_modelMatrix.translate(7.5, 0, 0);
g_modelMatrix.rotate(-currentAngle*0.1, 0, 1, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices); 
//tire2
g_modelMatrix.translate(0, 0, -3);
g_modelMatrix.rotate(-currentAngle*0.1, 0, 1, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices);
//tire 3
g_modelMatrix.translate(5.5, 0, 0);
g_modelMatrix.rotate(-currentAngle*0.1, 0, 1, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices);  
//tire 4
g_modelMatrix.translate(0, 0, 3);
g_modelMatrix.rotate(-currentAngle*0.1, 0, 1, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices); 


}

function drawTexGround(gl, program, o, texture, viewProjMatrix) {
gl.useProgram(program);   // Tell that this program object is used

// Assign the buffer objects and enable the assignment
initAttributeVariable(gl, program.a_Position, o.vertexBuffer);  // Vertex coordinates
initAttributeVariable(gl, program.a_Normal, o.normalBuffer);    // Normal
if(program.a_Color != undefined)
	initAttributeVariable(gl, program.a_Color, o.colorBuffer); 
initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);// Texture coordinates
gl.bindBuffer(gl.ARRAY_BUFFER, null);  // Bind indices

// Bind texture object to texture unit 0
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);

g_modelMatrix.setRotate(90.0, 1, 0, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

gl.drawArrays(gl.TRIANGLE_STRIP, 0, o.numIndices); 

}

function drawTexCube(gl, program, o, texture, viewProjMatrix) {

gl.useProgram(program);   // Tell that this program object is used

// Assign the buffer objects and enable the assignment
initAttributeVariable(gl, program.a_Position, o.vertexBuffer);  // Vertex coordinates
initAttributeVariable(gl, program.a_Normal, o.normalBuffer);    // Normal
if(program.a_Color != undefined)
	initAttributeVariable(gl, program.a_Color, o.colorBuffer); 
initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);// Texture coordinates
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer); // Bind indices

// Bind texture object to texture unit 0
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
//truck 
//base 1
g_modelMatrix.setScale(1, 0.5, 0.8);
g_modelMatrix.translate(currentAngle*0.01, 0, 0);
g_modelMatrix.translate(-2, 2.3, -3);
g_modelMatrix.translate(5, 0, -6);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);   // Draw
//base 2
g_modelMatrix.translate(2.5, 0, 0);
g_modelMatrix.rotate(-currentAngle*0.2, 0, 1, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0); 
//base 3
g_modelMatrix.translate(2.5, 0, 0);
g_modelMatrix.rotate(-currentAngle*0.2, 0, 1, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0); 

}

function drawTexSphere(gl, program, o, texture, viewProjMatrix) {

gl.useProgram(program);   // Tell that this program object is used

// Assign the buffer objects and enable the assignment
initAttributeVariable(gl, program.a_Position, o.vertexBuffer);  // Vertex coordinates
initAttributeVariable(gl, program.a_Normal, o.normalBuffer);    // Normal
if(program.a_Color != undefined)
	initAttributeVariable(gl, program.a_Color, o.colorBuffer); 
initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);// Texture coordinates
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer); // Bind indices

// Bind texture object to texture unit 0
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);

//base 1
g_modelMatrix.setTranslate(xMdragTot+0.1,  0.0, -yMdragTot+0.1);
g_modelMatrix.scale(0.4, 0.4, 0.4);
g_modelMatrix.translate(-6, 1.8, 0);
g_modelMatrix.rotate(currentAngle*0.6, 0, 1, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);   // Draw


g_modelMatrix.translate(0, 1, 0);
g_modelMatrix.scale(0.8, 0.8, 0.8);
g_modelMatrix.rotate(currentAngle*0.8, 0, 1, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0); 

g_modelMatrix.translate(0, 1, 0);
g_modelMatrix.scale(0.8, 0.8, 0.8);
g_modelMatrix.rotate(currentAngle*0.8, 0, 1, 0);
g_normalMatrix.setInverseOf(g_modelMatrix);
g_normalMatrix.transpose();
gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
g_mvpMatrix.set(viewProjMatrix);
g_mvpMatrix.multiply(g_modelMatrix);
gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0); 
}


function initAttributeVariable(gl, a_attribute, buffer) {
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
	gl.enableVertexAttribArray(a_attribute);
}

var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();



function initArrayBufferForLaterUse(gl, data, num, type) {
var buffer = gl.createBuffer();   // Create a buffer object
if (!buffer) {
	console.log('Failed to create the buffer object');
	return null;
}
// Write date into the buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

// Keep the information necessary to assign to the attribute variable later
buffer.num = num;
buffer.type = type;

return buffer;
}

function initElementArrayBufferForLaterUse(gl, data, type) {
var buffer = gl.createBuffer();　  // Create a buffer object
if (!buffer) {
	console.log('Failed to create the buffer object');
	return null;
}
// Write date into the buffer object
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

buffer.type = type;

return buffer;
}

function initVertexBuffersForCube(gl) {
// Create a cube
//    v6----- v5
//   /|      /|
//  v1------v0|
//  | |     | |
//  | |v7---|-|v4
//  |/      |/
//  v2------v3

var vertices = new Float32Array([   // Vertex coordinates
1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
-1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
-1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
]);

var normals = new Float32Array([   // Normal
0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,     // v0-v1-v2-v3 front
1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,     // v0-v3-v4-v5 right
0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,     // v0-v5-v6-v1 up
-1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,     // v1-v6-v7-v2 left
0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,     // v7-v4-v3-v2 down
0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0      // v4-v7-v6-v5 back
]);

var texCoords = new Float32Array([   // Texture coordinates
1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
]);

var indices = new Uint8Array([        // Indices of the vertices
0, 1, 2,   0, 2, 3,    // front
4, 5, 6,   4, 6, 7,    // right
8, 9,10,   8,10,11,    // up
12,13,14,  12,14,15,    // left
16,17,18,  16,18,19,    // down
20,21,22,  20,22,23     // back
]);

var o = new Object(); // Utilize Object to to return multiple buffer objects together
var colors = [];
for(var j=0; j< vertices.length; j++){
	colors.push(0.5);
	colors.push(0.5);
	colors.push(0);
}

// Write vertex information to buffer object
o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
o.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
o.colorBuffer = initArrayBufferForLaterUse(gl, new Float32Array(colors), 3, gl.FLOAT);
o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
if (!o.vertexBuffer || !o.normalBuffer || !o.texCoordBuffer || !o.indexBuffer) return null; 

o.numIndices = indices.length;

// Unbind the buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, null);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

return o;
}

function initVertexBuffersForGround(gl) { // Create a ground
var xcount = 20;     // # of lines to draw in x,y to make the grid.
var ycount = 20;  
var xymax = 100.0;     // grid size; extends to cover +/-xymax in x and y.
var xColr = new Float32Array([1.0, 0.0, 0.2]);  // bright yellow
var yColr = new Float32Array([1.0, 0.8, 0.0]);  // bright green.

// Create an (global) array to hold this ground-plane's vertices:
gndVerts = new Float32Array(floatsPerVertex*2*(xcount+ycount));
// draw a grid made of xcount+ycount lines; 2 vertices per line.

var xgap = xymax/(xcount-1);    // HALF-spacing between lines in x,y;
var ygap = xymax/(ycount-1);    // (why half? because v==(0line number/2))
var texCoords = [];
var tipx = 0, tipy=1;

// First, step thru x values as we make vertical lines of constant-x:
for(v=0, j=0; v<2*xcount; v++, j+= floatsPerVertex) {
if(v%2==0) {  // put even-numbered vertices at (xnow, -xymax, 0)
gndVerts[j  ] = -xymax + (v  )*xgap;  // x
gndVerts[j+1] = -xymax;               // y
gndVerts[j+2] = Math.sin(v*2);                  // z
texCoords.push(0, 1);
tipx ++;
}
else {        // put odd-numbered vertices at (xnow, +xymax, 0).
gndVerts[j  ] = -xymax + (v-1)*xgap;  // x
gndVerts[j+1] = xymax;                // y
gndVerts[j+2] = Math.sin(v*2);                  // z
texCoords.push(1);
texCoords.push(1);

}

}
// Second, step thru y values as wqe make horizontal lines of constant-y:
// (don't re-initialize j--we're adding more vertices to the array)
for(v=0; v<2*ycount; v++, j+= floatsPerVertex) {
if(v%2==0) {    // put even-numbered vertices at (-xymax, ynow, 0)
gndVerts[j  ] = -xymax;               // x
gndVerts[j+1] = -xymax + (v  )*ygap;  // y
gndVerts[j+2] = Math.cos(v*2);                  // z
texCoords.push(0);
texCoords.push(0);
}
else {          // put odd-numbered vertices at (+xymax, ynow, 0).
gndVerts[j  ] = xymax;                // x
gndVerts[j+1] = -xymax + (v-1)*ygap;  // y
gndVerts[j+2] = Math.sin(v*2);                  // z
texCoords.push(1);
texCoords.push(0);
}
}

var normals = [];
for(j=0; j<gndVerts.length; j+= 3){
	normals.push(0);
	normals.push(Math.random());
	normals.push(0);
}

var colors = [];
for(j=0; j<gndVerts.length; j+= 3){
	colors.push(1);
	colors.push(1);
	colors.push(1);
}

var o = new Object(); // Utilize Object to to return multiple buffer objects together

// Write vertex information to buffer object
o.vertexBuffer = initArrayBufferForLaterUse(gl, gndVerts, 3, gl.FLOAT);
o.colorBuffer = initArrayBufferForLaterUse(gl, new Float32Array(colors), 3, gl.FLOAT);
o.normalBuffer = initArrayBufferForLaterUse(gl, new Float32Array(normals), 3, gl.FLOAT);
o.texCoordBuffer = initArrayBufferForLaterUse(gl, new Float32Array(texCoords), 2, gl.FLOAT);
//o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
if (!o.vertexBuffer || !o.colorBuffer || !o.normalBuffer) return null; 

o.numIndices = gndVerts.length/3;

// Unbind the buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, null);
//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

return o;
}

function initVertexBuffersForAxes(gl){
	var vertices = new Float32Array([
		0,0,0, 1,0,0, 0,0,0,
		0,1,0, 0,0,0, 0,0,1,
		]);

	var colors = new Float32Array([1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1]);
	var normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1])
var o = new Object(); // Utilize Object to to return multiple buffer objects together

// Write vertex information to buffer object
o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
o.colorBuffer = initArrayBufferForLaterUse(gl, colors, 3, gl.FLOAT);
o.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
//o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
if (!o.vertexBuffer || !o.colorBuffer || !o.normalBuffer) return null; 

o.numIndices = vertices.length/3;

// Unbind the buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, null);

return o;
}

function initVertexBuffersForCylinder(gl) { // Create a ground
var ctrColr = new Float32Array([0.2, 0.2, 0.2]); // dark gray
var topColr = new Float32Array([1.0, 1.0, 0.4]); // light green
var botColr = new Float32Array([0.5, 0.5, 1.0]); // light blue
var capVerts = 16; // # of vertices around the topmost 'cap' of the shape
var botRadius = 1.6;   // radius of bottom of cylinder (top always 1.0)

// Create a (global) array to hold this cylinder's vertices;
cylVerts = new Float32Array(  ((capVerts*6) -2) * floatsPerVertex);
var colors = [];
var normals = [];
// # of vertices * # of elements needed to store them. 

// Create circle-shaped top cap of cylinder at z=+1.0, radius 1.0
// v counts vertices: j counts array elements (vertices * elements per vertex)
for(v=1,j=0; v<2*capVerts; v++,j+=floatsPerVertex) {  
// skip the first vertex--not needed.
if(v%2==0)
{       // put even# vertices at center of cylinder's top cap:
cylVerts[j  ] = 0.0;      // x,y,z,w == 0,0,1,1
cylVerts[j+1] = 0.0;  
cylVerts[j+2] = 1.0;
colors.push(ctrColr[0]);
colors.push(ctrColr[1]);
colors.push(ctrColr[2]); 
normals.push(0);
normals.push(1);
normals.push(1);
}
else {  // put odd# vertices around the top cap's outer edge;
// x,y,z,w == cos(theta),sin(theta), 1.0, 1.0
//          theta = 2*PI*((v-1)/2)/capVerts = PI*(v-1)/capVerts
cylVerts[j  ] = Math.cos(Math.PI*(v-1)/capVerts);     // x
cylVerts[j+1] = Math.sin(Math.PI*(v-1)/capVerts);     // y
//  (Why not 2*PI? because 0 < =v < 2*capVerts, so we
//   can simplify cos(2*PI * (v-1)/(2*capVerts))
cylVerts[j+2] = 1.0;  // z
cylVerts[j+3] = 1.0;  // w.
// r,g,b = topColr[]
colors.push(topColr[0]); 
colors.push(topColr[1]); 
colors.push(topColr[2]);
normals.push(0);
normals.push(1);
normals.push(1);   
}
}
// Create the cylinder side walls, made of 2*capVerts vertices.
// v counts vertices within the wall; j continues to count array elements
for(v=0; v< 2*capVerts; v++, j+=floatsPerVertex) {
if(v%2==0)  // position all even# vertices along top cap:
{   
cylVerts[j  ] = Math.cos(Math.PI*(v)/capVerts);   // x
cylVerts[j+1] = Math.sin(Math.PI*(v)/capVerts);   // y
cylVerts[j+2] = 1.0;  // z
// r,g,b = topColr[]
colors.push(topColr[0]); 
colors.push(topColr[1]); 
colors.push(topColr[2]); 
normals.push(Math.cos(Math.PI*(v)/capVerts)); //dx
normals.push(Math.sin(Math.PI*(v)/capVerts)); //dy
normals.push(0);  
}
else    // position all odd# vertices along the bottom cap:
{
cylVerts[j  ] = botRadius * Math.cos(Math.PI*(v-1)/capVerts);   // x
cylVerts[j+1] = botRadius * Math.sin(Math.PI*(v-1)/capVerts);   // y
cylVerts[j+2] =-1.0;  // z
// r,g,b = topColr[]
colors.push(topColr[0]); 
colors.push(topColr[1]); 
colors.push(topColr[2]);
normals.push(Math.cos(Math.PI*(v-1)/capVerts)); //dx
normals.push(Math.sin(Math.PI*(v-1)/capVerts)); //dy
normals.push(0);   
}
}
// Create the cylinder bottom cap, made of 2*capVerts -1 vertices.
// v counts the vertices in the cap; j continues to count array elements
for(v=0; v < (2*capVerts -1); v++, j+= floatsPerVertex) {
if(v%2==0) {  // position even #'d vertices around bot cap's outer edge
cylVerts[j  ] = botRadius * Math.cos(Math.PI*(v)/capVerts);   // x
cylVerts[j+1] = botRadius * Math.sin(Math.PI*(v)/capVerts);   // y
cylVerts[j+2] =-1.0;  // z
colors.push(topColr[0]); 
colors.push(topColr[1]); 
colors.push(topColr[2]);
normals.push(0);
normals.push(0);
normals.push(-1);   
}
else {        // position odd#'d vertices at center of the bottom cap:
cylVerts[j  ] = 0.0;      // x,y,z,w == 0,0,-1,1
cylVerts[j+1] = 0.0;  
cylVerts[j+2] =-1.0; 
colors.push(topColr[0]); 
colors.push(topColr[1]); 
colors.push(topColr[2]);
normals.push(0);
normals.push(0);
normals.push(-1); 
}

}

var o = new Object(); // Utilize Object to to return multiple buffer objects together

// Write vertex information to buffer object
o.vertexBuffer = initArrayBufferForLaterUse(gl, cylVerts, 3, gl.FLOAT);
o.colorBuffer = initArrayBufferForLaterUse(gl, new Float32Array(colors), 3, gl.FLOAT);
o.normalBuffer = initArrayBufferForLaterUse(gl, new Float32Array(normals), 3, gl.FLOAT);
//o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
if (!o.vertexBuffer || !o.colorBuffer || !o.normalBuffer) return null; 

o.numIndices = cylVerts.length/3;

// Unbind the buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, null);
//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

return o;
}

function initVertexBuffersForTorus(gl) { // Create a ground
var rbend = 1.0;                    // Radius of circle formed by torus' bent bar
var rbar = 0.5;                     // radius of the bar we bent to form torus
var barSlices = 23;                 // # of bar-segments in the torus: >=3 req'd;
// more segments for more-circular torus
var barSides = 13;                    // # of sides of the bar (and thus the 
// number of vertices in its cross-section)
// >=3 req'd;
// more sides for more-circular cross-section
// for nice-looking torus with approx square facets, 
//      --choose odd or prime#  for barSides, and
//      --choose pdd or prime# for barSlices of approx. barSides *(rbend/rbar)
// EXAMPLE: rbend = 1, rbar = 0.5, barSlices =23, barSides = 11.

// Create a (global) array to hold this torus's vertices:
torVerts = new Float32Array(floatsPerVertex*(2*barSides*barSlices +2));
//  Each slice requires 2*barSides vertices, but 1st slice will skip its first 
// triangle and last slice will skip its last triangle. To 'close' the torus,
// repeat the first 2 vertices at the end of the triangle-strip.  Assume 7
//tangent vector with respect to big circle
var tx = 0.0;
var ty = 0.0;
var tz = 0.0;
//tangent vector with respect to small circle
var sx = 0.0;
var sy = 0.0;
var sz = 0.0;
var phi=0, theta=0;                   // begin torus at angles 0,0
var thetaStep = 2*Math.PI/barSlices;  // theta angle between each bar segment
var phiHalfStep = Math.PI/barSides;   // half-phi angle between each side of bar

var normals = [];
var colors = [];

for(s=0,j=0; s<barSlices; s++) {    // for each 'slice' or 'ring' of the torus:
for(v=0; v< 2*barSides; v++, j+=floatsPerVertex) {    // for each vertex in this slice:
if(v%2==0)  { // even #'d vertices at bottom of slice,
	torVerts[j  ] = (rbend + rbar*Math.cos((v)*phiHalfStep)) * 
Math.cos((s)*thetaStep);
torVerts[j+1] = (rbend + rbar*Math.cos((v)*phiHalfStep)) *
Math.sin((s)*thetaStep);
torVerts[j+2] = -rbar*Math.sin((v)*phiHalfStep);
tx = (-1) * Math.sin(s*thetaStep);
ty = Math.cos(s*thetaStep);
tz = 0.0;

sx = Math.cos(s*thetaStep) * (-1) * Math.sin(v*phiHalfStep);
sy = Math.sin(s*thetaStep) * (-1) * Math.sin(v*phiHalfStep);
sz = (-1) * Math.cos(v*phiHalfStep);

normals.push(-ty*sz + tz*sy);
normals.push(-tz*sx + tx*sz);
normals.push(-tx*sy + ty*sx);
}
else {        // odd #'d vertices at top of slice (s+1);
// at same phi used at bottom of slice (v-1)
torVerts[j  ] = (rbend + rbar*Math.cos((v-1)*phiHalfStep)) * 
Math.cos((s+1)*thetaStep);
//  x = (rbend + rbar*cos(phi)) * cos(theta)
torVerts[j+1] = (rbend + rbar*Math.cos((v-1)*phiHalfStep)) *
Math.sin((s+1)*thetaStep);
//  y = (rbend + rbar*cos(phi)) * sin(theta) 
torVerts[j+2] = -rbar*Math.sin((v-1)*phiHalfStep);
//  z = -rbar  *   sin(phi)
tx = (-1) * Math.sin((s+1)*thetaStep);
ty = Math.cos((s+1)*thetaStep);
tz = 0.0;

sx = Math.cos((s+1)*thetaStep) * (-1) * Math.sin((v-1)*phiHalfStep);
sy = Math.sin((s+1)*thetaStep) * (-1) * Math.sin((v-1)*phiHalfStep);
sz = (-1) * Math.cos((v-1)*phiHalfStep);

normals.push(-ty*sz + tz*sy);
normals.push(-tz*sx + tx*sz);
normals.push(-tx*sy + ty*sx);
}
colors.push(Math.random() + 0.7);    // random color 0.0 <= R < 1.0
colors.push(Math.random()+currentAngle*0.004);    // random color 0.0 <= G < 1.0
colors.push(Math.random()+currentAngle*0.01);   // random color 0.0 <= B < 1.0
}
}
// Repeat the 1st 2 vertices of the triangle strip to complete the torus:
torVerts[j  ] = rbend + rbar; // copy vertex zero;
//  x = (rbend + rbar*cos(phi==0)) * cos(theta==0)
torVerts[j+1] = 0.0;
//  y = (rbend + rbar*cos(phi==0)) * sin(theta==0) 
torVerts[j+2] = 0.0;
//  z = -rbar  *   sin(phi==0)
colors.push(Math.random());    // random color 0.0 <= R < 1.0
colors.push(Math.random());     // random color 0.0 <= G < 1.0
colors.push(Math.random());      // random color 0.0 <= B < 1.0
normals.push(1);
normals.push(0);
normals.push(1);
j+=floatsPerVertex; // go to next vertex:
torVerts[j  ] = (rbend + rbar) * Math.cos(thetaStep);
//  x = (rbend + rbar*cos(phi==0)) * cos(theta==thetaStep)
torVerts[j+1] = (rbend + rbar) * Math.sin(thetaStep);
//  y = (rbend + rbar*cos(phi==0)) * sin(theta==thetaStep) 
torVerts[j+2] = 0.0;
//  z = -rbar  *   sin(phi==0)
colors.push(Math.random());    // random color 0.0 <= R < 1.0
colors.push(Math.random());     // random color 0.0 <= G < 1.0
colors.push(Math.random());      // random color 0.0 <= B < 1.0
normals.push(1);
normals.push(0);
normals.push(1);

var o = new Object(); // Utilize Object to to return multiple buffer objects together

// Write vertex information to buffer object
o.vertexBuffer = initArrayBufferForLaterUse(gl, torVerts, 3, gl.FLOAT);
o.colorBuffer = initArrayBufferForLaterUse(gl, new Float32Array(colors), 3, gl.FLOAT);
o.normalBuffer = initArrayBufferForLaterUse(gl, new Float32Array(normals), 3, gl.FLOAT);
//o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
if (!o.vertexBuffer || !o.colorBuffer || !o.normalBuffer) return null; 

o.numIndices = torVerts.length/3;

// Unbind the buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, null);
//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

return o;
}

function initVertexBuffersForSphere(gl) { // Create a sphere
	var SPHERE_DIV = 10;

	var i, ai, si, ci;
	var j, aj, sj, cj;
	var p1, p2;

	var vertices = [];
	var colors = [];
	var indices = [];
	var texCoords = [];

// Generate coordinates
for (j = 0; j <= SPHERE_DIV; j++) {
	aj = j * Math.PI / SPHERE_DIV;
	sj = Math.sin(aj);
	cj = Math.cos(aj);
	for (i = 0; i <= SPHERE_DIV; i++) {
		ai = i * 2 * Math.PI / SPHERE_DIV;
		si = Math.sin(ai);
		ci = Math.cos(ai);

vertices.push(si * sj);  // X
vertices.push(cj);       // Y
vertices.push(ci * sj);  // Z

texCoords.push(i%2, j%2);

colors.push(0.7);
colors.push(0.4);
colors.push(0.7);
}
}

// Generate indices
for (j = 0; j < SPHERE_DIV; j++) {
	for (i = 0; i < SPHERE_DIV; i++) {
		p1 = j * (SPHERE_DIV+1) + i;
		p2 = p1 + (SPHERE_DIV+1);

		indices.push(p1);
		indices.push(p2);
		indices.push(p1 + 1);

		indices.push(p1 + 1);
		indices.push(p2);
		indices.push(p2 + 1);
	}
}

var o = new Object(); // Utilize Object object to return multiple buffer objects together

// Write vertex information to buffer object
o.vertexBuffer = initArrayBufferForLaterUse(gl, new Float32Array(vertices), 3, gl.FLOAT);
o.colorBuffer = initArrayBufferForLaterUse(gl, new Float32Array(colors), 3, gl.FLOAT);
o.normalBuffer = initArrayBufferForLaterUse(gl, new Float32Array(vertices), 3, gl.FLOAT);
o.texCoordBuffer = initArrayBufferForLaterUse(gl, new Float32Array(texCoords), 2, gl.FLOAT);
o.indexBuffer = initElementArrayBufferForLaterUse(gl, new Uint8Array(indices), gl.UNSIGNED_BYTE);
if (!o.vertexBuffer || !o.colorBuffer || !o.indexBuffer || !o.normalBuffer || !o.texCoordBuffer) return null; 

o.numIndices = indices.length;

// Unbind the buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, null);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

return o;
}


function initTextures(gl, program, image) {
var texture = gl.createTexture();   // Create a texture object
if (!texture) {
	console.log('Failed to create the texture object');
	return null;
}

/*var image = new Image();  // Create a image object
if (!image) {
	console.log('Failed to create the image object');
	return null;
}*/
// Register the event handler to be called when image loading is completed
image.onload = function() {
// Write the image data to texture object
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

// Pass the texure unit 0 to u_Sampler
gl.useProgram(program);
gl.uniform1i(program.u_Sampler, 0);

gl.bindTexture(gl.TEXTURE_2D, null); // Unbind texture
};

// Tell the browser to load an Image
//image.src = 'sky.png';

return texture;
}

function initTexturesForImg1(gl, program) {
var texture = gl.createTexture();   // Create a texture object
if (!texture) {
	console.log('Failed to create the texture object');
	return null;
}

var image = new Image();  // Create a image object
if (!image) {
	console.log('Failed to create the image object');
	return null;
}
// Register the event handler to be called when image loading is completed
image.onload = function() {
// Write the image data to texture object
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

// Pass the texure unit 0 to u_Sampler
gl.useProgram(program);
gl.uniform1i(program.u_Sampler, 0);

gl.bindTexture(gl.TEXTURE_2D, null); // Unbind texture
};

// Tell the browser to load an Image
image.src = 'img1.png';

return texture;
}

var ANGLE_STEP = 30;   // The increments of rotation angle (degrees)

var last = Date.now(); // Last time that this function was called
function animate(angle) {
	var now = Date.now();
	var elapsed = now - last;
	last = now;
	if(angle >  80.0 && ANGLE_STEP > 0) ANGLE_STEP = -ANGLE_STEP;
	if(angle < -80.0 && ANGLE_STEP < 0) ANGLE_STEP = -ANGLE_STEP;
	var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
	return newAngle %= 360;
}

function myMouseDown(ev, gl, canvas) {
//==============================================================================
// Called when user PRESSES down any mouse button;
//                  (Which button?    console.log('ev.button='+ev.button);   )
//    ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
//    pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
var rect = ev.target.getBoundingClientRect(); // get canvas corners in pixels
var xp = ev.clientX - rect.left;                  // x==0 at canvas left edge
var yp = canvas.height - (ev.clientY - rect.top); // y==0 at canvas bottom edge
//  console.log('myMouseDown(pixel coords): xp,yp=\t',xp,',\t',yp);

// Convert to Canonical View Volume (CVV) coordinates too:
var x = (xp - canvas.width/2)  /    // move origin to center of canvas and
(canvas.width/2);      // normalize canvas to -1 <= x < +1,
var y = (yp - canvas.height/2) /    //                     -1 <= y < +1.
(canvas.height/2);
//  console.log('myMouseDown(CVV coords  ):  x, y=\t',x,',\t',y);

isDrag = true;
// set our mouse-dragging flag
xMclik = x;                         // record where mouse-dragging began
yMclik = y;
};


function myMouseMove(ev, gl, canvas) {
//==============================================================================
// Called when user MOVES the mouse with a button already pressed down.
//                  (Which button?   console.log('ev.button='+ev.button);    )
//    ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
//    pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

if(isDrag==false) return;       // IGNORE all mouse-moves except 'dragging'

// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
var rect = ev.target.getBoundingClientRect(); // get canvas corners in pixels
var xp = ev.clientX - rect.left;                  // x==0 at canvas left edge
var yp = canvas.height - (ev.clientY - rect.top); // y==0 at canvas bottom edge
//  console.log('myMouseMove(pixel coords): xp,yp=\t',xp,',\t',yp);

// Convert to Canonical View Volume (CVV) coordinates too:
var x = (xp - canvas.width/2)  /    // move origin to center of canvas and
(canvas.width/2);      // normalize canvas to -1 <= x < +1,
var y = (yp - canvas.height/2) /    //                     -1 <= y < +1.
(canvas.height/2);

// find how far we dragged the mouse:
xMdragTot += (x - xMclik);          // Accumulate change-in-mouse-position,&
yMdragTot += (y - yMclik);

//===================================================
xMclik = x;                         // Make NEXT drag-measurement from here.
yMclik = y;

// Show it on our webpage, in the <div> element named 'MouseText':
document.getElementById('MouseText').innerHTML=
'Mouse Drag totals (CVV x,y coords):\t'+
xMdragTot.toFixed(5)+', \t'+
yMdragTot.toFixed(5);  
};

function myMouseUp(ev, gl, canvas) {
//==============================================================================
// Called when user RELEASES mouse button pressed previously.
//                  (Which button?   console.log('ev.button='+ev.button);    )
//    ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
//    pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

// Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
var rect = ev.target.getBoundingClientRect(); // get canvas corners in pixels
var xp = ev.clientX - rect.left;                  // x==0 at canvas left edge
var yp = canvas.height - (ev.clientY - rect.top); // y==0 at canvas bottom edge
//  console.log('myMouseUp  (pixel coords): xp,yp=\t',xp,',\t',yp);

// Convert to Canonical View Volume (CVV) coordinates too:
var x = (xp - canvas.width/2)  /    // move origin to center of canvas and
(canvas.width/2);      // normalize canvas to -1 <= x < +1,
var y = (yp - canvas.height/2) /    //                     -1 <= y < +1.
(canvas.height/2);
//  console.log('myMouseUp  (CVV coords  ):  x, y=\t',x,',\t',y);

isDrag = false;                     // CLEAR our mouse-dragging flag, and
// accumulate any final bit of mouse-dragging we did:
xMdragTot += (x - xMclik);
yMdragTot += (y - yMclik);

// Show it on our webpage, in the <div> element named 'MouseText':
}


function keydown(ev, gl,canvas) {
//------------------------------------------------------
//HTML calls this'Event handler' or 'callback function' when we press a key:
switch(ev.keyCode){
case 39: { // right arrow - step right
	up = new Vector3();
	up[0] = 0;
	up[1] = 1;
	up[2] = 0;
	look = new Vector3();
	look = vec3FromEye2LookAt(g_EyeX, g_EyeY, g_EyeZ, g_LookAtX, g_LookAtY, g_LookAtZ);

	tmpVec3 = new Vector3();
	tmpVec3 = vec3CrossProduct(up, look);

//console.log(tmpVec3[0], tmpVec3[1], tmpVec3[2]);

g_EyeX -= MOVE_STEP * tmpVec3[0];
g_EyeY -= MOVE_STEP * tmpVec3[1];
g_EyeZ -= MOVE_STEP * tmpVec3[2];

g_LookAtX -= MOVE_STEP * tmpVec3[0];
g_LookAtY -= MOVE_STEP * tmpVec3[1];
g_LookAtZ -= MOVE_STEP * tmpVec3[2];

//console.log('eyeX=',g_EyeX, 'eyeY=', g_EyeY, 'eyeZ=', g_EyeZ, 'lookAtX=', g_LookAtX, 'lookAtY=', g_LookAtY, 'lookAtZ=', g_LookAtZ);
break;
}
case 37: 
{ // left arrow - step left
	up = new Vector3();
	up[0] = 0;
	up[1] = 1;
	up[2] = 0;
	look = new Vector3();
	look = vec3FromEye2LookAt(g_EyeX, g_EyeY, g_EyeZ, g_LookAtX, g_LookAtY, g_LookAtZ);

	tmpVec3 = new Vector3();
	tmpVec3 = vec3CrossProduct(up, look);


	g_EyeX += MOVE_STEP * tmpVec3[0];
	g_EyeY += MOVE_STEP * tmpVec3[1];
	g_EyeZ += MOVE_STEP * tmpVec3[2];

	g_LookAtX += MOVE_STEP * tmpVec3[0];
	g_LookAtY += MOVE_STEP * tmpVec3[1];
	g_LookAtZ += MOVE_STEP * tmpVec3[2];

	break;

} 
case 38: 
{ // up arrow - step forward
	tmpVec3 = new Vector3();
	tmpVec3 = vec3FromEye2LookAt(g_EyeX, g_EyeY, g_EyeZ, g_LookAtX, g_LookAtY, g_LookAtZ);

	g_EyeX += MOVE_STEP * tmpVec3[0];
	g_EyeY += MOVE_STEP * tmpVec3[1];
	g_EyeZ += MOVE_STEP * tmpVec3[2];

	g_LookAtX += MOVE_STEP * tmpVec3[0];
	g_LookAtY += MOVE_STEP * tmpVec3[1];
	g_LookAtZ += MOVE_STEP * tmpVec3[2];
	lightSpecStep[0] +=1;
	lightSpecStep[1] +=1;
	lightSpecStep[2] +=1;
	break;

} 
case 40: { // down arrow - step backward
	tmpVec3 = new Vector3();
	tmpVec3 = vec3FromEye2LookAt(g_EyeX, g_EyeY, g_EyeZ, g_LookAtX, g_LookAtY, g_LookAtZ);

	g_EyeX -= MOVE_STEP * tmpVec3[0];
	g_EyeY -= MOVE_STEP * tmpVec3[1];
	g_EyeZ -= MOVE_STEP * tmpVec3[2];

	g_LookAtX -= MOVE_STEP * tmpVec3[0];
	g_LookAtY -= MOVE_STEP * tmpVec3[1];
	g_LookAtZ -= MOVE_STEP * tmpVec3[2];
	lightSpecStep[0] -=1;
	lightSpecStep[1] -=1;
	lightSpecStep[2] -=1;
	break;
} 
case 112: { // F1-user guide
	console.log(' F1.');  
	break;
}
case 27:{   //esc->reset
	g_EyeX = 0.20, g_EyeY = 2.555, g_EyeZ = 8.25; 
	g_LookAtX = 0.0; g_LookAtY = 0.0; g_LookAtZ = 0.0;
	userLightPos= [0.2, 0, 6];
	break;
}
case 32:{   //space-> run/stop the screen
	if(ANGLE_STEP*ANGLE_STEP > 1) {
		myTmp = ANGLE_STEP;
		ANGLE_STEP = 0;
	}
	else {
		ANGLE_STEP = myTmp;
	}
	break;
}
default: {return;
	break;}
}    
}

function runStop() {
// Called when user presses the 'Run/Stop' button
if(ANGLE_STEP*ANGLE_STEP > 1) {
	myTmp = ANGLE_STEP;
	ANGLE_STEP = 0;
}
else {
	ANGLE_STEP = myTmp;
}
}

function keypress(ev,gl,canvas){
	switch(ev.keyCode){
case 90:{ // Z->switch on/off headlight
	console.log('Z(keycode:90)->switch on/off headlight');
	headLight = (headLight == 1)? 0: 1;
	break;}
case 122:{ // z->switch on/off headlight
	console.log('z(keycode:122)->switch on/off spherelight');
	sphereLight = (sphereLight == 1)? 0: 1;
	break;}
case 88:{ // X->switch on/off headlight
	console.log('X(keycode:88)->switch on/off cubelight');
	cubeLight = (cubeLight == 1)? 0: 1;
	break;}
case 120:{ // x->switch on/off headlight
	console.log('x(keycode:120)->switch on/off toruslight');
	torusLight = (torusLight == 1)? 0: 1;
	break;}
case 99:{ // c->switch on/off headlight
	console.log('c(keycode:99)->switch on/off cylinderlight');
	cylinderLight = (cylinderLight == 1)? 0: 1;
	break;}
case 97: // a->light move left
userLightPos[0] -= 0.5;
break;
case 100: // d->light move left
userLightPos[0] += 0.5;
break;
case 119: // w->light move up
userLightPos[1] += 0.5;
break;
case 115: // d->light move down
userLightPos[1] -= 0.5;
break;
case 113: // q->light becomes small
userLightPos[2] -= 0.5;
break;
case 101: // e->light becomes big
userLightPos[2] += 0.5;
break;
case 65:{ // A - look left
	console.log('A->look left');
	if(LAST_UPDATE==-1 || LAST_UPDATE==0)
	{
		a = g_LookAtX - g_EyeX;
		b = g_LookAtY - g_EyeY;
		c = g_LookAtZ - g_EyeZ;
		l = Math.sqrt(a*a + b*b + c*c);

		lzx = Math.sqrt(a*a+c*c);
		sin_phi = lzx / l;

		theta0 = Math.PI -  Math.asin(a/lzx);

		THETA_NOW = theta0 + LOOK_STEP;

		LAST_UPDATE = 1;
	}
	else
	{
		THETA_NOW += LOOK_STEP;
	}

	g_LookAtY = b + g_EyeY;
	g_LookAtX = l * sin_phi * Math.sin(THETA_NOW) + g_EyeX;
	g_LookAtZ = l * sin_phi * Math.cos(THETA_NOW) + g_EyeZ;
//draw(gl, u_MvpMatrix, u_ModelMatrix, u_NormalMatrix, u_ColorMod, currentAngle, canvas);   
break;
}
case 68: {//D - look right
	console.log('D->look right');
	if (LAST_UPDATE==-1 || LAST_UPDATE==0)
	{
		a = g_LookAtX - g_EyeX;
		b = g_LookAtY - g_EyeY;
		c = g_LookAtZ - g_EyeZ;
		l = Math.sqrt(a*a + b*b + c*c);
		lzx = Math.sqrt(a*a+c*c);
		sin_phi = lzx / l;

		theta0 = Math.PI -  Math.asin(a/lzx);

		THETA_NOW = theta0 - LOOK_STEP;

		LAST_UPDATE = 1;
	}
	else
	{
		THETA_NOW -= LOOK_STEP;
	}

	g_LookAtY = b + g_EyeY;
	g_LookAtX = l * sin_phi * Math.sin(THETA_NOW) + g_EyeX;
	g_LookAtZ = l * sin_phi * Math.cos(THETA_NOW) + g_EyeZ;
//draw(gl, u_MvpMatrix, u_ModelMatrix, u_NormalMatrix, u_ColorMod, currentAngle, canvas);   
break;
}
case 87:{ //W - look up
	console.log('W->look up');
	if (LAST_UPDATE==-1 || LAST_UPDATE==1)
	{  
		a = g_LookAtX - g_EyeX;
		b = g_LookAtY - g_EyeY;
		c = g_LookAtZ - g_EyeZ;
		l = Math.sqrt(a*a + b*b + c*c);
		cos_theta = c / Math.sqrt(a*a + c*c);
		sin_theta = a / Math.sqrt(a*a + c*c);

		phi0 = Math.asin(b/l);

		PHI_NOW = phi0 + LOOK_STEP;
		LAST_UPDATE = 0;
	}
	else
	{
		PHI_NOW += LOOK_STEP;
	}

	g_LookAtY = l * Math.sin(PHI_NOW) + g_EyeY;
	g_LookAtX = l * Math.cos(PHI_NOW) * sin_theta + g_EyeX;
	g_LookAtZ = l * Math.cos(PHI_NOW) * cos_theta + g_EyeZ;
	break;
}
case 83:{ //S-look down
	console.log('S->look down');
	if(LAST_UPDATE==-1 || LAST_UPDATE==1)
	{ 
		a = g_LookAtX - g_EyeX;
		b = g_LookAtY - g_EyeY;
		c = g_LookAtZ - g_EyeZ;
		l = Math.sqrt(a*a + b*b + c*c);

		cos_theta = c / Math.sqrt(a*a + c*c);
		sin_theta = a / Math.sqrt(a*a + c*c);

		phi0 = Math.asin(b/l);

		PHI_NOW = phi0 - LOOK_STEP;


		LAST_UPDATE = 0;
	}
	else
	{
		PHI_NOW -= LOOK_STEP;
	}

	g_LookAtY = l * Math.sin(PHI_NOW) + g_EyeY;
	g_LookAtX = l * Math.cos(PHI_NOW) * sin_theta + g_EyeX;
	g_LookAtZ = l * Math.cos(PHI_NOW) * cos_theta + g_EyeZ;
//draw(gl, u_MvpMatrix, u_ModelMatrix, u_NormalMatrix, u_ColorMod, currentAngle, canvas);   
break;
}
/*
//=================FLYING========================
case 80: { // P -> pitch
tempEyeY += 2;

//console.log('eyeX=',g_EyeX, 'eyeY=', g_EyeY, 'eyeZ=', g_EyeZ, 'lookAtX=', g_LookAtX, 'lookAtY=', g_LookAtY, 'lookAtZ=', g_LookAtZ);
console.log('Key I->flying-airplane pitch');
//draw(gl, u_MvpMatrix, u_ModelMatrix, u_NormalMatrix, u_ColorMod, currentAngle, canvas);   
break;

} 
case 76: { // L -> yaw
tempEyeX += 1;
//console.log('eyeX=',g_EyeX, 'eyeY=', g_EyeY, 'eyeZ=', g_EyeZ, 'lookAtX=', g_LookAtX, 'lookAtY=', g_LookAtY, 'lookAtZ=', g_LookAtZ);
console.log('Key J->flying-airplane yaw');
//draw(gl, u_MvpMatrix, u_ModelMatrix, u_NormalMatrix, u_ColorMod, currentAngle, canvas);   
break;

} 
case 49:{ //1->resize window width
orthoLR += currentAngle*0.001;
//draw(gl, u_MvpMatrix, u_ModelMatrix, u_NormalMatrix, u_ColorMod, currentAngle, canvas);   
break;
}
case 50:{ //2->resize window height
orthoTB += currentAngle*0.002;
//draw(gl, u_MvpMatrix, u_ModelMatrix, u_NormalMatrix, u_ColorMod, currentAngle, canvas);   
break;
}*/

default: {return;
	break;}
}
}

function vec3FromEye2LookAt(eyeX, eyeY, eyeZ, lookAtX, lookAtY, lookAtZ)
{
	result = new Vector3();

	dx = lookAtX - eyeX;
	dy = lookAtY - eyeY;
	dz = lookAtZ - eyeZ;
	amp = Math.sqrt(dx*dx + dy*dy + dz*dz);

	result[0] = dx/amp;
	result[1] = dy/amp;
	result[2] = dz/amp;

	return result;
}

function vec3CrossProduct(up, look) //UpVec x LookVec --> Left Vec
{
	r = new Vector3();

	r[0] = up[1]*look[2] - up[2]*look[1];
//console.log('up1', up[1]);
r[1] = up[2]*look[0] - up[0]*look[2];
r[2] = up[0]*look[1] - up[1]*look[0];

amp = Math.sqrt(r[0]*r[0] + r[1]*r[1] + r[2]*r[2]) + 0.000001;

r[0] /= amp;
r[1] /= amp;
r[2] /= amp;

return r;
}

function resize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight-200;
}

//dat gui controller
var controller = function () {
	this.Controller = 'User-adjustable'; this.ATT = 1;
	this.ambiRed = 0.4; this.ambiGreen = 0.4; this.ambiBlue = 0.4;
	this.diffRed = 1; this.diffGreen = 1; this.diffBlue = 1;
	this.specRed = 1; this.specGreen = 1; this.specBlue = 1;
	this.shiny = 1;
	this.isToon = false;this.isGouraud = false; this.Minions_img = false;
}
var contr = new controller();
var gui = new dat.GUI({autoPlace: false});
gui.add(contr, 'Controller');
var f1 = gui.addFolder('ambient');
f1.add(contr, 'ambiRed').min(0).max(100).step(0.1);
f1.add(contr, 'ambiGreen').min(0).max(100).step(0.1);
f1.add(contr, 'ambiBlue').min(0).max(100).step(0.1);
var f2 = gui.addFolder('diffuse');
f2.add(contr, 'diffRed').min(0).max(100).step(0.1);
f2.add(contr, 'diffGreen').min(0).max(100).step(0.1);
f2.add(contr, 'diffBlue').min(0).max(100).step(0.1);
var f3 = gui.addFolder('specular');
f3.add(contr, 'specRed').min(0).max(100).step(0.1);
f3.add(contr, 'specGreen').min(0).max(100).step(0.1);
f3.add(contr, 'specBlue').min(0).max(100).step(0.1);
gui.add(contr, 'shiny').min(0).max(100).step(1);
gui.add(contr, 'ATT', {'1': 1, '1/dist':2, '1/dist^2': 3 });
gui.add(contr, 'isToon');
gui.add(contr, 'isGouraud');
gui.add(contr, 'Minions_img');
var customContainer = document.getElementById('gui');
customContainer.appendChild(gui.domElement);