import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const pswd_reset= process.env.RESET_TOKEN_SECRET;

export const generateResetToken = async (id: string): Promise<string> => {
	if (!pswd_reset) {
		throw new Error('RESET_TOKEN_SECRET is not defined');
	}
	const pswd_token = jwt.sign({ id }, pswd_reset, { expiresIn: '15min' });
	return pswd_token;
}