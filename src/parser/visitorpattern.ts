import Binary from './syntaxtree/binary';
import Grouping from './syntaxtree/grouping';
import Literal from './syntaxtree/literal';
import Unary from './syntaxtree/unary';

interface Visitor<R> {
  visitLiteralExpr(expr: Literal): R;
  visitBinaryExpr(expr: Binary): R;
  visitUnaryExpr(expr: Unary): R;
  visitGroupingExpr(expr: Grouping): R;
}

export default Visitor;
