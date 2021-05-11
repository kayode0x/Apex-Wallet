import './Dashboard.scss';
import AuthContext from '../Auth/AuthContext';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
	const history = useHistory();
	const { loggedIn, getLoggedIn } = useContext(AuthContext);
	const [user, setUser] = useState(null);
	const [wallet, setWallet] = useState(null);
	const apiURL = 'https://api.apexwallet.app/api/v1';

	useEffect(() => {
		async function load() {
			await getLoggedIn();
			if (loggedIn === false) {
				history.push('/login');
			} else if (loggedIn === true) {
				try {
					let user = await axios.get(`${apiURL}/user/`, { withCredentials: true }).catch(async (err) => {
						await toast.dark(`${err.response.data}`, {
							position: toast.POSITION.TOP_CENTER,
						});
					});
					setUser(user.data);
					console.log(user);
					
				} catch (error) {
					console.log('ERROR' + error.response);
				}

				try {
					let wallet = await axios.get(`${apiURL}/wallet/`, { withCredentials: true }).catch(async (err) => {
						await toast.dark(err.response.data, {
							position: toast.POSITION.TOP_CENTER,
						});
					});
					setWallet(wallet.data);
					console.log(wallet);
				} catch (error) {
					console.log('ERROR2: ', error);
				}
			}
		}
		load();
	}, [getLoggedIn, loggedIn, history]);

	return (
		<div className="dashboard">
			{loggedIn === true && (
				<div>
					{user && (
						<>
							<h1>{user.name ? user.name : 'No name yet'}</h1>
							<h1>{user.username ? `Username: ${user.username}` : 'username pls'}</h1>
							<h1>{user.email ? `Email: ${user.email}` : 'email pls'}</h1>
							<h1>{user.image ? user.image : 'No image yet'}</h1>
						</>
					)}
					{wallet && (
						<>
							<h1>{wallet ? wallet : ''}</h1>
						</>
					)}
				</div>
			)}
			<ToastContainer />
		</div>
	);
};

export default Dashboard;
