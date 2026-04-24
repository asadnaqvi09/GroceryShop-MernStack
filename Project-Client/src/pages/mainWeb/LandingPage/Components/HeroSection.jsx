import React from 'react'
import heroImg from '../../../../assets/images/heroImg.jpg'
import bannerImg from '../../../../assets/icons/BannerImg.png'
import { NavLink } from 'react-router-dom'

function HeroSection() {
  return (
    <>
        <section className='hidden md:block bg-gray-600 rounded-2xl relative'>
            <div className="image w-full">
              <img src={heroImg} alt="This is Image" className='object-fit'/>
            </div>
            <div className="content absolute z-50 top-2 p-16">
              <div className="bannerBtn flex items-center p-2 bg-gradient-to-r from-green-300/60 to-white/40 rounded-md w-fit">
                <h3 className='text-sm text-green-600 font-bold'>Weekend Discount</h3>
              </div>
              <div className="mainHead max-w-md font-bold text-4xl mt-2">
                Get The best quality 
                products at the lowest 
                prices.
              </div>
              <div className="subpara text-md text-gray-600 max-w-lg mt-2">
                <p>We have prepared special discounts for you on organic breakfast
                  products
                </p>
              </div>
              <div className="details flex gap-2 mt-4">
                <div className="btn">
                  <NavLink to="/category">
                    <button className='btn-primary'>
                      Shop Now →
                    </button>
                  </NavLink>
                </div>
                <div className="price flex flex-col">
                  <div className="discountPrice flex items-center">
                    <h1 className='text-red-600 text-xl font-bold'>$21.67</h1>
                    <p className='text-gray-600 text-sm line-through line-through-red-600'>$59.99</p>
                  </div>
                  <div className="offer text-gray-400 text-sm">
                    Don't miss this limited time offer
                  </div>
                </div>
              </div>
            </div>
        </section>
        <section className='block md:hidden'>
          <div className="banner">
            <div className="image w-full">
              <img src={bannerImg} alt="This is Image" className='object-cover'/>
            </div>
          </div>
        </section>
    </>
  )
}

export default HeroSection