"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { authApi } from "@/lib/axios";
import { Transaction } from "@/types";
import { Loader2, Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [headers, setHeaders] = useState<string[]>([]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authApi.post("/login", {
        username: "user",
        password: "password",
      });

      const data = res.data;
      const list: Transaction[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.transactions)
        ? data.transactions
        : [];

      if (list.length > 0) {
        const keys = Object.keys(list[0]);
        setHeaders(keys);
      }

      setTransactions(list);
      setFiltered(list);
    } catch {
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(transactions);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        transactions.filter((t) =>
          Object.values(t).some((v) =>
            String(v ?? "").toLowerCase().includes(q)
          )
        )
      );
    }
    setCurrentPage(1);
  }, [search, transactions]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatValue = (val: unknown): string => {
    if (val === null || val === undefined) return "-";
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  const getStatusStyle = (val: string) => {
    const v = val.toLowerCase();
    if (v === "success" || v === "completed")
      return "bg-green-100 text-green-700";
    if (v === "failed" || v === "error")
      return "bg-red-100 text-red-700";
    if (v === "pending")
      return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <DashboardLayout title="Transactions">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Transaction List</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Total {filtered.length} transactions found
            </p>
          </div>
          <button
            onClick={fetchTransactions}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-60">
              <Loader2 size={32} className="animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-60 text-red-500 gap-2">
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchTransactions}
                className="text-xs underline text-blue-500"
              >
                Try again
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center justify-center h-60 text-gray-400 text-sm">
              No transaction data available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    {headers.map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h.replace(/_/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                      </td>
                      {headers.map((h) => (
                        <td key={h} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          {h === "status" ? (
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                formatValue(tx[h])
                              )}`}
                            >
                              {formatValue(tx[h])}
                            </span>
                          ) : (
                            <span className="text-xs">{formatValue(tx[h])}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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