// £ack https://gist.github.com/fasiha/d23ea4905cf5e4650e8cdeabdd15249f
// £ack https://stackoverflow.com/questions/39144374/how-to-render-svg-element-of-d3-js-using-react-js/69044058#69044058
import * as d3 from 'd3';
import { useState, useEffect, useRef, createRef } from 'react';
import { ForceGraph } from './ForceGraph';
import { dummyData } from '../../../../public/data/dummyNetworkData';

// export default function drawGraph(svgRef) {
//   const graphSvg = d3.select(svgRef.current);

//   graphSvg.join( 
//     ForceGraph(dummyData, {
//     nodeId: d => d.id,
//     nodeGroup: d => d.group,
//     nodeTitle: d => `${d.id}\n${d.group}`,
//     linkStrokeWidth: l => Math.sqrt(l.value),
//     width: 300,
//     height: 300, 
//     // invalidation // a promise to stop the simulation when the cell is re-run
//     })
//   )

// }

export const PlacedSvgGraph = () => {
  const svg = useRef(null) 

  useEffect(() => {

    if (svg) {
      svg.current.appendChild(ForceGraph(dummyData, {
        nodeId: d => d.id,
        nodeGroup: d => d.group,
        nodeTitle: d => `${d.id}\n${d.group}`,
        linkStrokeWidth: l => Math.sqrt(l.value),
        width: 400,
        height: 400, 
        // invalidation // a promise to stop the simulation when the cell is re-run
        })
      )
    }
  }, [])

  console.log("svg.current: ", svg.current)

  return (
    <div ref = {svg} />   
  )
}


  //     const graphSvg = 
  //       ForceGraph(dummyData, {
  //       nodeId: d => d.id,
  //       nodeGroup: d => d.group,
  //       nodeTitle: d => `${d.id}\n${d.group}`,
  //       linkStrokeWidth: l => Math.sqrt(l.value),
  //       width: 300,
  //       height: 300, 
  //       // invalidation // a promise to stop the simulation when the cell is re-run
  //       })

  //     console.log("graph: ", graphSvg)
      
  //   }


  // }, [graphSvg])


  // return graphSvg 

  // useEffect(() => {
  //   if (ref.current) {
  //     const dom = ref.current;
  //     const d3Container = d3.select(dom);

  //     const svg = d3Container
  //       .append('svg')
  //       .attr('width', dom.getBoundingClientRect().width)
  //       .attr('height', dom.getBoundingClientRect().height)
  //       .call(
  //         d3.zoom().on('zoom', function (event) {
  //           svg.attr('transform', event.transform);
  //         }),
  //       )
  //       .append('g');

  //     const circle = svg
  //       .append('circle')
  //       .attr('cx', 50)
  //       .attr('cy', 50)
  //       .attr('r', 1)
  //       .attr('fill', '#4CAF50');

    

  //     function animate() {
  //       let radius = 5;
  //       const distance = 100;
  //       circle
  //         .transition()
  //         .duration(2000)
  //         .attrTween('r', () => d3.interpolate(radius, radius + distance))
  //         .on('end', () => {
  //           radius = +circle.attr('r');
  //           circle
  //             .transition()
  //             .duration(2000)
  //             .attrTween('r', () => d3.interpolate(radius, radius - distance))
  //             .on('end', animate);
  //         });
  //     }

  //     animate();
  //   }
  // }, [ref]);
  // return <svg ref = {ref} style={{ height: 300, width: 300, border: "solid" }}></svg>;
// }

  // const d3ref = useD3((svg) => {
  //     const circle = svg
  //       .append("circle")
  //       .attr("cx", 50)
  //       .attr("cy", 50)
  //       .attr("r", 1)
  //       .attr("fill", "#4CAF50");
  
  //     function animate() {
  //       let radius = 5;
  //       let distance = 35;
  //       circle
  //         .transition()
  //         .duration(2000)
  //         .attrTween("r", () => d3.interpolate(radius, radius + distance))
  //         .on("end", () => {
  //           radius = circle.attr("r");
  //           distance = 35;
  
  //           circle
  //             .transition()
  //             .duration(2000)
  //             .attrTween("r", () => d3.interpolate(radius, radius - distance))
  //             .on("end", animate);
  //         });
  //     }
  //     animate();
  //   }, []);

      // const graph = 
      //   ForceGraph(dummyData, {
      //   nodeId: d => d.id,
      //   nodeGroup: d => d.group,
      //   nodeTitle: d => `${d.id}\n${d.group}`,
      //   linkStrokeWidth: 2,// l => Math.sqrt(l.value),
      //   width: 300,
      //   height: 300, 
      //   // invalidation // a promise to stop the simulation when the cell is re-run
      // })
 