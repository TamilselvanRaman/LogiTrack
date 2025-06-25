import React from "react";
import { Link } from "react-router-dom";
import {
  FaWarehouse,
  FaTruckMoving,
  FaUserCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBoxOpen,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const roles = [
  {
    role: "Business",
    icon: <FaWarehouse className="text-blue-600 text-3xl mx-auto mb-3" />,
    image:
      "https://images.pexels.com/photos/4484078/pexels-photo-4484078.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Register cargo, assign shipments, and manage logistics easily.",
    colorClass: "bg-blue-600 hover:bg-blue-700",
  },
  {
    role: "Driver",
    icon: <FaTruckMoving className="text-green-600 text-3xl mx-auto mb-3" />,
    image:
      "https://images.pexels.com/photos/1936675/pexels-photo-1936675.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "View available cargos, accept delivery, and update status.",
    colorClass: "bg-green-600 hover:bg-green-700",
  },
  {
    role: "Customer",
    icon: <FaUserCircle className="text-purple-600 text-3xl mx-auto mb-3" />,
    image:
      "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Track your cargo and receive delivery updates in real-time.",
    colorClass: "bg-purple-600 hover:bg-purple-700",
  },
];

const sliderSettings = {
  dots: true,
  infinite: true, // enables looping
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true, // enables automatic sliding
  autoplaySpeed: 2500, // delay between slides (in ms)
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2 },
    },
    {
      breakpoint: 640,
      settings: { slidesToShow: 1 },
    },
  ],
};

