import { Link } from 'react-router-dom';
import { RotateSpinner } from 'react-spinners-kit';
import saturnSVG from '../../../../assets/logo/saturnSVG.svg';
import alienSVG from '../../../../assets/logo/alienSVG.svg';
import astronautSVG from '../../../../assets/logo/astronautSVG.svg';
import sunSVG from '../../../../assets/logo/sunSVG.svg';
import { ImArrowDownLeft2, ImArrowUpRight2, ImLoop2 } from 'react-icons/im';
import { BsThreeDotsVertical } from 'react-icons/bs';
import CardDesign from './CardDesign';
import { useState } from 'react';
import TransactionModal from '../Transactions/TransactionModal';

const CompleteUser = ({ user, asset, wallet, handleCreateWallet, creatingWallet }) => {
	//receipt modal.
	const [transactionModal, setTransactionModal] = useState(false);
	const [singleTransaction, setSingleTransaction] = useState(null);

	let cardImage;

	if ((user !== null && user.cardDesign) === 'saturnSVG') {
		cardImage = saturnSVG;
	} else if ((user !== null && user.cardDesign) === 'alienSVG') {
		cardImage = alienSVG;
	} else if ((user !== null && user.cardDesign) === 'astronautSVG') {
		cardImage = astronautSVG;
	} else if ((user !== null && user.cardDesign) === 'sunSVG') {
		cardImage = sunSVG;
	} else {
		cardImage = saturnSVG;
	}

	const cardDesignFunction = () => {
		return (
			<div className={user.cardDesign ? user.cardDesign : 'saturnSVG'}>
				<CardDesign BsThreeDotsVertical={BsThreeDotsVertical} />
				<div className="apexWallet">Apex Card</div>
				<div className="cardBalance">
					<p>
						<span>$</span>
						{parseFloat(wallet.balance).toFixed(2)}
					</p>
				</div>
				<p className="cardNumber">
					<span>6732</span> <span>9239</span> <span>4344</span> <span>2230</span>
				</p>
				<img className="cardSVG" src={cardImage} alt="Card Design" />
			</div>
		);
	};
	const assetsFunction = () => {
		return (
			<div className="assetsContainer">
				{/* Assets container */}
				<p className="assetsHeader">Assets</p>
				{asset.map((asset, index) => (
					<Link to={`/prices/${asset.id}`} className="asset" key={index}>
						<div className="imageAndName">
							<img src={asset.image} alt={asset.name} />
							<div className="nameAndSymbol">
								<p>{asset.name}</p>
							</div>
						</div>
						<div className="priceAndBalance">
							<p>${parseFloat(asset.usdValue).toFixed(2)}</p>
							<p>
								{parseFloat(asset.balance).toFixed(5)}{' '}
								<span style={{ textTransform: 'uppercase' }}>{asset.symbol}</span>
							</p>
						</div>
					</Link>
				))}
			</div>
		);
	};
	const transactionsFunc = (coin, type, amount, symbol) => {
		if (asset !== null && wallet !== null) {
			if (coin !== 'Dollars' && coin !== 'USD' && type === 'Sent') {
				return (
					<p style={{ textTransform: 'uppercase' }}>
						-{amount} {symbol ? symbol : ''}
					</p>
				);
			} else if (coin !== 'Dollars' && coin !== 'USD' && type === 'Received') {
				return (
					<p style={{ textTransform: 'uppercase' }}>
						{amount} {symbol ? symbol : ''}
					</p>
				);
			} else if (coin !== 'Dollars' && coin !== 'USD' && type === 'Converted') {
				return (
					<p style={{ textTransform: 'uppercase' }}>
						-{amount} {symbol ? symbol : ''}
					</p>
				);
			} else {
				return (
					<p>
						<span>{type === 'Free' || type === 'Sold' || type === 'Received' ? '' : '-'}</span>$
						{parseFloat(amount).toFixed(2)}
					</p>
				);
			}
		}
	};

	//get the icon background based on the transaction type
	const getIconBg = (type) => {
		let color;
		if (type === 'Received' || type === 'Free' || type === 'Sold') {
			color = '#C2FEDB';
			return color;
		} else if (type === 'Bought' || type === 'Sent') {
			color = '#FDC4CC';
			return color;
		} else if (type === 'Converted') {
			color = '#bbdefb';
			return color;
		}
	};

	//get the icon color based on the transaction type
	const getIconColor = (type) => {
		let color;
		if (type === 'Received' || type === 'Free' || type === 'Sold') {
			color = '#12A550';
			return color;
		} else if (type === 'Bought' || type === 'Sent') {
			color = '#F71735';
			return color;
		} else if (type === 'Converted') {
			color = '#1565c0';
			return color;
		}
	};

	//get the icon based on the transaction type
	const getIcon = (type) => {
		let icon;
		if (type === 'Received' || type === 'Free' || type === 'Sold') {
			icon = <ImArrowDownLeft2 />;
			return icon;
		} else if (type === 'Bought' || type === 'Sent') {
			icon = <ImArrowUpRight2 />;
			return icon;
		} else if (type === 'Converted') {
			icon = <ImLoop2 />;
			return icon;
		}
	};

	const transactionsFunction = () => {
		return (
			<div className="transactionsContainer">
				{/* Transactions Container */}
				<div className="transactionsHeader">
					<p>Transactions</p>
					<Link to="/wallet/transactions">See All</Link>
				</div>
				{wallet.transactions.slice(0, 5).map((transaction) => (
					<div
						onClick={() => {
							setTransactionModal(!transactionModal);
							setSingleTransaction(transaction);
						}}
						className="walletTransaction"
						key={transaction._id}
					>
						<div
							style={{
								background: getIconBg(transaction.type),
								color: getIconColor(transaction.type),
							}}
							className="transactionIcon"
						>
							{getIcon(transaction.type)}
						</div>
						<div className="memoAndDate">
							<p>{transaction.coin}</p>
							<p>{transaction.name}</p>
						</div>
						<div className="value">
							{transactionsFunc(
								transaction.coin,
								transaction.type,
								transaction.amount,
								transaction.symbol
							)}
						</div>
					</div>
				))}
			</div>
		);
	};

	if (user !== null && user.isActive === true && user.wallet !== undefined && asset !== null && wallet !== null) {
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }} className="cardAssetsAndTransactions">
				{cardDesignFunction()}
				<div className="coinsAndTransactions">
					{assetsFunction()}
					{transactionsFunction()}
				</div>
				<TransactionModal
					setTransactionModal={setTransactionModal}
					singleTransaction={singleTransaction}
					transactionModal={transactionModal}
				/>
				<div
					className={`Overlay ${transactionModal ? 'Show' : ''}`}
					onClick={() => setTransactionModal(!transactionModal)}
				/>
			</div>
		);
	} else if (user !== null && user.isActive === false) {
		return (
			<>
				<div className="notActive">
					<p className="leadText">Verify your account</p>
					<p className="subText">You can not open a wallet until you have verified your account.</p>
					<p className="thirdText">We sent you an email 😉</p>
				</div>
				<div className="notActive2">
					<p>Once verified, your assets will show up here.</p>
				</div>
			</>
		);
	} else if (user !== null && user.isActive === true && user.wallet === undefined) {
		return (
			<>
				<div className="createWallet">
					<p>Account Verified!</p>
					<p>Click the button below to create a wallet and get started 🚀</p>

					<button onClick={handleCreateWallet} disabled={creatingWallet ? true : false}>
						{creatingWallet ? <RotateSpinner size={30} color="#fff" /> : 'Create Wallet'}
					</button>
				</div>
				<div className="notActive2">
					<p>Once you create a wallet, your assets will show up here.</p>
				</div>
			</>
		);
	} else {
		return (
			<div className="loading">
				<RotateSpinner size={40} color="#080809" />
			</div>
		);
	}
};

export default CompleteUser;
