'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const IntensityChart = ({ data }) => {
  const chartRef = useRef(null);
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        const { width } = chartRef.current.getBoundingClientRect();
        setDimensions({
          width: width,
          height: Math.min(400, Math.max(300, width * 0.6)) // Responsive height
        });
      }
    };

    // Initial sizing
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!data || data.length === 0 || dimensions.width === 0) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Group data by sector and calculate average intensity
    const sectorData = d3.rollup(
      data,
      v => d3.mean(v, d => d.intensity),
      d => d.sector
    );

    // Convert Map to array and sort by intensity
    const sectorArray = Array.from(sectorData, ([sector, intensity]) => ({ sector, intensity }))
      .filter(d => d.sector) // Filter out empty sectors
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 10); // Limit to top 10 for better mobile display

    // Set up dimensions and margins
    const margin = { top: 40, right: 30, bottom: 80, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .domain(sectorArray.map(d => d.sector))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sectorArray, d => d.intensity) * 1.1])
      .range([height, 0]);

    // Create and add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', dimensions.width < 500 ? '8px' : '10px'); // Smaller font on mobile

    // Create and add y-axis
    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', dimensions.width < 500 ? '8px' : '10px'); // Smaller font on mobile

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', dimensions.width < 500 ? '14px' : '16px')
      .style('font-weight', 'bold')
      .text('Average Intensity by Sector');

    // Add x-axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', dimensions.width < 500 ? '10px' : '12px')
      .text('Sector');

    // Add y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', dimensions.width < 500 ? '10px' : '12px')
      .text('Average Intensity');

    // Create color scale
    const color = d3.scaleOrdinal()
      .domain(sectorArray.map(d => d.sector))
      .range(d3.schemeCategory10);

    // Create and add bars
    svg.selectAll('.bar')
      .data(sectorArray)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.sector))
      .attr('y', d => y(d.intensity))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.intensity))
      .attr('fill', d => color(d.sector))
      .attr('rx', 2) // Rounded corners
      .attr('ry', 2)
      .on('mouseover', function(event, d) {
        // Show tooltip on hover
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background-color', 'white')
          .style('border', '1px solid #ddd')
          .style('border-radius', '4px')
          .style('padding', '10px')
          .style('box-shadow', '0 2px 5px rgba(0, 0, 0, 0.1)')
          .style('pointer-events', 'none')
          .style('opacity', 0)
          .style('z-index', 1000); // Ensure tooltip is on top

        tooltip
          .html(`<strong>Sector:</strong> ${d.sector}<br><strong>Avg. Intensity:</strong> ${d.intensity.toFixed(2)}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .transition()
          .duration(200)
          .style('opacity', 0.9);

        // Highlight the bar
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', d3.rgb(color(d.sector)).brighter(0.5));
      })
      .on('mouseout', function(event, d) {
        // Remove tooltip on mouseout
        d3.selectAll('.tooltip').remove();

        // Restore original bar color
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', color(d.sector));
      });

  }, [data, dimensions]);

  return (
    <div className="card h-full">
      <div ref={chartRef} className="w-full h-full overflow-hidden">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};

export default IntensityChart;