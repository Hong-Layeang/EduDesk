import Cookies from 'js-cookie';

const TOKEN_KEY = 'access_token';
const ROLE_KEY  = 'user_role';

export const cookies = {
  getToken:    ()           => Cookies.get(TOKEN_KEY),
  setToken:    (v: string)  => Cookies.set(TOKEN_KEY, v, { expires: 1, sameSite: 'strict' }),
  removeToken: ()           => Cookies.remove(TOKEN_KEY),

  getRole:    ()           => Cookies.get(ROLE_KEY),
  setRole:    (v: string)  => Cookies.set(ROLE_KEY, v, { expires: 1, sameSite: 'strict' }),
  removeRole: ()           => Cookies.remove(ROLE_KEY),

  clearAll: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(ROLE_KEY);
  },
};
