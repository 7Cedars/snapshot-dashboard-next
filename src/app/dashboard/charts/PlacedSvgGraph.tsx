
import * as d3 from 'd3';
import { useState, useEffect, useRef } from 'react';

export default function PlacedSvgGraph() {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const dom = ref.current;
      const d3Container = d3.select(dom);

      const svg = d3Container
        .append('svg')
        .attr('width', dom.getBoundingClientRect().width)
        .attr('height', dom.getBoundingClientRect().height)
        .call(
          d3.zoom<SVGSVGElement, unknown>().on('zoom', function (event) {
            svg.attr('transform', event.transform);
          }),
        )
        .append('g');

      const circle = svg
        .append('circle')
        .attr('cx', 50)
        .attr('cy', 50)
        .attr('r', 1)
        .attr('fill', '#4CAF50');

      function animate() {
        let radius = 5;
        const distance = 35;
        circle
          .transition()
          .duration(2000)
          .attrTween('r', () => d3.interpolate(radius, radius + distance) as any)
          .on('end', () => {
            radius = +circle.attr('r');
            circle
              .transition()
              .duration(2000)
              .attrTween('r', () => d3.interpolate(radius, radius - distance) as any)
              .on('end', animate);
          });
      }

      animate();
    }
  }, [ref]);
  return <svg ref={ref} style={{ height: 100, width: 100 }}></svg>;
}