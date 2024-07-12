import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

const LazySearchSelect = ({ options, value, onChange, onSearch, placeholder, isLoading }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const displayedOptions = useMemo(() => {
    if (!Array.isArray(options)) return [];
    return options.slice(0, page * itemsPerPage);
  }, [options, page, itemsPerPage]);

  const hasMore = displayedOptions.length < (Array.isArray(options) ? options.length : 0);

  const selectedOption = useMemo(() => {
    if (!Array.isArray(options)) return null;
    return options.find(option => option.id && option.id.toString() === value);
  }, [options, value]);

  useEffect(() => {
    if (selectedOption && !displayedOptions.includes(selectedOption)) {
      const pageNumber = Math.floor((Array.isArray(options) ? options.indexOf(selectedOption) : -1) / itemsPerPage) + 1;
      setPage(pageNumber);
    }
  }, [selectedOption, displayedOptions, options, itemsPerPage]);

  const handleLoadMore = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setPage(prev => prev + 1);
  }, []);

  const handleSearch = useCallback((e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    setPage(1);
    onSearch(newSearch);
  }, [onSearch]);

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder}>
          {selectedOption ? selectedOption.name : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
            className="mb-2"
          />
          <div className="max-h-[200px] overflow-auto">
            {isLoading ? (
              <div className="text-center py-2">Loading...</div>
            ) : (
              displayedOptions.map((option) => (
                <SelectItem key={option.id} value={option.id.toString()}>
                  {option.name}
                </SelectItem>
              ))
            )}
            {hasMore && !isLoading && (
              <div className="pt-2 border-t mt-2">
                <Button 
                  onClick={handleLoadMore}
                  variant="outline" 
                  className="w-full"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </SelectContent>
    </Select>
  );
};

export default React.memo(LazySearchSelect);