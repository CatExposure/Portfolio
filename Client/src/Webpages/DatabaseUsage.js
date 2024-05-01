import "../styles/Database.css";
import React from 'react';
import Axios from 'axios';
import {flexRender, getCoreRowModel, getFilteredRowModel, useReactTable} from '@tanstack/react-table';
//MAKE TABLE INTO COMPONENT

function Databases(){

     //runs only on first load. Only used to automatically fetch the database data and store it
     React.useEffect(() => {
        try {
            Axios.get("/test").then((response) => {
                ObjectConversion(response.data.rows);
                //setarrayData(response.data.rows);
            })
        } catch (err){
            console.log(err);
        }
    }, [])

    //useState to store the data obtained from the database
    const [data, setData] = React.useState([]);

    //converts an array of arrays into an array of objects, because god forbid I can't use an array index as the accessorKey 
    function ObjectConversion(arrayData){
        var data = []
        if (arrayData){
            console.log(arrayData);
            arrayData.forEach(row => {
                var object = {
                    "first_name": row[1],
                    "last_name": row[2],
                    "email": row[3],
                    "address": row[4],
                    "phone": row[5],
                    "access": row[6],
                    "password": row[7]
                }
                data.push(object);
            });
            setData(data)
        }
    }

    //defines what the columns will display and what type of information is tied to them
    const columns = [
        {
            accessorKey: "first_name",
            header: "First Name",
        },
        {
            accessorKey: "last_name",
            header: "Last Name",
        },
        {
            accessorKey: "email",
            header: "Email Address",
        },
        {
            accessorKey: "address",
            header: "Address",
        },
        {
            accessorKey: "phone",
            header: "Phone Number",
        },
        {
            accessorKey: "access",
            header: "Access Level",
        },
        {
            accessorKey: "password",
            header: "Password",
        },
    ]


    const [columnFilters, setColumnFilters] = React.useState([]);


    //columns and data are required options, while getCoreRowModel allows filtering, sorting, etc.
    const table = useReactTable({
        columns,
        data,
        state:{
            columnFilters,
        },
        getCoreRowModel:getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        columnResizeMode:"onChange",
        onColumnFilterChange: setColumnFilters,
    })

    return(
        <div className="table-section">
            <table className='table-container'>
            <div>
                <input type="text" className="userInputFilter" onChange={ //filters the tables data based on the users input (has to be an array of objects, not just an object)
                    e => setColumnFilters([{id:"first_name", value: e.target.value}])}></input>
            </div>
            <tbody>
                {table.getHeaderGroups().map(headerGroup => <tr className = "tr" key={headerGroup.id}>
                    {headerGroup.headers.map(
                        header => <th className="th" width={header.getSize()} key={header.id}>
                            {header.column.columnDef.header}
                                <div //allows the user the resize the column using tanstack functions
                                onMouseDown={header.getResizeHandler()} onTouchStart={header.getResizeHandler()}
                                className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}></div>
                        </th>
                    )}
                </tr>)}
                {//getRowModel().rows returns an array of rows
                table.getRowModel().rows.map(row => <tr className = "tr" key={row.id}>
                {row.getVisibleCells().map(cell => <td className="td" key={cell.id}>
                        {//look more into this
                        flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                    </td>)}
                </tr>)
            }
            </tbody>
            </table>
        </div>
    )
}

export default Databases;