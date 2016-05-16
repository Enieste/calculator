import Calculator from './app/calculator'
import React from 'react';
import ReactDOM from 'react-dom';
import './app/main.css';

var div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render(<Calculator/>, div);
