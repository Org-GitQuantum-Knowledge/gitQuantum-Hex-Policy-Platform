# HEX Policy Platform - Complete Documentation

## Overview

The HEX Policy Platform is a high-performance policy evaluation system that compiles policy rules into bytecode and executes them through a custom virtual machine. This documentation covers the complete architecture, usage, and benchmarking capabilities of the platform.

## Architecture

### System Design

The HEX Policy Platform follows a three-stage compilation and execution pipeline:

1. **AST (Abstract Syntax Tree)**: Policy rules are parsed into an abstract representation
2. **DAG (Directed Acyclic Graph)**: Rules are optimized into a dependency graph
3. **Bytecode**: The DAG is compiled into efficient bytecode instructions

This architecture enables both high-performance execution and compile-time optimizations.

### Core Components

#### PolicyVM (`packages/core/src/vm.ts`)

The PolicyVM is the runtime engine that executes compiled bytecode. It maintains a simple but efficient instruction set:

- **MATCH**: Tests whether a rule matches the current context
- **ALLOW**: Returns an ALLOW decision
- **DENY**: Returns a DENY decision

The VM executes bytecode sequentially, returning the first matching decision or DENY if no rules match.

#### Compiler (`packages/core/src/compiler.ts`)

The compiler transforms policy rules into bytecode format. Each rule generates:

1. A MATCH instruction with the rule's matching criteria
2. An ALLOW instruction if the rule matches
3. A final DENY instruction as the default policy

#### OPA Simulator (`packages/opa-sim/src/index.ts`)

A simplified rule evaluator that mimics OPA (Open Policy Agent) behavior for benchmarking comparison. It linearly scans rules and returns ALLOW on the first match, otherwise DENY.

#### Benchmark Suite (`packages/benchmark/src/`)

The benchmark suite provides comprehensive performance analysis:

- **BenchmarkRunner**: Configurable benchmark executor with warmup support
- **Metrics**: Execution time, speedup factor, and stability analysis
- **Multiple configurations**: Varying rule counts and iteration counts

## Installation and Setup

### Prerequisites

- Node.js 18+ with npm
- TypeScript 5.0+
- Git

### Installation Steps

```bash
# Clone or extract the repository
cd hex-policy-platform

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Execute benchmarks
npm run bench
```

## Usage

### Basic Policy Evaluation

```typescript
import { PolicyVM, compileToBytecode } from '@hex/core';

// Define policy rules
const rules = [
  {
    attribute: 'role',
    element: 'document',
    perm: 'read'
  },
  {
    attribute: 'role',
    element: 'document',
    perm: 'write'
  }
];

// Compile rules to bytecode
const bytecode = compileToBytecode(rules);

// Create VM instance
const vm = new PolicyVM(bytecode);

// Evaluate context
const context = {
  subject: { role: 'admin' },
  object: { type: 'document' },
  action: 'read'
};

const decision = vm.execute(context); // Returns 'ALLOW' or 'DENY'
```

### Running Benchmarks

```typescript
import { BenchmarkRunner } from '@hex/benchmark';

// Create runner with configuration
const runner = new BenchmarkRunner({
  iterations: 100000,
  ruleCount: 20,
  warmup: true
});

// Run single benchmark
const result = runner.run();
console.log(BenchmarkRunner.formatResult(result));

// Run multiple benchmarks for stability analysis
const results = runner.runMultiple(5);
console.log(BenchmarkRunner.formatMultipleResults(results));
```

## Testing

The project includes comprehensive test coverage for all core components:

### Running Tests

```bash
npm test
```

### Test Coverage

- **VM Tests**: 5 test cases covering basic execution, rule matching, and edge cases
- **Compiler Tests**: 4 test cases validating bytecode generation
- **OPA Simulator Tests**: 5 test cases ensuring compatibility with VM behavior

Current coverage: **96.29% statement coverage**, **100% function coverage**

## Benchmarking

### Benchmark Configurations

The benchmark suite supports multiple configurations:

| Configuration | Rules | Iterations | Purpose |
|---|---|---|---|
| Small | 5 | 10,000 | Quick validation |
| Medium | 10 | 50,000 | Standard performance |
| Large | 20 | 100,000 | Stress testing |
| Very Large | 50 | 100,000 | Extreme scenarios |

### Benchmark Metrics

Each benchmark run produces:

- **HEX Time**: Total execution time for HEX VM (milliseconds)
- **OPA Time**: Total execution time for OPA simulator (milliseconds)
- **Speedup**: Ratio of OPA time to HEX time (values > 1 indicate HEX is faster)
- **Iterations**: Number of policy evaluations performed

