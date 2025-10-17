import React from 'react'
import {Truck,ReceiptEuroIcon,DollarSign,Gift,HeadphonesIcon} from 'lucide-react'

function Service() {

  const service = [
    {id:1,name:"Free Shipping",subHeading:"For All Orders Over 100$",icon:<Truck size={30}/>},
    {id:2,name:"30 Days Return",subHeading:"For An Exchange Product",icon:<ReceiptEuroIcon size={30}/>},
    {id:3,name:"Secured Payment",subHeading:"Payment Cards Accepted",icon:<DollarSign size={30}/>},
    {id:4,name:"Special Gifts",subHeading:"Our First Product Order",icon:<Gift size={30}/>},
    {id:5,name:"Support 24/7",subHeading:"Contact Us AnyTime",icon:<HeadphonesIcon size={30}/>}
  ]  
  return (
    <section className='p-18 flex flex-col md:flex-row gap-10'>
        {
            service.map((index)=> (
                <div key={index.id} className='flex flex-col text-center items-center gap-2'>
                    <div className="icon text-gray-600 transition-transform duration-300 hover:text-green-600 hover:-translate-y-2 hover:scale-110 cursor-pointer"> {index.icon} </div>
                    <div className="title text-black font-medium text-xl"> {index.name} </div>
                    <div className="subHeading text-sm text-gray-600"> {index.subHeading} </div>
                </div>
            ))
        }
    </section>
  )
}

export default Service
