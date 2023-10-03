"use client"

import Link from 'next/link'

const Home = () => {

  return (
    
    <div className="pt-40 flex flex-row w-full max-h-screen text-sm py-5 place-content-center px-2">
      <div> 
        A Dashboard for Visualising Relational Voting Behaviour on Snapshot 
      </div>
      <div>
        <Link href='/dashboard?d1=1679018147782&d2=1696362727015'>To the DashBoard</Link>
                                  1696362727015
      </div>

    </div> 

  );
}

export default Home