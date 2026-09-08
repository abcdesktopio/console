import React, { useState } from 'react';
import { Accordion, Form, Row, Col, Badge, Button } from 'react-bootstrap';

const PULL_POLICIES = ['Always', 'IfNotPresent', 'Never'];

// Known volume names that may appear in pod configs
const KNOWN_VOLUMES = ['shm', 'run', 'tmp', 'log', 'rundbus', 'runuser', 'x11socket', 'sudoers', 'home', 'extrausers'];

const CONTAINER_META = {
  graphical:           { label: 'Graphical',            icon: 'bi-display',         hasImage: true,  hasTcpPort: true  },
  spawner:             { label: 'Spawner',               icon: 'bi-lightning-charge', hasImage: false, hasTcpPort: true  },
  broadcast:           { label: 'Broadcast',             icon: 'bi-broadcast',        hasImage: false, hasTcpPort: true  },
  webshell:            { label: 'Web Shell',             icon: 'bi-terminal',         hasImage: false, hasTcpPort: true  },
  printer:             { label: 'Printer (cupsd)',       icon: 'bi-printer',          hasImage: true,  hasTcpPort: true  },
  printerfile:         { label: 'Printer File',          icon: 'bi-file-earmark',     hasImage: false, hasTcpPort: true  },
  filer:               { label: 'Filer',                 icon: 'bi-folder2-open',     hasImage: true,  hasTcpPort: true  },
  sound:               { label: 'Sound (pulseaudio)',    icon: 'bi-volume-up',        hasImage: true,  hasTcpPort: true  },
  init:                { label: 'Init',                  icon: 'bi-play-circle',      hasImage: true,  hasTcpPort: false },
  ephemeral_container: { label: 'Ephemeral Container',  icon: 'bi-boxes',            hasImage: false, hasTcpPort: false },
  pod_application:     { label: 'Pod Application',      icon: 'bi-grid',             hasImage: false, hasTcpPort: false },
};

/* ── Volume tag selector ───────────────────────────────────────────────── */
function VolumeSelector({ volumes, onChange }) {
  const active = volumes ?? [];
  const allVols = [...new Set([...KNOWN_VOLUMES, ...active])];

  const toggle = (vol) => {
    if (active.includes(vol)) onChange(active.filter(v => v !== vol));
    else onChange([...active, vol]);
  };

  return (
    <div className="volumes-tag-list">
      {allVols.map(vol => (
        <span
          key={vol}
          className={`volume-tag ${active.includes(vol) ? 'volume-tag-on' : 'volume-tag-off'}`}
          onClick={() => toggle(vol)}
          title={active.includes(vol) ? 'Click to remove' : 'Click to add'}
        >
          {vol}
        </span>
      ))}
    </div>
  );
}

