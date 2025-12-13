import Navbar from './components/Navbar'
import HeroCarousel  from './components/HeroCarousel';
import HomePage from './HomePage.jsx'
import Footer from './components/Footer.jsx';

function App() {
  

  return (
    <div>
      <Navbar/>
      <HeroCarousel/>
      <HomePage/>

      {/* Footer Component */}
      <Footer/>
    </div>
  )
}

export default App;
