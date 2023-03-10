import Visitor from './visitorpattern';

abstract class Expr {
  abstract accept<R>(visitor: Visitor<R>): R;
}

export default Expr;
