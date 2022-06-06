import { useState, useEffect } from 'react';

//custom hook for getting info for list of tone rows
const useToneRows = () => {
  const [toneRows, setToneRows] = useState(null);

  useEffect(() => {
    // fetch tone rows
    const fetchToneRows = async () => {
      // console.log('fetching tone rows');
      const response = await fetch(`/api/tonerows`);
      const resJSON = await response.json();
      const newToneRows = resJSON.data;

      // console.log({ toneRows });

      // update the tone rows
      setToneRows(newToneRows);
    };

    fetchToneRows();

    // cleanup
    return () => {
      setToneRows(null);
    };
  }, []);

  return [toneRows, setToneRows];
};

export default useToneRows;
