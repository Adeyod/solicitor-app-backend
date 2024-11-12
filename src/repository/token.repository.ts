import { TokenSearchType } from '../constants/types';
import Token from '../models/token.model';

const findToken = async ({ user_id, purpose }: TokenSearchType) => {
  const getToken = await Token.findOne({
    user_id: user_id,
    purpose: purpose,
  });

  return getToken;
};

export { findToken };
