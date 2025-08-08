import React from 'react';
import { Nav, Accordion , OverlayTrigger, Tooltip} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

const renderTooltip = (message) => (
  <Tooltip id={`tooltip-${message.toLowerCase().replace(/\s+/g, '-')}`}>
    {message}
  </Tooltip>
);

export default function Sidebar() {
  const location = useLocation();

  return (
    <Nav defaultActiveKey="/console" className="sidebar navbar-nav">
      <Nav.Item>
        <OverlayTrigger placement="right" overlay={renderTooltip('Desktops')}>
          <Nav.Link 
            as={Link} 
            to="/" 
            active={location.pathname === '/'}
          >
            <span>
            <i className="bi bi-window-desktop"></i> <span className="menu-text">Desktops</span>
            </span>
          </Nav.Link>
        </OverlayTrigger>
      </Nav.Item>

      <Nav.Item>
        <OverlayTrigger placement="right" overlay={renderTooltip('Applications')}>
            <Nav.Link 
              as={Link} 
              to="/apps" 
              active={location.pathname === '/apps'}
            >
              <span>
              <i className="bi bi-app-indicator"></i> <span className="menu-text">Applications</span>
              </span>
            </Nav.Link>
        </OverlayTrigger>
      </Nav.Item>

      <Nav.Item>
        <Accordion id="collapseBanSubMenu" defaultActiveKey="0" className="mt-2">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <OverlayTrigger placement="right" overlay={renderTooltip('Ban')}>
                <span>
                <i className="bi bi-ban"></i> <span className="menu-text">Ban</span>
                </span>
              </OverlayTrigger>
            </Accordion.Header>
            <Accordion.Body>
                <OverlayTrigger placement="right" overlay={renderTooltip('Ban IP')}>
                <Nav.Link 
                  as={Link} 
                  to="/banIp" 
                  active={location.pathname === '/banIp'}
                >
                  <span>
                  <i className="bi bi-hdd-network"></i> <span className="menu-text">IP addr</span>
                  </span>
                </Nav.Link>
                </OverlayTrigger>
                <OverlayTrigger placement="right" overlay={renderTooltip('Ban Login')}>
                <Nav.Link 
                  as={Link} 
                  to="/banLogin" 
                  active={location.pathname === '/banLogin'}
                >
                  <span>
                  <i className="bi bi-person"></i> <span className="menu-text">Login</span>
                  </span>
                </Nav.Link>
                </OverlayTrigger>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Nav.Item>

      <Nav.Item className='invisibleWithAccordion'>
        <OverlayTrigger placement="right" overlay={renderTooltip('Ban IP')}>
          <Nav.Link 
            as={Link} 
            to="/banIp" 
            active={location.pathname === '/banIp'}
          >
            <span>
            <i className="bi bi-hdd-network"></i> <span className="menu-text">IP addr</span>
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
            <i className="bi bi-person"></i> <span className="menu-text">Login</span>
            </span>
          </Nav.Link>
        </OverlayTrigger>
      </Nav.Item>
    </Nav>
  );
}