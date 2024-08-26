import React, { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import './Home.scss'
const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  useEffect(() => {
   const displayLoader = () => setTimeout(() => setIsLoading(false), 1000)
   displayLoader()
  }, [])
  return (
    <div className='container'>
     <h1>Welcome</h1>
     { isLoading && <Loader/>}
    </div>
  );
}

export default Home;