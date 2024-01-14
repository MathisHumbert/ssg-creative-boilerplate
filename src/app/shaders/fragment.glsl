precision mediump float;

uniform float uAlpha;
uniform vec3 uColor;

varying vec2 vUv;

void main(){
  gl_FragColor = vec4(1., 1., 1., uAlpha);
}