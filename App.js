import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [queue, setQueue] = useState([]);
  const [totalWaitTime, setTotalWaitTime] = useState(0);

  // Function to calculate the total waiting time
  const updateTotalWaitTime = useCallback(() => {
    const totalTime = queue.reduce((sum, person) => sum + person.timeRemaining, 0);
    setTotalWaitTime(totalTime);
  }, [queue]);

  // Function to handle new user submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setQueue(prevQueue => [
      ...prevQueue,
      { name, timeRemaining: 120 } // 30 minutes in seconds
    ]);
    setName('');
  };

  // Update timers and remove users whose time has expired
  useEffect(() => {
    const interval = setInterval(() => {
      setQueue(prevQueue => {
        const updatedQueue = prevQueue
          .map(person => {
            const updatedTime = person.timeRemaining - 1;
            return { ...person, timeRemaining: updatedTime };
          })
          .filter(person => person.timeRemaining > 0); // Remove users whose timeRemaining is 0 or less

        return updatedQueue;
      });
      // Update total waiting time
      updateTotalWaitTime();
    }, 1000); // 1 second in milliseconds

    return () => clearInterval(interval);
  }, [updateTotalWaitTime]);

  // Scroll event for banner
  useEffect(() => {
    const handleScroll = () => {
      const banner = document.querySelector('.banner');
      if (window.scrollY > banner.clientHeight) {
        banner.classList.add('scrolled');
      } else {
        banner.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <nav>
        <h1>Creme Bruele Shoppe (UMass: Coolidge Highrise)</h1>
        <ul>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#work">Past Work</a></li>
        </ul>
      </nav>
      <div className="banner"></div>
      <section id="queue" className="centered-section">
        <h1>Barbershop Queue Check In:</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <button type="submit">Join Queue</button>
        </form>
        <div className="queue-info">
          {queue.length === 0 ? (
            <p>No one is in the queue. You can get your haircut now!</p>
          ) : (
            <>
              <h2>Current Queue</h2>
              <ul>
                {queue.map((person, index) => (
                  <li key={index}>
                    {person.name} - Time Remaining: {Math.floor(person.timeRemaining / 60)} minutes
                  </li>
                ))}
              </ul>
              <p>Total Waiting Time: {Math.floor(totalWaitTime / 60)} minutes</p>
            </>
          )}
        </div>
      </section>
      <section id="pricing" className="centered-section">
        <h2>Pricing</h2>
        <p>Prices Vary - Cuts starting from $15</p>
      </section>
      <section id="contact" className="centered-section">
        <h2>Contact</h2>
        <p>IG:@cremecutz__</p>
      </section>
      <section id="work" className="centered-section">
        <h2>Past Work</h2>
        <div className="video-container">
          <video src={`${process.env.PUBLIC_URL}/Nikhil.mp4`} loop autoPlay muted></video>
          <video src={`${process.env.PUBLIC_URL}/Hacsunda.mp4`} loop autoPlay muted></video>
          <video src={`${process.env.PUBLIC_URL}/Breagan.mp4`} loop autoPlay muted></video>
        </div>
      </section>
    </div>
  );
}

export default App;