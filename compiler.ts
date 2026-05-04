export function compileToBytecode(rules: any[]) {
  const bc: any[] = [];

  for (const r of rules) {
    bc.push({ op: "MATCH", arg: r });
    bc.push({ op: "ALLOW" });
  }

  bc.push({ op: "DENY" });
  return bc;
}