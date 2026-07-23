import React from "react";
import "../styles/toolbar.css";


// Reusable Toolbar component used across pages.
// Provides:
// - A flexible set of action buttons (passed in config array)
// - A section title
// - A search input field with controlled state
function Toolbar({ id, buttons = [], title, searchTerm = null, setSearchTerm = null }) {
  return (
    <div className="toolbar" id={id}>

      {/* Left section: toolbar buttons (config-driven) */}
      <div className="toolbar-buttons">
        {buttons.map(
          ({ id, type = "button", className, iconClass, onClick, ariaLabel }, index) => (
            <button
              id={id}
              key={id || index}
              type={type}
              className={className}
              onClick={onClick}
              aria-label={ariaLabel}
            >
              {/* Icon inside button; uses Bootstrap icons */}
              <i className={iconClass} style={{ fontSize: "1rem" }}></i>
            </button>
          )
        )}
      </div>

      {/* Middle section: page/section title (if provided) */}
      {title && (
        <b>
          <span className="section-title">{title}</span>
        </b>
      )}

      {/* Right section: Search bar */}
      {searchTerm !== null && (
        <input
        type="search"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: 5,
          borderRadius: 5,
          border: "1px solid #ccc",
          width: 250,
        }}
        />
      )}
    </div>
  );
}

export default Toolbar;
