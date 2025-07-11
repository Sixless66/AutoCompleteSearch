import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "./useDebounce";

const Autocomplete = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/search?q=${debouncedQuery}`);
        const data = await res.json();
        setSuggestions(data.results);
        setError(null);
      } catch (err) {
        setError("Failed to fetch suggestions.");
        setSuggestions([]);
      } finally {
        setLoading(false);
      } 
    };

    fetchData();
  }, [debouncedQuery]);

  const handleSelect = (item) => {
    setQuery(item);
    setSuggestions([]);
  }; 

  const handleKeyDown = (e) => {
  if (!Array.isArray(suggestions) || suggestions.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault(); 
    setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    setSelectedIndex((prev) => Math.max(prev - 1, 0));
  } else if (e.key === "Enter" && selectedIndex >= 0) {
    e.preventDefault();
    handleSelect(suggestions[selectedIndex]);
  }
}; 

  useEffect(() => { 
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setSuggestions([]); 
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); 

  return (
    <div className="relative w-full max-w-md mx-auto mt-10" ref={dropdownRef}>
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Search..."
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown} 
      />
      {loading && <div className="absolute mt-1 p-2 bg-white border">Loading...</div>}
      {error && <div className="absolute mt-1 p-2 bg-red-100 text-red-700">{error}</div>}
      {!loading && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
          {suggestions.map((item, index) => (
            <li
              key={index}
              className={`p-2 cursor-pointer ${
                index === selectedIndex ? "bg-blue-100" : ""
              }`}
              onMouseDown={() => handleSelect(item)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {item} 
            </li> 
          ))} 
        </ul>
      )}
    </div> 
  );
};

export default Autocomplete;
