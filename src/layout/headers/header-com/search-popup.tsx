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

  // Get all the children from the category_data array
  const allChildren: string[] = category_data.reduce((children: string[], category: ICategoryType) => {
    if (category.children && category.children.length > 0) {
      children.push(...category.children);
    }
    return children;
  }, []);

  // Create a new unique children array
  const uniqueCategory = [...new Set(allChildren)];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = generateQueryParams();
    if (queryParams) {
      router.push(`/search?${queryParams}`);
    } else {
      router.push(`/`);
      setCategoryVal("");
    }
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
                          <a className={`cursor-pointer ${categoryVal === c ? 'active' : ''}`} onClick={() => setCategoryVal(c)}>
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