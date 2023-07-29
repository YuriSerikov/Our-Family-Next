import { constRelTree } from "./constRelTree";

function lineToMom(
  context:CanvasRenderingContext2D,
  xMom: number,
  yMom: number,
  xChild: number,
  yChild: number,
  colorLine: string,
  indent = 10
) {
  const cardWidth = constRelTree.miniWidth;
  const cardHeight = constRelTree.miniHeight;
  const mgn = constRelTree.marginCard;
  const x0 = xChild + cardWidth / 2;
  const mgnY = constRelTree.marginY;
  const xW = xMom - mgn / 2;
  const yW = yMom + cardHeight / 2;
  let yStepUp = colorLine === "brown" ? (mgnY / 4) * 3 : indent;
  context.strokeStyle = colorLine;
  context.beginPath();
  context.moveTo(x0, yChild);
  context.lineTo(x0, yChild - yStepUp); // вверх
  context.lineTo(xW, yChild - yStepUp); // горизонтально
  context.lineTo(xW, yW); // вверх
  context.lineTo(xW + mgn / 2, yW); // вправо
  context.stroke();
}

export default lineToMom;
