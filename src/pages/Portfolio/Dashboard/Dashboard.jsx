import './Dashboard.scss';
import AuthContext from '../../../components/Auth/AuthContext';
import { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BottomNav from '../../../components/BottomNav/BottomNav';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import CompleteDashboard from './CompleteDashboard/CompleteDashboard';

const Dashboard = () => {
	const history = useHistory();
	const { loggedIn, getLoggedIn } = useContext(AuthContext);
	const [user, setUser] = useState(null);
	const [prices, setPrices] = useState(null);
	const [watchList, setWatchList] = useState(null);
	const [news, setNews] = useState(null);

	const apiURL = 'https://api.apexwallet.app/api/v1';
	const pricesEndPoint =
		'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20ethereum%2C%20ethereum-classic%2C%20litecoin%2C%20dogecoin%2C%20ripple%2C%20tether%2C%20binancecoin%2C%20cardano%2C%20usd-coin%2C%20tron%2C%20bitcoin-cash%2C%20polkadot%2C%20uniswap%2C%20dash%2C%20decentraland%2C%20shiba-inu%2C%20stellar%2C%20chainlink%2C%20solana&order=market_cap_desc&per_page=100&page=1&sparkline=false';
	// decentraland = %20decentraland%2C
	const newsAPI = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN';

	let isRendered = useRef(false);

	useEffect(() => {
		isRendered.current = true;
		async function load() {
			await getLoggedIn();
			if (loggedIn === false) {
				history.push('/login');
			} else if (loggedIn === true) {
				try {
					let user = await axios.get(`${apiURL}/user/`, { withCredentials: true }).catch(async (err) => {
						await toast.error(`${err.response.data}`, {
							
						});
					});
					if (isRendered.current === true) {
						setUser(user.data);
					} else {
						return null;
					}
				} catch (error) {
					console.log('ERROR' + error.response);
				}

				try {
					await fetch(pricesEndPoint, {
						method: 'GET',
						headers: {
							'content-type': 'application/json',
						},
					})
						.then((response) => response.json())
						.then((data) => {
							if (isRendered.current === true) {
								setPrices(data);
							} else {
								return null;
							}
						});
				} catch (error) {
					console.log('ERROR: ', error);
				}

				try {
					const cryptoCompareAPIKey = process.env.REACT_APP_CRYPTO_COMPARE_API;
					await fetch(newsAPI, {
						method: 'GET',
						headers: {
							'content-type': 'application/json',
							authorization: `Apikey ${cryptoCompareAPIKey}`,
						},
					})
						.then((response) => response.json())
						.then((data) => {
							setNews(data.Data);
						});
				} catch (error) {
					console.log('ERROR: ', error);
				}
			}
		}
		load();

		return () => {
			isRendered.current = false;
		};
	}, [getLoggedIn, loggedIn, history]);

	//min the user's watch list with the coingecko API
	useEffect(() => {
		if (user !== null && prices !== null) {
			let arr = [];

			if (user.watchList !== undefined) {
				user.watchList.forEach((watchedCoin) => {
					const oldList = watchedCoin;
					prices.forEach((price) => {
						if (price.id === oldList.coinId) {
							let newCoinData = {
								name: price.name,
								symbol: price.symbol,
								id: price.id,
								price: price.current_price,
								percentChange: price.price_change_percentage_24h,
								image: price.image,
							};
							arr.push(newCoinData);
						}
					});
				});
			}

			setWatchList(arr);
		}
	}, [prices, user]);

	return (
		<HelmetProvider>
			<div className="dashboard">
				<Helmet>
					<meta charSet="utf-8" />
					<title>Home - Apex</title>
				</Helmet>
				<BottomNav />
				<div className="container">
					<p className="header">Home</p>
					{CompleteDashboard(user, watchList, news)}
				</div>
				<ToastContainer hideProgressBar autoClose={3000} />
			</div>
		</HelmetProvider>
	);
};

export default Dashboard;
