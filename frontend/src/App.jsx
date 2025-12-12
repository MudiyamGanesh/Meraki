import Navbar from './components/Navbar'
import HeroCarousel  from './components/HeroCarousel';

function App() {
  

  return (
    <div>
      <Navbar/>
      <HeroCarousel/>
      <div style={{ height: '100vh', padding: '100px 20px', background: '#FAF0E6' }}>
        <h2>More Content Below...</h2>
      </div>
    </div>
  )
}

export default App;
