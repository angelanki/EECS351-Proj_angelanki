function setLight(gl, program,lampNum, lampADS, lampEyeLook, lightMat, lightSwitch){
//light setting
var u_eyePosWorld = gl.getUniformLocation(program, 'u_eyePosWorld');
gl.uniform4f(u_eyePosWorld, lampEyeLook[0], lampEyeLook[1], lampEyeLook[2], 1);
switch(lampNum){
case 0: 
var lamp0Pos = gl.getUniformLocation(program, 'li[0].pos');
var lamp0Amb = gl.getUniformLocation(program, 'li[0].amb');
var lamp0Diff = gl.getUniformLocation(program,   'li[0].diff');
var lamp0Spec = gl.getUniformLocation(program,   'li[0].spec');

var u_Ke = gl.getUniformLocation(program, 'li[0].ke');
var u_Ka = gl.getUniformLocation(program, 'li[0].ka');
var u_Kd = gl.getUniformLocation(program, 'li[0].kd');
var u_Ks = gl.getUniformLocation(program, 'li[0].ks');
var u_Kshiny = gl.getUniformLocation(program, 'li[0].kshiny');

gl.uniform4f(lamp0Pos, lampEyeLook[3], lampEyeLook[4], lampEyeLook[5], 1);
break;
case 1:
var lamp0Pos = gl.getUniformLocation(program, 'li[1].pos');
var lamp0Amb = gl.getUniformLocation(program, 'li[1].amb');
var lamp0Diff = gl.getUniformLocation(program,   'li[1].diff');
var lamp0Spec = gl.getUniformLocation(program,   'li[1].spec');

var u_Ke = gl.getUniformLocation(program, 'li[1].ke');
var u_Ka = gl.getUniformLocation(program, 'li[1].ka');
var u_Kd = gl.getUniformLocation(program, 'li[1].kd');
var u_Ks = gl.getUniformLocation(program, 'li[1].ks');
var u_Kshiny = gl.getUniformLocation(program, 'li[1].kshiny');

gl.uniform4f(lamp0Pos,  userLightPos[0]+lampEyeLook[3], userLightPos[1]+lampEyeLook[4], userLightPos[2]+lampEyeLook[5], 1);
break;
case 2:
var lamp0Pos = gl.getUniformLocation(program, 'li[2].pos');
var lamp0Amb = gl.getUniformLocation(program, 'li[2].amb');
var lamp0Diff = gl.getUniformLocation(program,   'li[2].diff');
var lamp0Spec = gl.getUniformLocation(program,   'li[2].spec');

var u_Ke = gl.getUniformLocation(program, 'li[2].ke');
var u_Ka = gl.getUniformLocation(program, 'li[2].ka');
var u_Kd = gl.getUniformLocation(program, 'li[2].kd');
var u_Ks = gl.getUniformLocation(program, 'li[2].ks');
var u_Kshiny = gl.getUniformLocation(program, 'li[2].kshiny');

gl.uniform4f(lamp0Pos, lampEyeLook[3], lampEyeLook[4], lampEyeLook[5], 1);
break;
case 3:
var lamp0Pos = gl.getUniformLocation(program, 'li[3].pos');
var lamp0Amb = gl.getUniformLocation(program, 'li[3].amb');
var lamp0Diff = gl.getUniformLocation(program,   'li[3].diff');
var lamp0Spec = gl.getUniformLocation(program,   'li[3].spec');

var u_Ke = gl.getUniformLocation(program, 'li[3].ke');
var u_Ka = gl.getUniformLocation(program, 'li[3].ka');
var u_Kd = gl.getUniformLocation(program, 'li[3].kd');
var u_Ks = gl.getUniformLocation(program, 'li[3].ks');
var u_Kshiny = gl.getUniformLocation(program, 'li[3].kshiny');

gl.uniform4f(lamp0Pos, lampEyeLook[3], lampEyeLook[4], lampEyeLook[5], 1);
break;
case 4:
var lamp0Pos = gl.getUniformLocation(program, 'li[4].pos');
var lamp0Amb = gl.getUniformLocation(program, 'li[4].amb');
var lamp0Diff = gl.getUniformLocation(program,   'li[4].diff');
var lamp0Spec = gl.getUniformLocation(program,   'li[4].spec');

var u_Ke = gl.getUniformLocation(program, 'li[4].ke');
var u_Ka = gl.getUniformLocation(program, 'li[4].ka');
var u_Kd = gl.getUniformLocation(program, 'li[4].kd');
var u_Ks = gl.getUniformLocation(program, 'li[4].ks');
var u_Kshiny = gl.getUniformLocation(program, 'li[4].kshiny');

gl.uniform4f(lamp0Pos, lampEyeLook[3], lampEyeLook[4], lampEyeLook[5], 1);
break;
case 5:
var lamp0Pos = gl.getUniformLocation(program, 'li[5].pos');
var lamp0Amb = gl.getUniformLocation(program, 'li[5].amb');
var lamp0Diff = gl.getUniformLocation(program,   'li[5].diff');
var lamp0Spec = gl.getUniformLocation(program,   'li[5].spec');

var u_Ke = gl.getUniformLocation(program, 'li[5].ke');
var u_Ka = gl.getUniformLocation(program, 'li[5].ka');
var u_Kd = gl.getUniformLocation(program, 'li[5].kd');
var u_Ks = gl.getUniformLocation(program, 'li[5].ks');
var u_Kshiny = gl.getUniformLocation(program, 'li[5].kshiny');

gl.uniform4f(lamp0Pos, lampEyeLook[3], lampEyeLook[4], lampEyeLook[5], 1);
break;
default:
return;
break;
}

if(lightSwitch % 2){
gl.uniform3f(lamp0Amb,  0.0, 0.0, 0.0);   // ambient
gl.uniform3f(lamp0Diff, 0.0, 0.0, 0.0);   // diffuse
gl.uniform3f(lamp0Spec, 0.0, 0.0, 0.0);   // Specular
}
else{
gl.uniform3f(lamp0Amb,  lampADS[0], lampADS[1], lampADS[2]);   // ambient
gl.uniform3f(lamp0Diff, lampADS[3], lampADS[4], lampADS[5]);   // diffuse
gl.uniform3f(lamp0Spec, lampADS[6], lampADS[7], lampADS[8]);   // Specular
}
var material = new Material(lightMat);
gl.uniform3f(u_Ke, material.emissive[0], material.emissive[1], material.emissive[2]);        // Ke emissive
gl.uniform3f(u_Ka, material.ambient[0], material.ambient[1], material.ambient[2]);        // Ka ambient
gl.uniform3f(u_Kd, material.diffuse[0], material.diffuse[1], material.diffuse[2]);        // Kd diffuse
gl.uniform3f(u_Ks, material.specular[0], material.specular[1], material.specular[2]);        // Ks specular
gl.uniform1f(u_Kshiny, material.shiny*lampADS[9]);   
}
