
#if defined(WEBGL2) || defined(WEBGPU)
precision highp sampler2DArray;
#endif
precision highp float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 u_World;
uniform mat4 u_ViewProjection;
uniform vec3 u_fresnelTop;
uniform vec3 u_fresnelBottom;
uniform vec3 u_down;
uniform vec3 u_baseColor;
uniform vec3 u_cameraPosition;
uniform float u_edgeBias;
uniform float u_edgePower;
uniform vec3 u_scaleColor;
uniform float u_centerBias;
uniform float u_centerPower;

varying vec3 v_xyz2;
varying vec4 v_output2;
varying vec4 v_output1;

#include<helperFunctions>

float u_Float = 0.0;

void main(void) {
	mat3 u_World_NUS = mat3(u_World);
	#ifdef NONUNIFORMSCALING
		u_World_NUS = transposeMat3(inverseMat3(u_World_NUS));
	#endif
	vec4 output2 = vec4(u_World_NUS * normal, 0.0);
	vec3 xyz2 = output2.xyz;
	vec4 output1 = u_World * vec4(position, 1.0);
	vec4 output0 = u_ViewProjection * output1;
	gl_Position = output0;
	v_xyz2 = xyz2;
	v_output2 = output2;
	v_output1 = output1;

}