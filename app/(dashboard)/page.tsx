import { DataGrid } from "@/components/summary-charts/DataGrid"
import { DataCharts } from "@/components/summary-charts/DataCharts"

export default function DashboardPage() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />
      <DataCharts />
    </div>
  )
}
