
class PerformanceMonitor {
  static trackWebVitals() {
    console.log('Monitoring Core Web Vitals...');
  }
}

class ErrorTracker {
  static trackError(e: Error) {
    console.error(`Logged: ${e.message}`);
  }
}

export { PerformanceMonitor, ErrorTracker };
