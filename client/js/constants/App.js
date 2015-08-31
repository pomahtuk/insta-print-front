import { Styles, MenuItem } from 'material-ui';
import printboxTheme from '../themes/printbox';
const ThemeManager = new Styles.ThemeManager();

// set application wide theme, constnt, let it be here
ThemeManager.setTheme(printboxTheme);

let {API_URL, SOCKET_URL, PROXY_API_URL, REDIRECT_URI, CLIENT_ID} = window.M;
let instaLink = `https://api.instagram.com/oauth/authorize/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token`;

export default {
  API_URL: API_URL,
  SOCKET_URL: SOCKET_URL,
  PROXY_API_URL: PROXY_API_URL,
  CLIENT_ID: CLIENT_ID,
  REDIRECT_URI: REDIRECT_URI,
  INSTAGRAM_URL: 'https://api.instagram.com/v1',
  THEME_MANAGER: ThemeManager,
  MENU_ITEMS: [
    { route: 'index', text: 'Home' },
    { route: 'tools', text: 'Tools' },
    {
       type: MenuItem.Types.LINK,
       payload: instaLink,
       text: 'Instagramm Auth',
       disabled: false
    }
  ]
};
