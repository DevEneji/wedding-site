import React from 'react'
import Nav from '../components/Nav'
import HeroSection from '../components/HeroSection'
import GallerySection from '../components/GallerySection'
import WrappedSection from '../components/WrappedSection'
import RSVPSection from '../components/RSVPSection'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-teal-950">
      <Nav />
      <main>
        <HeroSection />
        <GallerySection />
        <WrappedSection />
        <RSVPSection />
      </main>
      <Footer />
    </div>
  )
}
