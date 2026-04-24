import React, { useEffect } from 'react'
import grocery from '../../../../data/product.json'
import { fetchProducts } from '../../../../redux/features/product/productSlice'
import ProductList from '../../../../components/layout/ProductList'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
function PopularProducts() {
  const dispatch = useDispatch();
  const {products,loading,error} = useSelector(state=> state.product);

  useEffect(()=>{
    dispatch(fetchProducts());
  }, [dispatch])
  const Popular = products
    ? [...products].sort((a, b) => b.stock - a.stock).slice(10, 15)
    : [];
  return (
    <>
        <div className="products mt-8">
            <div className="productsHeading flex justify-between">
              <div className="heading">
                <h1 className='text-xl font-bold text-gray-800'>Popular Products</h1>
                <p className='text-sm text-gray-400'>Do not miss the current offers</p>
              </div>
              <div className="viewAll">
                <NavLink to="/category">
                <h4 className='text-gray-600 text-sm cursor-pointer hover:text-gray-900'>View All →</h4>
                </NavLink>
              </div>
            </div>
            <div className="productCard mt-6">
              {
                loading ? (<p className="text-gray-500">Loading popular products...</p>) :
                error ? (<p className="text-red-500">Error loading popular products: {error}</p>) :
                <ProductList products={Popular} pageType="Landing Page"/>
              }
            </div>
        </div>
    </>
  )
}

export default PopularProducts
