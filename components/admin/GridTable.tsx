import { FC } from 'react';
import { Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';



interface GridTableProps {
    columns: GridColDef[];
    rows: any;
    pageSize?: number;
    pageOptions?: number[];
    onRowClick?: (row: GridRowParams) => void;
}

export const GridTable: FC<GridTableProps> = (params) => {
    const {
        rows,
        columns,
        pageSize = 10,
        pageOptions = [10],
        onRowClick,
    } = params;

    return (
        <Grid container className="fadeIn">
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={pageSize}
                    rowsPerPageOptions={pageOptions}
                    isRowSelectable={(params: GridRowParams) => false}
                />
            </Grid>
        </Grid>
    );
};
