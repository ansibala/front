import React from "react";

//pagination
import TablePagination from "react-js-pagination";

const Pagination = (props) => {
  const handlePage = (page) => {
    props.handlePageChange(page);
  };
  const handleRowsPerPage = (value) => {
    props.handleRowsPerPage(value);
  }; 

  return (
    <>
      {props.userTotal ? (
        <div className="d-md-flex justify-content-end align-items-center">
          <div className="d-flex">
            <span className="text-white" style={{ fontWeight: "500" }}>Rows Per Page</span>
            <select
              class=" mx-2 mb-2 mb-md-0 mb-lg-0 dropdown  "
              style={{
                borderColor: "#112935",
                background: "#112935",
                color: "rgba(255,255,255)",
                borderRadius: "3px",
              }}
              onChange={(e) => {
                handleRowsPerPage(e.target.value);
              }}
            >
              <option  value="5">
                5
              </option>
              <option  value="10" selected>
                10
              </option>
              <option  value="25">
                25
              </option>
              <option  value="50">
                50
              </option>
              <option  value="100">
                100
              </option>
              <option  value="200">
                200
              </option>
              <option  value="500">
                500
              </option>
              <option  value="1000">
                1000
              </option>
              <option  value="5000">
                5000
              </option>
            </select>
          </div>
          <div className="align-middle">
            <TablePagination
              activePage={props.activePage}
              itemsCountPerPage={props.rowsPerPage}
              totalItemsCount={props.userTotal}
              pageRangeDisplayed={2}
              onChange={(page) => handlePage(page)}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <h6>No Data Found</h6>
        </div>
      )}
    </>
  );
};

export default Pagination;
