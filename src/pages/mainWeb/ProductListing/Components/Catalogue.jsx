import React, { useState } from 'react'
import ProductList from '../../../../components/layout/ProductList'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function Catalogue({ products, onSortChange, }) {
  const [currentPage,setCurrentPage] = useState(1);
  const productPerPage = 8;
  const indexOfLastProduct = currentPage * productPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productPerPage);

  const handlePerPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const getPagination = ()=> {
    const pages = [];
    const delta = 2;

    if (currentPage > 1 + delta){
      pages.push(1);
      if (currentPage>2 + delta) pages.push("...");
    }

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - delta) {
      if (currentPage < totalPages - delta - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }
  return (
    <>
      <div className="heading bg-[#F1F1F1] flex justify-between p-2 md:p-4 rounded-md text-center items-center mb-4">
        <div className="productLength text-xs md:text-sm font-medium text-gray-800">
          {products.length > 0
            ? `There are ${products.length} products`
            : "No product found in this category"}
        </div>

        {products.length > 0 && (
          <div className="sort gap-2 flex items-center text-xs md:text-sm">
            Sort By :{" "}
            <select onChange={(e)=> onSortChange(e.target.value)} className="p-3 text-xs w-36 font-medium text-gray-900 text-center bg-white rounded-md">
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="ratingHighLow">Rating: High to Low</option>
            </select>
          </div>
        )}
      </div>

      {products.length > 0 ? (
        <ProductList products={currentProducts} pageType="Catalogue" />
      ) : (
        <div className="text-center text-gray-500 py-10">
          No product found in this category
        </div>
      )}

      <div className='flex justify-center items-center gap-2 mt-6'>
        <button
        disabled={currentPage === 1}
        onClick={()=> handlePerPage(currentPage - 1)}
        className={`px-1 py-1 border rounded-full cursor-pointer ${currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-pointer" : "bg-gray-300 text-white hover:bg-[#02B290]"}`}
        >
          <ChevronLeft className='w-5 h-5' />
        </button>
        {getPagination().map((p,i)=>(
          p === "..." ? (
            <span key={i} className='px-3 py-1 border rounded-full'> 
              ...
            </span>
          ) : (
            <button key={p} onClick={()=> handlePerPage(p)} className={`px-3 py-1 border rounded-full cursor-pointer ${currentPage === p ? "bg-[#02B290] text-white" : "bg-gray-300 text-white hover:bg-[#02B290]"}`}>
              {p}
            </button>
          )
        ))}
        <button disabled={currentPage === totalPages}
        onClick={()=> handlePerPage(currentPage + 1)}
        className={`px-1 py-1 border rounded-full cursor-pointer ${currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-pointer" : "bg-gray-300 text-white hover:bg-[#02B290]"}`}>
          <ChevronRight className='w-5 h-5' />
        </button>
      </div>
    </>
  )
}

export default Catalogue