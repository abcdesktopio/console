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
import Spinner from 'react-bootstrap/Spinner';
import { FAILURE_ICON, SUCCESS_ICON } from "../services/toastIconsClasses";

export default function DataTable({ data = { nodes: [] }, loading = false, error = null, searchTerm, expandable = false, handleSingleDeletion=null, setSelectedIds=null, openToast=null, handleAppInfos=null}) {
  const safeNodes = Array.isArray(data?.nodes) ? data.nodes : [];
  const safeData = { nodes: safeNodes };


  const [expandedIds, setExpandedIds] = React.useState([]);

  const handleToggleExpand = (item) => {
    if (!expandable) return;
    setExpandedIds((prev) =>
      prev.includes(item.ID) ? prev.filter((id) => id !== item.ID) : [...prev, item.ID]
    );
  };

  function renderExpandedRow(item) {
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
            <ul style={{ margin: 0, padding: 0 }}>
              {Object.entries(item).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {String(value)}
                </li>
              ))}
            </ul>
          </td>
        </tr>
      );
  }  

  // ➤ Sélection
  const select = useRowSelect(data, {
    onChange: (action, state) => {
      if (setSelectedIds) setSelectedIds(select.state.ids);
      console.log("Lignes sélectionnées :", select.state.ids);
    },
  });

  if (loading) return <div className="loading-spinner"> <Spinner animation="border" variant="primary" /> <span className="loading-text">Loading...</span> </div> ;
  if (error) openToast(error, "danger", FAILURE_ICON);
  if (!safeNodes.length) return <p>Aucune donnée à afficher.</p>;

  return (
    <div className="table-container">

      {!loading && !error && (
        <Table data={safeData} select={select}>
          {(tableList) => {
            const filteredList = searchTerm
              ? tableList.filter((item) =>
                  Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
              : tableList;

            return (
              <>
                <Header>
                  <HeaderRow>
                    <HeaderCell>
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

                    {data.nodes[0] &&
                      Object.keys(data.nodes[0]).map((col) => (
                        <HeaderCell key={col}>{col}</HeaderCell>
                      ))}
                    <HeaderCell>Action</HeaderCell>
                  </HeaderRow>
                </Header>

                <Body>
                  {filteredList.map((item) => (
                    <React.Fragment key={item.ID}>
                      <Row item={item}>
                        <Cell>
                          <input
                            type="checkbox"
                            checked={select.state.ids.includes(item.ID)}
                            onChange={() => select.fns.onToggleById(item.ID)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Cell>

                        {Object.keys(item).map((col) => {
                          const value = String(item[col]);

                          if (col === "Desktop name") {
                            return (
                              <Cell
                                key={`${item.ID}-${col}`}
                                style={{ cursor: "pointer" , color: "#6dc5ef" }}
                                onClick={() => handleToggleExpand(item)}
                              >
                                {value}
                              </Cell>
                            );
                          }

                          else if (col === "Icon") {
                              return <Cell key={`${item.ID}-${col}`}><img src={`data:image/svg+xml;base64,${value}`}/></Cell>;
                          }
                          else if (col === "App name") {
                            return(
                                <Cell
                                    key={`${item.ID}-${col}`}
                                    style={{ cursor: "pointer" , color: "#6dc5ef" }}
                                    onClick={() => handleAppInfos(item.ID)}
                                >
                                    {value}
                                </Cell>
                            );
                          }
                          return <Cell key={`${item.ID}-${col}`}>{String(item[col])}</Cell>;
                        })}

                        <Cell className="actions-icons-container"> 
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Suppression de", item.ID);
                              handleSingleDeletion(item.ID);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#dc3545",
                            }}
                          >
                            <i className="bi bi-trash-fill" />
                          </button>
                        </Cell>
                      </Row>

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