import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const THEME_OPTIONS = ['auto', 'linux', 'macosx', 'windows'];
const ACCESS_MODES  = ['ReadWriteOnce', 'ReadWriteMany', 'ReadOnlyMany', 'ReadWriteOncePod'];

/* ── PersistentVolume + PVC editor ─────────────────────────────────────── */
function PvcEditor({ get, set }) {
  /* helpers to read/write nested objects without mutating state */
  const pv  = get('desktop.persistentvolume')  ?? {};
  const pvc = get('desktop.persistentvolumeclaim') ?? {};

  const setPv  = (next) => set('desktop.persistentvolume',          next);
  const setPvc = (next) => set('desktop.persistentvolumeclaim', next);

  const setPvDeep  = (path, val) => setPv( deepSet({ ...pv  }, path, val) );
  const setPvcDeep = (path, val) => setPvc(deepSet({ ...pvc }, path, val) );

  /* access modes toggle */
  const pvAccessModes  = pv?.spec?.accessModes  ?? [];
  const pvcAccessModes = pvc?.spec?.accessModes ?? [];

  const toggleMode = (list, mode, setFn) => {
    const next = list.includes(mode) ? list.filter(m => m !== mode) : [...list, mode];
    setFn(next);
  };

  /* mount options (array <-> newline textarea) */
  const mountOpts = (pv?.spec?.mountOptions ?? []).join('\n');

  return (
    <div className="mb-4">

      {/* ── PersistentVolume ──────────────────────────────────────────── */}
      <p className="config-subsection-title mt-2">PersistentVolume (desktop.persistentvolume)</p>
      <div className="provider-card p-3 mb-3">
        <Row className="g-3">
          {/* metadata */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">metadata.name <span className="text-muted fw-normal">— supports <code>{'{{ provider }}'}</code>, <code>{'{{ userid }}'}</code></span></Form.Label>
              <Form.Control size="sm"
                value={pv?.metadata?.name ?? '{{ provider }}-{{ userid }}-pv'}
                onChange={e => setPvDeep(['metadata', 'name'], e.target.value)} />
            </Form.Group>
          </Col>

          {/* spec.storageClassName */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">spec.storageClassName</Form.Label>
              <Form.Control size="sm"
                value={pv?.spec?.storageClassName ?? ''}
                onChange={e => setPvDeep(['spec', 'storageClassName'], e.target.value)} />
            </Form.Group>
          </Col>

          {/* spec.capacity.storage */}
          <Col md={3}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Capacity (storage)</Form.Label>
              <Form.Control size="sm" placeholder="e.g. 10Gi"
                value={pv?.spec?.capacity?.storage ?? ''}
                onChange={e => setPvDeep(['spec', 'capacity', 'storage'], e.target.value)} />
            </Form.Group>
          </Col>

          {/* spec.persistentVolumeReclaimPolicy */}
          <Col md={3}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Reclaim Policy</Form.Label>
              <Form.Select size="sm"
                value={pv?.spec?.persistentVolumeReclaimPolicy ?? 'Retain'}
                onChange={e => setPvDeep(['spec', 'persistentVolumeReclaimPolicy'], e.target.value)}>
                <option>Retain</option>
                <option>Delete</option>
                <option>Recycle</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* spec.accessModes */}
          <Col md={6}>
            <Form.Label className="small fw-semibold">Access Modes</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {ACCESS_MODES.map(m => (
                <Form.Check key={m} type="checkbox" id={`pv-am-${m}`} label={m}
                  checked={pvAccessModes.includes(m)}
                  onChange={() => toggleMode(pvAccessModes, m, v => setPvDeep(['spec', 'accessModes'], v))} />
              ))}
            </div>
          </Col>

          {/* spec.mountOptions */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Mount Options <span className="text-muted fw-normal">(one per line)</span></Form.Label>
              <Form.Control as="textarea" size="sm" rows={2}
                value={mountOpts}
                onChange={e => setPvDeep(['spec', 'mountOptions'], e.target.value.split('\n').map(s => s.trim()).filter(Boolean))} />
            </Form.Group>
          </Col>

          {/* CSI subsection */}
          <Col xs={12}><p className="config-subsection-title mb-1 mt-1">spec.csi</p></Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="small fw-semibold">driver</Form.Label>
              <Form.Control size="sm" placeholder="nfs.csi.k8s.io"
                value={pv?.spec?.csi?.driver ?? ''}
                onChange={e => setPvDeep(['spec', 'csi', 'driver'], e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group>
              <Form.Label className="small fw-semibold">volumeHandle <span className="text-muted fw-normal">— supports <code>{'{{ userid }}'}</code></span></Form.Label>
              <Form.Control size="sm"
                value={pv?.spec?.csi?.volumeHandle ?? ''}
                onChange={e => setPvDeep(['spec', 'csi', 'volumeHandle'], e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex align-items-end pb-2">
            <Form.Check type="switch" label="readOnly"
              checked={pv?.spec?.csi?.readOnly ?? false}
              onChange={e => setPvDeep(['spec', 'csi', 'readOnly'], e.target.checked)} />
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="small fw-semibold">volumeAttributes.server</Form.Label>
              <Form.Control size="sm" placeholder="192.168.1.1"
                value={pv?.spec?.csi?.volumeAttributes?.server ?? ''}
                onChange={e => setPvDeep(['spec', 'csi', 'volumeAttributes', 'server'], e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={8}>
            <Form.Group>
              <Form.Label className="small fw-semibold">volumeAttributes.share <span className="text-muted fw-normal">— supports <code>{'{{ userid }}'}</code></span></Form.Label>
              <Form.Control size="sm" placeholder="/data/nfs_share/{{ userid }}"
                value={pv?.spec?.csi?.volumeAttributes?.share ?? ''}
                onChange={e => setPvDeep(['spec', 'csi', 'volumeAttributes', 'share'], e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* ── PersistentVolumeClaim ─────────────────────────────────────── */}
      <p className="config-subsection-title">PersistentVolumeClaim (desktop.persistentvolumeclaim)</p>
      <div className="provider-card p-3 mb-3">
        <Row className="g-3">
          {/* metadata */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">metadata.name <span className="text-muted fw-normal">— supports <code>{'{{ provider }}'}</code>, <code>{'{{ userid }}'}</code></span></Form.Label>
              <Form.Control size="sm"
                value={pvc?.metadata?.name ?? '{{ provider }}-{{ userid }}'}
                onChange={e => setPvcDeep(['metadata', 'name'], e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">metadata.annotations[nfs.io/username] <span className="text-muted fw-normal">— supports <code>{'{{ userid }}'}</code></span></Form.Label>
              <Form.Control size="sm"
                value={pvc?.metadata?.annotations?.['nfs.io/username'] ?? '{{ userid }}'}
                onChange={e => setPvcDeep(['metadata', 'annotations', 'nfs.io/username'], e.target.value)} />
            </Form.Group>
          </Col>

          {/* spec.storageClassName */}
          <Col md={5}>
            <Form.Group>
              <Form.Label className="small fw-semibold">spec.storageClassName</Form.Label>
              <Form.Control size="sm"
                value={pvc?.spec?.storageClassName ?? ''}
                onChange={e => setPvcDeep(['spec', 'storageClassName'], e.target.value)} />
            </Form.Group>
          </Col>

          {/* spec.resources.requests.storage */}
          <Col md={3}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Requested Storage</Form.Label>
              <Form.Control size="sm" placeholder="e.g. 10Gi"
                value={pvc?.spec?.resources?.requests?.storage ?? ''}
                onChange={e => setPvcDeep(['spec', 'resources', 'requests', 'storage'], e.target.value)} />
            </Form.Group>
          </Col>

          {/* spec.accessModes */}
          <Col md={4}>
            <Form.Label className="small fw-semibold">Access Modes</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {ACCESS_MODES.map(m => (
                <Form.Check key={m} type="checkbox" id={`pvc-am-${m}`} label={m}
                  checked={pvcAccessModes.includes(m)}
                  onChange={() => toggleMode(pvcAccessModes, m, v => setPvcDeep(['spec', 'accessModes'], v))} />
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

/* ── deep-set utility (immutable path write) ───────────────────────────── */
function deepSet(obj, path, val) {
  if (path.length === 1) return { ...obj, [path[0]]: val };
  const key = path[0];
  return { ...obj, [key]: deepSet(obj[key] ?? {}, path.slice(1), val) };
}


/* ── Key-value editor ───────────────────────────────────────────────────── */
function KvEditor({ obj, onChange }) {
  const entries = Object.entries(obj ?? {});

  const renameKey = (oldKey, newKey) => {
    const next = {};
    for (const [k, v] of Object.entries(obj ?? {})) {
      next[k === oldKey ? newKey : k] = v;
    }
    onChange(next);
  };

  const setValue = (key, val) => onChange({ ...obj, [key]: val });

  const remove = (key) => {
    const next = { ...obj };
    delete next[key];
    onChange(next);
  };

  const add = () => onChange({ ...(obj ?? {}), '': '' });

  return (
    <div className="kv-editor">
      {entries.map(([k, v], i) => (
        <div key={i} className="kv-row">
          <input placeholder="Key"   value={k} onChange={e => renameKey(k, e.target.value)} />
          <input placeholder="Value" value={v} onChange={e => setValue(k, e.target.value)} />
          <Button variant="outline-danger" size="sm" onClick={() => remove(k)}>
            <i className="bi bi-x" />
          </Button>
        </div>
      ))}
      <Button variant="outline-secondary" size="sm" className="mt-1" style={{ width: 'fit-content' }} onClick={add}>
        <i className="bi bi-plus me-1" />Add variable
      </Button>
    </div>
  );
}

/* ── Main section ───────────────────────────────────────────────────────── */
export default function DesktopSection({ get, set }) {
  return (
    <div>
      {/* ── User account ──────────────────────────────────────────────── */}
      <p className="config-section-title">User Account</p>
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control size="sm" value={get('desktop.username') ?? 'balloon'}
              onChange={e => set('desktop.username', e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>User ID</Form.Label>
            <Form.Control size="sm" type="number" value={get('desktop.userid') ?? 4096}
              onChange={e => set('desktop.userid', parseInt(e.target.value))} />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Group ID</Form.Label>
            <Form.Control size="sm" type="number" value={get('desktop.groupid') ?? 4096}
              onChange={e => set('desktop.groupid', parseInt(e.target.value))} />
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group>
            <Form.Label>Home Directory</Form.Label>
            <Form.Control size="sm" value={get('desktop.userhomedirectory') ?? '/home/balloon'}
              onChange={e => set('desktop.userhomedirectory', e.target.value)} />
          </Form.Group>
        </Col>
      </Row>

      {/* ── Appearance ────────────────────────────────────────────────── */}
      <p className="config-section-title">Appearance</p>
      <Row className="g-3 mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Theme</Form.Label>
            <Form.Select size="sm" value={get('desktop.theme') ?? 'auto'}
              onChange={e => set('desktop.theme', e.target.value)}>
              {THEME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </Form.Select>
            <Form.Text className="text-muted">auto = detect from User-Agent</Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Zoom</Form.Label>
            <Form.Control size="sm" type="number" step="0.1" min="0.5" max="2"
              value={get('desktop.zoom') ?? 1}
              onChange={e => set('desktop.zoom', parseFloat(e.target.value))} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>PulseAudio Socket Path</Form.Label>
            <Form.Control size="sm" value={get('desktop.pulseaudiosocketpath') ?? '/tmp/.pulse.sock'}
              onChange={e => set('desktop.pulseaudiosocketpath', e.target.value)} />
          </Form.Group>
        </Col>
      </Row>

      {/* ── Home directory ────────────────────────────────────────────── */}
      <p className="config-section-title">Home Directory</p>
      <Row className="g-3 mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Type</Form.Label>
            <Form.Select size="sm" value={get('desktop.homedirectorytype') ?? ''}
              onChange={e => set('desktop.homedirectorytype', e.target.value || null)}>
              <option value="">None (emptyDir)</option>
              <option value="persistentVolumeClaim">persistentVolumeClaim</option>
              <option value="hostPath">hostPath</option>
            </Form.Select>
          </Form.Group>
        </Col>
        {get('desktop.homedirectorytype') === 'hostPath' && (
          <Col md={4}>
            <Form.Group>
              <Form.Label>Host Path Root</Form.Label>
              <Form.Control size="sm" value={get('desktop.hostPathRoot') ?? '/tmp'}
                onChange={e => set('desktop.hostPathRoot', e.target.value)} />
            </Form.Group>
          </Col>
        )}
      </Row>

      {/* PV + PVC editors — only when type is persistentVolumeClaim */}
      {get('desktop.homedirectorytype') === 'persistentVolumeClaim' && (
        <PvcEditor get={get} set={set} />
      )}

      <div className="d-flex flex-wrap gap-4 mb-4">
        <Form.Check type="switch" label="Remove home dir on logout"
          checked={get('desktop.removehomedirectory') ?? false}
          onChange={e => set('desktop.removehomedirectory', e.target.checked)} />
        <Form.Check type="switch" label="Remove PersistentVolume"
          checked={get('desktop.removepersistentvolume') ?? false}
          onChange={e => set('desktop.removepersistentvolume', e.target.checked)} />
        <Form.Check type="switch" label="Remove PersistentVolumeClaim"
          checked={get('desktop.removepersistentvolumeclaim') ?? false}
          onChange={e => set('desktop.removepersistentvolumeclaim', e.target.checked)} />
      </div>

      {/* ── Environment ───────────────────────────────────────────────── */}
      <p className="config-section-title">Environment Variables</p>
      <div className="mb-4">
        <KvEditor obj={get('desktop.envlocal') ?? {}} onChange={v => set('desktop.envlocal', v)} />
      </div>

      {/* ── Node Selector ─────────────────────────────────────────────── */}
      <p className="config-section-title">Node Selector</p>
      <div className="mb-4">
        <KvEditor obj={get('desktop.nodeselector') ?? {}} onChange={v => set('desktop.nodeselector', v)} />
        <Form.Text className="text-muted">e.g. abcdesktoprole=worker</Form.Text>
      </div>

      {/* ── GPU / Advanced ────────────────────────────────────────────── */}
      <p className="config-section-title">GPU / Advanced</p>
      <div className="mb-2">
        <Form.Check
          type="switch"
          id="overwrite-env-gpu"
          label="Share NVIDIA GPU UUID from pod to ephemeral container"
          checked={!!get('desktop.overwrite_environment_variable_for_application')}
          onChange={e => set(
            'desktop.overwrite_environment_variable_for_application',
            e.target.checked ? '/composer/overwrite_environment_variable_for_application.sh' : null
          )}
        />
        <Form.Text className="text-muted d-block mt-1">
          When enabled, runs <code>/composer/overwrite_environment_variable_for_application.sh</code> to propagate GPU environment variables to ephemeral containers.
        </Form.Text>
      </div>
    </div>
  );
}
