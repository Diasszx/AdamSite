import { ParticleBackground } from './components/ParticleBackground';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { FooterTicker } from './components/FooterTicker';

function App() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-black text-white">
      {/* Interactive Gray Particle Background */}
      <ParticleBackground />

      {/* Premium Header */}
      <Header />

      {/* Main Hero Showcase */}
      <Hero />

      {/* Infinite Ticker (transition banner between Hero and Projects) */}
      <FooterTicker />

      {/* 3D Projects Showcase Section */}
      <Projects />

      {/* Staggered Experience Timeline Section */}
      <Experience />
    </div>
  );
}

export default App;
