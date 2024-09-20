import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

// Define User type for form
type User = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    progress: number;
    status: string;
    [key: string]: string | number; // Add index signature
};


// Define the prop type for the AddRowModal component
type AddRowModalProps = {
    onAddRow: (newUser: User) => void;
    columnsConfig: Column[]; // New prop
};

// Define the prop type for the AddColumnModal component
type AddColumnModalProps = {
    onAddColumn: (newColumn: Column) => void
}

// Define Column type for form
type Column = {
    id: string
    label: string
    type: 'text' | 'number'
}

type EditRowModalProps = {
    user: User;
    onSave: (updatedUser: User) => void;
    columnsConfig: Column[]; // Add columnsConfig prop
};



export function AddRowModal({ onAddRow, columnsConfig }: AddRowModalProps) {
    const initialFormData = columnsConfig.reduce((acc, column) => {
        acc[column.id] = column.type === 'number' ? 0 : ''; // Initialize based on type
        return acc;
    }, {} as User);
    
    const [formData, setFormData] = useState<User>(initialFormData);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const parsedValue = columnsConfig.find(field => field.id === id)?.type === 'number' ? Number(value) : value;
        setFormData((prevData) => ({ ...prevData, [id]: parsedValue }));
    };

    // Handle form submission
    const handleSubmit = () => {
        onAddRow(formData);
        // Reset form data
        setFormData(initialFormData);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add New User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new user to the table.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {columnsConfig.map(({ id, label, type }) => (
                        <div key={id} className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={id} className="text-right">
                                {label}
                            </Label>
                            <Input
                                id={id}
                                type={type}
                                value={formData[id as keyof User]}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Add User</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function AddColumnModal({ onAddColumn }: AddColumnModalProps) {
    const [formData, setFormData] = useState<Column>({
        id: '',
        label: '',
        type: 'text' // default type
    });

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle type selection change
    const handleTypeChange = (value: 'text' | 'number') => {
        setFormData((prevData) => ({ ...prevData, type: value }));
    };

    // Handle form submission
    const handleSubmit = () => {
        onAddColumn(formData);
        // Reset form data
        setFormData({
            id: '',
            label: '',
            type: 'text'
        });
    };

    return (
        <Dialog>    
            <DialogTrigger asChild className="m-4">
                <Button variant="outline">Add New Column</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Column</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new column to the table.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="id" className="text-right">Column ID</Label>
                        <Input
                            id="id"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="label" className="text-right">Column Label</Label>
                        <Input
                            id="label"
                            name="label"
                            value={formData.label}
                            onChange={handleChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Column Type</Label>
                        <Select onValueChange={handleTypeChange} defaultValue={formData.type}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Add Column</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function EditRowModal({ user, onSave, columnsConfig }: EditRowModalProps) {
    const [formData, setFormData] = useState<User>(user);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const parsedValue = id === "age" || id === "visits" || id === "progress" ? Number(value) : value;
        setFormData((prevData) => ({ ...prevData, [id]: parsedValue }));
    };

    // Handle form submission
    const handleSubmit = () => {
        onSave(formData);
    };

    // Update formData whenever user prop changes
    useEffect(() => {
        setFormData(user);
    }, [user]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update the user details.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {columnsConfig.map(({ id, label, type }) => (
                        <div key={id} className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={id} className="text-right">
                                {label}
                            </Label>
                            <Input
                                id={id}
                                type={type === "number" ? "number" : "text"}
                                value={formData[id as keyof User]}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}