import React, { useState, useEffect } from "react";
import Spinner from 'react-bootstrap/Spinner';

// Import child detail sections
import ResourcesUsage from "./desktop_details_element/ResourcesUsage";
import Metadata from "./desktop_details_element/Metadata";
import Spec from "./desktop_details_element/Spec";
import Status from "./desktop_details_element/Status";
import RawJson from "./desktop_details_element/RawJson";
import Containers from "./desktop_details_element/Containers";
import Volumes from "./desktop_details_element/Volumes";

import { fetchDesktopRaw } from "../services/desktopsService";
import { FAILURE_ICON } from "../utils/toastIconsClasses";
import "../styles/desktopDetails.css";


// Component used to display all details for a single Desktop.
// Fetches raw data from the backend and renders child components
// (Resources, Metadata, Spec, Status, JSON, Containers, Volumes).
export default function DesktopDetails({ id, openToast = null }) {
  // State: full raw desktop object
  const [data, setData] = useState({});

  // Loading and error handling states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch desktop details every time ID changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchDesktopRaw(id); // API call
        setData(response);
      } catch (err) {
        setError(err.message || "Unknown error"); // fallback if no message
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
      <ResourcesUsage desktopId={id} openToast={openToast} data={data} />
      <Metadata id={id} data={data} />
      <Containers id={id} data={data} />
      <Volumes id={id} data={data} />
      <Spec id={id} data={data} />
      <Status id={id} data={data} />
      <RawJson id={id} data={data} />
    </div>
  );
}
