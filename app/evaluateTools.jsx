'use strict';

import React from 'react';
const _ = require('lodash');

export const isNum = (s) => !isNaN(Number(s));

const EvalTools = {
	convertKeys(keys) {
		const isNegativeNum = s => isNum(s) && Number(s) < 0;
		const isDot = s => s === '.';
		const isMinus = s => s === '-';
		const errors = [];
		const res = keys.reduce((acc, k, i) => {
			if (!acc.length) return [k];
			const prev = _.last(acc);
			if (isNum(k)) {
				if (isNum(prev)) {
					return acc.slice(0, acc.length - 1).concat([prev + k]);
				} else {
					if (isMinus(prev)) {
						const prevPrev = _.last(acc.slice(0, acc.length - 1));
						if (isNum(prevPrev)) {
							return acc.concat([k]);
						} else {
							if (isNegativeNum(k)) {
								errors.push({error: "can't have two successor minuses", index: i});
							}
							return acc.slice(0, acc.length - 1).concat([prev + k]);
						}
					} else {
						return acc.concat([k]);
					}
				}
			} else if (isDot(k)) {
				if (isNum(prev)) {
					return acc.slice(0, acc.length - 1).concat([prev + k]);
				} else if (isDot(prev)) {
					errors.push({error: "can't have two successive dots", index: i});
					return acc.concat([k]);
				} else {
					errors.push({error: "can't have successive dot and operator (.%, .+ etc)", index: i});
					return acc.concat([k]);
				}
			} else {
				if (isNum(prev)) {
					return acc.concat([k]);
				} else {
					errors.push({error: "can't have two 'operations' as successors, i.e. `--`, `+-`, `+.`", index: i});
					return acc.concat([k]);
				}
			}
		}, []);
		return {errors, keys: res};
	},
	intToPost(exp) {
		const priority = {
			'*': 1,
			'/': 1,
			'+': 2,
			'-': 2,
			'%': 2
		};
		let operatorsStack = [];
		let postfix = [];
		exp.forEach((value) => {
			if (isNum(value)) {
				postfix.push(value);
			} else {
				if (operatorsStack.length === 0 || priority[value] <= priority[_.last(operatorsStack)]) {
					operatorsStack.push(value);
				} else {
					postfix = postfix.concat(_.reverse(operatorsStack));
					operatorsStack = [value];
				}
			}
		});
		return postfix.concat(_.reverse(operatorsStack));
	},
	evaluate(exp) { // [2, 3, +] [2, 3, ]
		const operators = {
			'*': (a, b) => a * b,
			'/': (a, b) => a / b,
			'+': (a, b) => a + b,
			'-': (a, b) => a - b,
			'%': (a, b) => a * b / 100
		};
		let stack = [];
		exp.forEach((value) => {
			if (isNum(value)) {
				stack.push(Number(value));
			} else {
				const a = stack[stack.length - 2];
				const b = stack[stack.length - 1];
				stack = stack.slice(0, stack.length - 2);
				stack.push(operators[value](a, b));
			}
		});
		return stack[0];
	}
};

export const validate = (exp, nextValue) => {
	if (isNum(nextValue)) {
		return exp.concat([nextValue]);
	} else {
		const convertExp = EvalTools.convertKeys(exp.concat([nextValue, 1]));
		if (convertExp.errors.length > 0) {
			console.warn(convertExp.errors);
			return exp;
		} else {
			return exp.concat([nextValue]);
		}
	}
};

export default EvalTools;
