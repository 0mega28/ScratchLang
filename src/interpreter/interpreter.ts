import Token from '../common/token';
import TokenType from '../common/tokenType';
import {error} from '../error/error';
import RuntimeError from '../error/runtimeerror';
import {
  Expr,
  Literal,
  Binary,
  Unary,
  Grouping,
  ExprVisitor,
} from '../syntaxtree/expr';
import {Expression, Print, Stmt, StmtVisitor} from '../syntaxtree/stmt';
import {checkNumberOperand, checkNumberOperands} from './checkoperands';

class Interpreter implements ExprVisitor<any>, StmtVisitor<void> {
  interpret(statements: Stmt[]): Promise<void> {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
      return Promise.resolve();
    } catch (e) {
      if (e instanceof RuntimeError) {
        const runtimeError = e as RuntimeError;
        error(runtimeError.token.line, runtimeError.message);
        return Promise.reject();
      }
      throw e;
    }
  }
  visitLiteralExpr(expr: Literal): any {
    return expr.value;
  }

  visitBinaryExpr(expr: Binary): any {
    const left: any = this.evaluate(expr.left);
    const right: any = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.PLUS:
        if (typeof left === 'number' && typeof right === 'number')
          return left + right;
        if (
          (typeof left === 'string' && typeof right === 'number') ||
          (typeof left === 'number' && typeof right === 'string') ||
          (typeof left === 'string' && typeof right === 'string')
        )
          return `${left}${right}`;
        throw new RuntimeError(
          expr.operator,
          'Operands must be number or string'
        );

      case TokenType.MINUS:
        checkNumberOperands(expr.operator, left, right);
        return left - right;

      case TokenType.STAR:
        checkNumberOperands(expr.operator, left, right);
        return left * right;

      case TokenType.SLASH:
        checkNumberOperands(expr.operator, left, right);
        if (right === 0)
          throw new RuntimeError(expr.operator, 'division by zero');
        return left / right;

      case TokenType.GREATER:
        checkNumberOperands(expr.operator, left, right);
        return left > right;

      case TokenType.GREATER_EQUAL:
        checkNumberOperands(expr.operator, left, right);
        return left >= right;

      case TokenType.LESS:
        checkNumberOperands(expr.operator, left, right);
        return left < right;

      case TokenType.LESS_EQUAL:
        checkNumberOperands(expr.operator, left, right);
        return left <= right;

      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);

      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
    }
  }

  visitUnaryExpr(expr: Unary): any {
    const right: any = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS:
        checkNumberOperand(expr.operator, right);
        return -right;
      case TokenType.BANG:
        return !this.isTruthy(right);
    }

    throw new Error('shoult not reach here');
  }

  visitGroupingExpr(expr: Grouping): any {
    return this.evaluate(expr.expression);
  }

  visitExpressionStmt(stmt: Expression): void {
    this.evaluate(stmt.expression);
  }
  visitPrintStmt(stmt: Print): void {
    const value: any = this.evaluate(stmt.expression);
    console.log(value);
  }

  evaluate(expr: Expr): any {
    return expr.accept(this);
  }

  execute(statement: Stmt) {
    statement.accept(this);
  }

  isTruthy(object: any) {
    if (object === null || object === undefined) return false;
    if (object instanceof Boolean) return Boolean(object);
    return true;
  }

  isEqual(a: any, b: any): any {
    return a === b;
  }
}

export default Interpreter;
