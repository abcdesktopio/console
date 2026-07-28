import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const MENU_ITEMS = ['settings', 'appstore', 'screenshot', 'download', 'logout', 'disconnect'];

/* ── Background color list ──────────────────────────────────────────────── */
function ColorListEditor({ colors, onChange }) {
  const list = colors ?? [];
  return (
    <div>
      <Form.Label>Background Colors <small className="text-muted">(up to 8)</small></Form.Label>
      <div className="d-flex flex-wrap gap-2 align-items-center mt-1">
        {list.map((color, i) => (
          <div key={i} className="d-flex flex-column align-items-center gap-1">
            <input type="color" className="color-swatch-input" value={color}
              onChange={e => { const n = [...list]; n[i] = e.target.value; onChange(n); }} />
            <Button variant="link" size="sm" className="p-0 text-danger" style={{ fontSize: '0.7rem' }}
              onClick={() => onChange(list.filter((_, j) => j !== i))}>
              <i className="bi bi-x" />
            </Button>
          </div>
        ))}
        {list.length < 8 && (
          <Button variant="outline-secondary" size="sm" onClick={() => onChange([...list, '#6EC6F0'])}>
            <i className="bi bi-plus" />
          </Button>
        )}
      </div>
    </div>
  );
}

/* ── Welcome info script editor ───────────────────────────────────────────  */
function ScriptEditor({ script, onChange }) {
  const s = script ?? {};
  const upd = (field, val) => onChange({ ...s, [field]: val });
  return (
    <div className="border rounded p-2 mt-2" style={{ background: '#f8f9fa' }}>
      <Row className="g-2">
        <Col xs={12}>
          <Form.Check type="switch" label="Async" checked={s.async ?? false}
            onChange={e => upd('async', e.target.checked)} />
        </Col>
        <Col xs={12}>
          <Form.Label className="small fw-semibold">Src <span className="text-muted fw-normal">(external script URL)</span></Form.Label>
          <Form.Control size="sm" value={s.src ?? ''}
            onChange={e => upd('src', e.target.value)} placeholder="https://..." />
        </Col>
        <Col xs={12}>
          <Form.Label className="small fw-semibold">Inline data <span className="text-muted fw-normal">(JS code)</span></Form.Label>
          <Form.Control as="textarea" rows={3} size="sm"
            style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
            value={s.data ?? ''}
            onChange={e => upd('data', e.target.value)} />
        </Col>
      </Row>
    </div>
  );
}

/* ── Welcome info entry editor ────────────────────────────────────────────  */
function WelcomeEntryEditor({ entry, onChange, onRemove }) {
  const hasScript = entry.script !== undefined;
  const upd = (field, val) => onChange({ ...entry, [field]: val });

  const toggleScript = (checked) => {
    if (checked) {
      onChange({ ...entry, script: entry.script ?? { async: false, src: '' } });
    } else {
      const { script, ...rest } = entry;
      onChange(rest);
    }
  };

  return (
    <div className="provider-card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <p className="config-subsection-title mb-0">Welcome entry</p>
        <Button variant="link" size="sm" className="text-danger p-0" onClick={onRemove}>
          <i className="bi bi-trash" />
        </Button>
      </div>
      <Row className="g-2">
        <Col md={6}>
          <Form.Label className="small fw-semibold">Not before</Form.Label>
          <Form.Control size="sm" value={entry.notbefore ?? ''}
            onChange={e => upd('notbefore', e.target.value)}
            placeholder="04 Dec 2023 00:12:00 GMT" />
        </Col>
        <Col md={6}>
          <Form.Label className="small fw-semibold">Not after</Form.Label>
          <Form.Control size="sm" value={entry.notafter ?? ''}
            onChange={e => upd('notafter', e.target.value)}
            placeholder="08 Dec 2023 00:12:00 GMT" />
        </Col>

        <Col xs={12}>
          <Form.Check type="switch" className="mt-2"
            label="Inject a script instead of a message"
            checked={hasScript}
            onChange={e => toggleScript(e.target.checked)} />
        </Col>

        {hasScript ? (
          <Col xs={12}>
            <ScriptEditor script={entry.script} onChange={s => upd('script', s)} />
          </Col>
        ) : (
          <>
            <Col xs={12}>
              <Form.Label className="small fw-semibold">Title <span className="text-muted fw-normal">(optional)</span></Form.Label>
              <Form.Control size="sm" value={entry.title ?? ''}
                onChange={e => upd('title', e.target.value)} />
            </Col>
            <Col xs={12}>
              <Form.Label className="small fw-semibold">Information <span className="text-muted fw-normal">(HTML allowed)</span></Form.Label>
              <Form.Control as="textarea" rows={3} size="sm"
                value={entry.information ?? ''}
                onChange={e => upd('information', e.target.value)} />
            </Col>
          </>
        )}
      </Row>
    </div>
  );
}

