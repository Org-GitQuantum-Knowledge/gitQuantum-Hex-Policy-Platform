#!/usr/bin/env node
import { BenchmarkRunner } from "./runner";

async function main() {
  console.log("Starting HEX Policy VM Benchmark Suite...\n");

  // Run benchmarks with different configurations
  const configs = [
    { iterations: 10000, ruleCount: 5, label: "Small (5 rules)" },
    { iterations: 50000, ruleCount: 10, label: "Medium (10 rules)" },
    { iterations: 100000, ruleCount: 20, label: "Large (20 rules)" }
  ];

  for (const config of configs) {
    console.log(`\n--- Benchmark: ${config.label} ---`);
    const runner = new BenchmarkRunner({
      iterations: config.iterations,
      ruleCount: config.ruleCount,
      warmup: true
    });

    const result = runner.run();
    console.log(BenchmarkRunner.formatResult(result));
  }

  // Run multiple iterations for stability analysis
  console.log("\n\n--- Stability Analysis (5 runs with 50k iterations, 10 rules) ---");
  const stableRunner = new BenchmarkRunner({
    iterations: 50000,
    ruleCount: 10,
    warmup: true
  });

  const results = stableRunner.runMultiple(5);
  console.log(BenchmarkRunner.formatMultipleResults(results));

  // Export results as JSON
  console.log("\n\n--- Results JSON ---");
  console.log(JSON.stringify({ benchmarks: results }, null, 2));
}

main().catch(console.error);