### Running Benchmarks

```bash
# Run default benchmark suite
npm run bench

# Results include:
# - Small, medium, and large configurations
# - Stability analysis with 5 runs
# - JSON export of all results
```

## Performance Characteristics

### Current Performance

Based on benchmark results with the current implementation:

- **Small rule sets (5 rules)**: ~10ms for 10,000 iterations
- **Medium rule sets (10 rules)**: ~15ms for 50,000 iterations
- **Large rule sets (20 rules)**: ~30ms for 100,000 iterations

### Performance Factors

Performance is influenced by:

1. **Rule Count**: More rules increase matching time
2. **Context Complexity**: Complex subject/object attributes affect matching
3. **Match Position**: Rules matching early in the set execute faster
4. **VM Overhead**: Bytecode interpretation adds constant overhead

## Benchmark Dashboard

An interactive web dashboard is available for visualizing benchmark results:

### Features

- Real-time benchmark execution
- Interactive charts and metrics
- Historical data persistence
- Multiple visualization types
- Responsive design

### Accessing the Dashboard

The dashboard is available at: `https://8000-iv1bh3bp4dy9g0htzp379-d320355b.us2.manus.computer`

### Dashboard Components

1. **Metric Cards**: Display latest performance metrics
2. **Execution Time Chart**: Line chart of HEX vs OPA times
3. **Speedup Chart**: Trend analysis of speedup factor
4. **Rule Count Chart**: Performance by rule count
5. **Distribution Chart**: Ratio visualization
6. **Results Table**: Detailed benchmark data

## Project Structure

```
hex-policy-platform/
├── packages/
│   ├── core/                 # Core VM and compiler
│   │   ├── src/
│   │   │   ├── vm.ts        # PolicyVM implementation
│   │   │   ├── compiler.ts  # Rule compiler
│   │   │   ├── vm.test.ts   # VM tests
│   │   │   └── compiler.test.ts
│   │   └── tsconfig.json
│   ├── opa-sim/             # OPA simulator
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── index.test.ts
│   │   └── tsconfig.json
│   ├── benchmark/           # Benchmark suite
│   │   ├── src/
│   │   │   ├── run.ts       # Main benchmark runner
│   │   │   └── runner.ts    # BenchmarkRunner class
│   │   └── tsconfig.json
│   └── cli/                 # Command-line interface
│       ├── src/
│       │   └── index.ts
│       └── tsconfig.json
├── tsconfig.json            # Root TypeScript config
├── tsconfig.base.json       # Base compiler options
├── package.json             # Root package manifest
├── jest.config.js           # Jest testing config
└── README.md
```

## Development

### Building

```bash
# Build all packages
npm run build

# Build output goes to packages/*/dist/
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

### Adding New Rules

To extend the policy system:

1. Define rule structure in the compiler
2. Add matching logic to the VM
3. Add corresponding tests
4. Update benchmark configurations

## Performance Optimization

### Current Optimizations

- Bytecode compilation reduces interpretation overhead
- Linear rule scanning minimizes memory access patterns
- Warmup phase in benchmarks eliminates JIT compilation noise

### Future Optimization Opportunities

- Rule indexing by attribute for faster matching
- Bytecode caching and memoization
- SIMD operations for batch evaluation
- Parallel rule evaluation for independent rules

## Troubleshooting

### Build Errors

**Error**: `Cannot find module '@hex/opa-sim'`

**Solution**: Ensure npm install completed successfully and workspace packages are properly linked.

### Test Failures

**Error**: Jest tests not running

**Solution**: Verify @types/jest is installed: `npm install --save-dev @types/jest`

### Benchmark Issues

**Error**: Benchmark produces inconsistent results

**Solution**: Ensure warmup phase is enabled and system load is minimal during testing.

## Contributing

When contributing to the HEX Policy Platform:

1. Maintain test coverage above 90%
2. Follow TypeScript strict mode requirements
3. Add benchmarks for performance-critical changes
4. Update documentation for new features

## License

HEX Policy Platform - Open Source

## Support

For issues, questions, or contributions, please refer to the project repository.

## Changelog

### Version 1.0.0

- Initial release with core VM and compiler
- Comprehensive test suite with 96%+ coverage
- Enhanced benchmark suite with multiple configurations
- Interactive web dashboard for visualization
- Full TypeScript support with strict mode
- OPA simulator for performance comparison
