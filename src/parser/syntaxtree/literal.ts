import Expr from './expr';
import Visitor from '../visitorpattern';

type literalType = string | number | boolean | null;

class Literal extends Expr {
  value: literalType;

  constructor(value: literalType) {
    super();
    this.value = value;
  }
  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitLiteralExpr(this);
  }
}

export default Literal;
export {literalType};
