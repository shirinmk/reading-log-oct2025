

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReaderForm from "./ReaderForm";

const DashboardNavbar = ({
  readers = [],
  currentReader,
  setCurrentReader,
  onReaderAdded,
  onOpenLogModal, // controlled by Dashboard
}) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [showAddReaderModal, setShowAddReaderModal] = useState(false);
  const [selectedReader, setSelectedReader] = useState(currentReader);

  useEffect(() => {
    setSelectedReader(currentReader);
  }, [currentReader]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/select-school";
  };

  return (
    <>
      <nav className="navbar navbar-expand-md bg-light fixed-top text-primary-emphasis shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">
            ISSD
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            

            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <button
                  className="btn btn-light dropdown-toggle d-flex align-items-center"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                >
                  <span className="badge rounded-circle bg-danger text-white p-2 me-2">
                    {selectedReader
                      ? selectedReader.firstName?.[0]
                      : storedUser?.firstName?.[0]}
                  </span>
                  {selectedReader
                    ? `${selectedReader.firstName} ${selectedReader.lastName}`
                    : `${storedUser?.firstName} ${storedUser?.lastName}`}
                </button>

                <ul className="dropdown-menu dropdown-menu-end p-2">
                  <li className="dropdown-item p-2" key="parent">
                    <button
                      className="btn btn-link text-decoration-none fw-semibold text-dark p-0"
                      onClick={() => setCurrentReader(null)}
                    >
                      {storedUser?.firstName} {storedUser?.lastName} (You)
                    </button>
                  </li>

                  <li><hr className="dropdown-divider" /></li>

                  {readers.length > 0 ? (
                    readers.map((r) => (
                      <li className="dropdown-item p-2" key={r._id}>
                        <div className="d-flex align-items-center justify-content-between">
                          <button
                            className="btn btn-link text-decoration-none fw-semibold text-dark p-0"
                            onClick={() => setCurrentReader(r)}
                          >
                            {r.firstName} {r.lastName}
                          </button>
                          {/* <Link
                            to={`/edit-reader/${r._id}`}
                            className="btn btn-outline-secondary btn-sm"
                          >
                            Edit
                          </Link> */}
                          {/* <button
  className="btn btn-outline-secondary btn-sm"
  onClick={() => setEditReaderId(r._id)}
>
  Edit
</button> */}

                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="dropdown-item text-muted" key="noreader">
                      No readers yet
                    </li>
                  )}

                  <li><hr className="dropdown-divider" /></li>

                  <li key="add-reader">
                    <button
                      className="dropdown-item text-primary"
                      onClick={() => setShowAddReaderModal(true)}
                    >
                      ➕ Add a Reader
                    </button>
                  </li>

                  <li><hr className="dropdown-divider" /></li>

                  <li key="signout">
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Add Reader Modal */}
      {showAddReaderModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Reader</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddReaderModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ReaderForm
                  onReaderAdded={(newReader) => {
                    onReaderAdded?.(newReader);
                    setShowAddReaderModal(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardNavbar;
