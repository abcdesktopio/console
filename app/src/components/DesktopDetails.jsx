import React, { useState, useEffect } from "react";
import Spinner from 'react-bootstrap/Spinner';

// Import child detail sections
import ResourcesUsage from "./desktop_details_element/ResourcesUsage";
import Metadata from "./desktop_details_element/Metadata";
import Spec from "./desktop_details_element/Spec";
import Status from "./desktop_details_element/Status";
import RawJson from "./desktop_details_element/RawJson";
import ContainersAndPods from "./desktop_details_element/ContainersAndPods";
import Volumes from "./desktop_details_element/Volumes";

import { fetchDesktopRaw , getDesktopPods} from "../services/desktopsService";
import { FAILURE_ICON } from "../utils/toastIconsClasses";
import "../styles/desktopDetails.css";


// Component used to display all details for a single Desktop.
// Fetches raw data from the backend and renders child components
// (Resources, Metadata, Spec, Status, JSON, Containers, Volumes).
export default function DesktopDetails({ id, openToast = null, setRefreshCount = null }) {
  // State: full raw desktop object
  const [data, setData] = useState({});
  
  // State: list of running pod applications
  const [podsData, setPodsData] = useState({});

  // Used to trigger re-fetching of data (increment counter → reload)
  const [podsRefreshCount, setPodsRefreshCount] = useState(0);

  // Loading and error handling states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch desktop details 
  async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchDesktopRaw(id); // API call
        setData(response);
        const podsResponse = await getDesktopPods(id, false); // API call
        setPodsData(podsResponse);
      } catch (err) {
        setError(err.message || "Unknown error"); // fallback if no message
      } finally {
        setLoading(false);
      }
  }

  // Reload data every time podsRefreshCount or id changes
  useEffect(() => {
    fetchData();
  }, [podsRefreshCount, id]);

  // Whenever an error occurs, use toast to surface it
  useEffect(() => {
    if (error && openToast) {
      openToast(error, "danger", FAILURE_ICON);
    }
  }, [error, openToast]);

  // While fetching, show spinner
  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="secondary" />
        <span className="loading-text">Loading...</span>
      </div>
    );
  }
  
  // If error, do not render child sections (toast already displayed).
  if (error) {
    return null;
  }

  // Render all child detail sections with the fetched data
  return (
    <div className="desktop-details">
      <ResourcesUsage desktopId={id} openToast={openToast} data={data} setRefreshCount={setRefreshCount}/>
      <Metadata data={data} />
      <ContainersAndPods desktopId={id} openToast={openToast} data={data} podsData={podsData} setPodsRefreshCount={setPodsRefreshCount}/>
      <Volumes data={data} />
      <Spec data={data} />
      <Status data={data} />
      <RawJson data={data} />
    </div>
  );
}
