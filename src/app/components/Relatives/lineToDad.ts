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
 
  
  let yStepUp = colorLine === constRelTree.lineColorUp2 ? (mgnY / 4) * 3 : indent;
  context.strokeStyle = colorLine;
  if (colorLine === constRelTree.lineColorToDevorced) {
    let xF = xDad + cardWidth / 2
    let yF = yDad + cardHeight
    context.beginPath()
    context.moveTo(x0, yChild)
    context.lineTo(x0, yChild - yStepUp)
    context.lineTo(xF, yChild - yStepUp)
    context.lineTo(xF, yF)
    context.stroke()
  } else {
    let xF = xDad + cardWidth + mgn / 2
    let yF = yDad + cardHeight / 2
    context.beginPath()
    context.moveTo(x0, yChild)
    context.lineTo(x0, yChild - yStepUp)
    context.lineTo(xF, yChild - yStepUp)
    context.lineTo(xF, yF)
    context.lineTo(xF - mgn / 2, yF) // влево
    context.stroke()
  }
}
export default lineToDad;
