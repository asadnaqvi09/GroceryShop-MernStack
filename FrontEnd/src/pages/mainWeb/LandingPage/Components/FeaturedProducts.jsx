import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../../../../redux/features/product/productSlice'
import ProductList from '../../../../components/layout/ProductList'
import { NavLink } from 'react-router-dom'
function FeaturedProducts() {
  const dispatch = useDispatch();
  const {products,loading,error} = useSelector(state=>state.product);
  useEffect(()=>{
    dispatch(fetchProducts());
  },[dispatch])
  const featured = products ? [...products].filter((index)=> index.discountPrice).slice(0,5) : [];
  return (
    <>
        <div className="products mt-8">
            <div className="productsHeading flex justify-between ">
              <div className="heading">
                <h1 className='text-xl font-bold text-gray-800'>Featured Products</h1>
              </div>
              <div className="viewAll">
                <NavLink to="/category">
                <h4 className='text-gray-600 text-sm cursor-pointer hover:text-gray-900'>View All →</h4>
                </NavLink>
              </div>
            </div>
            <div className="featuredCard mt-6">
              {
                loading ? (<p className="text-gray-500">Loading featured products...</p>) :
                error ? (<p className="text-red-500">Error loading featured products: {error}</p>) :
                featured.length > 0 ? (<ProductList products={featured} pageType="Landing Page"/>) :
                (<p className="text-gray-500">No featured products available.</p>)
              }
            </div>
        </div>
    </>
  )
}

export default FeaturedProducts