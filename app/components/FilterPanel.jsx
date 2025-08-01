'use client';

import { useState, useEffect } from 'react';

const FilterPanel = ({ onFilterChange, data }) => {
  // State for filter values
  const [filters, setFilters] = useState({
    end_year: '',
    topic: '',
    sector: '',
    region: '',
    pestle: '',
    source: '',
    swot: '',
    country: '',
    city: ''
  });

  // Extract unique values for each filter from the data
  const [filterOptions, setFilterOptions] = useState({
    end_years: [],
    topics: [],
    sectors: [],
    regions: [],
    pestles: [],
    sources: [],
    swots: [],
    countries: [],
    cities: []
  });

  // Update filter options when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const uniqueEndYears = [...new Set(data.map(item => item.end_year).filter(Boolean))];
      const uniqueTopics = [...new Set(data.map(item => item.topic).filter(Boolean))];
      const uniqueSectors = [...new Set(data.map(item => item.sector).filter(Boolean))];
      const uniqueRegions = [...new Set(data.map(item => item.region).filter(Boolean))];
      const uniquePestles = [...new Set(data.map(item => item.pestle).filter(Boolean))];
      const uniqueSources = [...new Set(data.map(item => item.source).filter(Boolean))];
      const uniqueSwots = [...new Set(data.map(item => item.swot).filter(Boolean))];
      const uniqueCountries = [...new Set(data.map(item => item.country).filter(Boolean))];
      const uniqueCities = [...new Set(data.map(item => item.city).filter(Boolean))];

      setFilterOptions({
        end_years: uniqueEndYears,
        topics: uniqueTopics,
        sectors: uniqueSectors,
        regions: uniqueRegions,
        pestles: uniquePestles,
        sources: uniqueSources,
        swots: uniqueSwots,
        countries: uniqueCountries,
        cities: uniqueCities
      });
    }
  }, [data]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  // Reset all filters
  const resetFilters = () => {
    const resetValues = {
      end_year: '',
      topic: '',
      sector: '',
      region: '',
      pestle: '',
      source: '',
      swot: '',
      country: '',
      city: ''
    };
    setFilters(resetValues);
    onFilterChange(resetValues);
  };

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* End Year Filter */}
        <div>
          <label htmlFor="end_year" className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
          <select
            id="end_year"
            name="end_year"
            value={filters.end_year}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All End Years</option>
            {filterOptions.end_years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Topic Filter */}
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
          <select
            id="topic"
            name="topic"
            value={filters.topic}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All Topics</option>
            {filterOptions.topics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>

        {/* Sector Filter */}
        <div>
          <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
          <select
            id="sector"
            name="sector"
            value={filters.sector}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All Sectors</option>
            {filterOptions.sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Region</label>
          <select
            id="region"
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All Regions</option>
            {filterOptions.regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* PESTLE Filter */}
        <div>
          <label htmlFor="pestle" className="block text-sm font-medium text-gray-700 mb-1">PESTLE</label>
          <select
            id="pestle"
            name="pestle"
            value={filters.pestle}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All PESTLE</option>
            {filterOptions.pestles.map(pestle => (
              <option key={pestle} value={pestle}>{pestle}</option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <select
            id="source"
            name="source"
            value={filters.source}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All Sources</option>
            {filterOptions.sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>

        {/* SWOT Filter */}
        <div>
          <label htmlFor="swot" className="block text-sm font-medium text-gray-700 mb-1">SWOT</label>
          <select
            id="swot"
            name="swot"
            value={filters.swot}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All SWOT</option>
            {filterOptions.swots.map(swot => (
              <option key={swot} value={swot}>{swot}</option>
            ))}
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select
            id="country"
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All Countries</option>
            {filterOptions.countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select
            id="city"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All Cities</option>
            {filterOptions.cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={resetFilters}
          className="btn btn-secondary"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;