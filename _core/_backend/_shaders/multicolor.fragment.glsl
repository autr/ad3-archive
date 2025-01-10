
#if defined(PREPASS)
	#extension GL_EXT_draw_buffers : require
	layout(location = 0) out highp vec4 glFragData[SCENE_MRT_COUNT];
	highp vec4 gl_FragColor;
#endif

#if defined(WEBGL2) || defined(WEBGPU)
	precision highp sampler2DArray;
#endif

precision highp float;

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


float computeFresnelTerm(vec3 viewDirection,vec3 worldNormal,float bias,float power) {
	float fresnelTerm = pow(bias+abs(dot(viewDirection,worldNormal)),power);
	return clamp(fresnelTerm,0.,1.);
}

#include<helperFunctions>

float u_Float = 0.0;

void main(void) {
	float output6 = dot(u_down, v_xyz2);
	vec3 output5 = mix(u_fresnelTop , u_fresnelBottom, output6);
	vec3 output7 = normalize(u_cameraPosition - v_output1.xyz);
	float fresnel = computeFresnelTerm(output7.xyz, v_output2.xyz, u_edgeBias, u_edgePower);
	vec3 output4 = mix(output5 , u_baseColor, fresnel);
	float x = output7.x;
	float z = output7.z;
	float output10 = -1.0 * x;
	vec3 xyz3 = vec3(z, u_Float, output10).xyz;
	float output9 = dot(xyz3, v_xyz2);
	float fresnel1 = computeFresnelTerm(output7.xyz, v_output2.xyz, u_centerBias, u_centerPower);
	float output8 = output9 * fresnel1;
	vec3 output3 = mix(output4 , u_scaleColor, output8);
	gl_FragColor = vec4(output3, 1.0);

	#ifdef CONVERTTOLINEAR0
		gl_FragColor = toLinearSpace(gl_FragColor);
	#endif

	#ifdef CONVERTTOGAMMA0
		gl_FragColor = toGammaSpace(gl_FragColor);
	#endif

	#if defined(PREPASS)
		gl_FragData[0] = gl_FragColor;
	#endif

}