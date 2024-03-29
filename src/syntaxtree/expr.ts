import Token from '../common/token';

abstract class Expr {
  abstract accept<R>(ExprVisitor: ExprVisitor<R>): R;
}

interface ExprVisitor<R> {
  visitLiteralExpr(expr: Literal): R;
  visitBinaryExpr(expr: Binary): R;
  visitUnaryExpr(expr: Unary): R;
  visitGroupingExpr(expr: Grouping): R;
  visitVariableExpression(expr: Variable): R;
  visitAssignmentExpression(expr: Assignment): R;
}

class Unary extends Expr {
  operator: Token;
  right: Expr;

  constructor(operator: Token, right: Expr) {
    super();
    this.operator = operator;
    this.right = right;
  }
  accept<R>(ExprVisitor: ExprVisitor<R>): R {
    return ExprVisitor.visitUnaryExpr(this);
  }
}

type literalType = string | number | boolean | null;
class Literal extends Expr {
  value: literalType;

  constructor(value: literalType) {
    super();
    this.value = value;
  }
  accept<R>(ExprVisitor: ExprVisitor<R>): R {
    return ExprVisitor.visitLiteralExpr(this);
  }
}

class Grouping extends Expr {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }
  accept<R>(ExprVisitor: ExprVisitor<R>): R {
    return ExprVisitor.visitGroupingExpr(this);
  }
}

class Binary extends Expr {
  left: Expr;
  operator: Token;
  right: Expr;

  constructor(left: Expr, operator: Token, right: Expr) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept<R>(ExprVisitor: ExprVisitor<R>): R {
    return ExprVisitor.visitBinaryExpr(this);
  }
}

class Variable extends Expr {
  name: Token;

  constructor(name: Token) {
    super();
    this.name = name;
  }

  accept<R>(ExprVisitor: ExprVisitor<R>): R {
    return ExprVisitor.visitVariableExpression(this);
  }
}

class Assignment extends Expr {
  name: Token;
  value: Expr;

  constructor(name: Token, value: Expr) {
    super();
    this.name = name;
    this.value = value;
  }

  accept<R>(ExprVisitor: ExprVisitor<R>): R {
    throw ExprVisitor.visitAssignmentExpression(this);
  }
}

export {
  Expr,
  Unary,
  Binary,
  Grouping,
  Literal,
  literalType,
  ExprVisitor,
  Variable,
  Assignment,
};
