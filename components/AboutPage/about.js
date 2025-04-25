import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import './style.css'

const AboutPage = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="container">
      <Head>
        <title>About Us - AStar</title>
        <meta name="description" content="Discover the innovation behind AStar" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <header>
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Team AStar
        </motion.h1>
      </header>

      <main>
        <motion.h2 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {greeting}, welcome to our world of innovation!
        </motion.h2>
        
        <motion.section 
          className="about-content"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>At AStar, we&apos;re not just making cool products, we are a group of students passionate about learning and building. Our team of visionaries and innovators work tirelessly to make unique products that can help out people of all ages.</p>
          
          <h3>Our Mission</h3>
          <p>To create and innovate different softwares to provide substainable and useful products for people to learn.</p>
          
          <h3>Our Values</h3>
          <ul className="values-list">
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Innovation</motion.li>
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Growth</motion.li>
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Collaboration</motion.li>
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Excellence</motion.li>
          </ul>
        </motion.section>
      </main>

      <footer>
        <p>&copy; 2024 AStar. Innovating for a brighter tomorrow.</p>
      </footer>
    </div>
  );
};

export default AboutPage;