import  { useState, useEffect } from 'react';
import SelectBox from '@/components/schedule/selectbox';
import { Skeleton } from '../ui/skeleton';
import { TimeSelector } from './timeselector';
import { SubmitButton } from './submitbutton';

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
        console.log(data)
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, []);

  function setClassList(values: string[] | string) {
    // if values is a string, wrap it in an array
    if (!Array.isArray(values)) {
      values = [values];
    }
    const new_classes = values.map((v) => ({ code: v.split(' ')[0], number: v.split(' ')[1], crn_list: [] }));
    setSearchParams({ ...searchParams, classes: new_classes });
  }

  function getClassesList(){
    return searchParams.classes.map((c) => `${c.code} ${c.number}`);
  }


  if (loading) {
    return <Skeleton className="w-full h-12 rounded-md mt-4" /> 
  }

  return (
    <div className='flex flex-row min-w-full mt-4 gap-x-3'>
      <SelectBox
            options={options}
            value={getClassesList()}
            onChange={setClassList}
            placeholder="Classes"
            inputPlaceholder="Search for classes"
            emptyPlaceholder="No classes found."
            multiple={true}
            className='grow min-h-12'
          />
      <TimeSelector className="w-36 min-h-12" onChange={(v) => setSearchParams({...searchParams, start_time: v})} label="Start Time"/>
      <TimeSelector className="w-36 min-h-12" onChange={(v) => setSearchParams({...searchParams, end_time: v})} label="End Time"/>
      <SubmitButton className="min-h-12" searchParams={searchParams}/>
    </div>
    
  );
}
