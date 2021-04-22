import { useState, useEffect } from 'react';
import './App.css';

function Board() {
  const [points, setPoints] = useState([]);
  const [showLines, setShowLines] = useState(true);

  const newPoint = (event) => {
    setPoints([...points, { x: event.clientX , y: event.clientY }])
  }

  useEffect(() => {
    const canvas = document.querySelector('#screen');
    const context = canvas.getContext('2d');
  
    canvas.width = 1000;
    canvas.height = 700;
    canvas.style.margin = 'auto';
    context.fillStyle = 'white';
    context.fillRect(0, 0, 1000, 700);

    // desenha os pontos e cria as linhas
    points?.forEach((item, index) => {
      context.beginPath();
      context.arc(item.x, item.y, 4, 0, 2 * Math.PI, true);
      context.moveTo(item.x, item.y);
      context.stroke();
      if (points[index + 1] && showLines) {
        context.lineTo(points[index + 1].x, points[index + 1].y);
        context.stroke();
      }
    });

  }, [points, showLines]);

  return (
    <canvas id="screen" onClick={(event) => newPoint(event)} />
  );
}

export default Board;
