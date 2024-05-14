import React from 'react'
import Navbar from '../../components/user/Navbar/Navbar'
import { Toaster, toast } from 'sonner';

function Home() {

  return (
    <>
      <div>
        <Toaster />
        <Navbar />
      </div>
   
    </>
  )
}

export default Home