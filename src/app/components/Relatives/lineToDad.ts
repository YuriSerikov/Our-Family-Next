import { constRelTree } from "./constRelTree";

function lineToDad(
  context: CanvasRenderingContext2D,
  xDad: number,
  yDad: number,
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
  const xF = xDad + cardWidth + mgn / 2;
  const yF = yDad + cardHeight / 2;
  context.strokeStyle = colorLine;
  let yStepUp = colorLine === "brown" ? (mgnY / 4) * 3 : indent;
  context.beginPath();
  context.moveTo(x0, yChild);
  context.lineTo(x0, yChild - yStepUp);
  context.lineTo(xF, yChild - yStepUp);
  context.lineTo(xF, yF);
  context.lineTo(xF - mgn / 2, yF); // влево
  context.stroke();
}
export default lineToDad;
