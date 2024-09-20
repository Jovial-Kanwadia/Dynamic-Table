import { useMemo, useState, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AddRowModal, EditRowModal } from './Modal';
import { AddColumnModal } from './Modal';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'; // Adjust import according to your file structure

type User = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    progress: number;
    status: string;
}

const InitialData: User[] = [
    {
        firstName: 'Tanner',
        lastName: 'Linsley',
        age: 33,
        visits: 100,
        progress: 50,
        status: 'Married'
    },
    {
        firstName: 'Kevin',
        lastName: 'Vandy',
        age: 27,
        visits: 200,
        progress: 100,
        status: 'Single'
    }
];

type Column = {
    id: string;
    label: string;
    type: 'text' | 'number';
}

const initialColumns: Column[] = [
    { id: 'firstName', label: 'First Name', type: 'text' },
    { id: 'lastName', label: 'Last Name', type: 'text' },
    { id: 'age', label: 'Age', type: 'number' },
    { id: 'visits', label: 'Visits', type: 'number' },
    { id: 'progress', label: 'Progress', type: 'number' },
    { id: 'status', label: 'Status', type: 'text' },
];

const DynamicTable = () => {
    const [data, setData] = useState<User[]>(InitialData);
    const [columnsConfig, setColumnsConfig] = useState<Column[]>(initialColumns);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [filteredData, setFilteredData] = useState<User[]>(data);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // State to track sorting order

    const handleAddColumn = (newColumn: Column) => {
        setColumnsConfig((prevColumns) => [...prevColumns, newColumn]);
    };

    const handleEditUser = (updatedUser: User) => {
        setData((prevData) =>
            prevData.map((user) => (user.firstName === updatedUser.firstName ? updatedUser : user))
        );
    };

    const handleDeleteUser = (firstName: string) => {
        setData((prevData) => prevData.filter(user => user.firstName !== firstName));
    };

    const columnHelper = createColumnHelper<User>();

    const columns = useMemo(() => {
        return columnsConfig.map(({ id, label, type }) => {
            return columnHelper.accessor(id as keyof User, {
                header: label,
                cell: (info) => {
                    const value = info.getValue();
                    return type === 'number' ? value : String(value);
                },
            });
        });
    }, [columnsConfig]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleAddRow = (newUser: User) => {
        setData((prevData) => [...prevData, newUser]);
    };

    useEffect(() => {
        if (statusFilter === "all" || statusFilter === null) {
            setFilteredData(data);
        } else {
            setFilteredData(data.filter(user => user.status === statusFilter));
        }
    }, [statusFilter, data]);

    // Function to sort data by age
    const sortByAge = () => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        const sortedData = [...filteredData].sort((a, b) => {
            return newOrder === 'asc' ? a.age - b.age : b.age - a.age;
        });
        setFilteredData(sortedData);
        setSortOrder(newOrder);
    };

    return (
        <div className='h-screen w-full'>
            <div className='text-3xl text-white font-semibold m-4'>Table</div>
            
            {/* Shadcn Select for Filtering */}
            <div className="m-4 text-lg flex">
                <h1 className="text-white mr-4">Filter by Status:</h1>
                <Select onValueChange={setStatusFilter} defaultValue="all">
                    <SelectTrigger className='w-36'>
                        <span>Select Status</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Button for sorting by age */}
            <Button onClick={sortByAge} className="m-4">
                Sort by Age {sortOrder === 'asc' ? '↓' : '↑'}
            </Button>
        
            <AddRowModal onAddRow={handleAddRow} columnsConfig={columnsConfig} />
            <AddColumnModal onAddColumn={handleAddColumn} />
            <Table>
                <TableCaption className='text-white'>A list of your recent users.</TableCaption>
                <TableHeader>
                    <TableRow>
                        {table.getAllColumns().map((column: any) => (
                            <TableHead key={column.id} className="text-white">
                                {flexRender(column.columnDef.header, column)}
                            </TableHead>
                        ))}
                        <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className="text-white">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                            <TableCell>
                                <EditRowModal user={row.original} onSave={handleEditUser} columnsConfig={columnsConfig} />
                                <Button
                                    className="ml-2 text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteUser(row.original.firstName)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>      
    );
}

export default DynamicTable;
