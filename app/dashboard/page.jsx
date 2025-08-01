'use client';

import { useState, useEffect } from 'react';
import FilterPanel from '@/app/components/FilterPanel';
import IntensityChart from '@/app/components/IntensityChart';
import LikelihoodByRegionChart from '@/app/components/LikelihoodByRegionChart';
import RelevanceLikelihoodScatterPlot from '@/app/components/RelevanceLikelihoodScatterPlot';
import TopicsDistributionChart from '@/app/components/TopicsDistributionChart';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/data');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setFilteredData(result);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filter changes
  const handleFilterChange = async (filters) => {
    setLoading(true);
    
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    try {
      const response = await fetch(`/api/data?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      setFilteredData(result);
    } catch (err) {
      console.error('Error fetching filtered data:', err);
      setError('Failed to apply filters. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Visualization Dashboard</h1>
        <p className="text-gray-600">Explore and analyze insights with interactive visualizations</p>
      </div>

      {/* Filter Panel */}
      <FilterPanel onFilterChange={handleFilterChange} data={data} />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3 text-lg">Loading...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* Data Visualizations */}
      {!loading && !error && filteredData.length > 0 && (
        <div className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Intensity Chart */}
            <div className="h-[350px] md:h-[400px]">
              <IntensityChart data={filteredData} />
            </div>
            
            {/* Likelihood by Region Chart */}
            <div className="h-[350px] md:h-[400px]">
              <LikelihoodByRegionChart data={filteredData} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Relevance and Likelihood Scatter Plot */}
            <div className="h-[350px] md:h-[400px]">
              <RelevanceLikelihoodScatterPlot data={filteredData} />
            </div>
            
            {/* Topics Distribution Chart */}
            <div className="h-[350px] md:h-[400px]">
              <TopicsDistributionChart data={filteredData} />
            </div>
          </div>

          {/* Data Summary */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Data Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-700">Total Records</h3>
                <p className="text-2xl font-bold">{filteredData.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-700">Unique Sectors</h3>
                <p className="text-2xl font-bold">
                  {new Set(filteredData.map(item => item.sector).filter(Boolean)).size}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-700">Unique Topics</h3>
                <p className="text-2xl font-bold">
                  {new Set(filteredData.map(item => item.topic).filter(Boolean)).size}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-700">Unique Regions</h3>
                <p className="text-2xl font-bold">
                  {new Set(filteredData.map(item => item.region).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!loading && !error && filteredData.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6" role="alert">
          <p>No data found with the current filters. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}