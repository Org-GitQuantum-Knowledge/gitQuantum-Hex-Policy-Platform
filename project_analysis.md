# HEX Policy Platform - Project Analysis

## Overview
The HEX Policy Platform is a TypeScript monorepo that implements an AST → DAG → Bytecode Policy VM with OPA/Rego benchmarking capabilities.

## Project Structure

### Packages
1. **core** (`packages/core/src/`)
   - `vm.ts`: PolicyVM class that executes bytecode instructions
   - `compiler.ts`: Compiler that converts rules to bytecode
   - `index.ts`: Exports VM and compiler

2. **cli** (`packages/cli/src/`)
   - `index.ts`: Command-line interface entry point

3. **benchmark** (`packages/benchmark/src/`)
   - `run.ts`: Benchmark runner comparing HEX VM vs OPA simulator
   - Runs 100,000 iterations for each engine
   - Returns timing and speedup metrics

4. **opa-sim** (`packages/opa-sim/src/`)
   - `index.ts`: Simplified OPA rule evaluator
   - Mirrors the VM's matching logic for comparison

## Key Components

### PolicyVM
- Executes bytecode with three main operations:
  - `MATCH`: Checks subject attribute, object type, and action permission
  - `ALLOW`: Returns "ALLOW" decision
  - `DENY`: Returns "DENY" decision
- Default decision is "DENY" if no rules match

### Compiler
- Converts policy rules to bytecode format
- Generates MATCH instruction for each rule followed by ALLOW
- Adds final DENY instruction

### Benchmark
- Compares performance between HEX VM and OPA simulator
- Fixed 100,000 iterations per engine
- Returns: `{ hex, opa, speedup: opa / hex }`

## Current Status
- Project structure is minimal but functional
- No individual package.json files (monorepo uses root package.json)
- TypeScript configuration exists at root level
- Jest testing framework configured but no tests visible

## Missing Components
- Individual package.json files for each workspace
- Test files
- Build output directories
- Complete tsconfig.json for each package
- CLI implementation details
- Example usage or documentation

## Next Steps
To fully utilize this project, we need to:
1. Set up proper workspace configuration
2. Create package.json files for each package
3. Build the TypeScript code
4. Run benchmarks
5. Potentially create a visualization dashboard
