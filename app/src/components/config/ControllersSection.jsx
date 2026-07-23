import React from 'react';
import { Form, Row, Col, InputGroup, Button } from 'react-bootstrap';

/* ── helper: editable CIDR list ─────────────────────────────────────────── */
function PermitIpEditor({ ips, onChange }) {
  const list = ips ?? [];
  return (
    <div className="d-flex flex-column gap-1">
      {list.map((ip, i) => (
        <InputGroup key={i} size="sm">
          <Form.Control
            value={ip}
            onChange={e => { const n = [...list]; n[i] = e.target.value; onChange(n); }}
          />
          <Button variant="outline-danger" onClick={() => onChange(list.filter((_, j) => j !== i))}>
            <i className="bi bi-x" />
          </Button>
        </InputGroup>
      ))}
      <Button variant="outline-secondary" size="sm" style={{ width: 'fit-content' }}
        onClick={() => onChange([...list, ''])}>
        <i className="bi bi-plus me-1" />Add CIDR
      </Button>
    </div>
  );
}

/* ── helper: generic controller card ───────────────────────────────────── */
function ControllerEditor({ name, ctrl, onChange, children }) {
  const data = ctrl ?? {};
  const setField = (field, val) => onChange({ ...data, [field]: val });
  return (
    <div className="provider-card p-3 h-100">
      <p className="config-subsection-title">{name}</p>

      {/* API Keys — available on every controller */}
      <Form.Group className="mb-3">
        <Form.Label className="small fw-semibold">API Keys <span className="text-muted fw-normal">(one per line)</span></Form.Label>
        <Form.Control as="textarea" rows={2} size="sm"
          value={(data.apikey ?? []).join('\n')}
          onChange={e => setField('apikey', e.target.value.split('\n').map(s => s.trim()).filter(Boolean))}
        />
      </Form.Group>

      {/* Permitted IPs */}
      <Form.Label className="small fw-semibold">Permitted IPs</Form.Label>
      <PermitIpEditor ips={data.permitip} onChange={v => setField('permitip', v)} />

      {/* Controller-specific extras */}
      {children && <div className="mt-3 border-top pt-2">{children}</div>}
    </div>
  );
}

/* ── main section ───────────────────────────────────────────────────────── */
export default function ControllersSection({ get, set }) {
  const controllers = get('controllers') ?? {};
  const setCtrl = (name, val) => set('controllers', { ...controllers, [name]: val });

  // List of "always visible" controllers + any extra ones found in the config
  const knownControllers = ['ManagerController', 'DesktopController', 'ComposerController', 'StoreController'];
  const extraControllers = Object.keys(controllers).filter(k => !knownControllers.includes(k));

  return (
    <div>
      <p className="config-section-title">Controllers</p>
      <Row className="g-4">

        {/* ManagerController */}
        <Col md={6}>
          <ControllerEditor
            name="ManagerController"
            ctrl={controllers.ManagerController}
            onChange={v => setCtrl('ManagerController', v)}
          />
        </Col>

        {/* DesktopController */}
        <Col md={6}>
          <ControllerEditor
            name="DesktopController"
            ctrl={controllers.DesktopController}
            onChange={v => setCtrl('DesktopController', v)}
          >
            <Form.Check type="switch" label="Allow DNS requests"
              checked={controllers.DesktopController?.requestsallowed?.dns ?? true}
              onChange={e => setCtrl('DesktopController', {
                ...controllers.DesktopController,
                requestsallowed: { ...controllers.DesktopController?.requestsallowed, dns: e.target.checked },
              })}
            />
          </ControllerEditor>
        </Col>

        {/* ComposerController */}
        <Col md={6}>
          <ControllerEditor
            name="ComposerController"
            ctrl={controllers.ComposerController}
            onChange={v => setCtrl('ComposerController', v)}
          >
            <Form.Check type="switch" label="Allow getdesktopdescription"
              checked={controllers.ComposerController?.requestsallowed?.getdesktopdescription ?? true}
              onChange={e => setCtrl('ComposerController', {
                ...controllers.ComposerController,
                requestsallowed: { ...controllers.ComposerController?.requestsallowed, getdesktopdescription: e.target.checked },
              })}
            />
          </ControllerEditor>
        </Col>

        {/* StoreController */}
        <Col md={6}>
          <ControllerEditor
            name="StoreController"
            ctrl={controllers.StoreController}
            onChange={v => setCtrl('StoreController', v)}
          />
        </Col>

        {/* Extra controllers found in the config (e.g. AccountingController) */}
        {extraControllers.map(name => (
          <Col md={6} key={name}>
            <ControllerEditor
              name={name}
              ctrl={controllers[name]}
              onChange={v => setCtrl(name, v)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
