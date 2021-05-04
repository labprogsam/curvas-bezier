import React from 'react';
import './Radio.css';

function Radio({ name, value, type, setValue, id }) {
  return (
    <div className="label-input">
      <input type="radio" checked={value === type} onClick={() => setValue(type) } id={id} />
      <label htmlFor={id}>{name}</label>
    </div>
  );
}

export default Radio;
