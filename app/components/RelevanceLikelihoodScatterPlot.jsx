'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const RelevanceLikelihoodScatterPlot = ({ data }) => {
  const svgRef = useRef(null);
  const chartRef = useRef(null);
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

    // Set up dimensions and margins
    const margin = { 
      top: 40, 
      right: dimensions.width < 500 ? 20 : 30, 
      bottom: 60, 
      left: dimensions.width < 500 ? 40 : 60 
    };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.relevance) + 1])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.likelihood) + 1])
      .range([height, 0]);

    // Create color scale based on sector
    const sectors = [...new Set(data.map(d => d.sector).filter(Boolean))];
    const color = d3.scaleOrdinal()
      .domain(sectors)
      .range(d3.schemeCategory10);

    // Create and add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Create and add y-axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Relevance vs. Likelihood Scatter Plot');

    // Add x-axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text('Relevance');

    // Add y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .text('Likelihood');

    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3.axisBottom(x)
          .tickSize(-height)
          .tickFormat('')
      )
      .style('stroke', '#e0e0e0')
      .style('stroke-opacity', '0.7')
      .style('shape-rendering', 'crispEdges');

    svg.append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(y)
          .tickSize(-width)
          .tickFormat('')
      )
      .style('stroke', '#e0e0e0')
      .style('stroke-opacity', '0.7')
      .style('shape-rendering', 'crispEdges');

    // Create and add scatter plot points
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.relevance))
      .attr('cy', d => y(d.likelihood))
      .attr('r', 5)
      .style('fill', d => color(d.sector || 'Unknown'))
      .style('opacity', 0.7)
      .style('stroke', 'white')
      .style('stroke-width', 0.5)
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
          .style('opacity', 0);

        tooltip
          .html(`
            <strong>Topic:</strong> ${d.topic}<br>
            <strong>Sector:</strong> ${d.sector || 'Unknown'}<br>
            <strong>Relevance:</strong> ${d.relevance}<br>
            <strong>Likelihood:</strong> ${d.likelihood}<br>
            <strong>Region:</strong> ${d.region || 'Unknown'}
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .transition()
          .duration(200)
          .style('opacity', 0.9);

        // Highlight the point
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8)
          .style('opacity', 1);
      })
      .on('mouseout', function(event, d) {
        // Remove tooltip on mouseout
        d3.selectAll('.tooltip').remove();

        // Restore original point size
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 5)
          .style('opacity', 0.7);
      });

    // Add legend (adjust for small screens)
    if (dimensions.width >= 400) { // Only show legend on larger screens
      const legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0,${i * 20})`);

      // Add legend colored rectangles
      legend.append('rect')
        .attr('x', width - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color);

      // Add legend text
      legend.append('text')
        .attr('x', width - 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .style('font-size', dimensions.width < 500 ? '10px' : '12px')
        .text(d => d);
    }

  }, [data, dimensions]);

  return (
    <div className="card h-full">
      <div ref={chartRef} className="w-full h-full overflow-hidden">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};

export default RelevanceLikelihoodScatterPlot;