import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { useMemo, useState, useEffect} from "react";

export default function Classes() {

    let gened_abr_mapper = {
        'CS': {
            'SELF': 'Cultural Studies',
            'NW': 'Non-Western Cultures',
            'WCC': 'Western/Comparative Cultures',
            'US': 'US Minority Cultures',
            '': ''
        },
        'HUM': {
            'SELF' : 'Humanities & the Arts',
            'HP': 'Historical & Philosophical Perspectives',
            'LA': 'Literature & the Arts',
            '': ''
        },
        'NAT': {
            'SELF': 'Natural Sciences & Technology',
            'LS': 'Life Sciences',
            'PS': 'Physical Sciences',
            '': ''
        },
        'QR': {
            'SELF': 'Quantitative Reasoning',
            'QR1': 'Quantitative Reasoning 1',
            'QR2': 'Quantitative Reasoning 2',
            '': ''
        },
        'SBS': {
            'SELF': 'Social & Behavioral Sciences',
            'BS': 'Behavioral Sciences',
            'SS': 'Social Sciences',
            '': ''
        },
        '': ''
    };

    const defaultColDef = useMemo(() => {
        return {
            filter : true,  
        }
    })

    const [rowData, setRowData] = useState([
      ]);
      
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        { field: "code", headerName:"Subject" },
        { headerName: "Number", cellDataType : 'number', valueGetter : p => parseInt(p.data.number)},
        { field: "name"},
        { 
            headerName: 'Grades',
            children: [
                { 
                    headerName: 'Average GPA',
                    valueGetter : p => p.data.grades.avg_gpa != null ? Math.round(p.data.grades.avg_gpa * 100) / 100 : null,
                    cellDataType : 'number',
                },
                { 
                    headerName: 'Percentage of 4.0s',
                    valueGetter : p => p.data.grades.percent_4s ,
                    cellDataType : 'number',
                    valueFormatter : p =>  p.value != null ? Math.round(p.value * 100) + "%" : ""
                },
                { 
                    headerName: 'Number of Students',
                    field : "grades.num_students",
                    cellDataType : "number"
                },
            ]
        },
        { 
            headerName: 'Geneds',
            children: [
                { 
                    headerName: 'Advanced Composition',
                    valueGetter : p => p.data.gened.ACP == 'ACP',
                    cellDataType : 'boolean',
                },
                { 
                    headerName: 'Cultural Studies',
                    valueGetter : p => gened_abr_mapper['CS'][p.data.gened.CS]
                },
                { 
                    headerName: 'Humanities & Arts',
                    valueGetter : p => gened_abr_mapper['HUM'][p.data.gened.HUM]
                }, 
                { 
                    headerName: 'Natural Sciences & Technology',
                    valueGetter : p => gened_abr_mapper['NAT'][p.data.gened.NAT]
                },
                { 
                    headerName: 'Quantitative Reasoning',
                    valueGetter : p => gened_abr_mapper['QR'][p.data.gened.QR]
                },
                { 
                    headerName: 'Social & Behavioral Sciences',
                    valueGetter : p => gened_abr_mapper['SBS'][p.data.gened.SBS]
                },
            ]
        },
       
        
    ]);

    useEffect(() => {
        fetch(import.meta.env.VITE_GET_CLASSES_URL + "?dump=true") // Fetch data from server
          .then(result => result.json()) // Convert to JSON
          .then(rowData => setRowData(rowData)) // Update state of `rowData`
          .then(console.log(rowData[0]));
    }, [])

    let gridOptions = {
        autoSizeStrategy: {
            type: 'fitCellContents'
        },
        isExternalFilterPresent : externalFilter,


    
    }

    const [gened1, setGened1] = useState({col : '', val : ''});

    const handleGened1 = (e) => {
        console.log(e.target.value)
        // if key == a first level key, then set the value to the value of the key to * and col to key
        let gened_groups = Object.keys(gened_abr_mapper);
        if (gened_groups.includes(e.target.value)) {
            setGened1({col : e.target.value, val : '*'})
        } else {
            setGened1({col : e.target.value, val : e.target.value})
        }
    };

    function externalFilter() {
        return gened1 !== '';
    }

    return (
        // wrapping container with theme & size
        <div className="font-sans p-5">
            <h2 className="font-serif text-4xl pb-5">Fall 24 Classes</h2>

            <div className='flex flex-row w-full'>
                <div
                className="ag-theme-quartz" // applying the grid theme
                style={{ height: 600, width : '100%' }} // the grid will fill the size of the parent container
                id="class_table"
                >
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={colDefs}
                        defaultColDef={defaultColDef}
                        gridOptions={gridOptions}
                    />
                </div>
                <div className='flex flex-col pl-4 '>
                    <div className='glossy min-w-max py-5 px-6 border rounded-lg'>
                        <h3 className='text-lg font-bold pb-2'>Filter Geneds</h3>
                        <select onClick={handleGened1} defaultValue={gened1} name="Gened" id="gened_1" className='bg-transparent border-b border-gray-500  py-1'>
                            <option value="">Select a Gened</option>
                            {
                                // Iterate through the gened_abr_mapper with second level keys being tabbed and first level keys using self as name

                                Object.keys(gened_abr_mapper).map((key) => {
                                    if (key == '') {
                                        return
                                    }
                                    return <optgroup key={key} label={gened_abr_mapper[key]['SELF']}>
                                        {
                                            Object.keys(gened_abr_mapper[key]).map((subkey) => {
                                                if (subkey != 'SELF' && subkey != '') {
                                                    return <option key={subkey} value={subkey}>{gened_abr_mapper[key][subkey]}</option>
                                                }
                                            })
                                        }
                                        <option key={key} value={key}>All</option>
                                    </optgroup>
                                })
                            }
                        </select>

                        {/* {
                            // If gened_1 is selected, then show an option for and/or and gened_2 picker
                            (gened1 !== '') ?
                        } */}

                    </div>

                    <div>

                    </div>
                    
                </div>
        
            </div>
        </div>
    )
}