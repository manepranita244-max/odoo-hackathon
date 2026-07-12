import React from 'react';

const TopNavbar = () => {
  return (
    <div className="top-navbar">
      <div className="glass-card px-3 px-lg-4 py-3">
        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-light d-lg-none rounded-4 shadow-sm"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileSidebar"
              aria-controls="mobileSidebar"
            >
              <i className="bi bi-list fs-5"></i>
            </button>

            <div>
              <h4 className="mb-0 fw-bold">
                <span className="brand-gradient">TransitOps</span>
              </h4>
              <small className="text-muted">Operational Intelligence for Smart Transport</small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 gap-lg-3 flex-wrap">
            <div className="input-group" style={{ maxWidth: '260px' }}>
              <span className="input-group-text bg-white border-0 rounded-start-4">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 rounded-end-4"
                placeholder="Search operations..."
              />
            </div>

            <button className="icon-btn">
              <i className="bi bi-bell"></i>
            </button>
            <button className="icon-btn">
              <i className="bi bi-chat-dots"></i>
            </button>

            <div className="d-flex align-items-center gap-2 px-2">
              <div
                className="rounded-circle d-grid place-items-center text-white fw-bold"
                style={{
                  width: '42px',
                  height: '42px',
                  background: 'linear-gradient(135deg, #2563eb, #60a5fa)'
                }}
              >
                OP
              </div>
              <div className="d-none d-md-block">
                <div className="fw-semibold">Olivia Parker</div>
                <small className="text-muted">Operations Admin</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
