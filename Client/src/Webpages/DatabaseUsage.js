import "../styles/Database.css";
import React from 'react';
import Axios from 'axios';
import {createColumnHelper, flexRender, getPaginationRowModel, getCoreRowModel, getFilteredRowModel, useReactTable, } from '@tanstack/react-table';
import {Menu} from '@headlessui/react'
//MAKE TABLE INTO COMPONENT
//DO NOT USE FLOWBITE, IT HAS AN ISSUE WITH HOW EARLY JAVASCRIPT RUNS DOMCONTENTLOADED AND WILL NOT WORK AFTER FIRST RENDER

function Databases(){

     //runs only on first load. Only used to automatically fetch the database data and store it
     React.useEffect(() => {
        try {
            Axios.get("/test").then((response) => {
                ObjectConversion(response.data.rows);
            })
        } catch (err){
            console.log(err);
        }
    }, [])

    //useState to store the data obtained from the database
    const [data, setData] = React.useState([]);
    const [formVis, setFormVis] = React.useState(false);
    const [columnFilters, setColumnFilters] = React.useState([{
        id: "first_name",
        value: ""
    }]);
    const [pagination, setPagination] = React.useState({
        pageSize: 50,
        pageIndex: 0
    });
    const [columnVisibility, setColumnVisibility] = React.useState({
        first_name: true,
        last_name: true,
        email: true,
        address: true,
        phone: true,
        access: true,
        password: false
    });

    var columnVis = React.useRef({
        first_name: true,
        last_name: true,
        email: true,
        address: true,
        phone: true,
        access: true,
        password: false
    });

    var dropDownLabels = React.useRef({
        columnSelectLabel: "First Name",
        pageCountLabel: "50",
        apiLabel: "Entry"
    });

    var selPerson = React.useRef({
        first_name: "",
        last_name: "",
        email: "",
        address: "",
        phone: "",
        access: "",
        password: ""
    })
    function setSelPerson(aPerson){
        console.log(aPerson)
        selPerson.current.first_name  = aPerson.first_name;
        selPerson.current.last_name  = aPerson.last_name;
        selPerson.current.email  = aPerson.email;
        selPerson.current.address  = aPerson.address;
        selPerson.current.phone  = aPerson.phone;
        selPerson.current.access  = aPerson.access;
        selPerson.current.password  = aPerson.password;

        if (!formVis)
            {setFormVis(true);}
        else {setPagination({...pagination})} //temporary solution to force a re render
    }

    React.useEffect(() => {
        const formInputs = document.getElementsByClassName("formInput")
        formInputs[0].value = selPerson.current.first_name
        formInputs[1].value = selPerson.current.last_name
        formInputs[2].value = selPerson.current.email
        formInputs[3].value = selPerson.current.address
        formInputs[4].value = selPerson.current.phone
        formInputs[5].value = selPerson.current.access
        formInputs[6].value = selPerson.current.password
    })

    //converts an array of arrays into an array of objects, because god forbid I can't use an array index as the accessorKey 
    function ObjectConversion(arrayData){
        var data = []
        if (arrayData){
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

    const columnHelper = createColumnHelper();
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
        }, columnHelper.display({
            id:"selectButton",
            header: "Select Info",
            cell:(props) => <input type="button" value="transfer" id={props.row} onClick={() => {
                setSelPerson(props.row.original)}} className="hover:bg-gray-400 active:bg-gray-200 bg-gray-300 border border-solid border-black border-1 rounded-md"/> 
        })
    ]

    //columns and data are required options, while getCoreRowModel allows filtering, sorting, etc.
    const table = useReactTable({
        columns,
        data,
        state:{
            columnFilters,
            columnVisibility,
            pagination,
        },
        getCoreRowModel:getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        columnResizeMode:"onChange",
        onColumnFilterChange: setColumnFilters,
        oncolumnVisibilityChange: setColumnVisibility,
    })

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
                <input type="button" value={prop.text} onClick={() => {dropDownLabels.current.columnSelectLabel = prop.text; setColumnFilters([{id: prop.columnName, value: columnFilters[0].value}])}} className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"/>
        );
    }

    function PageCountButton(prop){
        return(
            <input type="button" value={prop.value} onClick={() => {dropDownLabels.current.pageCountLabel = prop.value; setPagination({pageSize: parseInt(prop.value), pageIndex: 0})}} className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"/>
        );
    }

    function ApiButton(prop){
        return(
            <input type="button" onClick={() => {dropDownLabels.current.apiLabel = prop.value}} className="hover:bg-gray-400 active:bg-gray-200 bg-gray-300 border border-solid border-black border-1 rounded-md" value={prop.value}/>
        );
    }
    return(
        <div id="body">
            <div className="table-section">
            <div>
                    <input type="text" className="userInputFilter" onChange={ //filters the tables data based on the users input (has to be an array of objects, not just an object)
                        e => setColumnFilters([{id: columnFilters[0].id, value: e.target.value}])}></input>
                    <Menu>
                        <Menu.Button>{dropDownLabels.current.columnSelectLabel}</Menu.Button>
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
                    <Menu>
                        <Menu.Button>{dropDownLabels.current.pageCountLabel} indexes</Menu.Button>
                            <Menu.Items>
                                <Menu.Item>
                                    <PageCountButton value="25"/>
                                </Menu.Item>
                                <Menu.Item>
                                    <PageCountButton value="50"/>
                                </Menu.Item>
                                <Menu.Item>
                                    <PageCountButton value="75"/>
                                </Menu.Item>
                                <Menu.Item>
                                    <PageCountButton value="100"/>
                                </Menu.Item>
                            </Menu.Items>
                    </Menu>
                </div>
                </div>
                <div>
                    {/*This is the pagination section, with all the things related to pagination stuff
                    fairly basic, this just utilizes a useRef object and a useState object
                    useRef object is used as a label, essentially just storing whatever value the user clicked on and setting that value as the dropdown button label
                    the useState object allows us to set the number of entries per page, and as so create a max and min fot the available pages (min will always be 1)*/}
                        <label>page </label>
                        {table.getState().pagination.pageIndex + 1}<label> of </label>
                        {table.getPageCount()}
                    </div>
                    <div>
                        <input type="button" value="Previous Page" onClick={() => {
                            setPagination({pageSize: pagination.pageSize, pageIndex: pagination.pageIndex - 1});
                        }}
                        disabled={
                            pagination.pageIndex === 0
                        }/>
                        <input type="button" value="Next Page" onClick={() => {
                            setPagination({pageSize: pagination.pageSize, pageIndex: pagination.pageIndex + 1});
                        }}
                        disabled={
                            pagination.pageIndex === table.getPageCount() - 1
                        }/>
                    </div>
                <div className='table-container'>
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
                <br/>
            </div>
            {/*Jesus christ this took me about 6-9 hours to figure this out
            firstly, just use a conditional operator with a usestate when trying to switch between an active/inactive element(pretty sure this a typical react thing, getting used to it)
            secondly, if using transitions with tailwind, they have to be done like so below, ESPECIALLY if you have 2 transitions with different delays
            more specifically, it seems having a transition in the "general" css stylesheet section (the style right after both of the conditionals) will not function correctly if you have another transition depending on a conditional
            in this case, I wanted the width to be 0vw AFTER the divs height was 0vh, which relied on the first conditional stylesheet as that is the only time when vh would be 0*/}
            <div className="fixed bottom-0">
                <div type="button" onClick={() => {setFormVis(!formVis)}} id="form-button" className="w-fit border border-b-0 border-black border-solid border-1">brug</div>
                <div id="databaseForm" className={`${formVis ? "h-[10vh] w-[100vw] [transition:height_300ms_0ms]" : "h-[0vh] w-[0vw] [transition:width_200ms_300ms,height_300ms_0ms]"} bg-gray-300 border-t border-black overflow-hidden`}>
                    <form> 
                        <label>First Name: </label>
                        <input type="text" className="formInput bg-gray-300" onChange={(e) => {selPerson.current.first_name = e.target.value}}/>
                        <label>Last Name: </label>
                        <input type="text" className="formInput bg-gray-300" onChange={(e) => {selPerson.current.last_name = e.target.value}}/>
                        <label>Email: </label>
                        <input type="text" className="formInput bg-gray-300" onChange={(e) => {selPerson.current.email = e.target.value}}/>
                        <label>Address: </label>
                        <input type="text" className="formInput bg-gray-300" onChange={(e) => {selPerson.current.address = e.target.value}}/>
                        <label>Phone: </label>
                        <input type="text" className="formInput bg-gray-300" onChange={(e) => {selPerson.current.phone = e.target.value}}/>
                        <label>Access Level: </label>
                        <input type="text" className="formInput bg-gray-300" onChange={(e) => {selPerson.current.access = e.target.value}}/>
                        <label>Password: </label>
                        <input type="text" className="formInput bg-gray-300" onChange={(e) => {selPerson.current.password = e.target.value}}/>
                        <input type="button" value="submit" className="hover:bg-gray-400 active:bg-gray-200 bg-white border border-solid border-black border-1 rounded-md" onClick={() => {/*finish REST api stuff here */}}/>
                        <Menu>
                            {/*ADD RERENDER FOR THIS BUTTON CLICK*/}
                        <Menu.Button className="hover:bg-gray-400 active:bg-gray-200 bg-white border border-solid border-black border-1 rounded-md">{dropDownLabels.current.apiLabel}</Menu.Button>
                            <Menu.Items>
                                <Menu.Item>
                                    <ApiButton value="Entry"/>
                                </Menu.Item>
                                <Menu.Item>
                                    <ApiButton value="Edit"/>
                                </Menu.Item>
                                <Menu.Item>
                                    <ApiButton value="Delete"/>
                                </Menu.Item>
                            </Menu.Items>
                    </Menu>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Databases;