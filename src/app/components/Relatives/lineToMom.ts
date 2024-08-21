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
  
  let yStepUp = colorLine === constRelTree.lineColorUp2 ? (mgnY / 4) * 3 : indent;
  context.strokeStyle = colorLine
if (colorLine === constRelTree.lineColorToDevorced) {
    let xF = xMom + cardWidth / 2
    let yF = yMom + cardHeight
    context.beginPath()
    context.moveTo(x0, yChild)
    context.lineTo(x0, yChild - yStepUp) // вверх
    context.lineTo(xF, yChild - yStepUp) // горизонтально
    context.lineTo(xF, yF) // вверх
    context.stroke()
  } else {
    let xF = xMom - mgn / 2
    let yF = yMom + cardHeight / 2
    context.beginPath()
    context.moveTo(x0, yChild)
    context.lineTo(x0, yChild - yStepUp) // вверх
    context.lineTo(xF, yChild - yStepUp) // горизонтально
    context.lineTo(xF, yF) // вверх
    context.lineTo(xF + mgn / 2, yF) // вправо
    context.stroke()
  }
}

export default lineToMom;
