import { useState, useEffect } from 'react';

//custom hook for returning a sorted array of objects by a specific field
const useArrayOfObjectsSortedByField = (objArr, sortedField, sortDirection) => {
  const [sortedObjArr, setSortedObjArr] = useState(null);

  useEffect(() => {
    // update the array of objects
    const newObjArr = objArr?.sort((a, b) => {
      return a[sortedField] < b[sortedField]
        ? sortDirection * -1
        : a[sortedField] > b[sortedField]
        ? sortDirection
        : 0;
    });
    // console.log({ newObjArr });
    setSortedObjArr(newObjArr);

    // cleanup
    return () => {
      setSortedObjArr(null);
    };
  }, [objArr, sortedField, sortDirection]);

  return [sortedObjArr, setSortedObjArr];
};

export default useArrayOfObjectsSortedByField;
