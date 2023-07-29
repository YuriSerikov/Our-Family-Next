import { constRelTree } from "./constRelTree";
import { IPersonCard } from "../../models/psnCardType";

const culcPozxKids = (
  arrKids:IPersonCard[],
  arrSmTree:IPersonCard[],
  xLeftParent: number,
  xRightParent: number,
  xCentralPoint: number
) => {
  const mgn = constRelTree.marginCard;
  const gridStepX = mgn + constRelTree.miniWidth;

  let nKids = arrKids.length > 0 ? arrKids.length : 0;

  const rightShiftPicture = (arrSmallTree:IPersonCard[], shift: number, xPozToArrange: number, kidsLevel: number) => {
    // освобождаем место для персоны
    // сдвигаем на shift уровни 1 - 3 и детский уровень, начиная с позиции xPozToArrange
    //console.log("вызов  rightSiftPicture ...");
    let condition = false;

    if (arrSmallTree.length > 0) {
      for (let j = 0; j < arrSmallTree.length; j++) {
        switch (kidsLevel) {
          case 4:
            condition = arrSmallTree[j].level <= 3;
            if (condition) {
              arrSmallTree[j].pozX = arrSmallTree[j].pozX + shift;
            }
            break;
          case 5:
            condition =
              arrSmallTree[j].level <= 3 ||
              (arrSmallTree[j].level === 4 &&
                arrSmallTree[j].pozX >= xPozToArrange);
            if (condition) {
              arrSmallTree[j].pozX = arrSmallTree[j].pozX + shift;
            }
            break;
          case 6:
            condition =
              arrSmallTree[j].level <= 3 ||
              ((arrSmallTree[j].level === 4 || arrSmallTree[j].level === 5) &&
                arrSmallTree[j].pozX >= xPozToArrange);
            if (condition) {
              arrSmallTree[j].pozX = arrSmallTree[j].pozX + shift;
            }
            break;
          default:
            break;
        }
      }
    }
    return arrSmallTree;
  };

  const rightShiftLevel_3 = (arrSmallTree:IPersonCard[], shift:number, xPozToArrange:number, kidsLevel:number) => {
    // сдвигаем на shift родительский уровень, начиная с заданной позиции

    let condition = false;

    if (arrSmallTree.length > 0) {
      for (let j = 0; j < arrSmallTree.length; j++) {
        switch (kidsLevel) {
          case 5:
            condition =
              arrSmallTree[j].level === 4 &&
              arrSmallTree[j].pozX >= xPozToArrange;
            if (condition) {
              arrSmallTree[j].pozX = arrSmallTree[j].pozX + shift;
            }
            break;
          case 6:
            condition =
              arrSmallTree[j].level === 5 &&
              arrSmallTree[j].pozX >= xPozToArrange;
            if (condition) {
              arrSmallTree[j].pozX = arrSmallTree[j].pozX + shift;
            }
            break;
          default:
            break;
        }
      }
    }
    return arrSmallTree;
  };

  const xFreePozInLevel = (arrSmallTree:IPersonCard[], level:number) => {
    let arrPsnLevel = arrSmallTree.filter((elem) => elem.level >= level);

    let xFreePozInLevel = mgn;
    if (arrPsnLevel.length > 0) {
      for (let i = 0; i < arrPsnLevel.length; i++) {
        xFreePozInLevel = Math.max(xFreePozInLevel, arrPsnLevel[i].pozX);
      }
      return xFreePozInLevel + gridStepX;
    } else {
      return mgn;
    }
  };

  if (nKids > 0) {
    let kidLevel = arrKids[0].level;
    let arrLevel = arrSmTree.filter((elem) => elem.level === kidLevel);
    let nPsnKidLevel = arrLevel.length;
    let isOneParent = xRightParent - xLeftParent < 2 * gridStepX ? true : false;

    if (nPsnKidLevel === 0) {
      // уровень пустой
      //console.log("empty level ...");
      if (nKids === 1) {
        // ребенок - один
        arrKids[0].pozX = isOneParent
          ? xLeftParent
          : xLeftParent + gridStepX / 2;
      } else if (nKids === 2) {
        // детей - двое
        if (!isOneParent) {
          // родителей двое
          arrKids[0].pozX = xLeftParent;
          arrKids[1].pozX = xLeftParent + gridStepX;
        } else {
          // родитель один
          if (xLeftParent - gridStepX > 0) {
            // есть свободное место слева
            arrKids[0].pozX = xLeftParent - gridStepX;
            arrKids[1].pozX = xLeftParent;
          } else {
            // свободного места нет
            if (xLeftParent < xCentralPoint) {
              // сдвинуть "картину" на один шаг
              arrSmTree = rightShiftPicture(
                arrSmTree,
                gridStepX,
                xLeftParent,
                kidLevel
              );

              arrKids[0].pozX = xLeftParent;
              arrKids[1].pozX = xLeftParent + gridStepX;
            } else {
              // разместить вправо от родителя
              arrSmTree = rightShiftLevel_3(
                arrSmTree,
                gridStepX,
                xRightParent,
                kidLevel
              );
              arrKids[0].pozX = xLeftParent;
              arrKids[1].pozX = xLeftParent + gridStepX;
            }
          }
        }
      } else {
        // детей больше двух
        //console.log("детей больше двух ...");
        let xFreeSpace = xLeftParent - mgn;

        if (!isOneParent) {
          // родителей двое
          //console.log("родителей двое ...");
          let xSpaceRequire = (nKids - 2) * gridStepX;
          if (xFreeSpace - xSpaceRequire > 0) {
            // есть свободное место
            for (let j = 0; j < arrKids.length; j++) {
              arrKids[j].pozX = xLeftParent + (1 - j) * gridStepX;
            }
          } else {
            // свободного места не достаточно
            if (xLeftParent < xCentralPoint) {
              // сдвинуть "картину" на shift
              // разместить справа на лево
              let shift = xSpaceRequire - xFreeSpace;

              arrSmTree = rightShiftPicture(
                arrSmTree,
                shift,
                xLeftParent,
                kidLevel
              );

              for (let j = 0; j < arrKids.length; j++) {
                arrKids[j].pozX = xLeftParent + shift + (1 - j) * gridStepX;
              }
            } else {
              // сдвинуть
              // разместить слева на право
              for (let j = 0; j < arrKids.length; j++) {
                arrKids[j].pozX = xLeftParent + (j - 1) * gridStepX;
              }
            }
          }
        } else {
          // родитель один, детей больше двух
          let xSpaceRequire = (nKids - 1) * gridStepX;
          if (xFreeSpace - xSpaceRequire > 0) {
            // есть свободное место
            for (let j = 0; j < arrKids.length; j++) {
              arrKids[j].pozX = xLeftParent - j * gridStepX;
            }
          } else {
            // свободного места не достаточно
            if (xLeftParent < xCentralPoint) {
              // сдвинуть "картину" на shift
              let shift = xSpaceRequire - xFreeSpace;
              arrSmTree = rightShiftPicture(
                arrSmTree,
                shift,
                xLeftParent,
                kidLevel
              );

              // разместить справа на лево

              for (let j = 0; j < arrKids.length; j++) {
                arrKids[j].pozX = xLeftParent + shift - j * gridStepX;
              }
            } else {
              // разместить слева на право
              let shift = xSpaceRequire - xFreeSpace;
              arrSmTree = rightShiftLevel_3(
                arrSmTree,
                shift,
                xRightParent,
                kidLevel
              );
              for (let j = 0; j < arrKids.length; j++) {
                arrKids[j].pozX = xLeftParent + (j - 1) * gridStepX;
              }
            }
          }
        }
      }
    } else {
      // уровень не пустой
      //console.log("not empty level ...");
      // определить свободную позицию в уровне детей

      let xMax = xFreePozInLevel(arrSmTree, kidLevel);

      if (xMax < xLeftParent) {
        //console.log("xMax < xLeftParent");
        if (nKids === 1) {
          if (!isOneParent) {
            arrKids[0].pozX = xLeftParent + gridStepX / 2;
          } else {
            arrKids[0].pozX = xLeftParent;
          }
        } else if (nKids === 2) {
          // детей двое
          if (!isOneParent) {
            arrKids[0].pozX = xLeftParent;
            arrKids[1].pozX = xLeftParent + gridStepX;
          } else {
            // родитель один. Проверить достаточно ли свободного места слева
            if (xLeftParent - xMax >= gridStepX) {
              // есть место
              arrKids[1].pozX = xLeftParent;
              arrKids[0].pozX = xLeftParent - gridStepX;
            } else {
              //  места не хватает.
              if (xLeftParent < xCentralPoint) {
                //  Сдвиг картины на шаг
                arrSmTree = rightShiftPicture(
                  arrSmTree,
                  gridStepX,
                  xLeftParent,
                  kidLevel
                );

                arrKids[0].pozX = xLeftParent;
                arrKids[1].pozX = xLeftParent + gridStepX;
              } else {
                // разместить справа на лево
                arrKids[0].pozX = xLeftParent;
                arrKids[1].pozX = xLeftParent + gridStepX;
              }
            }
          }
        } else {
          // детей больше двух
          //console.log("детей больше двух");
          let xFreeSpace = xLeftParent - xMax;
          if (!isOneParent) {
            // родителей двое
            //console.log("родителей двое");
            //console.log("xFreeSpace = ", xFreeSpace);
            // детей больше двух
            let xSpaceRequire = (nKids - 2) * gridStepX;
            //console.log("xSpaceRequire = ", xSpaceRequire);
            if (xFreeSpace - xSpaceRequire > 0) {
              // есть свободное место
              for (let j = 0; j < arrKids.length; j++) {
                arrKids[j].pozX = xLeftParent + (1 - j) * gridStepX;
              }
            } else {
              // свободного места не достаточно
              if (xLeftParent < xCentralPoint) {
                // сдвинуть "картину" на shift
                let shift = xSpaceRequire - xFreeSpace;
                arrSmTree = rightShiftPicture(
                  arrSmTree,
                  shift,
                  xLeftParent,
                  kidLevel
                );
                // разместить справа на лево
                for (let j = 0; j < arrKids.length; j++) {
                  arrKids[j].pozX = xLeftParent + shift + (1 - j) * gridStepX;
                }
              } else {
                // сдвинуть только "детские " уровни
                let shift = xSpaceRequire - xFreeSpace;
                //console.log("shift = ", shift);
                if (shift > 0) {
                  arrSmTree = rightShiftLevel_3(
                    arrSmTree,
                    shift,
                    xLeftParent,
                    kidLevel
                  );
                }
                // разместить слева на право
                for (let j = 0; j < arrKids.length; j++) {
                  arrKids[j].pozX = xLeftParent + j * gridStepX;
                  //console.log(arrKids[j].pozX);
                }
              }
            }
          } else {
            // детей больше двух
            // родитель один
            //console.log("детей больше двух , родитель один");
            let xSpaceRequire = (nKids - 1) * gridStepX;
            if (xFreeSpace - xSpaceRequire > 0) {
              // есть свободное место
              for (let j = 0; j < arrKids.length; j++) {
                arrKids[j].pozX = xLeftParent - j * gridStepX;
              }
            } else {
              // свободного места не достаточно
              if (xLeftParent < xCentralPoint) {
                // сдвинуть "картину" на shift
                let shift = xSpaceRequire - xFreeSpace;
                arrSmTree = rightShiftPicture(
                  arrSmTree,
                  shift,
                  xLeftParent,
                  kidLevel
                );
                // разместить справа на лево
                for (let j = 0; j < arrKids.length; j++) {
                  arrKids[j].pozX = xLeftParent + shift - j * gridStepX;
                }
              } else {
                // разместить слева на право
                for (let j = 0; j < arrKids.length; j++) {
                  arrKids[j].pozX = xLeftParent + j * gridStepX;
                }
              }
            }
          }
        }
      } else if (xMax === xLeftParent) {
        //console.log("xMax === xLeftParent");
        // не пустой уровень
        if (nKids === 1) {
          if (!isOneParent) {
            // родителей двое
            arrKids[0].pozX = xLeftParent + gridStepX / 2;
          } else {
            // родитель один
            arrKids[0].pozX = xLeftParent;
          }
        } else {
          // детей двое и больше
          if (isOneParent) {
            // родитель один
            if (xLeftParent < xCentralPoint) {
              // левая часть экрана, сдвигаем катинку
              arrSmTree = rightShiftPicture(
                arrSmTree,
                gridStepX * (nKids - 1),
                xLeftParent,
                kidLevel
              );
            } else {
              // правая часть экрана, сдвигаем родителей
              arrSmTree = rightShiftLevel_3(
                arrSmTree,
                gridStepX * (nKids - 1),
                xRightParent,
                kidLevel
              );
            }
          } else {
            // родителей двое
            if (xLeftParent < xCentralPoint) {
              // левая часть экрана, сдвигаем катинку
              arrSmTree = rightShiftPicture(
                arrSmTree,
                gridStepX * (nKids - 2),
                xLeftParent,
                kidLevel
              );
            } else {
              // правая часть экрана, сдвигаем родителей
              arrSmTree = rightShiftLevel_3(
                arrSmTree,
                gridStepX * (nKids - 2),
                xRightParent,
                kidLevel
              );
            }
          }

          for (let i = 0; i < arrKids.length; i++) {
            arrKids[i].pozX = xLeftParent + i * gridStepX;
          }
        }
      } else {
        // свободная позиция правее родителя, не пустой уровень
        //console.log("xMax > xLeftParent");
        //console.log("xMax = ", xMax);
        let shift = xMax - xLeftParent;

        if (xLeftParent < xCentralPoint) {
          // надо сдвинуть картину
          arrSmTree = rightShiftPicture(
            arrSmTree,
            shift,
            xLeftParent,
            kidLevel
          );
        } else {
          // сдвинуть только "детские " уровни
          //
          arrSmTree = rightShiftLevel_3(
            arrSmTree,
            shift,
            xLeftParent,
            kidLevel
          );
        }
        // разместить слева на право
        for (let i = 0; i < arrKids.length; i++) {
          arrKids[i].pozX = xLeftParent + shift + i * gridStepX;
        }
      }
    }
    arrSmTree = arrSmTree.concat(arrKids);
  }

  return arrSmTree;
};
export default culcPozxKids;
