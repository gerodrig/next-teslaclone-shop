import { FC } from "react"
import { ISize } from "../../interfaces";
import { Box, Button } from '@mui/material';

interface SizeSelectorProps {
    selectedSize?: ISize;
    sizes: ISize[];
};

export const SizeSelector: FC<SizeSelectorProps> = ({sizes, selectedSize}) => {


    
    return (
        <Box>
            {
                sizes.map(size => (
                    <Button key={size } size='small' color={ selectedSize === size ? 'primary' : 'info' }>
                        {size}
                    </Button>
                ))
            }
        </Box>
    )
}
