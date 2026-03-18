"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { deviceApi } from "@/lib/axios";
import { DeviceLog } from "@/types";
import { Loader2, Search, RefreshCw, ChevronLeft, ChevronRight, Wifi, WifiOff, ChevronDown, ChevronUp } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function DeviceLogsPage() {
  const [logs, setLogs] = useState<DeviceLog[]>([]);
  const [filtered, setFiltered] = useState<DeviceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await deviceApi.post("/1000000021/data", {});
      const data = res.data;
      const list: DeviceLog[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.logs)
        ? data.logs
        : typeof data === "object" && data !== null
        ? [data]
        : [];

      setLogs(list);
      setFiltered(list);
    } catch {
      setError("Failed to fetch device logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(logs);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        logs.filter((log) =>
          Object.values(log).some((v) =>
            String(v ?? "").toLowerCase().includes(q)
          )
        )
      );
    }
    setCurrentPage(1);
  }, [search, logs]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleRow = (idx: number) => {
    setExpandedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const formatLog = (val: unknown): string => {
    if (val === null || val === undefined) return "-";
    if (typeof val === "object") return JSON.stringify(val, null, 2);
    return String(val);
  };

  const toString = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    return String(val);
  };

  const isOnline = logs.some((log) => {
    const event = toString(log.event).toLowerCase();
    return event.includes("online") || event.includes("connect");
  });

  return (
    <DashboardLayout title="Device Logs">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Device Log Monitor</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Total {filtered.length} logs found
            </p>
          </div>
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {/* Device Status Card */}
        {!loading && !error && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isOnline ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                {isOnline ? <Wifi size={22} /> : <WifiOff size={22} />}
              </div>
              <div>
                <p className="text-sm text-gray-500">Device ID: 1000000021</p>
                <p className="text-base font-semibold text-gray-800">
                  Status:{" "}
                  <span className={isOnline ? "text-green-600" : "text-red-500"}>
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-gray-500">Total Logs</p>
                <p className="text-2xl font-bold text-gray-800">{logs.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Log Cards */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-60 bg-white rounded-xl border border-gray-100">
              <Loader2 size={32} className="animate-spin text-purple-500" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-60 bg-white rounded-xl border border-gray-100 text-red-500 gap-2">
              <p className="text-sm">{error}</p>
              <button onClick={fetchLogs} className="text-xs underline text-purple-500">
                Try again
              </button>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex items-center justify-center h-60 bg-white rounded-xl border border-gray-100 text-gray-400 text-sm">
              No device log data available.
            </div>
          ) : (
            paginated.map((log, idx) => {
              const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx;
              const isExpanded = expandedRows.includes(globalIdx);
              const logText = formatLog(log.log ?? log);
              const preview = logText.length > 120 ? logText.slice(0, 120) + "..." : logText;
              const deviceId = toString(log.device_id);
              const deviceType = toString(log.device_type);

              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Log Header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-400">
                        #{String(globalIdx + 1).padStart(3, "0")}
                      </span>
                      {deviceId && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                          Device: {deviceId}
                        </span>
                      )}
                      {deviceType && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          {deviceType}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleRow(globalIdx)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition-colors"
                    >
                      {isExpanded ? (
                        <>Hide <ChevronUp size={14} /></>
                      ) : (
                        <>Show Full <ChevronDown size={14} /></>
                      )}
                    </button>
                  </div>

                  {/* Log Body */}
                  <div className="px-5 py-4">
                    <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap break-all leading-relaxed">
                      {isExpanded ? logText : preview}
                    </pre>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}