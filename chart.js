class ChartManager {
    constructor() {
        this.charts = {};
        this.initCharts();
    }

    initCharts() {
        this.createTimeChart();
        this.createSpeedupChart();
        this.createRuleCountChart();
        this.createDistributionChart();
    }

    createTimeChart() {
        const ctx = document.getElementById('timeChart').getContext('2d');
        this.charts.time = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'HEX VM Time (ms)',
                        data: [],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'OPA Time (ms)',
                        data: [],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointBackgroundColor: '#f59e0b',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: '#f1f5f9' }
                    }
                },
                scales: {
                    y: {
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(71, 85, 105, 0.2)' }
                    },
                    x: {
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(71, 85, 105, 0.2)' }
                    }
                }
            }
        });
    }

    createSpeedupChart() {
        const ctx = document.getElementById('speedupChart').getContext('2d');
        this.charts.speedup = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Speedup Factor (OPA / HEX)',
                        data: [],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: '#f1f5f9' }
                    }
                },
                scales: {
                    y: {
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(71, 85, 105, 0.2)' }
                    },
                    x: {
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(71, 85, 105, 0.2)' }
                    }
                }
            }
        });
    }

    createRuleCountChart() {
        const ctx = document.getElementById('ruleCountChart').getContext('2d');
        this.charts.ruleCount = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'HEX VM Time (ms)',
                        data: [],
                        backgroundColor: '#3b82f6',
                        borderRadius: 4
                    },
                    {
                        label: 'OPA Time (ms)',
                        data: [],
                        backgroundColor: '#f59e0b',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: '#f1f5f9' }
                    }
                },
                scales: {
                    y: {
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(71, 85, 105, 0.2)' }
                    },
                    x: {
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(71, 85, 105, 0.2)' }
                    }
                }
            }
        });
    }

    createDistributionChart() {
        const ctx = document.getElementById('distributionChart').getContext('2d');
        this.charts.distribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['HEX VM', 'OPA Simulator'],
                datasets: [
                    {
                        data: [0, 0],
                        backgroundColor: ['#3b82f6', '#f59e0b'],
                        borderColor: '#1e293b',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: '#f1f5f9' }
                    }
                }
            }
        });
    }

    updateCharts(results) {
        if (results.length === 0) {
            this.clearCharts();
            return;
        }

        this.charts.time.data.labels = results.map((_, i) => `Run ${i + 1}`);
        this.charts.time.data.datasets[0].data = results.map(r => r.hexTime);
        this.charts.time.data.datasets[1].data = results.map(r => r.opaTime);
        this.charts.time.update();

        this.charts.speedup.data.labels = results.map((_, i) => `Run ${i + 1}`);
        this.charts.speedup.data.datasets[0].data = results.map(r => r.speedup);
        this.charts.speedup.update();

        const metricsByRuleCount = dataManager.getMetricsByRuleCount();
        const ruleCounts = Object.keys(metricsByRuleCount).sort((a, b) => a - b);
        this.charts.ruleCount.data.labels = ruleCounts.map(rc => `${rc} Rules`);
        this.charts.ruleCount.data.datasets[0].data = ruleCounts.map(rc => metricsByRuleCount[rc].hexTime);
        this.charts.ruleCount.data.datasets[1].data = ruleCounts.map(rc => metricsByRuleCount[rc].opaTime);
        this.charts.ruleCount.update();

        const latest = results[results.length - 1];
        this.charts.distribution.data.datasets[0].data = [latest.hexTime, latest.opaTime];
        this.charts.distribution.update();
    }

    clearCharts() {
        Object.values(this.charts).forEach(chart => {
            chart.data.labels = [];
            chart.data.datasets.forEach(dataset => {
                dataset.data = [];
            });
            chart.update();
        });
    }
}

const chartManager = new ChartManager();
