import React from 'react';
import { Accordion, Form, Row, Col, Badge, Button } from 'react-bootstrap';

const CLASS_BADGE_VARIANT = { default: 'secondary', bronze: 'warning', silver: 'light', gold: 'warning', platinum: 'info' };

/* ── Sub-component: requests/limits editor ──────────────────────────────── */
function ResourceEditor({ resources, onChange }) {
  const req = resources?.requests ?? {};
  const lim = resources?.limits   ?? {};

  const upd = (section, field, val) =>
    onChange({ ...resources, [section]: { ...(resources?.[section] ?? {}), [field]: val } });

  return (
    <Row className="g-2 mt-1">
      <Col xs={6}>
        <p className="config-subsection-title mb-2">Requests</p>
        <Form.Group className="mb-2">
          <Form.Label className="small">Memory</Form.Label>
          <Form.Control size="sm" value={req.memory ?? ''} placeholder="e.g. 576Mi"
            onChange={e => upd('requests', 'memory', e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label className="small">CPU</Form.Label>
          <Form.Control size="sm" value={req.cpu ?? ''} placeholder="e.g. 220m"
            onChange={e => upd('requests', 'cpu', e.target.value)} />
        </Form.Group>
      </Col>
      <Col xs={6}>
        <p className="config-subsection-title mb-2">Limits</p>
        <Form.Group className="mb-2">
          <Form.Label className="small">Memory</Form.Label>
          <Form.Control size="sm" value={lim.memory ?? ''} placeholder="e.g. 8Gi"
            onChange={e => upd('limits', 'memory', e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label className="small">CPU</Form.Label>
          <Form.Control size="sm" value={lim.cpu ?? ''} placeholder="e.g. 4000m"
            onChange={e => upd('limits', 'cpu', e.target.value)} />
        </Form.Group>
      </Col>
    </Row>
  );
}

/* ── Sub-component: full class editor ──────────────────────────────────── */
function ClassEditor({ name, data, onChange }) {
  const upd = (field, val) => onChange({ ...data, [field]: val });

  const nodeSelectorStr = data?.nodeSelector
    ? Object.entries(data.nodeSelector).map(([k, v]) => `${k}=${v}`).join(', ')
    : '';

  const parseNodeSelector = (raw) => {
    if (!raw.trim()) return null;
    return Object.fromEntries(
      raw.split(',').map(p => p.trim().split('=').map(s => s.trim())).filter(p => p.length === 2)
    );
  };

  const gpuCount = data?.containers?.graphical?.resources?.limits?.['nvidia.com/gpu'] ?? '0';

  return (
    <Row className="g-3">
      <Col xs={12}>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control size="sm" value={data?.description ?? ''} placeholder="Short description shown in UI"
            onChange={e => upd('description', e.target.value)} />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group>
          <Form.Label>Runtime Class</Form.Label>
          <Form.Select size="sm" value={data?.runtimeClassName ?? ''}
            onChange={e => upd('runtimeClassName', e.target.value || null)}>
            <option value="">None (default)</option>
            {['nvidia', 'kata-containers', 'gvisor'].map(r => <option key={r} value={r}>{r}</option>)}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group>
          <Form.Label>Node Selector <small className="text-muted">key=value, …</small></Form.Label>
          <Form.Control size="sm" value={nodeSelectorStr}
            placeholder="e.g. abcdesktoprole=worker"
            onChange={e => upd('nodeSelector', parseNodeSelector(e.target.value))} />
        </Form.Group>
      </Col>
      <Col xs={12}>
        <Form.Label>Resources</Form.Label>
        <ResourceEditor resources={data?.resources ?? {}} onChange={r => upd('resources', r)} />
      </Col>
      {/* GPU — only relevant for gold / platinum but let any class use it */}
      <Col md={4}>
        <Form.Group>
          <Form.Label>GPU <small className="text-muted">nvidia.com/gpu limit</small></Form.Label>
          <Form.Control size="sm" type="number" min={0} value={parseInt(gpuCount) || 0}
            onChange={e => {
              const n = parseInt(e.target.value) || 0;
              upd('containers', n > 0
                ? { graphical: { resources: { limits: { 'nvidia.com/gpu': String(n) } } } }
                : undefined);
            }} />
        </Form.Group>
      </Col>
    </Row>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function ExecuteClassesSection({ get, set }) {
  const classes = get('executeclasses') ?? {};
  const featuresPermissions = get('desktop.features_permissions') ?? [];

  const update = (name, data) => set('executeclasses', { ...classes, [name]: data });

  const toggleFeaturePermission = (perm, on) => {
    const next = on
      ? [...new Set([...featuresPermissions, perm])]
      : featuresPermissions.filter(p => p !== perm);
    set('desktop.features_permissions', next);
  };

  const addClass = () => {
    const name = window.prompt('New class name (e.g. custom):');
    if (!name || name.trim() === '' || classes[name.trim()]) return;
    set('executeclasses', {
      ...classes,
      [name.trim()]: {
        nodeSelector: null,
        runtimeClassName: null,
        description: name.trim(),
        resources: {
          requests: { memory: '576Mi', cpu: '220m' },
          limits:   { memory: '8Gi',   cpu: '4000m' },
        },
      },
    });
  };

  const removeClass = (name) => {
    const next = { ...classes };
    delete next[name];
    set('executeclasses', next);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="config-section-title mb-0">Execute Classes</p>
        <Button size="sm" variant="outline-primary" onClick={addClass}>
          <i className="bi bi-plus-lg me-1" />Add class
        </Button>
      </div>

      <Accordion alwaysOpen>
        {Object.entries(classes).map(([name, data], idx) => (
          <Accordion.Item key={name} eventKey={String(idx)} className="execute-class-card mb-2">
            <Accordion.Header>
              <span className="me-2">{name}</span>
              <Badge bg={CLASS_BADGE_VARIANT[name] ?? 'secondary'} text={name === 'silver' ? 'dark' : undefined} className="class-badge">
                {data?.resources?.limits?.memory ?? '—'}
              </Badge>
              <Badge bg="light" text="dark" className="class-badge">
                {data?.resources?.limits?.cpu ?? '—'}
              </Badge>
              {data?.runtimeClassName && (
                <Badge bg="info" text="dark" className="class-badge">{data.runtimeClassName}</Badge>
              )}
              {name !== 'default' && (
                <i
                  className="bi bi-trash ms-3 text-danger"
                  style={{ cursor: 'pointer', fontSize: '0.8rem' }}
                  onClick={e => { e.stopPropagation(); removeClass(name); }}
                  title="Delete class"
                />
              )}
            </Accordion.Header>
            <Accordion.Body>
              <ClassEditor name={name} data={data} onChange={d => update(name, d)} />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <div className="provider-card mb-3">
        <p className="config-subsection-title mb-2">Frontend features permissions</p>
        <p className="text-muted small mb-2">
          Read executeclasses and permit a user to set a dedicated class name as desktop features.
        </p>
        <div className="d-flex gap-4">
          <Form.Check type="switch" label="Read"
            checked={featuresPermissions.includes('read')}
            onChange={e => toggleFeaturePermission('read', e.target.checked)} />
          <Form.Check type="switch" label="Submit"
            checked={featuresPermissions.includes('submit')}
            onChange={e => toggleFeaturePermission('submit', e.target.checked)} />
        </div>
      </div>

      {Object.keys(classes).length === 0 && (
        <p className="text-muted text-center py-4">No execute classes defined.</p>
      )}
    </div>
  );
}
