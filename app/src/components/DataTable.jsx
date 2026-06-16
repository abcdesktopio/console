import * as React from "react";
import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
} from "@table-library/react-table-library/table";

import { useRowSelect } from "@table-library/react-table-library/select";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Spinner, Badge, Card } from 'react-bootstrap';
import DesktopDetails from "./DesktopDetails";
import { FAILURE_ICON } from "../utils/toastIconsClasses";
import "../styles/dataTable.css";
import "../styles/desktopDetails.css";


// Generic DataTable component used throughout the application.
// Supports searching, row selection, expandable rows, error/loading states, 
// icons, colored status, and action buttons.
export default function DataTable({
  data = { nodes: [] },              // shape expected by table-library: { nodes: [...] }
  loading = false,                   // flag to show loading spinner
  error = null,                      // error message (if fetch failed)
  searchTerm = "",                   // for client-side search filtering
  expandable = false,                // allows expandable detail rows (only if true)
  handleSingleDeletion = null,       // callback for delete action button
  setSelectedIds = null,             // callback for row selection state
  openToast = null,                  // function to show error/success toasts
  handleAppInfos = null,             // handler for opening app details modal
  setRefreshCount = null             // callback for triggering refresh
}) {
    
  // Ensure data is always a valid array
  const safeNodes = Array.isArray(data?.nodes) ? data.nodes : [];
  const safeData = { nodes: safeNodes };

  // Track which rows are expanded
  const [expandedIds, setExpandedIds] = React.useState([]);

  // Toggle expanded row for DesktopDetails
  const handleToggleExpand = (item) => {
    if (!expandable) return;
    setExpandedIds((prev) =>
      prev.includes(item.ID)
        ? prev.filter((id) => id !== item.ID)
        : [...prev, item.ID]
    );
  };

  // Render additional row with "DesktopDetails" (expand/collapse)
  function renderExpandedRow(item) {
    if (item.Status !== "Running") return null;
    return (
      <tr style={{ display: "flex", gridColumn: "1 / -1" }}>
        <td
          style={{
            flex: "1",
            padding: "1rem",
            background: "#eee",
          }}
          colSpan="100%"
        >
          <DesktopDetails id={item.ID} openToast={openToast} setRefreshCount={setRefreshCount}/>
        </td>
      </tr>
    );
  }

  // ➤ Row selection (multi-select with checkboxes)
  const select = useRowSelect(data, {
    onChange: (action, state) => {
      if (setSelectedIds) setSelectedIds(select.state.ids);
      console.log("Selected rows:", select.state.ids);
    },
  });

  // Calculate dynamic column count
  const nbDataCols = data.nodes[0] ? Object.keys(data.nodes[0]).length : 0;
  const withCheckbox = setSelectedIds ? 1 : 0;
  const withAction = handleSingleDeletion ? 1 : 0;
  const nbCols = nbDataCols + withCheckbox + withAction;

  // Define grid layout template for columns (responsive / flexible)
  const minCols = handleAppInfos
    ? Math.max(nbDataCols - 2, 0)
    : Math.max(nbDataCols - 1, 0);

  const columnsTemplate = handleAppInfos
    ? [
        ...(setSelectedIds ? ["44px"] : []), 
        "100px",                             
        ...Array(minCols).fill("minmax(200px, min-content)"),
        "minmax(120px, 1fr)",               
        ...(handleSingleDeletion ? ["70px"] : []) 
      ].join(" ")
    : expandable ? 
      [
        ...(setSelectedIds ? ["44px"] : []),
        ...Array(minCols).fill("minmax(150px, min-content)"),
        "minmax(120px, 1fr)",
        ...(handleSingleDeletion ? ["70px"] : [])
      ].join(" ")
    : [
        ...(setSelectedIds ? ["44px"] : []),
        ...Array(nbDataCols).fill("minmax(120px, 1fr)"),
        ...(handleSingleDeletion ? ["70px"] : [])
      ].join(" ");

  // Apply table theme with custom grid style
  const theme = useTheme([
    getTheme(),
    { Table: `--data-table-library_grid-template-columns: ${columnsTemplate};` }
  ]);

  // Handle loading / error / empty data
  if (loading)
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="secondary" />
        <span className="loading-text">Loading...</span>
      </div>
    );

  if (error) openToast(error, "danger", FAILURE_ICON);

  if (!safeNodes.length)
    return (
      <Card>
        <Card.Body className="no-data-container">
          <span className="no-data-text">No data to display</span>
        </Card.Body>
      </Card>
    );

  return (
    <div className="table-container table-scrollable">
      {!loading && !error && (
        <Table data={safeData} select={select} theme={theme} layout={{ custom: true }}>
          {(tableList) => {
            // Client-side search
            const filteredList = searchTerm
              ? tableList.filter((item) =>
                  Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
              : tableList;

            // Sort alphabetically by "App name" if the column exists
            const hasAppName = data.nodes[0] && "App name" in data.nodes[0];
            if (hasAppName) {
              filteredList.sort((a, b) =>
                String(a["App name"]).localeCompare(String(b["App name"]))
              );
            }

            return (
              <>
                {/* ---------- Table Header ---------- */}
                <Header>
                  <HeaderRow>
                    {setSelectedIds && (
                      <HeaderCell>
                        {/* Master checkbox for all filtered rows */}
                        <input
                          type="checkbox"
                          checked={
                            filteredList.length > 0 &&
                            filteredList.every((item) => select.state.ids.includes(item.ID))
                          }
                          ref={(el) => {
                            if (!el) return;
                            const someSelected =
                              filteredList.some((item) => select.state.ids.includes(item.ID)) &&
                              !filteredList.every((item) => select.state.ids.includes(item.ID));
                            el.indeterminate = someSelected;
                          }}
                          onChange={() => {
                            const filteredIds = filteredList
                              .map((item) => item.ID)
                              .filter((id) => id !== undefined);

                            const allSelected = filteredIds.every((id) =>
                              select.state.ids.includes(id)
                            );

                            if (allSelected) {
                              filteredIds.forEach((id) => select.fns.onToggleById(id));
                            } else {
                              filteredIds
                                .filter((id) => !select.state.ids.includes(id))
                                .forEach((id) => select.fns.onToggleById(id));
                            }
                          }}
                        />
                      </HeaderCell>
                    )}

                    {/* Dynamically render table headers based on object keys */}
                    {data.nodes[0] &&
                      Object.keys(data.nodes[0]).map((col) => (
                        <HeaderCell key={col}>{col}</HeaderCell>
                      ))}

                    {handleSingleDeletion && <HeaderCell>Action</HeaderCell>}
                  </HeaderRow>
                </Header>

                {/* ---------- Table Body ---------- */}
                <Body>
                  {filteredList.map((item) => (
                    <React.Fragment key={item.ID}>
                      <Row item={item}>
                        {/* Row selection checkbox */}
                        {setSelectedIds && (
                          <Cell>
                            <input
                              type="checkbox"
                              checked={select.state.ids.includes(item.ID)}
                              onChange={() => select.fns.onToggleById(item.ID)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Cell>
                        )}

                        {/* Automatically render all columns */}
                        {Object.keys(item).map((col) => {
                          const value = String(item[col]);

                          // Special renderings for specific col types
                          if (col === "Desktop name") {
                            return (
                              <Cell
                                key={`${item.ID}-${col}`}
                                style={{ cursor: "pointer", color: "#6dc5ef" }}
                                onClick={() => handleToggleExpand(item)}
                              >
                                {value}
                              </Cell>
                            );
                          } else if (col === "Icon") {
                            return (
                              <Cell key={`${item.ID}-${col}`}>
                                <img src={`data:image/svg+xml;base64,${value}`} />
                              </Cell>
                            );
                          } else if (col === "App name") {
                            return (
                              <Cell
                                key={`${item.ID}-${col}`}
                                style={{ cursor: "pointer", color: "#6dc5ef" }}
                                onClick={() => handleAppInfos(item.ID)}
                              >
                                {value}
                              </Cell>
                            );
                          } else if (col === "Status") {
                            return (
                              <Cell key={`${item.ID}-${col}`}>
                                {value.toLowerCase() === "running" ? (
                                  <Badge bg="success">{value}</Badge>
                                ) : (
                                  <Badge bg="danger">{value}</Badge>
                                )}
                              </Cell>
                            );
                          }
                          // Default: just render string
                          return <Cell key={`${item.ID}-${col}`}>{value}</Cell>;
                        })}

                        {/* Optional action column with delete button */}
                        {handleSingleDeletion && (
                          <Cell className="actions-icons-container">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Deleting", item.ID);
                                handleSingleDeletion(item.ID);
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#dc3545",
                                marginLeft: "15px",
                                fontSize: "1.5rem",
                              }}
                            >
                              <i className="bi bi-trash-fill" />
                            </button>
                          </Cell>
                        )}
                      </Row>

                      {/* Expanded row details */}
                      {expandedIds.includes(item.ID) && renderExpandedRow(item)}
                    </React.Fragment>
                  ))}
                </Body>
              </>
            );
          }}
        </Table>
      )}
    </div>
  );
}