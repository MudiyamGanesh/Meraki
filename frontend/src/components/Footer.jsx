import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-700 py-8 font-sans">
      <div className="container mx-auto px-4">
        {/* Header Text */}
        <div className="mb-8 text-center">
          <p className="text-lg font-semibold">Over <span className="text-black">6 Million</span> Happy Customers</p>
        </div>

        {/* Know More Section */}
        <div className="mb-8 border-b border-gray-300 pb-4 flex justify-between items-center cursor-pointer">
          <span className="text-gray-600 font-medium">Know more about The Souled Store</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Need Help */}
          <div>
            <h4 className="text-red-600 font-bold mb-4">NEED HELP</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-900">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-900">Track Order</a></li>
              <li><a href="#" className="hover:text-gray-900">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-gray-900">FAQs</a></li>
              <li><a href="#" className="hover:text-gray-900">My Account</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-red-600 font-bold mb-4">COMPANY</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-900">About Us</a></li>
              <li><a href="#" className="hover:text-gray-900">Investor Relation</a></li>
              <li><a href="#" className="hover:text-gray-900">Careers</a></li>
              <li><a href="#" className="hover:text-gray-900">Gift Vouchers</a></li>
              <li><a href="#" className="hover:text-gray-900">Community Initiatives</a></li>
            </ul>
          </div>

          {/* More Info */}
          <div>
            <h4 className="text-red-600 font-bold mb-4">MORE INFO</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-900">T&C</a></li>
              <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-900">Sitemap</a></li>
              <li><a href="#" className="hover:text-gray-900">Get Notified</a></li>
              <li><a href="#" className="hover:text-gray-900">Blogs</a></li>
            </ul>
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>COD Available</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>30 Days Easy Returns & Exchanges</span>
              </div>
            </div>
          </div>

          {/* Store Near Me */}
          <div>
            <h4 className="text-red-600 font-bold mb-4">STORE NEAR ME</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-900">Mumbai</a></li>
              <li><a href="#" className="hover:text-gray-900">Pune</a></li>
              <li><a href="#" className="hover:text-gray-900">Bangalore</a></li>
              <li><a href="#" className="hover:text-gray-900">Hubbali</a></li>
              <li><a href="#" className="text-blue-600 hover:text-blue-800 font-semibold">View More</a></li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="mt-8 flex justify-center space-x-4 items-center">
          <span className="text-gray-600 mr-2">Follow Us:</span>
          <a href="#" className="bg-blue-600 text-white p-2 rounded-full">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
          </a>
          <a href="#" className="bg-pink-600 text-white p-2 rounded-full">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="#" className="bg-yellow-500 text-white p-2 rounded-full">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.385c-3.535 0-6.385-2.85-6.385-6.385 0-3.535 2.85-6.385 6.385-6.385 3.535 0 6.385 2.85 6.385 6.385 0 3.535-2.85 6.385-6.385 6.385zm3.744-8.176a1.247 1.247 0 11-2.494 0 1.247 1.247 0 012.494 0z"/></svg>
          </a>
          <a href="#" className="bg-black text-white p-2 rounded-full">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>

        {/* Who We Are Accordion Stub */}
        <div className="mt-8 border-t border-b border-gray-300 py-4 flex justify-between items-center cursor-pointer">
          <span className="text-red-600 font-bold">WHO WE ARE</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Payment & Shipping */}
        <div className="mt-8">
          <p className="text-gray-600 mb-4">100% Secure Payment:</p>
          <div className="flex flex-wrap gap-4 items-center mb-8">
            {/* Note: In a real app, you might want to download these images to your public folder */}
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/PhonePe_Logo.svg/2560px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png" alt="Google Pay" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_Pay_logo.svg/2560px-Amazon_Pay_logo.svg.png" alt="Amazon Pay" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/2560px-Mastercard_2019_logo.svg.png" alt="Mastercard" className="h-6" />
            <span className="text-gray-600 text-sm">Cash on Delivery</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-600 mt-8">
          © The Souled Store 2025-26
        </div>
      </div>
    </footer>
  );
};

export default Footer;
