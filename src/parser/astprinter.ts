import Binary from './syntaxtree/binary';
import Expr from './syntaxtree/expr';
import Grouping from './syntaxtree/grouping';
import Literal from './syntaxtree/literal';
import Unary from './syntaxtree/unary';
import Visitor from './visitorpattern';

class AstPrinter implements Visitor<string> {
  print(expr: Expr): string {
    return expr.accept(this);
  }

  visitLiteralExpr(expr: Literal): string {
    if (expr.value === null) return 'nil';
    return expr.value.toString();
  }
  visitBinaryExpr(expr: Binary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }
  visitUnaryExpr(expr: Unary): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }
  visitGroupingExpr(expr: Grouping): string {
    return this.parenthesize('group', expr.expression);
  }

  private parenthesize(name: string, ...exprs: Expr[]): string {
    const builderArray: string[] = [];
    builderArray.push('(');
    builderArray.push(name);

    for (const expr of exprs) {
      builderArray.push(' ');
      builderArray.push(expr.accept(this));
    }
    builderArray.push(')');

    return builderArray.join('');
  }
}

export default AstPrinter;
