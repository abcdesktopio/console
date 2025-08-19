import React from 'react';
import { Nav, Accordion, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

// Utility function: generates a tooltip with a normalized id
const renderTooltip = (message) => (
  <Tooltip id={`tooltip-${message.toLowerCase().replace(/\s+/g, '-')}`}>
    {message}
  </Tooltip>
);

// Sidebar navigation component shown on the left of the console UI.
// Provides quick access to Desktops, Apps, and nested Ban pages (IP & Login).
// Uses react-bootstrap + react-router-dom integration.
export default function Sidebar() {
  // Retrieve current path so Nav.Link "active" can be applied
  const location = useLocation();

  return (
    <Nav defaultActiveKey="/console" className="sidebar navbar-nav">

      {/* ----------------- Desktops ----------------- */}
      <Nav.Item>
        <OverlayTrigger placement="right" overlay={renderTooltip('Desktops')}>
          <Nav.Link 
            as={Link} 
            to="/" 
            active={location.pathname === '/'}
          >
            <span>
              <i className="bi bi-window-desktop"></i> 
              <span className="menu-text">Desktops</span>
            </span>
          </Nav.Link>
        </OverlayTrigger>
      </Nav.Item>

      {/* ----------------- Applications ----------------- */}
      <Nav.Item>
        <OverlayTrigger placement="right" overlay={renderTooltip('Applications')}>
          <Nav.Link 
            as={Link} 
            to="/apps" 
            active={location.pathname === '/apps'}
          >
            <span>
              <i className="bi bi-app-indicator"></i> 
              <span className="menu-text">Applications</span>
            </span>
          </Nav.Link>
        </OverlayTrigger>
      </Nav.Item>

      {/* ----------------- Ban Section (Collapsible) ----------------- */}
      <Nav.Item>
        <Accordion id="collapseBanSubMenu" defaultActiveKey="0" className="mt-2">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <OverlayTrigger placement="right" overlay={renderTooltip('Ban')}>
                <span>
                  <i className="bi bi-ban"></i> 
                  <span className="menu-text">Ban</span>
                </span>
              </OverlayTrigger>
            </Accordion.Header>

            <Accordion.Body>
              {/* Ban IP */}
              <OverlayTrigger placement="right" overlay={renderTooltip('Ban IP')}>
                <Nav.Link 
                  as={Link} 
                  to="/banIp" 
                  active={location.pathname === '/banIp'}
                >
                  <span>
                    <i className="bi bi-hdd-network"></i> 
                    <span className="menu-text">IP addr</span>
                  </span>
                </Nav.Link>
              </OverlayTrigger>

              {/* Ban Login */}
              <OverlayTrigger placement="right" overlay={renderTooltip('Ban Login')}>
                <Nav.Link 
                  as={Link} 
                  to="/banLogin" 
                  active={location.pathname === '/banLogin'}
                >
                  <span>
                    <i className="bi bi-person"></i> 
                    <span className="menu-text">Login</span>
                  </span>
                </Nav.Link>
              </OverlayTrigger>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Nav.Item>

      {/* ----------------- Invisible Items (for responsive fallback/UI tricks) ----------------- */}
      {/* Duplicate ban links outside accordion, hidden by CSS class by default,
          shown when screen width is under 1400px*/}
      <Nav.Item className='invisibleWithAccordion'>
        <OverlayTrigger placement="right" overlay={renderTooltip('Ban IP')}>
          <Nav.Link 
            as={Link} 
            to="/banIp" 
            active={location.pathname === '/banIp'}
          >
            <span>
              <i className="bi bi-hdd-network"></i> 
              <span className="menu-text">IP addr</span>
            </span>
          </Nav.Link>
        </OverlayTrigger>
      </Nav.Item>
      
      <Nav.Item className='invisibleWithAccordion'>
        <OverlayTrigger placement="right" overlay={renderTooltip('Ban Login')}>
          <Nav.Link 
            as={Link} 
            to="/banLogin" 
            active={location.pathname === '/banLogin'}
          >
            <span>
              <i className="bi bi-person"></i> 
              <span className="menu-text">Login</span>
            </span>
          </Nav.Link>
        </OverlayTrigger>
      </Nav.Item>

    </Nav>
  );
}
