import React from 'react';
import './Checkbox.css';

function Checkbox({ name, value, setValue, id }) {
  return (
    <div className="label-input">
      <input type="checkbox" checked={value} onChange={(e) => setValue(e.target.checked) } id={id} />
      <label htmlFor={id}>{name}</label>
    </div>
  );
}

export default Checkbox;
