import { useState, useEffect } from 'react';
import Checkbox from './Checkbox';
import Radio from './Radio';
import './App.css';

function Board() {
  const [curves, setCurves] = useState([{ points: [], computedPoints: [] }]);
  const [selectedCurve, setSelectedCurve] = useState(0);
  const [showPoints, setShowPoints] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [showCurves, setShowCurves] = useState(true);
  const [currentNumPoints, setCurrentNumPoints] = useState(30);
  const [numPoints, setNumPoints] = useState(30);
  const [onMoving, setOnMoving] = useState(false);
  const [action, setAction] = useState('create');

  const newPoint = (event, update) => {
    if (action === 'create') {
      let oldPoints = curves[selectedCurve].points;
      const newArray = curves;
      if (!update) oldPoints = [...oldPoints, { x: event.clientX - 250 , y: event.clientY }];
      let computedPoints = computePoints(numPoints, oldPoints);
      newArray[selectedCurve] = { points: oldPoints, computedPoints };
      setCurves([...newArray]);
    }
  }

  const removePoint = (event) => {
    const checkInterval = (coord) => {
      return (event.clientX - 250 <= coord.x + 20 && event.clientX - 250 >= coord.x - 20) && (event.clientY <= coord.y + 20 && event.clientY >= coord.y - 20);
    }

    if(action === 'remove') {
      let oldPoints = curves[selectedCurve].points;
      const newArray = curves;
      const index = oldPoints.findIndex((coord) => {
        return checkInterval(coord);
      });
      if (index !== -1) {
        oldPoints.splice(index, 1);
        let computedPoints = computePoints(numPoints, oldPoints);
        newArray[selectedCurve] = { points: oldPoints, computedPoints };
        setCurves([...newArray]);
      }
    }
  }

  const movePoint = (event) => {
    const checkInterval = (coord) => {
      return (event.clientX - 250 <= coord.x + 20 && event.clientX - 250 >= coord.x - 20) && (event.clientY <= coord.y + 20 && event.clientY >= coord.y - 20);
    }

    if(action === 'move') {
      let oldPoints = curves[selectedCurve].points;
      const newArray = curves;
      const index = oldPoints.findIndex((coord) => {
        return checkInterval(coord);
      });
      if (index !== -1) {
        if (onMoving) {
          oldPoints.splice(index, 1, { x: event.clientX - 250, y: event.clientY });
          let computedPoints = computePoints(numPoints, oldPoints);
          newArray[selectedCurve] = { points: oldPoints, computedPoints };
          setCurves([...newArray]);
        }
      }
    }
  }

  const removeCurve = () => {
    let newCurves = curves;
    newCurves.splice(selectedCurve, 1);
    if (newCurves.length > 0) {
      setCurves([...newCurves]);
      setSelectedCurve(selectedCurve -1);
    } else {
      setCurves([{ points: [], computedPoints: [] }])
    }
  }

  const addNewCurve = () => {
    setCurves([...curves, { points: [], computedPoints: [] }]);
    changeCurve(curves.length);
  }

  const changeCurve = (num) => {
    setSelectedCurve(num);
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

  const computePoints = (numPoints, points) => {
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
  
    canvas.width = window.innerWidth - 250;
    canvas.height = window.innerHeight;
    canvas.style.margin = 'auto';
    context.fillStyle = 'white';
    context.fillRect(0, 0, 1000, 700);

    curves?.forEach((item, i) => {
      // desenha os pontos e cria as linhas
      item.points?.forEach((coord, index) => {
        context.beginPath();
        if (showPoints) {
          context.arc(coord.x, coord.y, 4, 0, 2 * Math.PI, true);
        }
        context.moveTo(coord.x, coord.y);
        context.stroke();
        if (i != selectedCurve) {
          context.fillStyle = "gray";
        } else {
          context.fillStyle = "red";
        }
        context.fill();
        if (item.points[index + 1] && showLines) {
          context.lineTo(item.points[index + 1].x, item.points[index + 1].y);
          context.stroke();
          context.fill();
        }
      });

      // desenha a curva
      item.computedPoints?.forEach((coord, index) => {
        context.beginPath();
        context.moveTo(coord.x, coord.y);
        context.stroke();
        if (item.computedPoints[index + 1] && showCurves) {
          context.lineTo(item.computedPoints[index + 1].x, item.computedPoints[index + 1].y);
          context.stroke();
          context.fill();
        }
      });
    });

  }, [showLines, showCurves, curves, selectedCurve, showPoints]);

  useEffect(() => {
    newPoint(null, true)
  },[numPoints]);

  return (
    <div className="canvas-nav">
      <nav className="nav">
        <button onClick={() => addNewCurve()}>Adicionar nova curva</button>
        
        <label htmlFor="avaliacoes" >Avaliações</label>
        <input id="avaliacoes" type="number" value={currentNumPoints} onChange={(e) => setCurrentNumPoints(e.target.value)} />
        <button type="button" onClick={() => setNumPoints(currentNumPoints) }>Set</button>

        <label htmlFor={'select-curve'}>Selecione a curva</label>
        <select id="select-curve" onChange={(event) => changeCurve(event.target.value)} value={selectedCurve}>
          {curves?.map((item, index) => (
            <option value={index} >{index}</option>
          ))}
        </select>

        <Radio name="Remover ponto" id="radio-remove" type="remove" value={action} setValue={setAction} />
        <Radio name="Criar ponto" id="radio-create" type="create" value={action} setValue={setAction} />
        <Radio name="Mover ponto" id="radio-move" type="move" value={action} setValue={setAction} />
        <button type="button" onClick={() => removeCurve()}>Remover curva</button>

        <p>Flags</p>
        <Checkbox name="Pontos de Controle" id="radio-show-points" value={showPoints} setValue={setShowPoints} />
        <Checkbox name="Poligonais de Controle" id="radio-show-poligon" value={showLines} setValue={setShowLines} />
        <Checkbox name="Curvas" id="radio-show-curves" value={showCurves} setValue={setShowCurves} />
      </nav>

      <canvas onMouseDown={() => setOnMoving(true)} onMouseMove={(e) => movePoint(e)} onMouseUp={() => setOnMoving(false)} id="screen" onClick={(event) => action === 'create' ? newPoint(event) : removePoint(event)} />
    </div>
  );
}

export default Board;
