class BenchmarkApp {
    constructor() {
        this.isRunning = false;
        this.initEventListeners();
        this.updateUI();
        this.subscribeToDataChanges();
    }

    initEventListeners() {
        document.getElementById('runBenchmarkBtn').addEventListener('click', () => this.runBenchmark());
        document.getElementById('clearDataBtn').addEventListener('click', () => this.clearData());
    }

    subscribeToDataChanges() {
        dataManager.subscribe(() => {
            this.updateUI();
            chartManager.updateCharts(dataManager.getResults());
        });
    }

    async runBenchmark() {
        if (this.isRunning) return;

        this.isRunning = true;
        const btn = document.getElementById('runBenchmarkBtn');
        btn.disabled = true;
        btn.textContent = 'Running...';

        try {
            const ruleCount = parseInt(document.getElementById('ruleCountSelect').value);
            const result = await this.simulateBenchmark(ruleCount);
            dataManager.addResult(result);
            this.updateTable();
        } catch (error) {
            console.error('Benchmark failed:', error);
            alert('Benchmark failed: ' + error.message);
        } finally {
            this.isRunning = false;
            btn.disabled = false;
            btn.textContent = 'Run Benchmark';
        }
    }

    async simulateBenchmark(ruleCount) {
        const baseHexTime = 10 + (ruleCount * 0.5);
        const baseOpaTime = 8 + (ruleCount * 0.4);
        
        const hexVariance = (Math.random() - 0.5) * 2;
        const opaVariance = (Math.random() - 0.5) * 2;
        
        const hexTime = Math.max(1, baseHexTime + hexVariance);
        const opaTime = Math.max(1, baseOpaTime + opaVariance);
        
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            hexTime: parseFloat(hexTime.toFixed(2)),
            opaTime: parseFloat(opaTime.toFixed(2)),
            speedup: parseFloat((opaTime / hexTime).toFixed(4)),
            ruleCount: ruleCount
        };
    }

    updateUI() {
        const latest = dataManager.getLatestResult();
        const results = dataManager.getResults();

        if (latest) {
            document.getElementById('hexTimeValue').textContent = latest.hexTime.toFixed(2);
            document.getElementById('opaTimeValue').textContent = latest.opaTime.toFixed(2);
            document.getElementById('speedupValue').textContent = latest.speedup.toFixed(2);
        }

        document.getElementById('runsValue').textContent = results.length;
        chartManager.updateCharts(results);
    }

    updateTable() {
        const tbody = document.getElementById('resultsTableBody');
        const results = dataManager.getResults();

        tbody.innerHTML = results.map((result) => `
            <tr>
                <td>${result.id}</td>
                <td>${result.hexTime.toFixed(2)}</td>
                <td>${result.opaTime.toFixed(2)}</td>
                <td>${result.speedup.toFixed(4)}</td>
                <td>${result.ruleCount}</td>
                <td>${new Date(result.timestamp).toLocaleString()}</td>
            </tr>
        `).join('');
    }

    clearData() {
        if (confirm('Are you sure you want to clear all benchmark data?')) {
            dataManager.clearResults();
            this.updateTable();
            document.getElementById('hexTimeValue').textContent = '--';
            document.getElementById('opaTimeValue').textContent = '--';
            document.getElementById('speedupValue').textContent = '--';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new BenchmarkApp();
    
    const results = dataManager.getResults();
    if (results.length > 0) {
        const tableBody = document.getElementById('resultsTableBody');
        tableBody.innerHTML = results.map((result) => `
            <tr>
                <td>${result.id}</td>
                <td>${result.hexTime.toFixed(2)}</td>
                <td>${result.opaTime.toFixed(2)}</td>
                <td>${result.speedup.toFixed(4)}</td>
                <td>${result.ruleCount}</td>
                <td>${new Date(result.timestamp).toLocaleString()}</td>
            </tr>
        `).join('');
    }
});
