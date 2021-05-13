import { useState, useEffect, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

function AuthContextProvider(props) {
	const [loggedIn, setLoggedIn] = useState(undefined);
	const apiURL = 'https://api.apexwallet.app/api/v1/auth/loggedin';

	async function getLoggedIn() {
		const loggedInResponse = await axios.get(apiURL, {
			headers: {
				'content-type': 'application/json',
			}
		}, { withCredentials: true });
		setLoggedIn(loggedInResponse.data);
	}

	useEffect(() => {
		getLoggedIn();
	}, []);

	return <AuthContext.Provider value={{ loggedIn, getLoggedIn }}>{props.children}</AuthContext.Provider>;
}

export default AuthContext;
export { AuthContextProvider };
