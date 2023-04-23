import Token from '../common/token';
import RuntimeError from '../error/runtimeerror';

class Environment {
  private values: Map<String, any> = new Map<String, any>();

  define(name: String, value: any): void {
    this.values.set(name, value);
  }

  assign(name: Token, value: any): void {
    const lexeme = name.lexeme;
    if (this.values.has(lexeme)) {
      this.values.set(lexeme, value);
      return;
    }

    throw new RuntimeError(name, `Undefined variable ${lexeme}.`);
  }

  get(name: Token): any {
    const lexeme = name.lexeme;

    if (this.values.has(lexeme)) {
      return this.values.get(lexeme);
    }

    throw new RuntimeError(name, `Undefined variable ${lexeme}.`);
  }
}

export default Environment;
