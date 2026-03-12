interface PerfMetric {
  name: string;
  durationMs: number;
}

function toTimingHeader(metrics: PerfMetric[]) {
  return metrics
    .map((metric) => `${metric.name};dur=${metric.durationMs.toFixed(1)}`)
    .join(", ");
}

export function jsonWithPerf<T>(
  body: T,
  init: ResponseInit,
  metrics: PerfMetric[],
) {
  const headers = new Headers(init.headers);
  const totalMetric = metrics.find((metric) => metric.name === "total");
  const totalMs = totalMetric
    ? totalMetric.durationMs
    : metrics.reduce((sum, metric) => sum + metric.durationMs, 0);

  headers.set("Server-Timing", toTimingHeader(metrics));
  headers.set("X-Perf-Total-Ms", totalMs.toFixed(1));

  return Response.json(body, { ...init, headers });
}

export function logPerf(route: string, details: Record<string, unknown>) {
  console.info(`[perf] ${route}`, details);
}
