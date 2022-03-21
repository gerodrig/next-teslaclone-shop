import { FC } from 'react';

import { Box, IconButton, Typography } from '@mui/material';
import {  AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface ItemCounterProps {}

export const ItemCounter: FC<ItemCounterProps> = () => {
    return (
        <Box display={'flex'} alignItems="center">
            <IconButton>
                <RemoveCircleOutline />
            </IconButton>
            <Typography sx={{ width: 40, textAlign: 'center' }}> 1 </Typography>
            <IconButton>
                <AddCircleOutline />
            </IconButton>
        </Box>
    );
};
