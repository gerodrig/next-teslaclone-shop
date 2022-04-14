import { useEffect, useState } from 'react';
import { PeopleOutline } from '@mui/icons-material';
import useSWR from 'swr';

import { AdminLayout } from '../../components/layouts';
import {
    GridColDef,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import { MenuItem, Select } from '@mui/material';
import { FullScreenLoading } from '../../components/ui';
import { IUser } from '../../interfaces';
import tesloApi from '../../api/tesloApi';
import { GridTable } from '../../components/admin';

const UsersPage = () => {
    //fetch information from SWR
    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (data) {
            setUsers(data);
        }
    }, [data]);

    if (!data && !error) return <FullScreenLoading />;

    const onRoleUpdated = async (userId: string, newRole: string) => {
        //perofrm the update
        const previousUsers = [...users];
        const updatedUser = users.map((user) => ({
            ...user,
            role: user._id === userId ? newRole : user.role,
        }));

        setUsers(updatedUser);

        try {
            await tesloApi.put('admin/users', { userId, role: newRole });
        } catch (error) {
            setUsers(previousUsers);
            console.log(error);
            alert('Error updating user role');
        }
    };

    //define grid to re-render when information changes
    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'name', headerName: 'Name', width: 300 },
        {
            field: 'role',
            headerName: 'Role',
            width: 300,
            renderCell: ({ row }: GridValueGetterParams) => {
                return (
                    <Select
                        value={row.role}
                        label="Role"
                        sx={{ width: '300px' }}
                        onChange={(e) => onRoleUpdated(row.id, e.target.value)}>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="superuser">Super User</MenuItem>
                        <MenuItem value="superadmin">Super Admin</MenuItem>
                        <MenuItem value="SEO">SEO</MenuItem>
                    </Select>
                );
            },
        },
    ];

    const rows = users.map((user) => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
    }));

    return (
        <AdminLayout
            title="Users"
            subtitle="User Management"
            icon={<PeopleOutline />}>

            <GridTable columns={columns} rows={rows} />
        </AdminLayout>
    );
};

export default UsersPage;
