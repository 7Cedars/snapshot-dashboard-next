"use client";
import { ChartCanvas } from '../ui/ChartCanvas';
import { NetworkDiagram } from './charts/NetworkDiagram';

const NetworkChart = () => {

  return (
    <div className="border border-gray-300 mt-4 rounded-lg items-center flex-auto"> 
      <ChartCanvas
        VizComponent={NetworkDiagram}
        vizName={"NetworkDiagram"}
        maxWidth={2000}
        height={500}
        />
    </div>
  );
}

export default NetworkChart;