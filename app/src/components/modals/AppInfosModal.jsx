import React, { useEffect, useState } from 'react';
import GenericModal from '../generic/GenericModal';
import { prettyPrintJson } from '../../utils/prettyJson';
import { getAppInfos } from '../../services/appsService';

export default function AppInfosModal({ show, onClose, appId }) {
  const [appInfos, setAppInfos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && appId) {
      setLoading(true);
      setError(null);
      getAppInfos(appId)
        .then((data) => setAppInfos(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [show, appId]);

  let modalBody;
  if (loading) {
    modalBody = <p>Chargement en cours...</p>;
  } else if (error) {
    modalBody = <p style={{ color: 'red' }}>Erreur : {error}</p>;
  } else if (appInfos) {
    modalBody = (
      <pre
        className='prettyJson'
        dangerouslySetInnerHTML={{ __html: prettyPrintJson(appInfos) }}
      />
    );
  } else {
    modalBody = <p>Aucune donnée à afficher.</p>;
  }

  return (
    <GenericModal
        id="AppInfosModal"
        show={show}
        onClose={onClose}
        title="App Infos"
        body={modalBody}
        customClass="app-infos-modal"
    />
  );
}
