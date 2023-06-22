import React, { useEffect, useState } from 'react';
import { InputGroup, Form } from "react-bootstrap";
import axiosClient from "../axios-client.js";
import { Search } from "react-feather";

/**
 *
 * @param {string} search - phrase to search
 * @param {function} setSearch
 * @param {string} placeholder
 * @param {function} setResults - update results
 * @param {function} setIsSearchLoading
 * @return {JSX.Element}
 * @constructor
 */
export default function SearchBar({search, setSearch, placeholder = 'Buscar', setResults, setIsSearchLoading}) {

  useEffect(() => {
    setIsSearchLoading(false);
    if(search.length > 0){
      getSearch();
    }else{
      setResults([]);
    }

  }, [search]);

  /**
   * Search patients
   */
  const getSearch = () => {
    setIsSearchLoading(true)
    axiosClient.get('/patients/search', {
      params: {
        search: search
      }
    })
      .then(({data}) => {
        setIsSearchLoading(false)
        const results = data.patients.filter((patients) => {
          return (
            patients && patients.id && patients.firstName && patients.firstSurname && patients.documentType && patients.documentId
          )
        })
        setResults(results);
      })
      .catch((err) => {
        setIsSearchLoading(false)
        console.error(err);
      })
  }

  /**
   *
   * @param {string} value
   */
  const handleChange = (value) => {
    setSearch(value);
  }


  return (
    <div className='search-bar'>
      <InputGroup>
        <InputGroup.Text id="basic-addon1">
          <Search/>
        </InputGroup.Text>
        <Form.Control placeholder={placeholder} value={search} onChange={(e) => handleChange(e.target.value)}/>
      </InputGroup>
    </div>
  );
}