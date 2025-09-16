import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import * as ApiService from "../../services/auth";
import './animate.css';

// Type definitions
interface Grade {
  _id: string;
  name: string;
  level_id?: {
    name: string;
  };
}

interface LearningArea {
  _id: string;
  name: string;
  grade_id?: {
    _id: string;
    name: string;
  };
}

interface Strand {
  _id: string;
  name: string;
  term?: number;
}

interface Substrand {
  _id: string;
  name: string;
  learning_outcome?: string;
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total: number;
}

interface ApiResponse {
  data: any[];
  pagination: PaginationInfo;
}

function CurriculumExplorer() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [learningAreas, setLearningAreas] = useState<Record<string, LearningArea[]>>({});
  const [strands, setStrands] = useState<Record<string, Strand[]>>({});
  const [substrands, setSubstrands] = useState<Record<string, Substrand[]>>({});
  const [selectedSubstrand, setSelectedSubstrand] = useState<Substrand | null>(null);
  const [loading, setLoading] = useState({ grades: true, learningAreas: {}, strands: {}, substrands: {}, slos: false });
  const [search, setSearch] = useState("");
  const [termFilter, setTermFilter] = useState("1");
  const [page, setPage] = useState({ grades: 1, learningAreas: {}, strands: {}, substrands: {} });
  const [pagination, setPagination] = useState({
    grades: { current_page: 1, total_pages: 1, total: 0 },
    learningAreas: {},
    strands: {},
    substrands: {},
  });
  const [expanded, setExpanded] = useState<{ grade: string | null, learningArea: string | null, strand: string | null }>({ grade: null, learningArea: null, strand: null });
  const [dialog, setDialog] = useState({ show: false, success: true, message: "" });
  const navigate = useNavigate();
  const notify = useRef(null);

  const terms = [
    { _id: "1", name: "Term 1" },
    { _id: "2", name: "Term 2" },
    { _id: "3", name: "Term 3" },
  ];

  useEffect(() => {
    fetchGrades();
  }, [page.grades, search]);

  async function fetchGrades() {
    setLoading((prev) => ({ ...prev, grades: true }));
    try {
      const response = await ApiService.getGrades({ page: page.grades, limit: 10, search });
      setGrades(response.data || []);
      setPagination((prev) => ({
        ...prev,
        grades: response.pagination || { current_page: 1, total_pages: 1, total: 0 },
      }));
      if (response.data.length > 0 && !expanded.grade) {
        setExpanded((prev) => ({ ...prev, grade: response.data[0]._id }));
        fetchLearningAreas(response.data[0]._id);
      }
    } catch (error) {
      setDialog({ show: true, success: false, message: "Failed to load grades." });
      setTimeout(() => setDialog((prev) => ({ ...prev, show: false })), 3000);
    } finally {
      setLoading((prev) => ({ ...prev, grades: false }));
    }
  }

  async function fetchLearningAreas(gradeId: string) {
    if (!gradeId || learningAreas[gradeId]) return;
    setLoading((prev) => ({ ...prev, learningAreas: { ...prev.learningAreas, [gradeId]: true } }));
    try {
      const response = await ApiService.getLearningAreas({
        page: page.learningAreas[gradeId] || 1,
        limit: 10,
        search,
        gradeId,
      });
      setLearningAreas((prev) => ({ ...prev, [gradeId]: response.data || [] }));
      setPagination((prev) => ({
        ...prev,
        learningAreas: {
          ...prev.learningAreas,
          [gradeId]: response.pagination || { current_page: 1, total_pages: 1, total: 0 },
        },
      }));
    } catch (error) {
      setDialog({ show: true, success: false, message: "Failed to load learning areas." });
      setTimeout(() => setDialog((prev) => ({ ...prev, show: false })), 3000);
    } finally {
      setLoading((prev) => ({ ...prev, learningAreas: { ...prev.learningAreas, [gradeId]: false } }));
    }
  }

  async function fetchStrands(learningAreaId: string) {
    if (!learningAreaId || strands[learningAreaId]) return;
    setLoading((prev) => ({ ...prev, strands: { ...prev.strands, [learningAreaId]: true } }));
    try {
      const response = await ApiService.getStrands({
        page: page.strands[learningAreaId] || 1,
        limit: 10,
        search,
      }, {
        grade: expanded.grade || "na",
        learning_area: learningAreaId,
        term: termFilter !== "all" ? parseInt(termFilter) : "na",
      });
      setStrands((prev) => ({ ...prev, [learningAreaId]: response.data || [] }));
      setPagination((prev) => ({
        ...prev,
        strands: {
          ...prev.strands,
          [learningAreaId]: response.pagination || { current_page: 1, total_pages: 1, total: 0 },
        },
      }));
    } catch (error) {
      setDialog({ show: true, success: false, message: "Failed to load strands. Please try again." });
      setTimeout(() => setDialog((prev) => ({ ...prev, show: false })), 3000);
    } finally {
      setLoading((prev) => ({ ...prev, strands: { ...prev.strands, [learningAreaId]: false } }));
    }
  }

  async function fetchSubstrands(strandId: string) {
    if (!strandId || substrands[strandId]) return;
    setLoading((prev) => ({ ...prev, substrands: { ...prev.substrands, [strandId]: true } }));
    try {
      const response = await ApiService.getSubstrandByStrand(
        { page: page.substrands[strandId] || 1, limit: 10, search },
        strandId
      );
      setSubstrands((prev) => ({ ...prev, [strandId]: response.data || [] }));
      setPagination((prev) => ({
        ...prev,
        substrands: {
          ...prev.substrands,
          [strandId]: response.pagination || { current_page: 1, total_pages: 1, total: 0 },
        },
      }));
    } catch (error) {
      setDialog({ show: true, success: false, message: "Failed to load substrands." });
      setTimeout(() => setDialog((prev) => ({ ...prev, show: false })), 3000);
    } finally {
      setLoading((prev) => ({ ...prev, substrands: { ...prev.substrands, [strandId]: false } }));
    }
  }

  function selectGrade(gradeId: string) {
    setExpanded((prev) => ({
      ...prev,
      grade: gradeId,
      learningArea: null,
      strand: null
    }));
    setLearningAreas({});
    setStrands({});
    setSubstrands({});
    setSelectedSubstrand(null);
    fetchLearningAreas(gradeId);
  }

  function selectLearningArea(learningAreaId: string) {
    setExpanded((prev) => ({
      ...prev,
      learningArea: learningAreaId,
      strand: null
    }));
    setStrands({});
    setSubstrands({});
    setSelectedSubstrand(null);
    fetchStrands(learningAreaId);
  }

  function selectStrand(strandId: string) {
    setExpanded((prev) => ({
      ...prev,
      strand: strandId
    }));
    setSelectedSubstrand(null);
    fetchSubstrands(strandId);
  }

  function goBackToStrands() {
    setExpanded((prev) => ({
      ...prev,
      strand: null
    }));
    setSelectedSubstrand(null);
  }

  function goBackToSubstrands() {
    setSelectedSubstrand(null);
  }

  function handlePageChange(level: string, id: string, newPage: number) {
    setPage((prev) => ({
      ...prev,
      [level]: { ...prev[level], [id]: newPage },
    }));
    if (level === "grades") fetchGrades();
    else if (level === "learningAreas") fetchLearningAreas(id);
    else if (level === "strands") fetchStrands(id);
    else if (level === "substrands") fetchSubstrands(id);
  }

  function handleTermChange(event) {
    const newTerm = event.target.value;
    setTermFilter(newTerm);
    setStrands({});
    setSubstrands({});
    setSelectedSubstrand(null);
    setExpanded((prev) => ({ ...prev, strand: null }));
    if (expanded.learningArea) fetchStrands(expanded.learningArea);
  }

  function openSubstrandSLOs(substrand: Substrand) {
    setSelectedSubstrand(substrand);
  }

  return (
    <main className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-indigo-600">Curriculum Explorer</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-full sm:w-64">
              <input
                type="search"
                placeholder="Search curriculum..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage({ grades: 1, learningAreas: {}, strands: {}, substrands: {} });
                  setExpanded((prev) => ({ ...prev, learningArea: null, strand: null }));
                  setLearningAreas({});
                  setStrands({});
                  setSubstrands({});
                  setSelectedSubstrand(null);
                }}
                aria-label="Search grades, learning areas, strands, or substrands"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
              </svg>
            </div>
            <select
              className="w-32 py-2 rounded-lg border border-gray-300 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={termFilter}
              onChange={handleTermChange}
              aria-label="Filter by term"
            >
              {terms.map((term) => (
                <option key={term._id} value={term._id}>{term.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange("grades", null, Math.max(page.grades - 1, 1))}
                disabled={pagination.grades.current_page === 1}
                className="px-3 py-1 rounded-md bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                aria-label="Previous grades page"
              >
                Prev
              </button>
              <button
                onClick={() => handlePageChange("grades", null, Math.min(page.grades + 1, pagination.grades.total_pages))}
                disabled={pagination.grades.current_page === pagination.grades.total_pages}
                className="px-3 py-1 rounded-md bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                aria-label="Next grades page"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="pb-8">
          {loading.grades ? (
            <div className="flex justify-center items-center py-16">
              <svg className="w-12 h-12 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
              </svg>
            </div>
          ) : grades.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-lg">No curriculum content found. Try adjusting your search or term.</div>
          ) : (
            <>
              {/* Grades Tabs */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 border-b border-gray-200">
                  {grades.map((grade) => (
                    <button
                      key={grade._id}
                      onClick={() => selectGrade(grade._id)}
                      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
                        expanded.grade === grade._id
                          ? 'bg-indigo-600 text-white border-b-2 border-indigo-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-indigo-100 hover:text-indigo-600'
                      }`}
                      aria-selected={expanded.grade === grade._id}
                      role="tab"
                      aria-controls={`learning-areas-${grade._id}`}
                    >
                      {grade.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Layout */}
              {expanded.grade && (
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Learning Areas Sidebar */}
                  <div className="w-full lg:w-1/4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {loading.learningAreas[expanded.grade] ? (
                      <div className="flex justify-center items-center py-8">
                        <svg className="w-10 h-10 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                        </svg>
                      </div>
                    ) : !learningAreas[expanded.grade] || learningAreas[expanded.grade].length === 0 ? (
                      <div className="text-center py-8 text-gray-500 text-sm">No learning areas found.</div>
                    ) : (
                      <>
                        <div className="space-y-2" aria-label={`Learning areas for ${grades.find(g => g._id === expanded.grade)?.name || 'selected grade'}`}>
                          {learningAreas[expanded.grade].map((area: LearningArea) => (
                            <button
                              key={area._id}
                              onClick={() => selectLearningArea(area._id)}
                              className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 truncate ${
                                expanded.learningArea === area._id
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white text-gray-800 hover:bg-indigo-100 hover:text-indigo-600'
                              }`}
                              aria-selected={expanded.learningArea === area._id}
                              role="button"
                              aria-controls={`strands-${area._id}`}
                            >
                              {area.name}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
                          <span>
                            Page {pagination.learningAreas[expanded.grade]?.current_page || 1} of {pagination.learningAreas[expanded.grade]?.total_pages || 1} (
                            {pagination.learningAreas[expanded.grade]?.total || 0} entries)
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handlePageChange("learningAreas", expanded.grade, (page.learningAreas[expanded.grade] || 1) - 1)}
                              disabled={(page.learningAreas[expanded.grade] || 1) === 1}
                              className="px-2 py-1 rounded-md bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700"
                              aria-label="Previous learning areas page"
                            >
                              Prev
                            </button>
                            <button
                              onClick={() => handlePageChange("learningAreas", expanded.grade, (page.learningAreas[expanded.grade] || 1) + 1)}
                              disabled={(page.learningAreas[expanded.grade] || 1) === pagination.learningAreas[expanded.grade]?.total_pages}
                              className="px-2 py-1 rounded-md bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700"
                              aria-label="Next learning areas page"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Strands/Substrands/SLOs Content */}
                  <div className="w-full lg:w-3/4 p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    {expanded.learningArea ? (
                      loading.strands[expanded.learningArea] ? (
                        <div className="flex justify-center items-center py-6">
                          <svg className="w-8 h-8 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                          </svg>
                        </div>
                      ) : !strands[expanded.learningArea] || strands[expanded.learningArea].length === 0 ? (
                        <div className="text-center py-6 text-gray-500 text-sm">No strands found for this term or search.</div>
                      ) : !expanded.strand ? (
                        <>
                          <div className="space-y-2 mb-3" aria-label={`Strands for ${learningAreas[expanded.grade]?.find(a => a._id === expanded.learningArea)?.name || 'selected learning area'}`}>
                            {strands[expanded.learningArea].map((strand: Strand) => (
                              <button
                                key={strand._id}
                                onClick={() => selectStrand(strand._id)}
                                className="group bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:border-indigo-500 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-[calc(50%-0.75rem)] animate__animated animate__fadeIn"
                                role="button"
                                aria-label={`View substrands for ${strand.name}`}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-800 group-hover:text-indigo-600 truncate">{strand.name}</h4>
                                  <span className="text-xs text-gray-500 flex-shrink-0">Term {strand.term || "N/A"}</span>
                                </div>
                                <svg
                                  className="w-4 h-4 text-amber-500 group-hover:text-amber-600 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                            <span>
                              Page {pagination.strands[expanded.learningArea]?.current_page || 1} of {pagination.strands[expanded.learningArea]?.total_pages || 1} (
                              {pagination.strands[expanded.learningArea]?.total || 0} entries)
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handlePageChange("strands", expanded.learningArea, (page.strands[expanded.learningArea] || 1) - 1)}
                                disabled={(page.strands[expanded.learningArea] || 1) === 1}
                                className="px-2 py-1 rounded-md bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700"
                                aria-label="Previous strands page"
                              >
                                Prev
                              </button>
                              <button
                                onClick={() => handlePageChange("strands", expanded.learningArea, (page.strands[expanded.learningArea] || 1) + 1)}
                                disabled={(page.strands[expanded.learningArea] || 1) === pagination.strands[expanded.learningArea]?.total_pages}
                                className="px-2 py-1 rounded-md bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700"
                                aria-label="Next strands page"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </>
                      ) : !selectedSubstrand ? (
                        <>
                          <div className="mb-4 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={goBackToStrands}
                                className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                aria-label="Back to strands"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Strands
                              </button>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 truncate">
                              {strands[expanded.learningArea]?.find(s => s._id === expanded.strand)?.name || 'Selected Strand'}
                            </h3>
                          </div>
                          {loading.substrands[expanded.strand] ? (
                            <div className="flex justify-center items-center py-4">
                              <svg className="w-6 h-6 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                              </svg>
                            </div>
                          ) : !substrands[expanded.strand] || substrands[expanded.strand].length === 0 ? (
                            <div className="text-center py-4 text-gray-500 text-sm">No substrands found.</div>
                          ) : (
                            <>
                              <div className="space-y-2 mb-3 max-h-[calc(100vh-300px)] overflow-y-auto" aria-label={`Substrands for ${strands[expanded.learningArea]?.find(s => s._id === expanded.strand)?.name || 'selected strand'}`}>
                                {substrands[expanded.strand].map((substrand: Substrand, index) => (
                                  <article
                                    key={substrand._id}
                                    onClick={() => openSubstrandSLOs(substrand)}
                                    className={`group bg-white border border-gray-200 rounded-md p-3 flex items-center justify-between hover:border-indigo-500 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-[calc(50%-0.75rem)] animate__animated animate__fadeIn animate__delay-${index % 5}s`}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`View SLOs for ${substrand.name}`}
                                  >
                                    <span className="text-sm text-gray-800 group-hover:text-indigo-600 truncate">{ReactHtmlParser(substrand.name)}</span>
                                    <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-emerald-600 rounded-full group-hover:bg-emerald-700 flex-shrink-0">View SLOs</span>
                                  </article>
                                ))}
                              </div>
                              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                                <span>
                                  Page {pagination.substrands[expanded.strand]?.current_page || 1} of {pagination.substrands[expanded.strand]?.total_pages || 1} (
                                  {pagination.substrands[expanded.strand]?.total || 0} entries)
                                </span>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handlePageChange("substrands", expanded.strand, (page.substrands[expanded.strand] || 1) - 1)}
                                    disabled={(page.substrands[expanded.strand] || 1) === 1}
                                    className="px-2 py-1 rounded-md bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700"
                                    aria-label="Previous substrands page"
                                  >
                                    Prev
                                  </button>
                                  <button
                                    onClick={() => handlePageChange("substrands", expanded.strand, (page.substrands[expanded.strand] || 1) + 1)}
                                    disabled={(page.substrands[expanded.strand] || 1) === pagination.substrands[expanded.strand]?.total_pages}
                                    className="px-2 py-1 rounded-md bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700"
                                    aria-label="Next substrands page"
                                  >
                                    Next
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="mb-4 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={goBackToSubstrands}
                                className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                aria-label="Back to substrands"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Substrands
                              </button>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <h3 className="text-xl font-bold text-gray-800 truncate">
                                {strands[expanded.learningArea]?.find(s => s._id === expanded.strand)?.name || 'Selected Strand'}
                              </h3>
                              <span className="text-lg font-semibold text-gray-600 line-clamp-1">
                                {ReactHtmlParser(selectedSubstrand.name)}
                              </span>
                            </div>
                          </div>
                          {loading.slos ? (
                            <div className="flex justify-center items-center py-4">
                              <svg className="w-6 h-6 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                              </svg>
                            </div>
                          ) : (
                            <div className="max-h-[calc(100vh-300px)] overflow-hidden">
                              <div className="mt-3">
                                {selectedSubstrand.learning_outcome ? (
                                  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 animate__animated animate__fadeInUp">
                                    <h4 className="text-base font-semibold text-indigo-600 mb-2">Specific Learning Outcome</h4>
                                    <div className="text-gray-800 text-sm leading-relaxed truncate">{ReactHtmlParser(selectedSubstrand.learning_outcome)}</div>
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-gray-500 text-sm">No learning outcome available.</div>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )
                    ) : (
                      <div className="text-center py-6 text-gray-500 text-sm">Select a learning area to view strands.</div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Footer Info */}
        <footer className="text-center text-sm text-gray-500">
          Showing page {pagination.grades.current_page} of {pagination.grades.total_pages} ({pagination.grades.total} grades)
        </footer>

        {/* Notification */}
        <div
          className={`fixed bottom-4 right-4 transition-opacity duration-300 ${dialog.show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${dialog.success ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {dialog.success ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
            <div>
              <p className="font-medium">{dialog.success ? "Success" : "Failed"}</p>
              <p className="text-sm">{dialog.message}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CurriculumExplorer;