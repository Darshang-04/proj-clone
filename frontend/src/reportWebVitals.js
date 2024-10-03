const reportWebVitals = (onPerformanceEntry) => {
  if (typeof onPerformanceEntry === 'function') {
    import('web-vitals')
      .then((webVitals) => {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals;
        const vitalsMetrics = [getCLS, getFID, getFCP, getLCP, getTTFB];

        vitalsMetrics.forEach((metric) => metric(onPerformanceEntry));
      })
      .catch((error) => {
        console.error('Error importing web-vitals:', error);
      });
  }
};

export default reportWebVitals;