import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as ApiService from "../../services/auth";

function LearningAreas() {
  const [learningAreas, setLearningAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total: 0 });
  const [grade, setGrade] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const notify = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const gradeData = location?.state?.data;
    if (gradeData) setGrade(gradeData);
  }, [location]);

  useEffect(() => {
    if (grade?._id) fetchLearningAreas();
  }, [grade, page, limit, search]);

  async function fetchLearningAreas() {
    setLoading(true);
    try {
      const response = await ApiService.getLearningAreas({
        page,
        limit,
        search,
        gradeId: grade._id,
      });
      setLearningAreas(response.data);
      setPagination(response.pagination);
    } catch (error) {
      setMessage("Failed to load learning areas.");
      setSuccess(false);
      setDialog(true);
      setTimeout(() => setDialog(false), 3000);
    } finally {
      setLoading(false);
    }
  }

  function openStrand(learningArea) {
    navigate("/home/Strands", { replace: true, state: { data: learningArea } });
  }

  return (
    <main className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation Bar */}
        <nav className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white border-b border-gray-200 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home/grade", { replace: true })}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-2"
              aria-label="Back to grades"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Grades
            </button>
            <h1 className="text-2xl font-bold text-indigo-600">{grade?.name || "Loading..."}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full sm:w-64">
              <input
                type="search"
                placeholder="Search areas..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search learning areas"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
                />
              </svg>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={pagination.current_page === 1}
                className="px-3 py-1 rounded-md bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                aria-label="Previous page"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.total_pages))}
                disabled={pagination.current_page === pagination.total_pages}
                className="px-3 py-1 rounded-md bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <section className="pb-8">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <svg className="w-12 h-12 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                />
              </svg>
            </div>
          ) : learningAreas.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-lg">
              No learning areas found. Try adjusting your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Learning areas grid">
              {learningAreas.map((area, idx) => (
                <article
                  key={area._id || idx}
                  onClick={() => openStrand(area)}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-500 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  tabIndex={0}
                  aria-label={`View strands for ${area.name}`}
                  role="button"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 truncate">
                        {area.name}
                      </h2>
                      <div className="w-6 h-6">
                        <svg className="w-full h-full text-amber-500 group-hover:text-amber-600" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10 10 10 0 0 1-10-10 10 10 0 0 1 10-10"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="opacity-20"
                          />
                          <path
                            d="M12 2a10 10 0 0 1 10 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="15 45"
                            className="group-hover:animate-spin-slow"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{area?.grade_id?.name}</p>
                    <div className="mt-4">
                      <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-emerald-600 rounded-full group-hover:bg-emerald-700 transition-colors">
                        Explore Strands
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Footer Info */}
        <footer className="text-center text-sm text-gray-500">
          Showing page {pagination.current_page} of {pagination.total_pages} ({pagination.total} entries)
        </footer>

        {/* Notification */}
        <div
          className={`fixed bottom-4 right-4 transition-opacity duration-300 ${
            dialog ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${
            success ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {success ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              )}
            </svg>
            <div>
              <p className="font-medium">{success ? "Success" : "Failed"}</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LearningAreas;