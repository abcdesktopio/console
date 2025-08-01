import React from "react";

function Toolbar({ buttons = [], title, searchTerm, setSearchTerm }) {
  return (
    <div className="toolbar">
      <div className="toolbar-buttons">
        {buttons.map(({ id, type = "button", className, iconClass, onClick, ariaLabel }, index) => (
          <button
            id={id}
            key={id || index}
            type={type}
            className={className}
            onClick={onClick}
            aria-label={ariaLabel}
          >
            <i className={iconClass} style={{ fontSize: "1rem" }}></i>
          </button>
        ))}
      </div>
      {title && (
        <b>
          <span className="section-title">{title}</span>
        </b>
      )}
      <input
          type="search"
          placeholder="Recherche..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: 5,
            borderRadius: 5,
            border: "1px solid #ccc",
            width: 250,
          }}
        />
  </div>
  );
}

export default Toolbar;