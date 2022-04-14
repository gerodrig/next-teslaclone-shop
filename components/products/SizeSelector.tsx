import { FC } from "react"
import { ISize } from "../../interfaces";
import { Box, Button } from '@mui/material';

interface SizeSelectorProps {
    selectedSize?: ISize;
    sizes: ISize[];

    //Methods
    onSelectedSize: (size: ISize) => void;
};

export const SizeSelector: FC<SizeSelectorProps> = ({sizes, selectedSize, onSelectedSize}) => {


    
    return (
        <Box>
            {
                sizes.map(size => (
                    <Button key={size } size='small' className="fadeIn" color={ selectedSize === size ? 'primary' : 'info' } onClick={() => onSelectedSize(size)}>
                        {size}
                    </Button>
                ))
            }
        </Box>
    )
}
