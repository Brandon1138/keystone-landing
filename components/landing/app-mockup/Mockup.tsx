import { MockupWindow } from "./MockupWindow";
import { Sidebar } from "./Sidebar";
import { MetricStrip } from "./MetricCard";
import { OpsBarChart } from "./OpsBarChart";
import { LatencyGauge } from "./LatencyGauge";
import { LatencyLineChart } from "./LatencyLineChart";
import { ThroughputHistogram } from "./ThroughputHistogram";
import { SchemeTable } from "./SchemeTable";

export function Mockup() {
  return (
    <MockupWindow>
      <div className="flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <MetricStrip />
          <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-[1.4fr_1fr]">
            <OpsBarChart />
            <LatencyGauge />
          </div>
          <div className="grid grid-cols-1 gap-3 px-4 pb-4 lg:grid-cols-2">
            <LatencyLineChart />
            <ThroughputHistogram />
          </div>
          <div className="px-4 pb-4">
            <SchemeTable />
          </div>
        </div>
      </div>
    </MockupWindow>
  );
}
