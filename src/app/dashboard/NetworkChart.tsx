"use client";
import { ChartCanvas } from '../ui/ChartCanvas';
import { NetworkDiagram } from './charts/NetworkDiagram';

const NetworkChart = ( ) => {

  return (
    <div className='content-center'> 
       <b> Network Component </b>
      <button 
        type="submit"
        className="font-medium text-black px-5 hover:text-gray-300 sm:py-6"
        // onClick={handleDataOnClick}
        >
        LOAD DATA
      </button> 
      <div>  
        <ChartCanvas
          VizComponent={NetworkDiagram}
          vizName={"NetworkDiagram"}
          maxWidth={2000}
          height={300}
          />
    </div>
    </div>
  );
}

export default NetworkChart;