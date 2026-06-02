"use client";
import dynamic from "next/dynamic";
import ReactPaginate from "react-paginate";

// prop type
type IProps = {
  pageCount: number;
  handlePageClick: (event: { selected: number }) => void;
};

const Pagination = ({ handlePageClick, pageCount }: IProps) => {
  return (
    <>
      <ReactPaginate
        breakLabel="..."
        activeClassName="active"
        nextLabel={<i className="fal fa-angle-right"></i>}
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel={<i className="fal fa-angle-left"></i>}
        renderOnZeroPageCount={null}
      />
    </>
  );
};

export default dynamic(() => Promise.resolve(Pagination), {
  ssr: false
})
