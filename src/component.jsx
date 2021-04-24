import { useState, useEffect } from 'react';
import './App.css';

function Board() {
  const [points, setPoints] = useState([]);
  const [showLines, setShowLines] = useState(true);
  const [showCurves, setShowCurves] = useState(true);
  const [numPoints, setNumPoints] = useState(100);
  const [createNewPoint, setCreateNewPoint] = useState(true);

  const removeCurves = () => {
    setPoints([]);
  }

  const removePoint = (event) => {

  }

  const deCastejauRecursive = (controlPoints, t) => {
    if (controlPoints.length > 1) {
      let nextPoints = [];
      for(let i = 0; i < controlPoints.length-1; i++) {
        nextPoints.push({
          x: (1-t)*controlPoints[i].x + t*controlPoints[i+1].x,
          y: (1-t)*controlPoints[i].y + t*controlPoints[i+1].y
        });
      }
      return deCastejauRecursive(nextPoints, t);
    } else {
      return controlPoints[0];
    }
  }

  const computePoints = (numPoints) => {
    if(points) {
      numPoints--;
      let controlPoints = [];
      if (points.length === 0) {
        return controlPoints;
      } 
      let delta = 1.0/numPoints;
      let t = delta;
      controlPoints.push(points[0]);
      for(let i = 1; i < numPoints; i++) {
        controlPoints.push(deCastejauRecursive(points, t));
        t += delta;
      }
      controlPoints.push(points[points.length-1]);
      return controlPoints;
    }
    return null;
  }

  useEffect(() => {
    const canvas = document.querySelector('#screen');
    const context = canvas.getContext('2d');
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.margin = 'auto';
    context.fillStyle = 'white';
    context.fillRect(0, 0, 1000, 700);

    // desenha os pontos e cria as linhas
    points?.forEach((item, index) => {
      context.beginPath();
      context.arc(item.x, item.y, 4, 0, 2 * Math.PI, true);
      context.moveTo(item.x, item.y);
      context.stroke();
      context.fillStyle = "red";
      context.fill();
      if (points[index + 1] && showLines) {
        context.lineTo(points[index + 1].x, points[index + 1].y);
        context.stroke();
        context.strokeStyle = "black";
        context.fill();
      }
    });

    // desenha a curva
    let curvePoints = computePoints(numPoints);
    curvePoints?.forEach((item, index) => {
      context.beginPath();
      context.moveTo(item.x, item.y);
      context.stroke();
      if (curvePoints[index + 1] && showCurves) {
        context.lineTo(curvePoints[index + 1].x, curvePoints[index + 1].y);
        context.stroke();
        context.strokeStyle = "red";
      }
    });

  }, [points, showLines, numPoints, showCurves]);

  const newPoint = (event) => {
    if (createNewPoint) {
      setPoints([...points, { x: event.clientX , y: event.clientY }]);
    }
  }

  return (
    <canvas id="screen" onClick={(event) => newPoint(event)} />
  );
}

export default Board;
