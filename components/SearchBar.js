import React from 'react'; 
const SearchBar = ({ onSearch }) => { 
  const handleSearch = (e) => { 
    const query = e.target.value; onSearch(query); 
  } return ( <div className="search-bar"> 
    <input type="text" placeholder="Search films..." onChange={handleSearch} /><button>Search</button> 
    </div> ); 
} 
export default SearchBar;
