import { FC, useContext } from "react"
import { Grid, Typography } from "@mui/material"
import { CartContext } from "../../context"
import { formatCurrency } from "../../utils";

interface OrderSummaryProps {
    summaryDetails?: {
        numberOfProducts: number;
        subTotal: number; 
        HST: number,
        total: number
    }
}

export const OrderSummary: FC<OrderSummaryProps> = ({summaryDetails}) => {

        //numberOfProducts, subTotal, total, HST 
        const cart = useContext(CartContext);

        const orderSummayDetails = summaryDetails ? summaryDetails : cart;

        const { numberOfProducts, subTotal, HST, total } = orderSummayDetails;


    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>No. Products</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{numberOfProducts}</Typography>
            </Grid>
            
            <Grid item xs={6}>
                <Typography>SubTotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ formatCurrency(subTotal) }</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>HST ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ formatCurrency(HST) }</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt:2 }}>
                <Typography variant="subtitle1">Total:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt:2 }} display='flex' justifyContent='end'>
                <Typography variant="subtitle1">{ formatCurrency(total) }</Typography>
            </Grid>

        </Grid>
    )
}
