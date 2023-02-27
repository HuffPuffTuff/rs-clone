import React, { MouseEventHandler } from 'react';
import './toggle.scss';

interface Props {
  value: boolean;
  onChange: MouseEventHandler;
}

const Toggle = ({ value, onChange }: Props) => (
  <label className='toggler' htmlFor="toggler">
    <input
      className='visually-hidden'
      id="toggler"
      type="checkbox"
      onClick={onChange}
      checked={value}
      readOnly
    />
  </label>
);

export default Toggle;