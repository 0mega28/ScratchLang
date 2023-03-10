import Binary from './binary';
import Grouping from './grouping';
import Literal from './literal';
import Unary from './unary';

interface Visitor<R> {
  visitLiteralExpr(expr: Literal): R;
  visitBinaryExpr(expr: Binary): R;
  visitUnaryExpr(expr: Unary): R;
  visitGroupingExpr(expr: Grouping): R;
}

export default Visitor;
