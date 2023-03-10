import Token from '../common/token';
import RuntimeError from '../error/runtimeerror';

function checkNumberOperand(operator: Token, operand: any) {
  if (typeof operand === 'number') return true;
  throw new RuntimeError(operator, 'Operand must be a number');
}

function checkNumberOperands(operator: Token, left: any, right: any) {
  if (typeof left === 'number' && typeof right === 'number') return true;
  throw new RuntimeError(operator, 'Operands must be numbers');
}

export {checkNumberOperand, checkNumberOperands};
