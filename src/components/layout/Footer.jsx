import React from "react";
import { FaFacebookF, FaInstagram, FaPinterest, FaYoutube } from "react-icons/fa";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmazonPay } from "react-icons/fa";

function Footer() {
  const product = [
    { id: 1, name: "Prices" },
    { id: 2, name: "New Products" },
    { id: 3, name: "Best Sales" },
    { id: 4, name: "Contact Us" },
    { id: 5, name: "Sitemap" },
    { id: 6, name: "Stores" },
  ];

  const social = [
    { id: 1, logo: <FaFacebookF /> },
    { id: 2, logo: <FaInstagram /> },
    { id: 3, logo: <FaPinterest /> },
    { id: 4, logo: <FaYoutube /> },
  ];

  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-sm text-gray-500">
            ClassyShop - Mega Super Store <br />
            507 Union Trade Centre France
          </p>
          <p className="text-sm text-gray-500 mt-2">sales@yourcompany.com</p>
          <p className="text-green-600 font-semibold text-lg mt-2">
            (+91) 9876-543-210
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Products</h3>
          <ul className="space-y-2 text-sm">
            {product.map((item) => (
              <li
                key={item.id}
                className="hover:text-green-600 cursor-pointer transition"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Our Company</h3>
          <ul className="space-y-2 text-sm">
            {product.map((item) => (
              <li
                key={item.id}
                className="hover:text-green-600 cursor-pointer transition"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Subscribe to Newsletter</h3>
          <p className="text-sm text-gray-500 mb-4">
            Get updates on special discounts & offers.
          </p>
          <div className="items-center rounded-full overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border-1 border-gray-300 text-sm bg-transparent"
            />
            <button className="px-5 py-2 bg-green-500 text-white font-medium hover:bg-green-600 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-3">
            {social.map((item) => (
              <div
                key={item.id}
                className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded-full text-gray-600 hover:bg-green-500 hover:text-white transition cursor-pointer"
              >
                {item.logo}
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 text-center">
            © 2024 ClassyShop. All rights reserved.
          </p>

          <div className="flex gap-4 text-3xl text-gray-500">
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