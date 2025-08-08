import React, { useState, useEffect } from "react";
import Spinner from 'react-bootstrap/Spinner';
import ResourcesUsage from "./desktop_details_element/ResourcesUsage";
import Metadata from "./desktop_details_element/Metadata";
import Spec from "./desktop_details_element/Spec";
import Status from "./desktop_details_element/Status";
import RawJson from "./desktop_details_element/RawJson";
import Containers from "./desktop_details_element/Containers";
import Volumes from "./desktop_details_element/Volumes";
import { fetchDesktopRaw } from "../services/desktopsService";
import { FAILURE_ICON } from "../utils/toastIconsClasses";

export default function DesktopDetails({ id, openToast = null }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
        const response = await fetchDesktopRaw(id);
        setData(response);
        } catch (err) {
        setError(err.message || "Erreur inconnue");
        } finally {
        setLoading(false);
        }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (error && openToast) {
      openToast(error, "danger", FAILURE_ICON);
    }
  }, [error, openToast]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="secondary" />
        <span className="loading-text">Loading...</span>
      </div>
    );
  }
  
  if (error) {
    return null; 
  }

  return (
    <div className="desktop-details">
      <ResourcesUsage desktopId={id} openToast={openToast} data={data}/>
      <Metadata id={id} data={data} />
      <Containers id={id} data={data} />
      <Volumes id={id} data={data} />
      <Spec id={id} data={data} />
      <Status id={id} data={data} />
      <RawJson id={id} data={data} />
    </div>
  );
}
