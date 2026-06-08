'use client';
import React, { useState } from 'react';
import category_data from '@/data/category-data';
import { ICategoryType } from '@/types/category-d-t';
import { useRouter } from 'next/navigation';

// prop type 
type IProps = {
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

  // Real categories for search
  const uniqueCategory = ['AI Tools', 'Creative & Editing', 'Work & OS', 'Streaming', 'VPNs', 'Adults'];

const SearchPopup = ({showSearch,setShowSearch}:IProps) => {
  const router = useRouter();
  const [categoryVal, setCategoryVal] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const generateQueryParams = () => {
    const queryParams = [];

    if (categoryVal) {
      queryParams.push(`category=${categoryVal.toLowerCase()}`);
    }

    if (searchText) {
      queryParams.push(`searchText=${searchText.toLowerCase()}`);
    }

    return queryParams.join("&");
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const queryParams = generateQueryParams();
    if (queryParams) {
      router.push(`/shop?${queryParams}`);
      setShowSearch(false);
    } else {
      router.push(`/shop`);
      setCategoryVal("");
    }
  };

  const handleCategorySearch = (c: string) => {
    setCategoryVal(c);
    // Use the value directly since state update is async
    const queryParams = [];
    if (c) queryParams.push(`category=${c}`);
    if (searchText) queryParams.push(`searchText=${searchText.toLowerCase()}`);
    
    router.push(`/shop?${queryParams.join("&")}`);
    setShowSearch(false);
  };
  
  return (
    <>
    <section className={`header__search white-bg transition-3 ${showSearch ? 'search-opened' : ''}`}>
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="header__search-inner text-center">
              <form onSubmit={handleSubmit}>
                <div className="header__search-btn" onClick={() => setShowSearch(false)}>
                  <button className="header__search-btn-close">
                    <i className="fal fa-times"></i>
                  </button>
                </div>
                <div className="header__search-header">
                  <h3>Search</h3>
                </div>
                <div className="header__search-categories">
                  <ul className="search-category">
                    {uniqueCategory.map((c, index) => {
                      return (
                        <li key={index}>
                          <a className={`cursor-pointer ${categoryVal === c ? 'active' : ''}`} onClick={() => handleCategorySearch(c)}>
                            {c}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="header__search-input p-relative">
                  <input type="text" name='search' onChange={(e) => setSearchText(e.target.value)} placeholder="Search for products... " />
                  <button type="submit"><i className="far fa-search"></i></button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </section>
    {/* body overlay */}
    <div onClick={() => setShowSearch(false)} className={`body-overlay transition-3 ${showSearch ? 'opened' : ''}`}></div>
  </>
  );
};

export default SearchPopup;