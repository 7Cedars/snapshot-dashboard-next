"use client"

import Link from 'next/link'
import { PROPOSALS_FROM_SPACES } from './utils/queries';
import { useQuery } from '@apollo/client';

const Home = () => {

  const { loading, error, data, client } = useQuery(PROPOSALS_FROM_SPACES, {
    variables: { 
      first: 1000, 
      skip: 0, 
      space_in: ['ctcswap.eth', 'linea-build.eth']} 
  });

  if (loading) return null;
  if (error) return `Error! ${error}`;

  console.log(data, "client: ", client)


  return (
    
    <div className="pt-40 flex flex-row w-full max-h-screen text-sm py-5 place-content-center px-2">
      <div> 
        A Dashboard for Visualising Relational Voting Behaviour on Snapshot 
        {/* <SpacesList/> */}
      </div>
      <div>
        <Link href='/dashboard'>To the DashBoard</Link>
      </div>

    </div> 

  );
}

export default Home