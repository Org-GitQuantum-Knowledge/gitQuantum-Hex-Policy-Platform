class BenchmarkDataManager {
    constructor() {
        this.results = this.loadFromStorage() || [];
        this.listeners = [];
    }

    addResult(result) {
        const enrichedResult = {
            ...result,
            id: this.results.length + 1,
            timestamp: new Date().toISOString()
        };
        this.results.push(enrichedResult);
        this.saveToStorage();
        this.notifyListeners();
        return enrichedResult;
    }

    getResults() {
        return this.results;
    }

    getLatestResult() {
        return this.results[this.results.length - 1] || null;
    }

    getResultsByRuleCount(ruleCount) {
        return this.results.filter(r => r.ruleCount === ruleCount);
    }

    getAverageMetrics() {
        if (this.results.length === 0) {
            return { hexTime: 0, opaTime: 0, speedup: 0 };
        }

        const sum = this.results.reduce(
            (acc, r) => ({
                hexTime: acc.hexTime + r.hexTime,
                opaTime: acc.opaTime + r.opaTime,
                speedup: acc.speedup + r.speedup
            }),
            { hexTime: 0, opaTime: 0, speedup: 0 }
        );

        return {
            hexTime: sum.hexTime / this.results.length,
            opaTime: sum.opaTime / this.results.length,
            speedup: sum.speedup / this.results.length
        };
    }

    getMetricsByRuleCount() {
        const grouped = {};
        this.results.forEach(result => {
            const key = result.ruleCount;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(result);
        });

        const metrics = {};
        Object.keys(grouped).forEach(ruleCount => {
            const results = grouped[ruleCount];
            const sum = results.reduce(
                (acc, r) => ({
                    hexTime: acc.hexTime + r.hexTime,
                    opaTime: acc.opaTime + r.opaTime,
                    speedup: acc.speedup + r.speedup
                }),
                { hexTime: 0, opaTime: 0, speedup: 0 }
            );
            metrics[ruleCount] = {
                hexTime: sum.hexTime / results.length,
                opaTime: sum.opaTime / results.length,
                speedup: sum.speedup / results.length,
                count: results.length
            };
        });

        return metrics;
    }

    clearResults() {
        this.results = [];
        this.saveToStorage();
        this.notifyListeners();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.results));
    }

    saveToStorage() {
        try {
            localStorage.setItem('hex_benchmark_results', JSON.stringify(this.results));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem('hex_benchmark_results');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            return null;
        }
    }

    exportAsJSON() {
        return JSON.stringify(this.results, null, 2);
    }

    exportAsCSV() {
        if (this.results.length === 0) return '';

        const headers = ['ID', 'HEX Time (ms)', 'OPA Time (ms)', 'Speedup', 'Rules', 'Timestamp'];
        const rows = this.results.map(r => [
            r.id,
            r.hexTime.toFixed(2),
            r.opaTime.toFixed(2),
            r.speedup.toFixed(4),
            r.ruleCount,
            r.timestamp
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        return csv;
    }
}

const dataManager = new BenchmarkDataManager();
