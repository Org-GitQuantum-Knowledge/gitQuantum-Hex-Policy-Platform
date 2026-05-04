export type Decision = "ALLOW" | "DENY";

export interface Context {
  subject: Record<string, any>;
  object: Record<string, any>;
  action: string;
}

export class PolicyVM {
  constructor(private bytecode: any[]) {}

  execute(ctx: Context): Decision {
    for (let i = 0; i < this.bytecode.length; i++) {
      const ins = this.bytecode[i];

      switch (ins.op) {
        case "MATCH":
          const r = ins.arg;
          if (!(ctx.subject[r.attribute] && ctx.object.type === r.element && ctx.action === r.perm)) {
            i++;
          }
          break;

        case "ALLOW":
          return "ALLOW";

        case "DENY":
          return "DENY";
      }
    }
    return "DENY";
  }
}