import { BObject } from "./object";

export class Environment {
  store: Record<string, BObject> = {};
  outer?: Environment;
  prints: string[] = [];
  constructor(outer?: Environment) { 
    this.outer = outer; 
    if (outer) this.prints = outer.prints; // share prints
  }
  get(name: string): BObject | undefined {
    const obj = this.store[name];
    if (obj === undefined && this.outer) return this.outer.get(name);
    return obj;
  }
  set(name: string, val: BObject): BObject {
    this.store[name] = val;
    return val;
  }
}

export function newEnvironment(): Environment {
  return new Environment();
}

export function newEnclosedEnvironment(outer: Environment): Environment {
  const env = new Environment(outer);
  return env;
}
