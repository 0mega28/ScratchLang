import {
  Expr,
  Literal,
  Binary,
  Unary,
  Grouping,
  ExprVisitor,
  Variable,
  Assignment,
} from '../syntaxtree/expr';

class AstPrinter implements ExprVisitor<string> {
  print(expr: Expr): Promise<string> {
    return Promise.resolve(expr.accept(this));
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
  visitVariableExpression(expr: Variable): string {
    return this.parenthesize(`variable ${expr.name}`);
  }
  visitAssignmentExpression(expr: Assignment): string {
    return this.parenthesize(`assignment ${expr.name}`, expr.value);
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
