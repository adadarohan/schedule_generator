import  { useState, useEffect } from 'react';
import SelectBox from '@/components/schedule/selectbox';

export default function SearchBar({ searchParams, setSearchParams }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const response = await fetch(import.meta.env.VITE_GET_CLASSES_URL);
        let data = await response.json();
        // convert into key value pairs, with key and value same
        data = data.map((d) => ({ value: d, label: d }));
        setOptions(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, []);

  function setClassList(values: string[] | string) {
    console.log(values);
    setSearchParams({ ...searchParams, classes: values });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SelectBox
      options={options}
      value={searchParams.classes}
      onChange={setClassList}
      placeholder="Select classes"
      inputPlaceholder="Search for classes"
      emptyPlaceholder="No classes found."
      multiple
      className='mt-4 py-3'
    />
  );
}
