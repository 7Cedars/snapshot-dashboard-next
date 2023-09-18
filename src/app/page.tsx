"use client"

import Link from 'next/link'

const Home = () => {

  return (
    
    <div className="pt-40 flex flex-row w-full max-h-screen text-sm py-5 place-content-center px-2">
      <div> 
        A Dashboard for Visualising Relational Voting Behaviour on Snapshot 
      </div>
      <div>
        <Link href='/dashboard'>To the DashBoard</Link>
      </div>

    </div> 

  );
}

export default Home