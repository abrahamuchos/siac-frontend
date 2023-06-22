import React from 'react';
import Spinner from "./Spinner.jsx";

export default function SearchResultsList({results, isSearchLoading, setIdPatient, setSearch}) {

  const handleClick = (patientId) =>{
    setIdPatient(patientId)
    setSearch('')
  }

  return (
    <ul className='search-results-list'>
      { isSearchLoading ? (<li key='spinner' className='text-center p-0'><Spinner /></li>) : ''}
      { isSearchLoading ? '' :
        results.map((result) =>{
          return (<li key={result.id} onClick={() => handleClick(result.id)}>
            {result.firstName +' '+ result.firstSurname+' ('+ result.documentType+': '+ result.documentId+') '}
          </li>)
        })
      }
    </ul>
  );
}

