import React from 'react'
import grocery from '../../../../data/product.json'
import ProductList from '../../../../components/layout/ProductList'
import { NavLink } from 'react-router-dom'
function Dariy() {
  const dairyProduct = grocery.filter((cat)=> cat.category === "dairy" || cat.category === "bakery").slice(0,5);
  return (
    <>
        <div className="products mt-8">
            <div className="productsHeading flex justify-between">
              <div className="heading">
                <h1 className='text-xl font-bold text-gray-800'>Bakery & Diary</h1>
              </div>
              <div className="viewAll">
                <NavLink to="/category">
                <h4 className='text-gray-600 text-sm cursor-pointer hover:text-gray-900'>View All →</h4>
                </NavLink>
              </div>
            </div>
            <div className="featuredCard mt-6">
              <ProductList products={dairyProduct} />
            </div>
        </div>
    </>
  )
}

export default Dariy
