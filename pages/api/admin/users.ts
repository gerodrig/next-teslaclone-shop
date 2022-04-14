import type { NextApiRequest, NextApiResponse } from 'next';
import { isValidObjectId } from 'mongoose';

import { db } from '../../../database';
import { IUser } from '../../../interfaces';
import { User } from '../../../models';

type Data =
    | {
          message: string;
      }
    | IUser[];

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch (req.method) {
        case 'GET':
            return getUsers(req, res);
        case 'PUT':
            return updateUser(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();
    //search for all users
    const users = await User.find().select('-password').lean();
    await db.disconnect();

    return res.status(200).json(users);
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { userId = '', role = '' } = req.body;

    //validate that userId is a valid mongo id
    if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user' });
    }

    const validRoles = ['admin', 'user', 'superuser', 'superadmin', 'SEO'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role: ' + validRoles.join(', ') });
    }

    //connect to database
    await db.connect();
    const user = await User.findById(userId);

    if(!user) {
        await db.disconnect();
        return res.status(404).json({ message: `User ${userId} not found` });
    }

    user.role = role;
    await user.save();

    await db.disconnect();

    return res.status(200).json({ message: 'User updated' });
};
