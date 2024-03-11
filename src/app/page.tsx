"use client"

import Link from 'next/link'
import Image from 'next/image';

const Home = () => {

  return (
    
    <div className="grid grid-cols-1 lg:grid-cols-2 max-h-screen text-sm py-5 justify-items-stretch px-2">
      <div className='flex justify-end pe-12 h-0 lg:h-full'> 
        <img
            className="flex"
            aria-hidden="true"
            width={400}
            height={400}
            src={`/images/networkExample.png `}
            alt="network example"
          />
      </div>

      <div className='flex lg:justify-start justify-center'>
        <div className='flex flex-col place-content-center '> 
         
          <img
                  className="flex justify-center self-center"
                  aria-hidden="true"
                  width={200}
                  height={200 }
                  src={`/images/snapnetLogo.svg `}
                  alt="SnapnetLogo icon"
                />
          <div className='text-center text-4xl text-bold mt-6'>
            Snapnet
          </div>
          <div className='text-center text-gray-500'>
            Visualising DAO voter networks
          </div>
          <div className='flex flex-col place-content-center justify-center text-center mt-20'>
              <Link 
                href='/dashboard?d1=1679018147782&d2=1696362727015'
                className='w-64 h-10 m-2 self-center flex flex-col place-content-center text-blue-400 border border-blue-500 bg-blue-100 hover:bg-blue-200 rounded rounded-lg hover'>
                  To the DashBoard
                </Link>
          </div>
        </div>
      </div>
    </div> 
  );
}

export default Home