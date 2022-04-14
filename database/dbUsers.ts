import { User } from '../models';
import { db } from './';
import bcrypt from 'bcryptjs';


export const checkUserEmailPassword = async (email: string, password: string) => {

    //connect to database
    await db.connect();
    const user = await User.findOne({email});
    //disconnect from database
    await db.disconnect();

    if(!user){
        return null;
    }

    if(!bcrypt.compareSync(password, user.password! as string)){
        return null;
    }

    const { role, name, _id } = user;

    return {
        _id,
        email: email.toLocaleLowerCase(),
        role,
        name,
    }


}


//This function verifies an oauth user
export const oAuthToDbUser = async ( oAuthEmail: string, oAuthName: string ) => {

    await db.connect();
    const user = await User.findOne({email: oAuthEmail});
    

    if(user){
        await db.disconnect();
        const { role, name, _id, email } = user;
        return { _id, email, role, name };
    }

    //create new user
    const newUser = new User({email: oAuthEmail, name: oAuthName, password: '@', role: 'user'});
    await newUser.save();
    await db.disconnect();

    const { role, name, _id, email } = newUser;

    return { _id, email, role, name };

}