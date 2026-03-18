"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { authApi, deviceApi } from "@/lib/axios";
import { getUser } from "@/lib/auth";
import { ArrowLeftRight, MonitorDot, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface DashboardStats {
  totalTransactions: number;
  successTransactions: number;
  failedTransactions: number;
  totalDeviceLogs: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTransactions: 0,
    successTransactions: 0,
    failedTransactions: 0,
    totalDeviceLogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = getUser();

        const [txRes, logsRes] = await Promise.allSettled([
          authApi.post("/login", {
            username: user?.username ?? "user",
            password: "password",
          }),
          deviceApi.post("/1000000021/data", {}),
        ]);

        let totalTransactions = 0;
        let successTransactions = 0;

        if (txRes.status === "fulfilled") {
          const data = txRes.value.data;
          const transactions: unknown[] = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.transactions)
            ? data.transactions
            : [];

          totalTransactions = transactions.length;
          successTransactions = transactions.filter((t) => {
            const tx = t as Record<string, unknown>;
            return tx.status === "success" || tx.status === "completed";
          }).length;
        }

        let totalDeviceLogs = 0;
        if (logsRes.status === "fulfilled") {
          const data = logsRes.value.data;
          const logs: unknown[] = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.logs)
            ? data.logs
            : typeof data === "object" && data !== null
            ? [data]
            : [];
          totalDeviceLogs = logs.length;
        }

        setStats({
          totalTransactions,
          successTransactions,
          failedTransactions: totalTransactions - successTransactions,
          totalDeviceLogs,
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Transactions",
      value: stats.totalTransactions,
      icon: ArrowLeftRight,
      light: "bg-blue-50 text-blue-600",
    },
    {
      label: "Success Transactions",
      value: stats.successTransactions,
      icon: CheckCircle,
      light: "bg-green-50 text-green-600",
    },
    {
      label: "Failed Transactions",
      value: stats.failedTransactions,
      icon: AlertCircle,
      light: "bg-red-50 text-red-600",
    },
    {
      label: "Device Logs",
      value: stats.totalDeviceLogs,
      icon: MonitorDot,
      light: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Section Selamat Datang */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold">Selamat Datang Kembali Mina-san! 👋</h2>
          <p className="text-blue-100 mt-1 text-sm">
            Ini merupakan informasi terkini mengenai aktivitas transaksi dan log device perusahaan.
          </p>
        </div>

        {/* Cards Info */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 size={32} className="animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(({ label, value, icon: Icon, light }) => (
              <div
                key={label}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className={`p-3 rounded-xl ${light}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigasi Cepat */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Navigasi Cepat</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="/dashboard/transactions"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
            >
              <ArrowLeftRight size={20} className="text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  Transactions
                </p>
                <p className="text-xs text-gray-400">View all transaction records</p>
              </div>
            </a>
            <a
              href="/dashboard/device-logs"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-colors group"
            >
              <MonitorDot size={20} className="text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-purple-600">
                  Device Logs
                </p>
                <p className="text-xs text-gray-400">Monitor device activity logs</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}