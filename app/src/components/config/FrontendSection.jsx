import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const MENU_ITEMS = ['settings', 'appstore', 'screenshot', 'download', 'logout', 'disconnect'];

export default function FrontendSection({ get, set }) {
  const menuConfig  = get('front.menuconfig')        ?? {};
  const imageNotif  = get('front.imagenotification') ?? {};
  const tipsinfo    = get('tipsinfo')                ?? {};
  const webrtc      = get('webrtc.rtc_constraints')  ?? {};
  const fail2ban    = get('fail2ban')                ?? {};
  const logmein     = get('auth.logmein')            ?? {};
  const prelogin    = get('auth.prelogin')           ?? {};

  return (
    <div>
      {/* ── Menu ──────────────────────────────────────────────────────── */}
      <p className="config-section-title">Top-right Menu</p>
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

      {/* ── Tips ──────────────────────────────────────────────────────── */}
      <p className="config-section-title">Tips Info</p>
      <div className="mb-4">
        <Form.Check type="switch" label="Show Network Map"
          checked={tipsinfo.networkmap ?? false}
          onChange={e => set('tipsinfo', { ...tipsinfo, networkmap: e.target.checked })} />
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
    </div>
  );
}
