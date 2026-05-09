import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import ExpertCard from "../components/ExpertCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const CATEGORIES = ["All", "Career", "Finance", "Health", "Legal", "Technology", "Education"];

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExperts, setTotalExperts] = useState(0);

  // Debounce search so we don't fire on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchExperts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 6 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category;

      const { data } = await api.get("/experts", { params });
      setExperts(data.experts);
      setTotalPages(data.totalPages);
      setTotalExperts(data.totalExperts);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load experts.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category]);

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val === "All" ? "" : val);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
      <div className="pagination">
        <button
          className="page-btn"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          ‹
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`page-btn${p === page ? " active" : ""}`}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="page-btn"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          ›
        </button>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Find Your Expert</h1>
        <p className="page-subtitle">
          Book 1-on-1 sessions with top professionals across career, finance, health, and more.
        </p>
      </div>

      <div className="filter-bar">
        <div className="search-wrapper">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select category-select"
          value={category || "All"}
          onChange={handleCategoryChange}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {!loading && !error && experts.length > 0 && (
        <p className="results-info">
          Showing {experts.length} of {totalExperts} expert{totalExperts !== 1 ? "s" : ""}
          {category ? ` in ${category}` : ""}
          {debouncedSearch ? ` matching "${debouncedSearch}"` : ""}
        </p>
      )}

      {loading && <Loader message="Finding experts…" />}

      {!loading && error && <ErrorMessage message={error} />}

      {!loading && !error && experts.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No experts found</div>
          <p className="empty-desc">
            Try adjusting your search or selecting a different category.
          </p>
        </div>
      )}

      {!loading && !error && experts.length > 0 && (
        <>
          <div className="experts-grid">
            {experts.map((expert) => (
              <ExpertCard key={expert._id} expert={expert} />
            ))}
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default ExpertList;
