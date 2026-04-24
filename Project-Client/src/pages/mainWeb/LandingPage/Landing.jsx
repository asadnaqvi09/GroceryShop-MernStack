import React from 'react'
import HeroSection from './Components/HeroSection'
import PopularProducts from './Components/PopularProducts'
import FeaturedProducts from './Components/FeaturedProducts'
import Diary from './Components/Dariy'
import Service from './Components/Service'

function Landing() {
  return (
    <div className='md:py-12 px-8 py-6 md:px-16 bg-white'>
      <HeroSection />
      <PopularProducts />
      <FeaturedProducts />
      <Diary />
      <Service />
    </div>
  )
}

export default Landing
