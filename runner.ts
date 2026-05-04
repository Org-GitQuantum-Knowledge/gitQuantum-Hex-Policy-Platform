import { performance } from "perf_hooks";
import { PolicyVM } from "@hex/core";
import { compileToBytecode } from "@hex/core";
import { opaEvaluate } from "@hex/opa-sim";

export interface BenchmarkResult {
  hexTime: number;
  opaTime: number;
  speedup: number;
  iterations: number;
  timestamp: Date;
}

export interface BenchmarkConfig {
  iterations?: number;
  ruleCount?: number;
  warmup?: boolean;
}

export class BenchmarkRunner {
  private iterations: number;
  private ruleCount: number;
  private warmup: boolean;

  constructor(config: BenchmarkConfig = {}) {
    this.iterations = config.iterations || 100000;
    this.ruleCount = config.ruleCount || 10;
    this.warmup = config.warmup !== false;
  }

  private generateRules(count: number): any[] {
    const rules = [];
    for (let i = 0; i < count; i++) {
      rules.push({
        attribute: `attr_${i % 5}`,
        element: `element_${i % 3}`,
        perm: `perm_${i % 4}`
      });
    }
    return rules;
  }

  private generateContext(ruleIndex: number): any {
    return {
      subject: {
        attr_0: "value_0",
        attr_1: "value_1",
        attr_2: "value_2",
        attr_3: "value_3",
        attr_4: "value_4"
      },
      object: {
        type: `element_${ruleIndex % 3}`
      },
      action: `perm_${ruleIndex % 4}`
    };
  }

  run(): BenchmarkResult {
    const rules = this.generateRules(this.ruleCount);
    const bytecode = compileToBytecode(rules);
    const vm = new PolicyVM(bytecode);

    // Warmup phase
    if (this.warmup) {
      const warmupCtx = this.generateContext(0);
      for (let i = 0; i < 1000; i++) {
        vm.execute(warmupCtx);
        opaEvaluate(rules, warmupCtx);
      }
    }

    // HEX VM benchmark
    let hexTime = performance.now();
    for (let i = 0; i < this.iterations; i++) {
      const ctx = this.generateContext(i % this.ruleCount);
      vm.execute(ctx);
    }
    hexTime = performance.now() - hexTime;

    // OPA simulator benchmark
    let opaTime = performance.now();
    for (let i = 0; i < this.iterations; i++) {
      const ctx = this.generateContext(i % this.ruleCount);
      opaEvaluate(rules, ctx);
    }
    opaTime = performance.now() - opaTime;

    return {
      hexTime,
      opaTime,
      speedup: opaTime / hexTime,
      iterations: this.iterations,
      timestamp: new Date()
    };
  }

  runMultiple(runs: number): BenchmarkResult[] {
    const results: BenchmarkResult[] = [];
    for (let i = 0; i < runs; i++) {
      results.push(this.run());
    }
    return results;
  }

  static formatResult(result: BenchmarkResult): string {
    return `
HEX Policy VM Benchmark Results
================================
Iterations:     ${result.iterations.toLocaleString()}
HEX Time:       ${result.hexTime.toFixed(2)}ms
OPA Time:       ${result.opaTime.toFixed(2)}ms
Speedup:        ${result.speedup.toFixed(2)}x
Timestamp:      ${result.timestamp.toISOString()}
    `.trim();
  }

  static formatMultipleResults(results: BenchmarkResult[]): string {
    const avgHexTime = results.reduce((sum, r) => sum + r.hexTime, 0) / results.length;
    const avgOpaTime = results.reduce((sum, r) => sum + r.opaTime, 0) / results.length;
    const avgSpeedup = results.reduce((sum, r) => sum + r.speedup, 0) / results.length;

    return `
HEX Policy VM Benchmark Results (${results.length} runs)
=======================================================
Avg HEX Time:   ${avgHexTime.toFixed(2)}ms
Avg OPA Time:   ${avgOpaTime.toFixed(2)}ms
Avg Speedup:    ${avgSpeedup.toFixed(2)}x
Min Speedup:    ${Math.min(...results.map(r => r.speedup)).toFixed(2)}x
Max Speedup:    ${Math.max(...results.map(r => r.speedup)).toFixed(2)}x
    `.trim();
  }
}
