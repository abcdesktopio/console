import React from 'react';
import { Tab, Nav, Form, Row, Col, Button, Badge } from 'react-bootstrap';

/* ══════════════════════════════════════════════════════════════════════════
   IMPLICIT (Anonymous)
══════════════════════════════════════════════════════════════════════════ */
function ImplicitSection({ authmanagers, onChange }) {
  const providers = authmanagers?.implicit?.providers ?? {};
  const anon = providers.anonymous ?? {};
  const enabled = !!providers.anonymous;

  const setAnon = (data) => onChange({
    ...authmanagers,
    implicit: { ...authmanagers?.implicit, providers: { ...providers, anonymous: data } },
  });

  const toggleEnabled = (on) => {
    const next = { ...providers };
    if (on) {
      next.anonymous = { displayname: 'Anonymous', caption: 'Have a look !', userid: 'anonymous', username: 'Anonymous', textcolor: 'black', backgroundcolor: '#FFFFFF', icon: 'img/auth/anonymous_icon.svg' };
    } else {
      delete next.anonymous;
    }
    onChange({ ...authmanagers, implicit: { providers: next } });
  };

  return (
    <div className="provider-card">
      <div className="provider-header">
        <h6 className="mb-0">Anonymous provider</h6>
        <Form.Check type="switch" label="Enabled" checked={enabled} onChange={e => toggleEnabled(e.target.checked)} />
      </div>
      {enabled && (
        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Display Name</Form.Label>
              <Form.Control size="sm" value={anon.displayname ?? ''} onChange={e => setAnon({ ...anon, displayname: e.target.value })} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Caption</Form.Label>
              <Form.Control size="sm" value={anon.caption ?? ''} onChange={e => setAnon({ ...anon, caption: e.target.value })} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Icon path</Form.Label>
              <Form.Control size="sm" value={anon.icon ?? ''} onChange={e => setAnon({ ...anon, icon: e.target.value })} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>User ID</Form.Label>
              <Form.Control size="sm" value={anon.userid ?? ''} onChange={e => setAnon({ ...anon, userid: e.target.value })} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control size="sm" value={anon.username ?? ''} onChange={e => setAnon({ ...anon, username: e.target.value })} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Text Color</Form.Label>
              <div className="d-flex align-items-center gap-2">
                <input type="color" className="color-swatch-input"
                  value={anon.textcolor?.startsWith('#') ? anon.textcolor : '#000000'}
                  onChange={e => setAnon({ ...anon, textcolor: e.target.value })} />
                <Form.Control size="sm" value={anon.textcolor ?? ''} onChange={e => setAnon({ ...anon, textcolor: e.target.value })} />
              </div>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Background Color</Form.Label>
              <div className="d-flex align-items-center gap-2">
                <input type="color" className="color-swatch-input"
                  value={anon.backgroundcolor?.startsWith('#') ? anon.backgroundcolor : '#FFFFFF'}
                  onChange={e => setAnon({ ...anon, backgroundcolor: e.target.value })} />
                <Form.Control size="sm" value={anon.backgroundcolor ?? ''} onChange={e => setAnon({ ...anon, backgroundcolor: e.target.value })} />
              </div>
            </Form.Group>
          </Col>
        </Row>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   EXPLICIT (LDAP / AD)
══════════════════════════════════════════════════════════════════════════ */
function ExplicitSection({ authmanagers, ldapconfig, onChangeAuth, onChangeLdap }) {
  const showDomains = authmanagers?.explicit?.show_domains ?? true;

  const updLdap = (name, conf) => onChangeLdap({ ...ldapconfig, [name]: conf });

  return (
    <div>
      <Form.Check type="switch" className="mb-3"
        label="Show domain list on login page"
        checked={showDomains}
        onChange={e => onChangeAuth({ ...authmanagers, explicit: { ...authmanagers?.explicit, show_domains: e.target.checked } })}
      />

      {Object.entries(ldapconfig ?? {}).map(([name, conf]) => (
        <div className="provider-card" key={name}>
          <div className="provider-header">
            <h6 className="mb-0">{name}</h6>
            <Form.Check type="switch" label="Default"
              checked={conf.default ?? false}
              onChange={e => updLdap(name, { ...conf, default: e.target.checked })} />
          </div>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Protocol</Form.Label>
                <Form.Select size="sm" value={conf.ldap_protocol ?? 'ldap'}
                  onChange={e => updLdap(name, { ...conf, ldap_protocol: e.target.value })}>
                  <option value="ldap">ldap</option>
                  <option value="ldaps">ldaps</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Timeout (s)</Form.Label>
                <Form.Control size="sm" type="number" value={conf.ldap_timeout ?? 15}
                  onChange={e => updLdap(name, { ...conf, ldap_timeout: parseInt(e.target.value) })} />
              </Form.Group>
            </Col>
            <Col md={1} className="d-flex align-items-end pb-1">
              <Form.Check type="switch" label="TLS" checked={conf.secure ?? false}
                onChange={e => updLdap(name, { ...conf, secure: e.target.checked })} />
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Base DN</Form.Label>
                <Form.Control size="sm" value={conf.ldap_basedn ?? ''}
                  placeholder="ou=people,dc=example,dc=com"
                  onChange={e => updLdap(name, { ...conf, ldap_basedn: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Servers <small className="text-muted">(comma-separated)</small></Form.Label>
                <Form.Control size="sm"
                  value={(conf.servers ?? []).join(', ')}
                  placeholder="192.168.1.10, ldap.example.com"
                  onChange={e => updLdap(name, { ...conf, servers: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              </Form.Group>
            </Col>
            {conf.ldap_fqdn !== undefined && (
              <Col md={6}>
                <Form.Group>
                  <Form.Label>LDAP FQDN <small className="text-muted">(AD SRV record)</small></Form.Label>
                  <Form.Control size="sm" value={conf.ldap_fqdn ?? ''}
                    onChange={e => updLdap(name, { ...conf, ldap_fqdn: e.target.value })} />
                </Form.Group>
              </Col>
            )}
            {conf.domain !== undefined && (
              <>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Domain</Form.Label>
                    <Form.Control size="sm" value={conf.domain ?? ''}
                      onChange={e => updLdap(name, { ...conf, domain: e.target.value })} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Domain FQDN</Form.Label>
                    <Form.Control size="sm" value={conf.domain_fqdn ?? ''}
                      onChange={e => updLdap(name, { ...conf, domain_fqdn: e.target.value })} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Kerberos Realm</Form.Label>
                    <Form.Control size="sm" value={conf.kerberos_realm ?? ''}
                      onChange={e => updLdap(name, { ...conf, kerberos_realm: e.target.value })} />
                  </Form.Group>
                </Col>
              </>
            )}
            {conf.serviceaccount && (
              <>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Service Account DN</Form.Label>
                    <Form.Control size="sm" value={conf.serviceaccount?.login ?? ''}
                      onChange={e => updLdap(name, { ...conf, serviceaccount: { ...conf.serviceaccount, login: e.target.value } })} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Service Account Password</Form.Label>
                    <Form.Control size="sm" type="password" value={conf.serviceaccount?.password ?? ''}
                      onChange={e => updLdap(name, { ...conf, serviceaccount: { ...conf.serviceaccount, password: e.target.value } })} />
                  </Form.Group>
                </Col>
              </>
            )}
          </Row>
        </div>
      ))}
      {Object.keys(ldapconfig ?? {}).length === 0 && (
        <p className="text-muted text-center py-3 border rounded">No LDAP / AD config found in od.config</p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   EXTERNAL (OAuth 2.0)
══════════════════════════════════════════════════════════════════════════ */
function OAuthProviderCard({ name, provider, onChange, onRemove }) {
  const upd = (field, val) => onChange({ ...provider, [field]: val });

  // scope is stored as an array; display as comma-separated string
  const scopeStr = Array.isArray(provider.scope)
    ? provider.scope.join(', ')
    : (provider.scope ?? '');
  const setScope = (raw) => upd('scope', raw.split(',').map(s => s.trim()).filter(Boolean));

  return (
    <div className="provider-card">
      <div className="provider-header">
        <div className="d-flex align-items-center gap-2">
          <h6 className="mb-0 text-capitalize">{name}</h6>
          <Badge bg={provider.enabled ? 'success' : 'secondary'} style={{ fontSize: '0.7rem' }}>
            {provider.enabled ? 'enabled' : 'disabled'}
          </Badge>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <Form.Check type="switch" label="Enabled" checked={provider.enabled ?? false}
            onChange={e => upd('enabled', e.target.checked)} />
          <Button variant="outline-danger" size="sm" onClick={onRemove}><i className="bi bi-trash" /></Button>
        </div>
      </div>

      <Row className="g-3">
        {/* ── Identity ── */}
        <Col md={4}>
          <Form.Group>
            <Form.Label>Display Name</Form.Label>
            <Form.Control size="sm" value={provider.displayname ?? ''} onChange={e => upd('displayname', e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Icon path <small className="text-muted">img/auth/…</small></Form.Label>
            <Form.Control size="sm" value={provider.icon ?? ''} placeholder="img/auth/google_icon.svg"
              onChange={e => upd('icon', e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Text Color</Form.Label>
            <div className="d-flex align-items-center gap-1">
              <input type="color" className="color-swatch-input"
                value={provider.textcolor?.startsWith('#') ? provider.textcolor : '#000000'}
                onChange={e => upd('textcolor', e.target.value)} />
              <Form.Control size="sm" value={provider.textcolor ?? ''} onChange={e => upd('textcolor', e.target.value)} />
            </div>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Background Color</Form.Label>
            <div className="d-flex align-items-center gap-1">
              <input type="color" className="color-swatch-input"
                value={provider.backgroundcolor?.startsWith('#') ? provider.backgroundcolor : '#FFFFFF'}
                onChange={e => upd('backgroundcolor', e.target.value)} />
              <Form.Control size="sm" value={provider.backgroundcolor ?? ''} onChange={e => upd('backgroundcolor', e.target.value)} />
            </div>
          </Form.Group>
        </Col>

        {/* ── Credentials ── */}
        <Col md={6}>
          <Form.Group>
            <Form.Label>Client ID</Form.Label>
            <Form.Control size="sm" value={provider.client_id ?? ''} onChange={e => upd('client_id', e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Client Secret</Form.Label>
            <Form.Control size="sm" type="password" value={provider.client_secret ?? ''} onChange={e => upd('client_secret', e.target.value)} />
          </Form.Group>
        </Col>

        {/* ── Scope ── */}
        <Col md={12}>
          <Form.Group>
            <Form.Label>Scope <small className="text-muted">(comma-separated)</small></Form.Label>
            <Form.Control size="sm" value={scopeStr}
              onChange={e => setScope(e.target.value)} />
          </Form.Group>
        </Col>

        {/* ── URLs ── */}
        <Col md={12}>
          <Form.Group>
            <Form.Label>Authorization Base URL</Form.Label>
            <Form.Control size="sm" value={provider.authorization_base_url ?? ''}
              onChange={e => upd('authorization_base_url', e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group>
            <Form.Label>Token URL</Form.Label>
            <Form.Control size="sm" value={provider.token_url ?? ''}
              onChange={e => upd('token_url', e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group>
            <Form.Label>Userinfo URL</Form.Label>
            <Form.Control size="sm" value={provider.userinfo_url ?? ''}
              onChange={e => upd('userinfo_url', e.target.value)} />
          </Form.Group>
        </Col>

        {/* ── Redirect URI ── */}
        <Col md={8}>
          <Form.Group>
            <Form.Label>Redirect URI Prefix</Form.Label>
            <Form.Control size="sm" value={provider.redirect_uri_prefix ?? ''}
              placeholder="https://hostname.domain.local/API/auth/oauth"
              onChange={e => upd('redirect_uri_prefix', e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Redirect URI Query String</Form.Label>
            <Form.Control size="sm" value={provider.redirect_uri_querystring ?? ''}
              onChange={e => upd('redirect_uri_querystring', e.target.value)} />
          </Form.Group>
        </Col>

        {/* ── Options ── */}
        <Col md={4} className="d-flex align-items-end">
          <Form.Check type="switch" label="Userinfo Auth"
            checked={provider.userinfo_auth ?? false}
            onChange={e => upd('userinfo_auth', e.target.checked)} />
        </Col>
      </Row>
    </div>
  );
}

function ExternalSection({ authmanagers, onChange }) {
  const providers = authmanagers?.external?.providers ?? {};

  const updProvider = (name, data) =>
    onChange({ ...authmanagers, external: { ...authmanagers?.external, providers: { ...providers, [name]: data } } });

  const removeProvider = (name) => {
    const next = { ...providers };
    delete next[name];
    onChange({ ...authmanagers, external: { ...authmanagers?.external, providers: next } });
  };

  const addProvider = () => {
    const name = window.prompt('Provider key name (e.g. google, orange, github):');
    if (!name?.trim() || providers[name.trim()]) return;
    updProvider(name.trim().toLowerCase(), {
      displayname: name.trim().charAt(0).toUpperCase() + name.trim().slice(1),
      enabled: false, icon: '', textcolor: '#000000', backgroundcolor: '#FFFFFF',
      client_id: '', client_secret: '',
      scope: [], userinfo_auth: false,
      authorization_base_url: '', token_url: '', userinfo_url: '',
      redirect_uri_prefix: '', redirect_uri_querystring: '',
      policies: { acl: { permit: ['all'] } },
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted small">OAuth 2.0 identity providers (Google, Orange, GitHub…)</span>
        <Button size="sm" variant="outline-primary" onClick={addProvider}>
          <i className="bi bi-plus-lg me-1" />Add provider
        </Button>
      </div>
      {Object.keys(providers).length === 0 && (
        <p className="text-muted text-center py-4 border rounded">No external OAuth providers configured</p>
      )}
      {Object.entries(providers).map(([name, prov]) => (
        <OAuthProviderCard key={name} name={name} provider={prov}
          onChange={d => updProvider(name, d)}
          onRemove={() => removeProvider(name)} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   AUTH SECTION — root
══════════════════════════════════════════════════════════════════════════ */
export default function AuthSection({ get, set }) {
  const authmanagers = get('authmanagers') ?? { external: { providers: {} }, explicit: {}, implicit: { providers: {} } };
  const ldapconfig   = get('ldapconfig') ?? {};

  return (
    <div>
      <p className="config-section-title">Authentication</p>
      <Tab.Container defaultActiveKey="implicit">
        <Nav variant="tabs" className="mb-3 config-tabs">
          <Nav.Item><Nav.Link eventKey="implicit"><i className="bi bi-person me-1" />Implicit (Anonymous)</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="explicit"><i className="bi bi-server me-1" />Explicit (LDAP / AD)</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="external"><i className="bi bi-boxes me-1" />External (OAuth 2.0)</Nav.Link></Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="implicit">
            <ImplicitSection authmanagers={authmanagers} onChange={v => set('authmanagers', v)} />
          </Tab.Pane>
          <Tab.Pane eventKey="explicit">
            <ExplicitSection
              authmanagers={authmanagers}
              ldapconfig={ldapconfig}
              onChangeAuth={v => set('authmanagers', v)}
              onChangeLdap={v => set('ldapconfig', v)}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="external">
            <ExternalSection authmanagers={authmanagers} onChange={v => set('authmanagers', v)} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
