import jwt from 'jsonwebtoken';

export const signToken = (_id: string, email: string) => {
    if (!process.env.JWT_SECRET_SEED) {
        throw new Error('JWT_SECRET_SEED is not defined check .env file');
    }

    return jwt.sign(
        //payload
        { _id, email },
        //seed
        process.env.JWT_SECRET_SEED,
        //options
        { expiresIn: '30d' }
    );
};

export const isValidToken = (token: string): Promise<string> => {
    if (!process.env.JWT_SECRET_SEED) {
        throw new Error('JWT_SECRET_SEED is not defined check .env file');
    }

    if( token.length <= 10 ){
        return Promise.reject('Token is not valid');
    }

    return new Promise((resolve, reject) => {
        try {
            jwt.verify(
                token,
                process.env.JWT_SECRET_SEED || '',
                (err, decoded) => {
                    if (err) {
                        return reject('Invalid token');
                    }
                    const { _id } = decoded as { _id: string };

                    resolve(_id);
                }
            );
        } catch (error) {
            reject('Invalid token');
        }
    });
};
