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

  // State for expanded/collapsed sections on mobile
  const [expandedSection, setExpandedSection] = useState(null);

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
      const uniqueEndYears = [...new Set(data.map(item => item.end_year).filter(Boolean))].sort((a, b) => a - b);
      const uniqueTopics = [...new Set(data.map(item => item.topic).filter(Boolean))].sort();
      const uniqueSectors = [...new Set(data.map(item => item.sector).filter(Boolean))].sort();
      const uniqueRegions = [...new Set(data.map(item => item.region).filter(Boolean))].sort();
      const uniquePestles = [...new Set(data.map(item => item.pestle).filter(Boolean))].sort();
      const uniqueSources = [...new Set(data.map(item => item.source).filter(Boolean))].sort();
      const uniqueSwots = [...new Set(data.map(item => item.swot).filter(Boolean))].sort();
      const uniqueCountries = [...new Set(data.map(item => item.country).filter(Boolean))].sort();
      const uniqueCities = [...new Set(data.map(item => item.city).filter(Boolean))].sort();

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

  // Toggle section expansion on mobile
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Filter sections grouped for better mobile experience
  const filterSections = [
    { id: 'basic', title: 'Basic Filters', filters: ['end_year', 'topic', 'sector'] },
    { id: 'location', title: 'Location Filters', filters: ['region', 'country', 'city'] },
    { id: 'analysis', title: 'Analysis Filters', filters: ['pestle', 'source', 'swot'] }
  ];

  // Helper function to render filter select
  const renderFilterSelect = (filterName) => {
    const labelMap = {
      end_year: 'End Year',
      topic: 'Topic',
      sector: 'Sector',
      region: 'Region',
      pestle: 'PESTLE',
      source: 'Source',
      swot: 'SWOT',
      country: 'Country',
      city: 'City'
    };

    const optionsMap = {
      end_year: filterOptions.end_years,
      topic: filterOptions.topics,
      sector: filterOptions.sectors,
      region: filterOptions.regions,
      pestle: filterOptions.pestles,
      source: filterOptions.sources,
      swot: filterOptions.swots,
      country: filterOptions.countries,
      city: filterOptions.cities
    };

    return (
      <div key={filterName} className="mb-3">
        <label htmlFor={filterName} className="block text-sm font-medium text-gray-700 mb-1">{labelMap[filterName]}</label>
        <select
          id={filterName}
          name={filterName}
          value={filters[filterName]}
          onChange={handleFilterChange}
          className="select transition-all hover:border-primary focus:border-primary"
        >
          {/* <option value="">{filterName === 'country' || filterName === 'city' ? `All ${labelMap[filterName]}ies` : `All ${labelMap[filterName]}s`}</option> */}
          <option value="">
          {`All ${
              labelMap[filterName].endsWith('y')
              ? labelMap[filterName].slice(0, -1) + 'ies'
              : labelMap[filterName] + 's'
               }`}
          </option>
          {optionsMap[filterName].map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="card mb-6 transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button
          onClick={resetFilters}
          className="btn btn-secondary text-sm md:text-base transition-transform hover:scale-105"
        >
          Reset Filters
        </button>
      </div>

      {/* Desktop View - All filters visible */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(filters).map(filterName => renderFilterSelect(filterName))}
        </div>
      </div>

      {/* Mobile View - Collapsible sections */}
      <div className="md:hidden">
        {filterSections.map(section => (
          <div key={section.id} className="mb-4 border rounded-lg overflow-hidden">
            <button 
              className="w-full p-3 bg-gray-50 text-left font-medium flex justify-between items-center"
              onClick={() => toggleSection(section.id)}
            >
              <span>{section.title}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${expandedSection === section.id ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`p-3 transition-all ${expandedSection === section.id ? 'block' : 'hidden'}`}>
              {section.filters.map(filterName => renderFilterSelect(filterName))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;