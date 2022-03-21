import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Box,
    Button,
} from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';

const AddressPage = () => {
    return (
        <ShopLayout
            title="Address"
            pageDescription={'Confirm shipping address'}>
            <Typography variant="h1" component="h1">
                Address
            </Typography>

            <Grid container spacing={ 2 } sx={{ mt: 2}}>
                <Grid item xs={12} sm={6}>
                    <TextField label="Name" variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Last Name" variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Address" variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Address 2 (optional)"
                        variant="filled"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Postal Code" variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="City" variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Country</InputLabel>
                        <Select variant="filled" label="Country" value={1}>
                            <MenuItem value={1}>Canada</MenuItem>
                            <MenuItem value={2}>United States</MenuItem>
                            <MenuItem value={3}>Mexico</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Telephone" variant="filled" fullWidth />
                </Grid>
            </Grid>

            <Box sx={{ mt: 5 }} display="flex" justifyContent='center'>
                <Button color="secondary" className="circular-btn" size="large">
                    Review Order
                </Button>
            </Box>
        </ShopLayout>
    );
};

export default AddressPage;