/* ── Single container editor ──────────────────────────────────────────── */
function ContainerEditor({ name, container, onChange }) {
  const meta = CONTAINER_META[name] ?? { hasImage: true, hasTcpPort: true };
  const upd = (field, val) => onChange({ ...container, [field]: val });

  const imageValue = typeof container?.image === 'object'
    ? (container.image?.default ?? '')
    : (container?.image ?? '');

  const setImage = (val) => upd('image',
    typeof container?.image === 'object' ? { ...container.image, default: val } : val
  );

  return (
    <Row className="g-3">
      <Col xs={12}>
        <Form.Check type="switch" label="Enabled"
          checked={container?.enable !== false}
          onChange={e => upd('enable', e.target.checked)} />
      </Col>

      {meta.hasTcpPort && container?.tcpport !== undefined && (
        <Col md={2}>
          <Form.Group>
            <Form.Label>TCP Port</Form.Label>
            <Form.Control size="sm" type="number" value={container.tcpport ?? ''}
              onChange={e => upd('tcpport', parseInt(e.target.value))} />
          </Form.Group>
        </Col>
      )}

      {meta.hasImage && container?.image !== undefined && (
        <>
          <Col md={8}>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control size="sm" value={imageValue} onChange={e => setImage(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Pull Policy</Form.Label>
              <Form.Select size="sm" value={container?.imagePullPolicy ?? 'IfNotPresent'}
                onChange={e => upd('imagePullPolicy', e.target.value)}>
                {PULL_POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
        </>
      )}

      {/* Image pull policy for containers that don't have an explicit image field but have pull policy */}
      {!meta.hasImage && container?.imagePullPolicy !== undefined && (
        <Col md={3}>
          <Form.Group>
            <Form.Label>Pull Policy</Form.Label>
            <Form.Select size="sm" value={container?.imagePullPolicy ?? 'IfNotPresent'}
              onChange={e => upd('imagePullPolicy', e.target.value)}>
              {PULL_POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
      )}

      {container?.volumes !== undefined && (
        <Col xs={12}>
          <Form.Label>Volumes <small className="text-muted">(click to toggle)</small></Form.Label>
          <VolumeSelector volumes={container.volumes} onChange={v => upd('volumes', v)} />
        </Col>
      )}

      {/* Security context excerpt */}
      {container?.securityContext !== undefined && (
        <Col xs={12}>
          <details>
            <summary className="text-muted small" style={{ cursor: 'pointer' }}>Security Context</summary>
            <Row className="g-2 mt-1">
              {container.securityContext.runAsUser !== undefined && (
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="small">runAsUser</Form.Label>
                    <Form.Control size="sm" value={container.securityContext.runAsUser ?? ''}
                      onChange={e => upd('securityContext', { ...container.securityContext, runAsUser: e.target.value })} />
                  </Form.Group>
                </Col>
              )}
              {container.securityContext.runAsGroup !== undefined && (
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="small">runAsGroup</Form.Label>
                    <Form.Control size="sm" value={container.securityContext.runAsGroup ?? ''}
                      onChange={e => upd('securityContext', { ...container.securityContext, runAsGroup: e.target.value })} />
                  </Form.Group>
                </Col>
              )}
              {container.securityContext.readOnlyRootFilesystem !== undefined && (
                <Col md={3} className="d-flex align-items-end">
                  <Form.Check size="sm" type="switch" label="readOnlyRootFS"
                    checked={container.securityContext.readOnlyRootFilesystem ?? false}
                    onChange={e => upd('securityContext', { ...container.securityContext, readOnlyRootFilesystem: e.target.checked })} />
                </Col>
              )}
              {container.securityContext.allowPrivilegeEscalation !== undefined && (
                <Col md={3} className="d-flex align-items-end">
                  <Form.Check size="sm" type="switch" label="allowPrivEscalation"
                    checked={container.securityContext.allowPrivilegeEscalation ?? false}
                    onChange={e => upd('securityContext', { ...container.securityContext, allowPrivilegeEscalation: e.target.checked })} />
                </Col>
              )}
            </Row>
          </details>
        </Col>
      )}
    </Row>
  );
}

/* ── Pod spec editor ───────────────────────────────────────────────────── */
function PodSpecEditor({ pod, onChange }) {
  const spec = pod?.spec ?? {};
  const updSpec = (field, val) => onChange({ ...pod, spec: { ...spec, [field]: val } });

  return (
    <div>
      <p className="config-section-title mt-3">Pod Spec</p>
      <Form.Check type="switch" label="Share Process Namespace"
        checked={spec.shareProcessNamespace ?? false}
        onChange={e => updSpec('shareProcessNamespace', e.target.checked)} />
    </div>
  );
}

/* ── Default volumes editor ─────────────────────────────────────────────── */
function DefaultVolumesEditor({ pod, onChange }) {
  const defVols = pod?.default_volumes ?? {};

  const updateVol = (name, conf) => onChange({ ...pod, default_volumes: { ...defVols, [name]: conf } });

  return (
    <div>
      <p className="config-section-title mt-3">Default Volumes</p>
      {Object.entries(defVols).map(([volName, volConf]) => (
        <Row key={volName} className="g-2 mb-2 align-items-center">
          <Col md={2}><code className="small">{volName}</code></Col>
          <Col md={3}>
            <Form.Control size="sm" placeholder="medium (e.g. Memory)"
              value={volConf?.emptyDir?.medium ?? ''}
              onChange={e => updateVol(volName, { ...volConf, emptyDir: { ...volConf?.emptyDir, medium: e.target.value } })} />
          </Col>
          <Col md={3}>
            <Form.Control size="sm" placeholder="sizeLimit (e.g. 8Gi)"
              value={volConf?.emptyDir?.sizeLimit ?? ''}
              onChange={e => updateVol(volName, { ...volConf, emptyDir: { ...volConf?.emptyDir, sizeLimit: e.target.value } })} />
          </Col>
        </Row>
      ))}
    </div>
  );
}

/* ── Main section ───────────────────────────────────────────────────────── */
export default function DesktopPodSection({ get, set }) {
  const pod = get('desktop.pod') ?? {};

  const updateContainer = (name, data) => set('desktop.pod', { ...pod, [name]: data });
  const updatePod = (data) => set('desktop.pod', data);

  const containerNames = Object.keys(CONTAINER_META).filter(n => pod[n] !== undefined);

  return (
    <div>
      <p className="config-section-title">Desktop Pod — Containers</p>

      <Accordion alwaysOpen>
        {containerNames.map((name, idx) => {
          const meta = CONTAINER_META[name];
          const container = pod[name];
          const isEnabled = container?.enable !== false;
          return (
            <Accordion.Item key={name} eventKey={String(idx)} className="execute-class-card mb-2">
              <Accordion.Header>
                <i className={`bi ${meta.icon} me-2`} style={{ color: '#6dc5ef' }} />
                <span>{meta.label}</span>
                <Badge bg={isEnabled ? 'success' : 'secondary'} className="class-badge">
                  {isEnabled ? 'enabled' : 'disabled'}
                </Badge>
                {container?.tcpport && (
                  <Badge bg="light" text="dark" className="class-badge">:{container.tcpport}</Badge>
                )}
                {container?.imagePullPolicy && (
                  <Badge bg="light" text="dark" className="class-badge">{container.imagePullPolicy}</Badge>
                )}
              </Accordion.Header>
              <Accordion.Body>
                <ContainerEditor
                  name={name}
                  container={container}
                  onChange={data => updateContainer(name, data)}
                />
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>

      <PodSpecEditor pod={pod} onChange={updatePod} />
      <DefaultVolumesEditor pod={pod} onChange={updatePod} />
    </div>
  );
}
