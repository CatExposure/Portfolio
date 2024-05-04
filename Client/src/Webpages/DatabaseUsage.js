import "../styles/Database.css";
import React from 'react';
import Axios from 'axios';
import {flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, } from '@tanstack/react-table';
import {Menu} from '@headlessui/react'
//MAKE TABLE INTO COMPONENT
//DO NOT USE FLOWBITE, IT HAS AN ISSUE WITH HOW EARLY JAVASCRIPT RUNS DOMCONTENTLOADED AND WILL NOT WORK AFTER FIRST RENDER

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


    const [columnFilters, setColumnFilters] = React.useState([{
        id: "first_name",
        value: ""
    }]);
    const [columnVisibility, setColumnVisibility] = React.useState({
        first_name: true,
        last_name: true,
        email: true,
        address: true,
        phone: true,
        access: true,
        password: false
    });
    //columns and data are required options, while getCoreRowModel allows filtering, sorting, etc.
    const table = useReactTable({
        columns,
        data,
        state:{
            columnFilters,
            columnVisibility,
        },
        getCoreRowModel:getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        columnResizeMode:"onChange",
        onColumnFilterChange: setColumnFilters,
        oncolumnVisibilityChange: setColumnVisibility,
    })

    var columnVis = React.useRef({
        first_name: true,
        last_name: true,
        email: true,
        address: true,
        phone: true,
        access: true,
        password: false
    });

    function DropdownItem(prop){
        //JESUS CHRIST I spent so long and this visibilty per column
        //basic jist is, if there is something that relies on 2 usestates being changed, find another method to get what you want without using 1 of the usestates
        //below function works as each checkbox checks if their respective column is visible (doesnt require a usestate)
        //after there is a change, update the columnVis object and set (a copy of?) it to columnVisibility usestate
        //if you dont send a copy (the ...{your object here}), then the usestate will recognize it as the same object and not see a reason to re-render
        function handleChange(e, prop){
            columnVis.current[prop.columnName] = e.target.checked;
            setColumnVisibility({...columnVis.current});
        }
        
        return(
            <li>
                <input type="checkbox" defaultChecked={table.getColumn(prop.columnName).getIsVisible()} onChange={(e) => {handleChange(e, prop)}} className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"></input>
                <label className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black">{prop.text}</label>
            </li>
        );
    }

    function ColumnSelectButton(prop){

        return(
                <input type="button" value={prop.text} onClick={() => {setColumnFilters([{id: prop.columnName, value: columnFilters[0].value}])}} className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"/>
        );
    }

    return(
        <div className="table-section">
            <div className='table-container'>
            <div>
                <input type="text" className="userInputFilter" onChange={ //filters the tables data based on the users input (has to be an array of objects, not just an object)
                    e => setColumnFilters([{id: columnFilters[0].id, value: e.target.value}])}></input>
                <Menu>
                    <Menu.Button>Drop2</Menu.Button>
                    <Menu.Items>
                        <Menu.Item>
                            <ColumnSelectButton columnName="first_name" text="First Name"/>
                        </Menu.Item>
                        <Menu.Item>
                            <ColumnSelectButton columnName="last_name" text="Last Name"/>
                        </Menu.Item>
                        <Menu.Item>
                            <ColumnSelectButton columnName="email" text="Email Address"/>
                        </Menu.Item>
                        <Menu.Item>
                            <ColumnSelectButton columnName="address" text="Address"/>
                        </Menu.Item>
                        <Menu.Item>
                            <ColumnSelectButton columnName="phone" text="Phone Number"/>
                        </Menu.Item>
                        <Menu.Item>
                            <ColumnSelectButton columnName="access" text="Access Level"/>
                        </Menu.Item>
                        <Menu.Item>
                            <ColumnSelectButton columnName="password" text="Password"/>
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
                <Menu>
                    <Menu.Button>Drop</Menu.Button>
                    <Menu.Items>
                        <Menu.Item>
                            <DropdownItem columnName="first_name" text="First Name"/>
                        </Menu.Item>
                        <Menu.Item>
                            <DropdownItem columnName="last_name" text="Last Name"/>
                        </Menu.Item>
                        <Menu.Item>
                            <DropdownItem columnName="email" text="Email Address"/>
                        </Menu.Item>
                        <Menu.Item>
                            <DropdownItem columnName="address" text="Address"/>
                        </Menu.Item>
                        <Menu.Item>
                            <DropdownItem columnName="phone" text="Phone Number"/>
                        </Menu.Item>
                        <Menu.Item>
                            <DropdownItem columnName="access" text="Access Level"/>
                        </Menu.Item>
                        <Menu.Item>
                            <DropdownItem columnName="password" text="Password"/>
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            </div>
            <table>
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
        </div>
    )
}

export default Databases;