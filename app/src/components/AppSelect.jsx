import React, { useEffect, useState } from 'react';
import { getApps } from '../services/appsService'
import { getDock } from '../services/webfrontService'

export default function AppSelect({ show, onChange, openToast }) {
  const [allApps, setAllApps] = useState([]);
  const [dockApps, setDockApps] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (!show) return; 
    let cancelled = false;

    getApps()
      .then((res) => {
        if (cancelled) return;
        setAllApps(Object.values(res)); 
        const dock_data = getDock();
        setDockApps(dock_data[0].dock); 
      })
      .catch((error) => {
        if (cancelled) return;
        setError(error.message || "Erreur lors du chargement des apps");
        openToast(error.message, "danger", FAILURE_ICON);
      });
      return () => { cancelled = true };
  }, [show]);

  const filteredApps = allApps.filter(app => !dockApps.includes(app.launch));

  return (
    <div>
      <select
        id="addAppSelect"
        className="form-select"
        value={selected}
        onChange={e => {
          setSelected(e.target.value);
          if (onChange) onChange(e.target.value);
        }}
      >
        <option value="">Choose an application to add</option>
        {filteredApps.map((app, i) => (
          <option key={app.launch} value={app.launch}>
            {app.name}
          </option>
        ))}
      </select>
      {error && (
        <div className="alert alert-danger mt-2">{error}</div>
      )}
    </div>
  );
}
