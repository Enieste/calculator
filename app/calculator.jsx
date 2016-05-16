'use strict';

import React from 'react';
import EvalTools, { isNum, validate } from './evaluateTools';
const _ = require('lodash');

const Calculator = React.createClass({
	getInitialState() {
		return {expression: [],
			lastAnswer: 0,
		  answer: undefined}
	},
	cleanAll() {
		this.setState({expression: [], answer: undefined})
	},
	cleanLast() {
		this.setState({expression: this.state.expression.slice(0, this.state.expression.length - 1)})
	},
	addAction(b) {
		const { expression, lastAnswer } = this.state;
		expression.length === 0 ?
		this.setState({answer: undefined}, () => {
			this.setState({expression: expression.concat(isNum(b) ? [b] : isNum(lastAnswer) ? [lastAnswer.toString(), b] : [b])})
		})
		: this.setState({expression: validate(expression, b)});
	},
	lastAnswer() {
		this.setState({expression: this.state.expression.concat([this.state.lastAnswer.toString()])});
	},
	calculate() {
		const convertedExpression = EvalTools.convertKeys(this.state.expression);
		// todo errors check
		console.warn(convertedExpression.errors)
		const postfix = EvalTools.intToPost(convertedExpression.keys);
		this.setState({expression: [], answer: EvalTools.evaluate(postfix)},
			() => this.setState({lastAnswer: this.state.answer}));
	},
	render() {
		const buttons = [{name: 'AC',
			function: this.cleanAll},
			{name: 'CE',
				function: this.cleanLast},
			{name: '%',
				function: this.addAction},
			{name: '/',
				function: this.addAction},
			{name: '7',
				function: this.addAction},
			{name: '8',
				function: this.addAction},
			{name: '9',
				function: this.addAction},
			{name: '*',
				function: this.addAction},
			{name: '4',
				function: this.addAction},
			{name: '5',
				function: this.addAction},
			{name: '6',
				function: this.addAction},
			{name: '-',
				function: this.addAction},
			{name: '1',
				function: this.addAction},
			{name: '2',
				function: this.addAction},
			{name: '3',
				function: this.addAction},
			{name: '+',
				function: this.addAction},
			{name: '.',
				function: this.addAction},
			{name: '0',
				function: this.addAction},
			{name: 'Ans',
				function: this.lastAnswer},
			{name: '=',
				function: this.calculate}
		];
		return <div className="calculator">
			<input className="display" value={this.state.answer || this.state.expression.join('')} type="text" readOnly />
			<div className="buttons">
				{buttons.map((button) => {
						return <div key={button.name} className="button" onClick={() => button.function(button.name)}>{button.name}</div>
					}
				)}
			</div>
		</div>
	}
});

export default Calculator;
