import { Music } from "lucide-react";
import Link from "next/link";

export default function Top100ArtistsComponent({
  topArtists,
  activeFilter,
  setActiveFilter,
  isLoading,
  dateRange,
  formatDate,
  formatTime,
}) {
  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-md pb-24 px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 mt-6">
          <h1 className="text-xl font-semibold whitespace-nowrap">
            Top 100 Artists
          </h1>
          <div className="h-px flex-1 bg-gray-700"></div>
        </div>

        {/* Date Range Info */}
        {dateRange.start && dateRange.end && (
          <p className="text-xs text-gray-400 mb-4">
            {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
          </p>
        )}

        {/* Time Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {[
            { label: "4 weeks", value: "month" },
            { label: "6 months", value: "6months" },
            { label: "1 year", value: "1year" },
            { label: "Always", value: "alltime" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                activeFilter === f.value
                  ? "bg-green-600 text-white shadow-lg shadow-green-500/50 scale-105"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Artists List */}
        <div className="space-y-3 mb-24">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Loading...</p>
            </div>
          ) : topArtists.length > 0 ? (
            topArtists.map((item, index) => (
              <Link
                key={index}
                href={`/artist/${encodeURIComponent(item.artist)}`}
                className="group relative block bg-gray-900 px-4 py-3 rounded-lg font-medium tracking-wide transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:bg-gray-800 shadow-md hover:shadow-2xl hover:shadow-blue-600/60 border border-transparent hover:border-blue-500/30"
              >
                <div className="flex justify-between items-center">
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-blue-100 text-sm">
                    {index + 1}. {item.artist}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-gray-400 group-hover:text-blue-300">
                        {item.count} plays
                      </div>
                      <div className="text-xs text-gray-500 group-hover:text-blue-400">
                        {formatTime(item.ms)}
                      </div>
                    </div>
                    <Music className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 text-green-400 transform group-hover:scale-110" />
                  </div>
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/0 via-blue-500/0 to-blue-600/0 group-hover:from-blue-600/20 group-hover:via-blue-500/10 group-hover:to-blue-600/20 transition-all duration-300 pointer-events-none"></div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-2">Nothing to show</p>
              <p className="text-xs text-gray-500">
                There is no data for this period. Please try another one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
