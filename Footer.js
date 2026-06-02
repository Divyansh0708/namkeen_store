'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';
import { newsletterAPI } from '../../lib/api';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await newsletterAPI.subscribe(email);
      toast.success('Subscribed successfully! 🎉');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-dark text-gray-300">
      {/* Newsletter strip */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 py-10">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-bold text-white">Get Crispy Deals in Your Inbox</h3>
            <p className="text-primary-100 mt-1">Subscribe for exclusive offers, new arrivals & recipes</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input-field md:w-72 bg-white/20 border-white/30 text-white placeholder-white/60 focus:ring-white"
              required
            />
            <button type="submit" disabled={subscribing}
              className="bg-white text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors flex-shrink-0 disabled:opacity-70">
              {subscribing ? '...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-2xl">🍿</div>
              <div>
                <div className="font-display font-bold text-xl text-white">Namkeen Store</div>
                <div className="text-xs text-primary-400 font-semibold tracking-widest uppercase">Premium Snacks</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-5">
              Bringing you the finest authentic Indian namkeens crafted with love and tradition since 2010. Fresh, crispy, and full of flavor.
            </p>
            <div className="flex gap-3">
              {[FiInstagram, FiFacebook, FiTwitter, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-dark-700 hover:bg-primary-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-5 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'All Products' },
                { href: '/products?isBestSeller=true', label: 'Best Sellers' },
                { href: '/products?isNew=true', label: 'New Arrivals' },
                { href: '/#about', label: 'About Us' },
                { href: '/#contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-primary-400 transition-colors text-sm font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 group-hover:bg-primary-400 transition-colors flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white mb-5 text-lg">Categories</h4>
            <ul className="space-y-3">
              {[
                { icon: '🫘', label: 'Bhujia' },
                { icon: '🍜', label: 'Sev' },
                { icon: '🥜', label: 'Mixture' },
                { icon: '🥔', label: 'Chips' },
                { icon: '🌾', label: 'Healthy Snacks' },
                { icon: '🏺', label: 'Traditional Snacks' },
              ].map(({ icon, label }) => (
                <li key={label}>
                  <Link href={`/products?keyword=${label}`} className="text-gray-400 hover:text-primary-400 transition-colors text-sm font-medium flex items-center gap-2">
                    <span>{icon}</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-5 text-lg">Get In Touch</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm">
                <FiMapPin className="text-primary-400 flex-shrink-0 mt-0.5" size={16} />
                <span className="text-gray-400">123 Snack Street, Bikaner, Rajasthan — 334001</span>
              </li>
              <li className="flex gap-3 text-sm">
                <FiPhone className="text-primary-400 flex-shrink-0" size={16} />
                <a href="tel:+919876543210" className="text-gray-400 hover:text-primary-400 transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex gap-3 text-sm">
                <FiMail className="text-primary-400 flex-shrink-0" size={16} />
                <a href="mailto:hello@namkeenstore.com" className="text-gray-400 hover:text-primary-400 transition-colors">hello@namkeenstore.com</a>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-dark-800 rounded-xl border border-dark-700">
              <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Business Hours</p>
              <p className="text-sm text-gray-300">Mon – Sat: 9 AM – 7 PM</p>
              <p className="text-sm text-gray-300">Sunday: 10 AM – 5 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-700">
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Namkeen Store. All rights reserved.</p>
          <div className="flex gap-5 text-sm">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'FAQ'].map((label) => (
              <Link key={label} href="#" className="text-gray-500 hover:text-primary-400 transition-colors">{label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Payments secured by</span>
            <span className="font-bold text-gray-400">Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
