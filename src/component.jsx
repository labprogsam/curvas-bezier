import { useState } from 'react';
import './App.css';

function Board() {
  const [points, setPoints] = useState([]);

  const createLine = (x1, y1, x2, y2) => {
    let distance = Math.sqrt( ((x1-x2) * (x1-x2)) + ((y1-y2) * (y1 - y2)) );

    let xMid = (x1 + x2)/2;
    let yMid = (y1 + y2)/2;

    let salopeInRadian = Math.atan2(y1 - y2, x1 - x2);
    let salopeInDegree = (salopeInRadian  * 180) / Math.PI;

    return ({ width: distance, top: yMid, left: xMid, transform: `rotate(${salopeInDegree}deg)`, backgroundColor: '#000' })
  }

  const newPoint = (event) => {
    setPoints([...points, { x: event.clientX, y: event.clientY }]);
  }

  return (
    <div className="App" onClick={(event) => newPoint(event)}>
      {
        points?.map((item, index) => {
          return (
            <>
              <div
                key={`${item.x}-${item.y}`}
                className={`point ${item.x}-${item.y}`}
                style={{ top: item.y - 8, left: item.x - 8 }}
              />
              {index + 1 < points.length &&
                <div
                  id={`line-${item.x}-${item.y}-${points[index+1].x}-${points[index+1].y}`}
                  style={createLine(item.x, item.y, points[index+1].x, points[index+1].y)}
                />
              }
            </>
          )
        })
      }
    </div>
  );
}

export default Board;
