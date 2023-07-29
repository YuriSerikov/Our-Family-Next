import { constRelTree } from "./constRelTree";

function lineToWife(context: CanvasRenderingContext2D,
  xHusband: number,
  yHusband: number,
  xWife:number,
  yWife:number) {
  const cardWidth = constRelTree.miniWidth;
  const cardHeight = constRelTree.miniHeight;

  //const x0 = xHusband + cardWidth;
  //const y0 = yHusband + cardHeight/2

  context.strokeStyle = "black";
  context.beginPath();
  context.moveTo(xHusband + cardWidth, yHusband + cardHeight / 2);
  context.lineTo(xWife, yWife + cardHeight / 2);
  context.stroke();
}

export default lineToWife;