const locations = [
  {
    src: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
    title: "New York Hub",
    desc: "East Coast freight center.",
  },
  {
    src: "https://images.unsplash.com/photo-1592496011288-98c06bde4ba4?auto=format&fit=crop&w=1200&q=80",
    title: "Los Angeles Terminal",
    desc: "West Coast shipping point.",
  },
  {
    src: "https://images.unsplash.com/photo-1605902711622-cfb43c4437d4?auto=format&fit=crop&w=1200&q=80",
    title: "Chicago Distribution",
    desc: "Midwest central network.",
  },
  {
    src: "https://images.unsplash.com/photo-1617957742854-641612cbb4fd?auto=format&fit=crop&w=1200&q=80",
    title: "Houston Station",
    desc: "South-central logistics.",
  },
  {
    src: "https://images.unsplash.com/photo-1549921296-3a6b63e70a3a?auto=format&fit=crop&w=1200&q=80",
    title: "Seattle Dock",
    desc: "Pacific shipping gateway.",
  },
  {
    src: "https://images.unsplash.com/photo-1581093588401-04b6e02f5d6f?auto=format&fit=crop&w=1200&q=80",
    title: "Denver Point",
    desc: "Rocky Mountain region.",
  },
  {
    src: "https://images.unsplash.com/photo-1535392432937-a27c01a512f4?auto=format&fit=crop&w=1200&q=80",
    title: "Atlanta Base",
    desc: "Southern US freight zone.",
  },
  {
    src: "https://images.unsplash.com/photo-1605819204283-8619113e0773?auto=format&fit=crop&w=1200&q=80",
    title: "Miami Port",
    desc: "Southeast coastal shipping.",
  },
];

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="h-[80vh] bg-cover bg-center flex flex-col justify-center items-center text-white text-center relative overflow-hidden">
        {/* Animated background image */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('/banner.jgp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 px-6"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-xl">
            Welcome to LogiTrack
          </h1>
          <p className="text-xl md:text-2xl font-medium drop-shadow-lg">
            Smart Logistics for Businesses, Drivers & Customers
          </p>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div
            className="md:w-1/2"
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              loading="lazy"
              src="https://images.pexels.com/photos/6169655/pexels-photo-6169655.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="About LogiTrack"
              className="rounded-2xl shadow-lg w-full h-auto transform hover:scale-105 transition duration-500"
            />
          </motion.div>
          <motion.div
            className="md:w-1/2 space-y-6 text-center md:text-left"
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-extrabold text-blue-700">
              About <span className="text-gray-900">LogiTrack</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              LogiTrack is a modern logistics platform that empowers businesses,
              drivers, and customers to manage, track, and deliver cargo with
              unmatched efficiency and real-time visibility.
            </p>
            <Link
              to="/dashboard/business"
              className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow hover:bg-blue-800 transition"
            >
              Explore Features
            </Link>
          </motion.div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="bg-gray-100 py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {roles.map(({ role, icon, image, text, colorClass }) => (
            <motion.div
              key={role}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                loading="lazy"
                src={image}
                alt={role}
                className="rounded-lg mb-6 w-full h-44 object-cover"
              />
              {icon}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{role}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {text}
              </p>
              <Link
                to="/login"
                className={`inline-block ${colorClass} text-white px-5 py-2 rounded-lg transition`}
              >
                {role === "Customer" ? "Track Cargo" : `${role} Dashboard`}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cargo Services */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          <motion.img
            loading="lazy"
            src="https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Cargo Services"
            className="w-full lg:w-1/2 rounded-xl shadow-lg object-cover"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          />
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-blue-700">
              Our Cargo Services
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: <FaBoxOpen className="text-blue-500 text-2xl mt-1" />,
                  title: "Wide Cargo Types",
                  desc: "Refrigerated goods, bulk freight, e-commerce, FMCG, and more.",
                },
                {
                  icon: <FaClock className="text-green-500 text-2xl mt-1" />,
                  title: "Timely Deliveries",
                  desc: "Optimized routing ensures fast delivery every time.",
                },
                {
                  icon: (
                    <FaShieldAlt className="text-yellow-500 text-2xl mt-1" />
                  ),
                  title: "Secure Handling",
                  desc: "Safe, traceable logistics for valuable and fragile goods.",
                },
              ].map(({ icon, title, desc }) => (
                <motion.div
                  key={title}
                  className="flex items-start gap-4"
                  initial={{ x: -40, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {icon}
                  <div>
                    <h4 className="font-bold">{title}</h4>
                    <p className="text-gray-600 text-sm">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Operational Locations Slider */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-100 via-white to-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold text-blue-700 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            Our Operational Locations
          </motion.h2>

          <div className="w-full">
            <Slider {...sliderSettings}>
              {locations.map((location, index) => (
                <motion.div
                  key={index}
                  className="px-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-md group transition-transform duration-300 hover:scale-105 h-72">
                    <img
                      src={location.src}
                      alt={location.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition duration-300"></div>
                    <div className="absolute bottom-0 w-full bg-white/80 backdrop-blur-md p-3 text-left">
                      <h3 className="text-lg font-semibold text-blue-800 mb-1">
                        {location.title}
                      </h3>
                      <p className="text-sm text-gray-700">{location.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-700 mb-16">
            Get in Touch
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:h-[500px]">
            {/* Contact Form */}
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-2xl shadow-xl flex flex-col justify-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Write your message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 shadow"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Map */}
            <motion.div
              className="rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <iframe
                title="Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24176.39302664118!2d-74.0060157!3d40.7127281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a19db2d718f%3A0x4c93c4e8d3ebfbcd!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-16 border-t border-gray-200 text-gray-700">
        <div className="max-w-7xl mx-auto px-6 grid gap-12 md:grid-cols-3 text-center md:text-left">
          {/* Logo & Description */}
          <div>
            <h3 className="text-3xl font-extrabold text-blue-700 mb-4">
              LogiTrack
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              A modern logistics platform empowering businesses, drivers, and
              customers to manage, assign, and track cargo seamlessly.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              Contact Us
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-center justify-center md:justify-start gap-3">
                <FaPhone className="text-blue-500" />
                +1 (555) 123-4567
              </p>
              <p className="flex items-center justify-center md:justify-start gap-3">
                <FaEnvelope className="text-blue-500" />
                <a
                  href="mailto:support@logitrack.com"
                  className="hover:text-blue-700 transition"
                >
                  support@logitrack.com
                </a>
              </p>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              Head Office
            </h3>
            <p className="flex items-center justify-center md:justify-start gap-3 text-sm text-gray-600">
              <FaMapMarkerAlt className="text-blue-500" />
              1234 Warehouse St, New York, NY 10001
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-12 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">LogiTrack</span>. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
