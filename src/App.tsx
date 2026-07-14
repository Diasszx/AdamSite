import { ParticleBackground } from './components/ParticleBackground';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
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

      {/* Infinite Ticker Footer */}
      <FooterTicker />
    </div>
  );
}

export default App;
