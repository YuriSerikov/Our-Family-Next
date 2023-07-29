import styled, { keyframes }  from 'styled-components'


const rad = Math.PI / 180;
const R = 80;
const r = R / 16;
const phi = Math.PI / 2;

let t=0;

function pointOnLemniscate() {
  let o = {
    x: (R * Math.cos(t) / (1 + (Math.sin(t) * Math.sin(t)))).toFixed(5),
    y: (R * Math.sin(t) * Math.cos(t) / (1 + (Math.sin(t) * Math.sin(t)))).toFixed(5)
  };
  return o
}

function pointOnLissajous() {
  let o = {
    x: (R * Math.sin(5 * t + phi)).toFixed(5),
    y: (R * Math.sin(6 * t)).toFixed(5)
  };
  return o
}

function pointOnHeart() {
  let o = {
  x: (16 * r * (Math.sin(t) * Math.sin(t) * Math.sin(t))).toFixed(5),
  y: (-13 * r * Math.cos(t) + 5 * r * Math.cos(2 * t) + 2 * r * Math.cos(3 * t) + r * Math.cos(4 * t)).toFixed(5)
  }
  return o
}

function getShadow(pointOnCurve: { (): { x: string; y: string; }; (): { x: string; y: string; }; (): { x: string; y: string; }; (): any; }) {
  let boxShadowRy = [];
  for (let a = 0; a < 360; a += .5) {
    t = a * rad;
    let o = pointOnCurve();
    boxShadowRy.push(`${o.x }px ${o.y}px 0px 1px hsl(${a} ,100%,50%)`);
  }
  let boxShadowStr = boxShadowRy.join();
  return boxShadowStr;
}

  const curvAnimation = keyframes`
    50% {box-shadow: ${getShadow(pointOnLemniscate)};
    background-color:hsl(90,100%,50%);}
    55% {background-color:transparent;}
    100% {box-shadow: ${getShadow(pointOnHeart)};
    background-color:transparent;}
  `
  
 const Loader = styled.div`
  width: 100%;
  height: 100%;
  font-size: 16px;
  background-color: black;
  opacity: 90%;

  &:before {
  top: 30%;
  left: 50%;
  content: '';
  width: 2px;
  height: 2px;
  border-radius: 50%;
  position: absolute;
  background-color: hsl(90, 100%, 50%);
  animation: ${curvAnimation} 5s ease-in-out infinite alternate-reverse;
  -webkit-animation: ${curvAnimation} 5s ease-in-out infinite alternate-reverse;
  }
  &:before {
  box-shadow: ${getShadow(pointOnLissajous)}
}
`;

export default Loader;