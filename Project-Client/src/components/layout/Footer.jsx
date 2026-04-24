import React from "react";
import { FaFacebookF, FaInstagram, FaPinterest, FaYoutube } from "react-icons/fa";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmazonPay } from "react-icons/fa";

function Footer() {
  const footerLinks = [
    { id: 1, name: "Fruit & Vegetables", to: "fruit" },
    { id: 2, name: "Meats & Seafood", to: "meats" },
    { id: 3, name: "Breakfast & Dairy", to: "dairy" },
    { id: 4, name: "Breads & Bakery", to: "bakery" },
    { id: 5, name: "Beverages", to: "beverages" },
    { id: 6, name: "Frozen Foods", to: "seafood" },
    { id: 7, name: "Biscuits & Snacks", to: "snacks" },
    { id: 8, name: "Grocery & Staples", to: "grocery&staples" },
  ];

  const social = [
    { id: 1, logo: <FaFacebookF /> },
    { id: 2, logo: <FaInstagram /> },
    { id: 3, logo: <FaPinterest /> },
    { id: 4, logo: <FaYoutube /> },
  ];

  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-12 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-sm text-gray-500">
            ClassyShop - Mega Super Store
            <br />
            507 Union Trade Centre France
          </p>
          <p className="text-sm text-gray-500 mt-2">sales@yourcompany.com</p>
          <p className="text-green-600 font-semibold text-lg mt-2">
            (+91) 9876-543-210
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {footerLinks.map((item) => (
              <p
                key={item.id}
                className="text-gray-700 hover:text-green-600 cursor-pointer transition"
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Subscribe to Newsletter</h3>
          <p className="text-sm text-gray-500 mb-4">
            Get updates on special discounts & offers.
          </p>
          <div className="flex rounded-full overflow-hidden border border-gray-300">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
            />
            <button className="px-6 py-3 bg-green-500 text-white font-medium hover:bg-green-600 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex gap-4">
            {social.map((icon, i) => (
              <div
                key={i}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 text-gray-600 hover:bg-green-500 hover:text-white hover:border-green-500 transition cursor-pointer"
              >
                {icon.logo}
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            © 2024 ClassyShop. All rights reserved.
          </p>

          <div className="flex gap-5 text-3xl text-gray-600">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcPaypal />
            <FaCcAmazonPay />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;