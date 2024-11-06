import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Autocomplete = ({
  search,
  onSelect,
  multiple = false,
  template: CustomTemplate,
  placeholder = "Recherchez...",
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query) {
      search(query)
        .then((results) => setSuggestions(results))
        .catch((error) => console.error("Erreur lors de la récupération des suggestions:", error));
    } else {
      setSuggestions([]);
    }
  }, [query, search]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSelect = (item) => {
    if (multiple) {
      setSelectedItems((prevItems) => [...prevItems, item]);
      onSelect([...selectedItems, item]);
    } else {
      setSelectedItems([item]);
      onSelect(item);
      setIsDropdownOpen(false);
    }
    setQuery(item.label);
  };

  const renderSuggestion = (suggestion) => {
    if (CustomTemplate) {
      return <CustomTemplate item={suggestion} />;
    }

    return (
      <div>
        {suggestion.label}
        {suggestion.type === "product" && <span> - {suggestion.price}€</span>}
      </div>
    );
  };

  return (
    <div className="autocomplete" ref={inputRef} style={{ position: "relative" }}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsDropdownOpen(true)}
        style={{ width: "100%", padding: "8px", fontSize: "16px" }}
      />

      {isDropdownOpen && suggestions.length > 0 && (
        <div className="suggestions" style={dropdownStyles}>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSelect(suggestion)}
              style={suggestionStyles}
            >
              {renderSuggestion(suggestion)}
            </div>
          ))}
        </div>
      )}

      {multiple && selectedItems.length > 0 && (
        <div className="selected-items" style={{ marginTop: "8px" }}>
          {selectedItems.map((item, index) => (
            <span key={index} style={selectedItemStyles}>
              {item.firstName || item.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const dropdownStyles = {
  position: "absolute",
  top: "100%",
  left: 0,
  width: "100%",
  border: "1px solid #ddd",
  borderRadius: "4px",
  backgroundColor: "white",
  zIndex: 1,
  maxHeight: "200px",
  overflowY: "auto",
};

const suggestionStyles = {
  padding: "8px",
  cursor: "pointer",
  color: "#333",
  backgroundColor: "white",
};

const selectedItemStyles = {
  display: "inline-block",
  background: "#e1e1e1",
  padding: "4px 8px",
  borderRadius: "12px",
  marginRight: "4px",
  marginBottom: "4px",
  color: "#333",
};

Autocomplete.propTypes = {
  search: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  template: PropTypes.elementType,
  placeholder: PropTypes.string,
};

export default Autocomplete;
