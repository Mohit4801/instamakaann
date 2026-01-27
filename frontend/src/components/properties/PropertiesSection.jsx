import React, { useEffect, useState } from 'react';
import { PropertyCard } from './PropertyCard';
import { Link } from 'react-router-dom';
import api from '@/lib/api';

export const PropertiesSection = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties');
        setProperties(res.data || []);
      } catch (err) {
        setError('No properties found');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-[#0b1220] text-center">
        <p className="text-slate-500 dark:text-slate-400">
          Loading properties...
        </p>
      </section>
    );
  }

  if (error || properties.length === 0) {
    return (
      <section className="py-20 bg-white dark:bg-[#0b1220] text-center">
        <p className="text-slate-500 dark:text-slate-400">
          No properties available
        </p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-[#0b1220]">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Recommended Properties
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Properties matching your preferences
            </p>
          </div>

          <Link
            to="/all-properties"
            className="
              text-sm px-4 py-2 rounded-lg
              border border-teal-500/40
              text-teal-600 dark:text-teal-400
              hover:bg-teal-500/10
              transition
            "
          >
            View All Properties
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.slice(0, 4).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};
