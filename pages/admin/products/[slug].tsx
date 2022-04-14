import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useForm } from 'react-hook-form';

import { AdminLayout } from '../../../components/layouts';
import { IProduct } from '../../../interfaces';
import {
    DriveFileRenameOutline,
    SaveOutlined,
    UploadOutlined,
} from '@mui/icons-material';
import { dbProducts } from '../../../database';
import {
    Box,
    Button,
    capitalize,
    Card,
    CardActions,
    CardMedia,
    Checkbox,
    Chip,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material';
import { Product } from '../../../models';
import tesloApi from '../../../api/tesloApi';
import { useRouter } from 'next/router';

const validTypes = ['shirts', 'pants', 'hoodies', 'hats'];
const validGender = ['men', 'women', 'kid', 'unisex'];
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface Formdata {
    _id?: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: string[];
    slug: string;
    tags: string[];
    title: string;
    type: string;
    gender: string;
}

interface ProductAdminPageProps {
    product: IProduct;
}

const ProductAdminPage: FC<ProductAdminPageProps> = ({ product }) => {
    const router = useRouter();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newTagValue, setNewTagValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    //import useForm hook
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
        watch,
    } = useForm<Formdata>({
        defaultValues: product,
    });

    //useEffect to suggest the name of the slug
    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            //console.log({value,name, type});
            if (name === 'title') {
                const newSlug =
                    value.title
                        ?.replaceAll(' ', '_')
                        .replaceAll("'", '')
                        .toLocaleLowerCase() || '';

                setValue('slug', newSlug);
            }
        });
        //clean the watch observable when unmounting
        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    // Add tags TODO: create set to do this validation for us

    const onNewTag = () => {
        const newTag = newTagValue.trim().toLocaleLowerCase();
        setNewTagValue('');
        //check if the tag is already in the tags array
        const currentTags = Array.from(new Set([...getValues('tags'), newTag]));

        //add new tag in case is not already in there
        setValue('tags', [...currentTags]);
    };

    const onDeleteTag = (tag: string) => {
        const currentTags = getValues('tags').filter((t) => t !== tag);
        setValue('tags', currentTags, { shouldValidate: true });
    };

    const onFileSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
        
        if (!target.files || target.files.length === 0) return;

    
        try {
            for (const file of target.files) {
                const formData = new FormData();
                formData.append('files', file);
                
                const { data } = await tesloApi.post<{ message: string} >('/admin/uploads', formData);
                console.log(data.message);
                setValue('images', [...getValues('images'), data.message], { shouldValidate: true });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const OnDeleteImage = (image: string) => {
        setValue('images', getValues('images').filter((img) => img !== image), { shouldValidate: true });
    }

    const onSubmit = async (form: Formdata) => {
        //return in case images loaded are less than 2
        //TODO: implement a snackbar instead of an aler
        if (form.images.length < 2)
            return alert('Please upload at least 2 images');

        //avoid double posting by disabling submit button
        setIsSaving(true);

        //create a new product
        try {
            const { data } = await tesloApi({
                url: '/admin/products',
                method: form._id ? 'PUT' : 'POST', //if we have _id we are updating otherwise we are creating
                data: form,
            });

            //TODO: if this is done correctly show a snackbar
            console.log({ data });

            if (!form._id) {
                //reload the browser
                router.replace(`/admin/products/${form.slug}`);
            } else {
                setIsSaving(false);
            }
        } catch (error) {
            console.log(error);
            setIsSaving(false);
        }
    };

    const onChangeSize = (size: string) => {
        //get the array of all the sizes we have defined
        const currentSizes = getValues('sizes');

        if (currentSizes.includes(size)) {
            //remove the size from the array and re-render with souldValidate
            return setValue(
                'sizes',
                currentSizes.filter((s) => s !== size),
                { shouldValidate: true }
            );
        }

        //add the selected Values to the array
        setValue('sizes', [...currentSizes, size], { shouldValidate: true });
    };

    return (
        <AdminLayout
            title={'Product'}
            subtitle={`Editing: ${product.title}`}
            icon={<DriveFileRenameOutline />}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
                    <Button
                        color="secondary"
                        startIcon={<SaveOutlined />}
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={isSaving}>
                        Save
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Title"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('title', {
                                required: 'This field is required',
                                minLength: {
                                    value: 2,
                                    message:
                                        'Title must be at least 2 characters',
                                },
                            })}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />

                        <TextField
                            label="Description"
                            variant="filled"
                            fullWidth
                            multiline
                            sx={{ mb: 1 }}
                            {...register('description', {
                                required: 'This field is required',
                                minLength: {
                                    value: 2,
                                    message:
                                        'Title must be at least 2 characters',
                                },
                            })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />

                        <TextField
                            label="Stock"
                            type="number"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('inStock', {
                                required: 'This field is required',
                                min: {
                                    value: 0,
                                    message: 'Stock must be at least 0',
                                },
                            })}
                            error={!!errors.inStock}
                            helperText={errors.inStock?.message}
                        />

                        <TextField
                            label="Price"
                            type="number"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('price', {
                                required: 'This field is required',
                                min: {
                                    value: 0,
                                    message: 'Price must be at least 0',
                                },
                            })}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Type</FormLabel>
                            <RadioGroup
                                row
                                value={getValues('type')}
                                onChange={(event) =>
                                    setValue('type', event.target.value, {
                                        shouldValidate: true,
                                    })
                                }>
                                {validTypes.map((option) => (
                                    <FormControlLabel
                                        key={option}
                                        value={option}
                                        control={<Radio color="secondary" />}
                                        label={capitalize(option)}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Gender</FormLabel>
                            <RadioGroup
                                row
                                value={getValues('gender')}
                                onChange={(event) =>
                                    setValue('type', event.target.value, {
                                        shouldValidate: true,
                                    })
                                }>
                                {validGender.map((option) => (
                                    <FormControlLabel
                                        key={option}
                                        value={option}
                                        control={<Radio color="secondary" />}
                                        label={capitalize(option)}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Sizes</FormLabel>
                            {validSizes.map((size) => (
                                <FormControlLabel
                                    key={size}
                                    control={
                                        <Checkbox
                                            checked={getValues(
                                                'sizes'
                                            ).includes(size)}
                                        />
                                    }
                                    label={size}
                                    onChange={() => onChangeSize(size)}
                                />
                            ))}
                        </FormGroup>
                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('slug', {
                                required: 'This field is required',
                                validate: (value) =>
                                    value.trim().includes(' ')
                                        ? 'Slug cannot contain spaces'
                                        : undefined,
                            })}
                            error={!!errors.slug}
                            helperText={errors.slug?.message}
                        />

                        <TextField
                            label="Labels"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            helperText="Press [spacebar] to add label"
                            value={newTagValue}
                            onChange={({ target }) =>
                                setNewTagValue(target.value)
                            }
                            onKeyUp={({ code }) =>
                                code === 'Space' || code === 'Enter'
                                    ? onNewTag()
                                    : null
                            }
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                listStyle: 'none',
                                p: 0,
                                m: 0,
                            }}
                            component="ul">
                            {getValues('tags').map((tag) => {
                                return (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={() => onDeleteTag(tag)}
                                        color="primary"
                                        size="small"
                                        sx={{ ml: 1, mt: 1 }}
                                    />
                                );
                            })}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display="flex" flexDirection="column">
                            <FormLabel sx={{ mb: 1 }}>Images</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={<UploadOutlined />}
                                sx={{ mb: 3 }}
                                onClick={() => fileInputRef.current?.click()}>
                                Load image(s)
                            </Button>
                            {/* //File upload */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/gif, image/jpeg"
                                style={{ display: 'none' }}
                                multiple
                                onChange={onFileSelected}
                            />
                            <Chip
                                label="2 images are required"
                                color="error"
                                variant="outlined"
                                sx={{ display: getValues('images').length < 2 ? 'flex' : 'none' }}
                            />

                            <Grid container spacing={2}>
                                {getValues('images').map((img) => (
                                    <Grid item xs={4} sm={3} key={img}>
                                        <Card>
                                            <CardMedia
                                                component="img"
                                                className="fadeIn"
                                                image={ img }
                                                alt={img}
                                            />
                                            <CardActions>
                                                <Button fullWidth color="error" onClick={ () => OnDeleteImage(img) }>
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </AdminLayout>
    );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const { slug = '' } = query;

    let product: IProduct | null;

    if (slug == 'new') {
        //create product
        const tempProduct = JSON.parse(JSON.stringify(new Product()));
        //maange tempProduct to include 2 images and delete id
        delete tempProduct._id;
        tempProduct.images = ['img1.jpg', 'img2.jpg'];
        product = tempProduct;
    } else {
        product = await dbProducts.getProductBySlug(slug.toString());
    }

    if (!product) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            },
        };
    }

    return {
        props: {
            product,
        },
    };
};

export default ProductAdminPage;
