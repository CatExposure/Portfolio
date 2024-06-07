import React from 'react';
import Axios from 'axios';
import {apiUrl} from '../Components/Api'
import {createColumnHelper, flexRender, getPaginationRowModel, getCoreRowModel, getFilteredRowModel, useReactTable, } from '@tanstack/react-table';
import {Menu, Dialog} from '@headlessui/react'
import {ArrowsUpDownIcon} from '@heroicons/react/24/outline';
<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
//ISSUE WITH BEING ON 2ND OR HIGHER PAGE AND FILTERING
//DO NOT USE FLOWBITE, IT HAS AN ISSUE WITH HOW EARLY JAVASCRIPT RUNS DOMCONTENTLOADED AND WILL NOT WORK AFTER FIRST RENDER
//obtain data based on users entries per page

function Databases(){

    const formInputs = document.getElementsByClassName("formInput")

     //runs only on first load. Only used to automatically fetch the database data and store it
     React.useEffect(() => {
        getData()
    }, []);

    function getData(){
        try {
            Axios.get(apiUrl+"test").then((response) => {
                ObjectConversion(response.data.rows);
                console.log(response)
            })
        } catch (err){
            console.log(err);
        }
    };

    function restUp() {
        try {
            Axios({
                method: 'put',
                url: apiUrl+'userUpdate/'+selPerson.current.id,
                data: {
                    firstName: selPerson.current.first_name,
                    lastName: selPerson.current.last_name,
                    email: selPerson.current.email,
                    address: selPerson.current.address,
                    phone: selPerson.current.phone,
                    access: selPerson.current.access,
                    password: selPerson.current.password
                },
            }).then(() => {getData();});
        } catch(err){
            console.log(err)
        }
    };

    function restPo(){
        try {
            Axios({
                method: 'post',
                url: apiUrl+'userCreate/',
                data: {
                    firstName: selPerson.current.first_name,
                    lastName: selPerson.current.last_name,
                    email: selPerson.current.email,
                    address: selPerson.current.address,
                    phone: selPerson.current.phone,
                    access: selPerson.current.access,
                    password: selPerson.current.password
                },
            }).then(() => {getData();});
        } catch(err){
            console.log(err)
        }
    };

    function restDel(){
        try {
            Axios({
                method: 'delete',
                url: apiUrl+'userDelete/'+selPerson.current.id,
            }).then(() => {clearForm(); getData();});
        } catch(err){
            console.log(err)
        }
    };

    function runApi(){
        if (selApi === "Update"){
            restUp()
        } else if (selApi === "Entry"){
            restPo()
        }
    };

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

    var [selApi, setSelApi] = React.useState("entry")

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
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        address: "",
        phone: "",
        access: "",
        password: ""
    })

    function reRender(){
        setPagination({...pagination})
    }

    function setSelPerson(aPerson, autoOpen){
        selPerson.current.id = aPerson.id;
        selPerson.current.first_name  = aPerson.first_name;
        selPerson.current.last_name  = aPerson.last_name;
        selPerson.current.email  = aPerson.email;
        selPerson.current.address  = aPerson.address;
        selPerson.current.phone  = aPerson.phone;
        selPerson.current.access  = aPerson.access;
        selPerson.current.password  = aPerson.password;

        if (autoOpen){
            if (!formVis)
                {setFormVis(true);}
            else {reRender()} //temporary solution to force a re render
        }
    }

    React.useEffect(() => {
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
                    "id": row[0],
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

    function clearForm(){
        selPerson.current.id = "";
        selPerson.current.first_name  = "";
        selPerson.current.last_name  = "";
        selPerson.current.email  = "";
        selPerson.current.address  = "";
        selPerson.current.phone  = "";
        selPerson.current.access  = "";
        selPerson.current.password  = "";
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
            cell:(props) => <div><input type="button" value="transfer" id={props.row} onClick={() => {
                setSelPerson(props.row.original, true)}} className="hover:cursor-pointer hover:bg-gray-400 active:bg-gray-200 bg-gray-300 border border-solid border-black border-1 rounded-md"/> 
                <input type="button" value="Delete" id={props.row} onClick={() => {
                setSelPerson(props.row.original, false); setdialogOpen(true)}} className="hover:cursor-pointer hover:bg-red-400 active:bg-red-200 bg-red-300 border border-solid border-black border-1 rounded-md"/></div>
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

    const [dialogOpen, setdialogOpen] = React.useState(false)

    function ConfirmationBox(aPerson){
        return(
            <Dialog open={dialogOpen} onClose={() => setdialogOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <Dialog.Panel className="space-y-4 border bg-gray-200 p-12">
                    <Dialog.Title>Delete Entry</Dialog.Title>
                    <Dialog.Description>Are you sure you want to delete user {selPerson.current.first_name} {selPerson.current.last_name}?</Dialog.Description>
                    <div className="flex gap-4">
                        <button onClick={() => {setdialogOpen(false); restDel()}}>Yes</button>
                        <button onClick={() => {setdialogOpen(false); clearForm()}}>No</button>
                    </div>
                </Dialog.Panel>
                </div>
            </Dialog>
        );
    }

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
            <div className="flex flex-row">
                <input type="checkbox" defaultChecked={table.getColumn(prop.columnName).getIsVisible()} onChange={(e) => {handleChange(e, prop)}} className="flex"></input>
                <label className="flex flex-auto">{prop.text}</label>
            </div>
        );
    }

    function ColumnSelectButton(prop){
        return(
                <input type="button" value={prop.text} onClick={() => {dropDownLabels.current.columnSelectLabel = prop.text; setColumnFilters([{id: prop.columnName, value: columnFilters[0].value}])}} className="flex mr-10"/>
        );
    }

    function PageCountButton(prop){
        return(
            <input type="button" value={prop.text} onClick={() => {dropDownLabels.current.pageCountLabel = prop.value; setPagination({pageSize: parseInt(prop.value), pageIndex: 0})}} className=""/>
        );
    }

    function ApiButton(prop){
        return(
            <input type="button" onClick={() => {dropDownLabels.current.apiLabel = prop.value; setSelApi(prop.value)}} className="mx-1 hover:bg-gray-400 active:bg-gray-200 bg-gray-300 border border-solid border-black border-1 rounded-md" value={prop.value}/>
        );
    }
    
    return(
        <div id="body" className="min-h-screen bg-gray-400 text-lg pt-10">
            <div>Sorry! This webpage is under construction! (because Oracle Sucks)</div>
            <ConfirmationBox/>
            <div className="table-section relative justify-between gap-10 flex flex-auto flex-row">
                    <input type="text" placeholder="Type here to filter" className="border border-black border-2 bg-gray-300  rounded-md text-black placeholder:text-black" onChange={ //filters the tables data based on the users input (has to be an array of objects, not just an object)
                        e => setColumnFilters([{id: columnFilters[0].id, value: e.target.value}])}></input>
                    <Menu as="div" className="border border-black border-1 flex flex-row z-10 px-1 rounded-md bg-gray-300">
                        <Menu.Button className="flex">Sorting by: {dropDownLabels.current.columnSelectLabel}</Menu.Button>
                        <Menu.Items className="absolute mt-8 bg-gray-400 flex flex-col border border-solid border-2 border-black rounded-md">
                            <Menu.Item className="flex flex-row">
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
                    <Menu as="div" className="border border-black border-1 flex z-10 px-1 rounded-md bg-gray-300">
                        <Menu.Button>Visible Columns</Menu.Button>
                        <Menu.Items className="absolute mt-8 bg-gray-400 flex flex-col border border-solid border-2 border-black rounded-md">
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
                    <Menu as="div" className="border border-black border-1 flex z-10 px-1 rounded-md bg-gray-300">
                        <Menu.Button>{dropDownLabels.current.pageCountLabel} Entries Per Page</Menu.Button>
                            <Menu.Items className="absolute mt-8 bg-gray-400 flex flex-col border border-solid border-2 border-black rounded-md">
                                <Menu.Item>
                                    <PageCountButton value="25" text="25 Entries"/>
                                </Menu.Item>
                                <Menu.Item>
                                    <PageCountButton value="50" text="50 Entries"/>
                                </Menu.Item>
                                <Menu.Item>
                                    <PageCountButton value="75" text="75 Entries"/>
                                </Menu.Item>
                                <Menu.Item>
                                    <PageCountButton value="100" text="100 Entries"/>
                                </Menu.Item>
                            </Menu.Items>
                    </Menu>
                </div>
                {/*This is the pagination section, with all the things related to pagination stuff
                    fairly basic, this just utilizes a useRef object and a useState object
                    useRef object is used as a label, essentially just storing whatever value the user clicked on and setting that value as the dropdown button label
                    the useState object allows us to set the number of entries per page, and as so create a max and min fot the available pages (min will always be 1)*/}
                    <div className="flex justify-center my-2 gap-3">
                        <input type="button" value="Previous Page" className="hover:cursor-pointer border border-black border-1 bg-gray-300 rounded-md px-1" onClick={() => {
                            setPagination({pageSize: pagination.pageSize, pageIndex: pagination.pageIndex - 1});
                        }}
                        disabled={
                            pagination.pageIndex === 0
                        }/>
                        <input type="button" value="Next Page" className="hover:cursor-pointer border border-black border-1 bg-gray-300 rounded-md px-1" onClick={() => {
                            setPagination({pageSize: pagination.pageSize, pageIndex: pagination.pageIndex + 1});
                        }}
                        disabled={
                            pagination.pageIndex === table.getPageCount() - 1
                        }/>
                    </div>
                    <div className="flex justify-center my-1 gap-1">
                        <label>page </label>
                        {table.getState().pagination.pageIndex + 1}<label> of </label>
                        {table.getPageCount()}
                    </div>
                <div className='z-5 flex justify-center table-container mt-10 pb-10'>
                <table className="border border-black bg-white shadow-[0_0_20px_10px_rgba(255,255,255,.5),0_0_40px_20px_rgba(0,255,255,.3)]">
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
                <div type="button" onClick={() => {setFormVis(!formVis)}} id="form-button" className="hover:cursor-pointer w-fit border border-b-0 border-black border-solid border-1 bg-white"><ArrowsUpDownIcon className="h-10"/></div>
                <div id="databaseForm" className={`${formVis ? "h-[13vh] w-[100vw] [transition:height_300ms_0ms]" : "h-[0vh] w-[0vw] [transition:width_200ms_300ms,height_300ms_0ms]"} bg-gray-300 border-t border-black overflow-hidden`}>
                    <form className="flex flex-wrap my-2"> 
                    <div className="flex my-2">
                        <label className="flex">First Name: </label>
                        <input type="text" className="formInput flex bg-white rounded-md mx-2 pl-2" onChange={(e) => {selPerson.current.first_name = e.target.value}}/>
                    </div>
                    <div className="flex my-2">
                        <label className="flex">Last Name: </label>
                        <input type="text" className="formInput flex bg-white rounded-md mx-2 pl-2" onChange={(e) => {selPerson.current.last_name = e.target.value}}/>
                    </div>
                    <div className="flex my-2">  
                        <label>Email: </label>
                        <input type="text" className="formInput bg-white rounded-md mx-2 pl-2" onChange={(e) => {selPerson.current.email = e.target.value}}/>
                    </div>
                    <div className="flex my-2">
                        <label>Address: </label>
                        <input type="text" className="formInput bg-white rounded-md mx-2 pl-2" onChange={(e) => {selPerson.current.address = e.target.value}}/>
                    </div>
                    <div className="flex my-2">
                        <label>Phone: </label>
                        <input type="text" className="formInput bg-white rounded-md mx-2 pl-2" onChange={(e) => {selPerson.current.phone = e.target.value}}/>
                    </div>
                    <div className="flex my-2">
                        <label>Access Level: </label>
                        <input type="text" className="formInput bg-white rounded-md mx-2 pl-2" onChange={(e) => {selPerson.current.access = e.target.value}}/>
                    </div>
                    <div className="flex my-2">
                        <label>Password: </label>
                        <input type="text" className="formInput bg-white rounded-md mx-2 pl-2" onChange={(e) => {selPerson.current.password = e.target.value}}/>
                    </div>
                        <input type="button" value="Clear" className="hover:cursor-pointer mx-2 hover:bg-gray-400 active:bg-gray-200 bg-white border border-solid border-black border-1 rounded-md" onClick={() => {clearForm()}}/>
                        <input type="button" value="submit" className="hover:cursor-pointer mx-2 hover:bg-gray-400 active:bg-gray-200 bg-white border border-solid border-black border-1 rounded-md" onClick={() => {runApi()}}/>
                        <Menu>
                        <Menu.Button id="apiSelector" className="hover:cursor-pointer mx-2 hover:bg-gray-400 active:bg-gray-200 bg-white border border-solid border-black border-1 rounded-md">{dropDownLabels.current.apiLabel}</Menu.Button>
                        <Menu.Items>
                            <Menu.Item>
                                <ApiButton value="Entry"/>
                            </Menu.Item>
                            <Menu.Item>
                                <ApiButton value="Update"/>
                            </Menu.Item>
                            </Menu.Items>
                    </Menu>
                    </form>
                </div>
        </div>*
        </div>
    )
}

export default Databases;