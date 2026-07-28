import React from 'react';
import { Form, Row, Col, Table } from 'react-bootstrap';

const LOG_LEVELS = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];

/* ── deep immutable path write ──────────────────────────────────────────── */
function deepSet(obj, path, val) {
  const next = JSON.parse(JSON.stringify(obj ?? {}));
  let cur = next;
  for (let i = 0; i < path.length - 1; i++) {
    if (!cur[path[i]]) cur[path[i]] = {};
    cur = cur[path[i]];
  }
  cur[path[path.length - 1]] = val;
  return next;
}

/* ── single handler card ─────────────────────────────────────────────────  */
function HandlerCard({ name, conf, allHandlerNames, onChange }) {
  const isFile = !!conf.filename;
  const mbSize = Math.round((conf.maxBytes ?? 10485760) / 1024 / 1024);

  const upd = (field, val) => onChange({ ...conf, [field]: val });

  return (
    <div className="provider-card p-3 h-100">
      <p className="config-subsection-title">{name}</p>
      <Row className="g-2">
        {/* Class */}
        {conf.class !== undefined && (
          <Col xs={12}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Class</Form.Label>
              <Form.Control size="sm" value={conf.class ?? ''}
                onChange={e => upd('class', e.target.value)} />
            </Form.Group>
          </Col>
        )}

        {/* Filters */}
        {conf.filters !== undefined && (
          <Col xs={12}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Filters <span className="text-muted fw-normal">(one per line)</span></Form.Label>
              <Form.Control as="textarea" rows={2} size="sm"
                value={(conf.filters ?? []).join('\n')}
                onChange={e => upd('filters', e.target.value.split('\n').map(s => s.trim()).filter(Boolean))}
              />
            </Form.Group>
          </Col>
        )}

        {/* Level */}
        {conf.level !== undefined && (
          <Col xs={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Level</Form.Label>
              <Form.Select size="sm" value={conf.level}
                onChange={e => upd('level', e.target.value)}>
                {LOG_LEVELS.map(l => <option key={l}>{l}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
        )}

        {/* Formatter */}
        {conf.formatter !== undefined && (
          <Col xs={6}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Formatter</Form.Label>
              <Form.Control size="sm" value={conf.formatter ?? ''}
                onChange={e => upd('formatter', e.target.value)} />
            </Form.Group>
          </Col>
        )}

        {/* File-based handler */}
        {isFile && (
          <>
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Filename</Form.Label>
                <Form.Control size="sm" value={conf.filename}
                  onChange={e => upd('filename', e.target.value)} />
              </Form.Group>
            </Col>
            <Col xs={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Max size (MB)</Form.Label>
                <Form.Control size="sm" type="number" min={1} value={mbSize}
                  onChange={e => upd('maxBytes', parseInt(e.target.value || 10) * 1024 * 1024)} />
              </Form.Group>
            </Col>
            <Col xs={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Backups</Form.Label>
                <Form.Control size="sm" type="number" min={0} value={conf.backupCount ?? 20}
                  onChange={e => upd('backupCount', parseInt(e.target.value))} />
              </Form.Group>
            </Col>
            <Col xs={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Encoding</Form.Label>
                <Form.Control size="sm" value={conf.encoding ?? 'utf-8'}
                  onChange={e => upd('encoding', e.target.value)} />
              </Form.Group>
            </Col>
          </>
        )}

        {/* Stream */}
        {conf.stream !== undefined && (
          <Col xs={12}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Stream</Form.Label>
              <Form.Control size="sm" value={conf.stream}
                onChange={e => upd('stream', e.target.value)} />
            </Form.Group>
          </Col>
        )}
      </Row>
    </div>
  );
}

/* ── formatter card ────────────────────────────────────────────────────── */
function FormatterCard({ name, conf, onChange }) {
  const upd = (field, val) => onChange({ ...conf, [field]: val });
  return (
    <div className="provider-card p-3 h-100">
      <p className="config-subsection-title">{name}</p>
      <Form.Group className="mb-2">
        <Form.Label className="small fw-semibold">Format</Form.Label>
        <Form.Control as="textarea" rows={2} size="sm"
          style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
          value={conf.format ?? ''}
          onChange={e => upd('format', e.target.value)} />
      </Form.Group>
      {conf.datefmt !== undefined && (
        <Form.Group>
          <Form.Label className="small fw-semibold">Date format</Form.Label>
          <Form.Control size="sm" style={{ fontFamily: 'monospace' }}
            value={conf.datefmt ?? ''}
            onChange={e => upd('datefmt', e.target.value)} />
        </Form.Group>
      )}
    </div>
  );
}

/* ── main section ───────────────────────────────────────────────────────── */
export default function LoggingSection({ get, set }) {
  const logging = get('logging');

  /* If the parser returned a raw string (e.g. edge-case), show a fallback */
  if (typeof logging === 'string') {
    return (
      <div>
        <p className="config-section-title">Logging</p>
        <div className="alert alert-warning py-2 small">
          The logging config could not be parsed — editing as raw text.
        </div>
        <Form.Control as="textarea" rows={20}
          style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
          value={logging}
          onChange={e => set('logging', e.target.value)}
        />
      </div>
    );
  }

  const cfg = logging ?? {};
  const handlers   = cfg.handlers   ?? {};
  const loggers    = cfg.loggers    ?? {};
  const root       = cfg.root       ?? {};
  const formatters = cfg.formatters ?? {};
  const filters    = cfg.filters    ?? {};

  const upd = (path, val) => set('logging', deepSet(cfg, path, val));

  const handlerNames = Object.keys(handlers);

  /* Toggle a handler name in an array */
  const toggleHandler = (path, current, hName, checked) => {
    const next = checked
      ? [...(current ?? []), hName]
      : (current ?? []).filter(x => x !== hName);
    upd(path, next);
  };

  return (
    <div>

      {/* ── General ───────────────────────────────────────────────────── */}
      <p className="config-section-title">General</p>
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Version</Form.Label>
            <Form.Control size="sm" type="number" value={cfg.version ?? 1}
              onChange={e => upd(['version'], parseInt(e.target.value || '1', 10))} />
          </Form.Group>
        </Col>
        <Col md={9} className="d-flex align-items-end">
          <Form.Check type="switch" id="disable-existing-loggers"
            label="Disable existing loggers"
            checked={cfg.disable_existing_loggers ?? false}
            onChange={e => upd(['disable_existing_loggers'], e.target.checked)} />
        </Col>
      </Row>

      {/* ── Formatters ────────────────────────────────────────────────── */}
      <p className="config-section-title">Formatters</p>
      <Row className="g-3 mb-4">
        {Object.entries(formatters).map(([name, conf]) => (
          <Col key={name} md={6}>
            <FormatterCard name={name} conf={conf}
              onChange={next => upd(['formatters', name], next)} />
          </Col>
        ))}
      </Row>

      {/* ── Filters ───────────────────────────────────────────────────── */}
      <p className="config-section-title">Filters</p>
      <Row className="g-3 mb-4">
        {Object.entries(filters).map(([name, conf]) => (
          <Col key={name} md={6}>
            <div className="provider-card p-3 h-100">
              <p className="config-subsection-title">{name}</p>
              <Form.Group>
                <Form.Label className="small fw-semibold">Callable class</Form.Label>
                <Form.Control size="sm" style={{ fontFamily: 'monospace' }}
                  value={conf['()'] ?? ''}
                  onChange={e => upd(['filters', name, '()'], e.target.value)} />
              </Form.Group>
            </div>
          </Col>
        ))}
      </Row>

      {/* ── Handlers ──────────────────────────────────────────────────── */}
      <p className="config-section-title">Handlers</p>
      <Row className="g-3 mb-4">
        {Object.entries(handlers).map(([name, conf]) => (
          <Col key={name} md={6} sm={6}>
            <HandlerCard
              name={name}
              conf={conf}
              allHandlerNames={handlerNames}
              onChange={next => upd(['handlers', name], next)}
            />
          </Col>
        ))}
      </Row>

      {/* ── Module loggers ────────────────────────────────────────────── */}
      <p className="config-section-title">Module Loggers</p>
      <Table size="sm" bordered className="mb-0" style={{ fontSize: '0.85rem' }}>
        <thead className="table-light">
          <tr>
            <th>Module</th>
            <th style={{ width: 140 }}>Level</th>
            <th style={{ width: 90 }} className="text-center">Propagate</th>
            <th>Active handlers</th>
          </tr>
        </thead>
        <tbody>
          {[{ name: 'root', conf: root, isRoot: true }, ...Object.entries(loggers).map(([name, conf]) => ({ name, conf, isRoot: false }))].map(({ name, conf, isRoot }) => (
            <tr key={name} className={isRoot ? 'table-light' : undefined}>
              <td className="align-middle"><code>{isRoot ? <strong>root</strong> : name}</code></td>

              <td className="align-middle">
                <Form.Select size="sm" value={conf.level ?? 'ERROR'}
                  onChange={e => upd(isRoot ? ['root', 'level'] : ['loggers', name, 'level'], e.target.value)}>
                  {LOG_LEVELS.map(l => <option key={l}>{l}</option>)}
                </Form.Select>
              </td>

              <td className="text-center align-middle">
                {conf.propagate !== undefined ? (
                  <Form.Check type="switch"
                    checked={conf.propagate ?? true}
                    onChange={e => upd(isRoot ? ['root', 'propagate'] : ['loggers', name, 'propagate'], e.target.checked)} />
                ) : <span className="text-muted">—</span>}
              </td>

              <td className="align-middle">
                <div className="d-flex flex-wrap gap-2">
                  {handlerNames.map(h => (
                    <Form.Check key={h} type="checkbox" id={`lgr-${name}-${h}`} label={h}
                      checked={(conf.handlers ?? []).includes(h)}
                      onChange={e => toggleHandler(
                        isRoot ? ['root', 'handlers'] : ['loggers', name, 'handlers'], conf.handlers, h, e.target.checked
                      )} />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
