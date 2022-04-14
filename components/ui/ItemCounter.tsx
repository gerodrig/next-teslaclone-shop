import { FC } from 'react';

import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface ItemCounterProps {
    currentValue: number;
    maxValue: number;

    //Methods
    updatedQuantity: (quantity: number) => void;
}

export const ItemCounter: FC<ItemCounterProps> = ({
    currentValue,
    maxValue,
    updatedQuantity,
}) => {

    const handleIncrement = (counter: number) => {
        if (
            currentValue + counter <= maxValue &&
            currentValue + counter >= 1
        ) {
            updatedQuantity(currentValue + counter);
        }
    };

    return (
        <Box display={'flex'} alignItems="center">
            <IconButton onClick={() => handleIncrement(-1)}>
                <RemoveCircleOutline />
            </IconButton>
            <Typography sx={{ width: 40, textAlign: 'center' }}> {currentValue} </Typography>
            <IconButton onClick={() => handleIncrement(+1)}>
                <AddCircleOutline />
            </IconButton>
        </Box>
    );
};
