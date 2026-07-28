import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const WEBSOCKET_OPTIONS = ['http_origin', 'default_host_url', 'host', 'bridge'];


export default function GeneralSection({ get, set }) {
  const webrtc      = get('webrtc.rtc_constraints')  ?? {};
  const fail2ban    = get('fail2ban')                ?? {};
  const logmein     = get('auth.logmein')            ?? {};
  const prelogin    = get('auth.prelogin')           ?? {};

  return (
    <div>
      {/* ── Server ─────────────────────────────────────────────────────── */}
      <p className="config-section-title">Server</p>
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Default Host URL <small className="text-muted">— public URL of the service / reverse proxy</small></Form.Label>
            <Form.Control
              type="url"
              value={get('default_host_url') ?? ''}
              onChange={e => set('default_host_url', e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>WebSocket Routing</Form.Label>
            <Form.Select
              value={get('websocketrouting') ?? 'http_origin'}
              onChange={e => set('websocketrouting', e.target.value)}
            >
              {WEBSOCKET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </Form.Select>
            <Form.Text className="text-muted">How the browser reaches the WebSocket server</Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Geolocation IP <small className="text-muted">— external IP for GeoIP / AD site</small></Form.Label>
            <Form.Control
              value={get('server.geolocation_ipaddr') ?? '127.0.0.1'}
              onChange={e => set('server.geolocation_ipaddr', e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* ── Kubernetes Timeouts ─────────────────────────────────────────── */}
      <p className="config-section-title">Kubernetes Timeouts</p>
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>PVC Bind (s)</Form.Label>
            <Form.Control
              type="number"
              value={get('K8S_BOUND_PVC_TIMEOUT_SECONDS') ?? 60}
              onChange={e => set('K8S_BOUND_PVC_TIMEOUT_SECONDS', parseInt(e.target.value))}
            />
            <Form.Text className="text-muted">Timeout to bind a PersistentVolumeClaim</Form.Text>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>PVC Max Events</Form.Label>
            <Form.Control
              type="number"
              value={get('K8S_BOUND_PVC_MAX_EVENT') ?? 5}
              onChange={e => set('K8S_BOUND_PVC_MAX_EVENT', parseInt(e.target.value))}
            />
            <Form.Text className="text-muted">Max K8s events polled while waiting for PVC</Form.Text>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Create Pod (s)</Form.Label>
            <Form.Control
              type="number"
              value={get('K8S_CREATE_POD_TIMEOUT_SECONDS') ?? 300}
              onChange={e => set('K8S_CREATE_POD_TIMEOUT_SECONDS', parseInt(e.target.value))}
            />
            <Form.Text className="text-muted">Includes image pull time — increase if images are large</Form.Text>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Ephemeral Container (s)</Form.Label>
            <Form.Control
              type="number"
              value={get('K8S_CREATE_EPHEMERALCONTAINER_TIMEOUT_SECONDS') ?? 120}
              onChange={e => set('K8S_CREATE_EPHEMERALCONTAINER_TIMEOUT_SECONDS', parseInt(e.target.value))}
            />
            <Form.Text className="text-muted">Includes image pull for ephemeral containers</Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {/* ── JWT ─────────────────────────────────────────────────────────── */}
      <p className="config-section-title">JWT</p>
      <Row className="g-3 mb-4">
        {/* jwt_token_user */}
        <Col xs={12}><p className="config-subsection-title mb-1">User token (jwt_token_user)</p></Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Expiry (s) <small className="text-muted">— null = unlimited</small></Form.Label>
            <Form.Control size="sm" type="number"
              value={get('jwt_token_user')?.exp ?? 360}
              onChange={e => set('jwt_token_user', { ...get('jwt_token_user'), exp: parseInt(e.target.value) || null })}
            />
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group>
            <Form.Label>Private key file</Form.Label>
            <Form.Control size="sm"
              value={get('jwt_token_user')?.jwtuserprivatekeyfile ?? ''}
              onChange={e => set('jwt_token_user', { ...get('jwt_token_user'), jwtuserprivatekeyfile: e.target.value })}
            />
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group>
            <Form.Label>Public key file</Form.Label>
            <Form.Control size="sm"
              value={get('jwt_token_user')?.jwtuserpublickeyfile ?? ''}
              onChange={e => set('jwt_token_user', { ...get('jwt_token_user'), jwtuserpublickeyfile: e.target.value })}
            />
          </Form.Group>
        </Col>

        {/* jwt_token_desktop */}
        <Col xs={12}><p className="config-subsection-title mb-1 mt-2">Desktop token (jwt_token_desktop) <small className="fw-normal text-muted">— same key files must be copied to nginx</small></p></Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Expiry (s)</Form.Label>
            <Form.Control size="sm" type="number"
              value={get('jwt_token_desktop')?.exp ?? 420}
              onChange={e => set('jwt_token_desktop', { ...get('jwt_token_desktop'), exp: parseInt(e.target.value) || null })}
            />
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group>
            <Form.Label>Signing private key file</Form.Label>
            <Form.Control size="sm"
              value={get('jwt_token_desktop')?.jwtdesktopprivatekeyfile ?? ''}
              onChange={e => set('jwt_token_desktop', { ...get('jwt_token_desktop'), jwtdesktopprivatekeyfile: e.target.value })}
            />
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group>
            <Form.Label>Signing public key file</Form.Label>
            <Form.Control size="sm"
              value={get('jwt_token_desktop')?.jwtdesktoppublickeyfile ?? ''}
              onChange={e => set('jwt_token_desktop', { ...get('jwt_token_desktop'), jwtdesktoppublickeyfile: e.target.value })}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Payload public key file</Form.Label>
            <Form.Control size="sm"
              value={get('jwt_token_desktop')?.payloaddesktoppublickeyfile ?? ''}
              onChange={e => set('jwt_token_desktop', { ...get('jwt_token_desktop'), payloaddesktoppublickeyfile: e.target.value })}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* ── WebRTC ────────────────────────────────────────────────────── */}
      <p className="config-section-title">WebRTC Constraints</p>
      <div className="d-flex gap-4 mb-4">
        <Form.Check type="switch" label="Audio (microphone)"
          checked={webrtc.audio ?? true}
          onChange={e => set('webrtc.rtc_constraints', { ...webrtc, audio: e.target.checked })} />
        <Form.Check type="switch" label="Video (webcam)"
          checked={webrtc.video ?? false}
          onChange={e => set('webrtc.rtc_constraints', { ...webrtc, video: e.target.checked })} />
      </div>

      {/* ── Fail2Ban ──────────────────────────────────────────────────── */}
      <p className="config-section-title">Fail2Ban</p>
      <Row className="g-3 mb-4">
        <Col xs={12}>
          <Form.Check type="switch" label="Enable Fail2Ban"
            checked={fail2ban.enable ?? false}
            onChange={e => set('fail2ban', { ...fail2ban, enable: e.target.checked })} />
        </Col>
        {(fail2ban.enable) && (
          <>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Ban expire (s)</Form.Label>
                <Form.Control size="sm" type="number" value={fail2ban.banexpireafterseconds ?? 600}
                  onChange={e => set('fail2ban', { ...fail2ban, banexpireafterseconds: parseInt(e.target.value) })} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Fails before ban</Form.Label>
                <Form.Control size="sm" type="number" value={fail2ban.failsbeforeban ?? 5}
                  onChange={e => set('fail2ban', { ...fail2ban, failsbeforeban: parseInt(e.target.value) })} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Protected Networks <small className="text-muted">(comma-separated CIDR)</small></Form.Label>
                <Form.Control size="sm"
                  value={(fail2ban.protectednetworks ?? []).join(', ')}
                  onChange={e => set('fail2ban', { ...fail2ban, protectednetworks: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              </Form.Group>
            </Col>
          </>
        )}
      </Row>

      {/* ── Log-me-in / Pre-login ─────────────────────────────────────── */}
      <p className="config-section-title">Log-me-in / Pre-login</p>
      <Row className="g-3 mb-2">
        <Col xs={12}>
          <Form.Check type="switch" label="Enable Log-me-in"
            checked={logmein.enable ?? false}
            onChange={e => set('auth.logmein', { ...logmein, enable: e.target.checked })} />
        </Col>
        {logmein.enable && (
          <>
            <Col md={6}>
              <Form.Group>
                <Form.Label>HTTP Attribute</Form.Label>
                <Form.Control size="sm" value={logmein.http_attribut ?? ''}
                  onChange={e => set('auth.logmein', { ...logmein, http_attribut: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Network List <small className="text-muted">(comma-separated CIDR)</small></Form.Label>
                <Form.Control size="sm"
                  value={(logmein.network_list ?? []).join(', ')}
                  onChange={e => set('auth.logmein', { ...logmein, network_list: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Check type="switch" label="Permit Query String"
                checked={logmein.permit_querystring ?? false}
                onChange={e => set('auth.logmein', { ...logmein, permit_querystring: e.target.checked })} />
            </Col>
          </>
        )}
        <Col xs={12}>
          <Form.Check type="switch" label="Enable Pre-login"
            checked={prelogin.enable ?? false}
            onChange={e => set('auth.prelogin', { ...prelogin, enable: e.target.checked })} />
        </Col>
        {prelogin.enable && (
          <Col md={8}>
            <Form.Group>
              <Form.Label>Pre-login URL</Form.Label>
              <Form.Control size="sm" value={prelogin.url ?? ''}
                onChange={e => set('auth.prelogin', { ...prelogin, url: e.target.value })} />
            </Form.Group>
          </Col>
        )}
      </Row>

      {/* ── OAuth Library ───────────────────────────────────────────────── */}
      <p className="config-section-title">OAuth Library</p>
      <Row className="g-3">
        <Col md={6}>
          <Form.Check
            type="switch"
            id="oauthlib-insecure"
            label="Allow Insecure Transport (dev only)"
            checked={get('OAUTHLIB_INSECURE_TRANSPORT') ?? false}
            onChange={e => set('OAUTHLIB_INSECURE_TRANSPORT', e.target.checked)}
          />
          <Form.Text className="text-muted d-block mt-1">
            Disables HTTPS enforcement for OAuth — <strong>never enable in production</strong>
          </Form.Text>
        </Col>
        <Col md={6}>
          <Form.Check
            type="switch"
            id="oauthlib-relax"
            label="Relax Token Scope"
            checked={get('OAUTHLIB_RELAX_TOKEN_SCOPE') ?? false}
            onChange={e => set('OAUTHLIB_RELAX_TOKEN_SCOPE', e.target.checked)}
          />
          <Form.Text className="text-muted d-block mt-1">
            Prevents scope-mismatch warnings (fixes Microsoft account re-auth)
          </Form.Text>
        </Col>
      </Row>
    </div>
  );
}
