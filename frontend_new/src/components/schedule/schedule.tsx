import { useState } from 'react';
import TopBar from '@/components/schedule/topbar';
import SearchBar from '@/components/schedule/searchbar';

export default function Schedule() {

    const [searchParams, setSearchParams] = useState({
        classes: [], // {'code': class_code, 'number': class_number, 'crn_list': crn_list}
        pref_sections: [], // list of crns
        open_sections_only: true, 
        start_time: 0, // 24 hour time
        end_time: 0, // 24 hour time
        pref_time : 12, // 24 hour time (to center around)
        lunch: { // lunch time, slider maybe?
            start: 11,
            end: 13,
            duration: 1
        },
        max_distance : 1600, // distance in meters
        back_to_back: true, // prefer back to back classes
    });

    /*
    Groups - 

    top - semester, open sections only
    main - classes, start and end time
    bottom - each class, lunch, distance, preferences (back to back & pref time)

    */

    return (
        <div>
            <TopBar searchParams={searchParams} setSearchParams={setSearchParams}></TopBar>
            <SearchBar searchParams={searchParams} setSearchParams={setSearchParams}></SearchBar>
        </div>
    )
}