import React, { useState } from 'react';
import { SearchPropsType } from '../../types/types';
import './search.scss';

export function Search(props: SearchPropsType) {
  return (
    <div className='search-block'>
      <input
        className="search-block__field field field--search"
        type="text"
        placeholder="Search"
        value={props.value}
        onChange={props.handleChange}
      />
      <button
        className='search-block__clean'
        onClick={props.clearInput}
      >
        x
      </button>
    </div>
  );
}
