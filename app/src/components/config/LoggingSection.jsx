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
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Max size (MB)</Form.Label>
                <Form.Control size="sm" type="number" min={1} value={mbSize}
                  onChange={e => upd('maxBytes', parseInt(e.target.value || 10) * 1024 * 1024)} />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Backups</Form.Label>
                <Form.Control size="sm" type="number" min={0} value={conf.backupCount ?? 20}
                  onChange={e => upd('backupCount', parseInt(e.target.value))} />
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
  const handlers = cfg.handlers ?? {};
  const loggers  = cfg.loggers  ?? {};
  const root     = cfg.root     ?? {};

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

      {/* ── Root logger ───────────────────────────────────────────────── */}
      <p className="config-section-title">Root Logger</p>
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Level</Form.Label>
            <Form.Select size="sm" value={root.level ?? 'DEBUG'}
              onChange={e => upd(['root', 'level'], e.target.value)}>
              {LOG_LEVELS.map(l => <option key={l}>{l}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={9}>
          <Form.Label>Active handlers</Form.Label>
          <div className="d-flex flex-wrap gap-3 mt-1">
            {handlerNames.map(h => (
              <Form.Check key={h} type="checkbox" id={`root-h-${h}`} label={h}
                checked={(root.handlers ?? []).includes(h)}
                onChange={e => toggleHandler(['root', 'handlers'], root.handlers, h, e.target.checked)} />
            ))}
          </div>
        </Col>
      </Row>

      {/* ── Handlers ──────────────────────────────────────────────────── */}
      <p className="config-section-title">Handlers</p>
      <Row className="g-3 mb-4">
        {Object.entries(handlers).map(([name, conf]) => (
          <Col key={name} md={4} sm={6}>
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
          {Object.entries(loggers).map(([name, conf]) => (
            <tr key={name}>
              <td className="align-middle"><code>{name}</code></td>

              <td className="align-middle">
                <Form.Select size="sm" value={conf.level ?? 'ERROR'}
                  onChange={e => upd(['loggers', name, 'level'], e.target.value)}>
                  {LOG_LEVELS.map(l => <option key={l}>{l}</option>)}
                </Form.Select>
              </td>

              <td className="text-center align-middle">
                {conf.propagate !== undefined ? (
                  <Form.Check type="switch"
                    checked={conf.propagate ?? true}
                    onChange={e => upd(['loggers', name, 'propagate'], e.target.checked)} />
                ) : <span className="text-muted">—</span>}
              </td>

              <td className="align-middle">
                <div className="d-flex flex-wrap gap-2">
                  {handlerNames.map(h => (
                    <Form.Check key={h} type="checkbox" id={`lgr-${name}-${h}`} label={h}
                      checked={(conf.handlers ?? []).includes(h)}
                      onChange={e => toggleHandler(
                        ['loggers', name, 'handlers'], conf.handlers, h, e.target.checked
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
