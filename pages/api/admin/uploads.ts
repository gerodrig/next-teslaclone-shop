import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = {
    message: string;
};

// configure uploads so bodyParser can read the file
export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch (req.method) {
        case 'POST':
            return uploadFile(req, res);

        default:
            return res.status(400).json({ message: 'Bad Request' });
    }
}

const saveFile = async (file: formidable.File): Promise<string> => {
    //METHOD TO SAVE FILE TO SERVER *** *DONT DO TI***
    // const data = fs.readFileSync(file.filepath);

    //move file to pulbic folder this MUST NOT BE DONE IN PRODUCTION
    // fs.writeFileSync(`./public/${file.originalFilename}`, data);

    //delete file from temp folder
    // return fs.unlinkSync(file.filepath);

    const { secure_url } = await cloudinary.uploader.upload(file.filepath);
    return secure_url;
};

//define parsefile function
const parseFiles = async (req: NextApiRequest): Promise<string> => {
    return new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return reject(err);
            }

            const filePath = await saveFile(files.files as formidable.File);

            return resolve(filePath);
        });
    });
};

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    //recieve file that are in the headers
    const imageUrl = await parseFiles(req);

    return res.status(200).json({ message: imageUrl });
};