export default function FrontendSection({ get, set }) {
  const menuConfig  = get('front.menuconfig')        ?? {};
  const imageNotif  = get('front.imagenotification') ?? {};
  const tipsinfo    = get('tipsinfo')                ?? {};
  const welcomeinfo = get('welcomeinfo')              ?? {};
  const welcomeList = welcomeinfo.welcome ?? [];

  const updWelcome = (list) => set('welcomeinfo', { ...welcomeinfo, welcome: list });

  return (
    <div>
      {/* ── Menu ──────────────────────────────────────────────────────── */}
      <p className="config-section-title">Main Menu</p>
      <div className="d-flex flex-wrap gap-4 mb-4">
        {MENU_ITEMS.map(item => (
          <Form.Check key={item} type="switch" id={`menu-${item}`}
            label={item.charAt(0).toUpperCase() + item.slice(1)}
            checked={menuConfig[item] ?? true}
            onChange={e => set('front.menuconfig', { ...menuConfig, [item]: e.target.checked })} />
        ))}
      </div>

      {/* ── Notifications ─────────────────────────────────────────────── */}
      <p className="config-section-title">Image Pull Notifications</p>
      <div className="d-flex gap-4 mb-4">
        <Form.Check type="switch" label="Ephemeral Container"
          checked={imageNotif.ephemeral_container ?? false}
          onChange={e => set('front.imagenotification', { ...imageNotif, ephemeral_container: e.target.checked })} />
        <Form.Check type="switch" label="Pod Application"
          checked={imageNotif.pod_application ?? false}
          onChange={e => set('front.imagenotification', { ...imageNotif, pod_application: e.target.checked })} />
      </div>

      {/* ── Color Editor ─────────────────────────────────────────────────── */}
      <p className="config-section-title">Color Editor</p>
      <div className="mb-4">
        <ColorListEditor
          colors={get('desktop.defaultbackgroundcolors') ?? []}
          onChange={v => set('desktop.defaultbackgroundcolors', v)}
        />
      </div>

      {/* ── Welcome Info ──────────────────────────────────────────────── */}
      <p className="config-section-title">Welcome Info</p>
      <p className="text-muted small mb-2">
        Show a welcome message or inject a script for maintenance windows or announcements. Empty by default.
      </p>
      <div className="mb-4">
        {welcomeList.map((entry, i) => (
          <WelcomeEntryEditor
            key={i}
            entry={entry}
            onChange={next => updWelcome(welcomeList.map((e, j) => (j === i ? next : e)))}
            onRemove={() => updWelcome(welcomeList.filter((_, j) => j !== i))}
          />
        ))}
        <Button variant="outline-secondary" size="sm"
          onClick={() => updWelcome([...welcomeList, { notbefore: '', notafter: '', information: '' }])}>
          <i className="bi bi-plus-lg me-1" />Add welcome entry
        </Button>
      </div>
      
      {/* ── Tips ──────────────────────────────────────────────────────── */}
      <p className="config-section-title">Tips Info</p>
      <div className="mb-4">
        <Form.Check type="switch" label="Show Network Map"
          checked={tipsinfo.networkmap ?? false}
          onChange={e => set('tipsinfo', { ...tipsinfo, networkmap: e.target.checked })} />
      </div>

    </div>
  );
}
