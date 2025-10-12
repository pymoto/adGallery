"use client"

import React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface DailyStats {
  date: string
  views: number
  clicks: number
}

interface DeviceStats {
  device: string
  views: number
  clicks: number
}

interface BrowserStats {
  browser: string
  views: number
  clicks: number
}

interface LocationStats {
  location: string
  views: number
  clicks: number
}

interface AnalyticsChartProps {
  dailyStats: DailyStats[]
  deviceStats: DeviceStats[]
  browserStats: BrowserStats[]
  locationStats: LocationStats[]
}

export function AnalyticsChart({ 
  dailyStats, 
  deviceStats, 
  browserStats, 
  locationStats 
}: AnalyticsChartProps) {
  // 日別統計のチャートデータ
  const dailyChartData = {
    labels: dailyStats.map(stat => {
      const date = new Date(stat.date)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }),
    datasets: [
      {
        label: "閲覧数",
        data: dailyStats.map(stat => stat.views),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.1,
      },
      {
        label: "クリック数",
        data: dailyStats.map(stat => stat.clicks),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.1,
      },
    ],
  }

  // デバイス別統計のチャートデータ
  const deviceChartData = {
    labels: deviceStats.map(stat => {
      const deviceNames: { [key: string]: string } = {
        desktop: "デスクトップ",
        mobile: "モバイル",
        tablet: "タブレット",
        unknown: "不明"
      }
      return deviceNames[stat.device] || stat.device
    }),
    datasets: [
      {
        label: "閲覧数",
        data: deviceStats.map(stat => stat.views),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // ブラウザ別統計のチャートデータ
  const browserChartData = {
    labels: browserStats.map(stat => stat.browser),
    datasets: [
      {
        label: "閲覧数",
        data: browserStats.map(stat => stat.views),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
          "rgb(139, 92, 246)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // 地域別統計のチャートデータ
  const locationChartData = {
    labels: locationStats.map(stat => stat.location),
    datasets: [
      {
        label: "閲覧数",
        data: locationStats.map(stat => stat.views),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
          "rgb(139, 92, 246)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "広告分析データ",
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  }

  return (
    <div className="space-y-8">
      {/* 日別統計グラフ */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">日別統計</h3>
        <div className="h-64">
          <Line data={dailyChartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* デバイス別統計 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">デバイス別統計</h3>
          <div className="h-64">
            <Doughnut data={deviceChartData} options={doughnutOptions} />
          </div>
        </div>

        {/* ブラウザ別統計 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">ブラウザ別統計</h3>
          <div className="h-64">
            <Doughnut data={browserChartData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* 地域別統計 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">地域別統計</h3>
        <div className="h-64">
          <Bar data={locationChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}
