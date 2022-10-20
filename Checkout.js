import { IonButton, IonCheckbox, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonToolbar } from '@ionic/react';
import styles from './pages/Swirepay.module.scss';

import Card from './icons/card';
import Cards from './icons/cards';
import BackArrow from './icons/backArrow';
import Close from './icons/close';
import CustomField from './components/CustomField';
import { useCardFields } from './data/fields';
import { useEffect, useState } from 'react';
import { validateForm } from './data/utils';
import { useParams } from 'react-router';
import { useHistory, useLocation } from "react-router-dom";
import axios from 'axios';

const Checkout = () => {
	const params = useParams();
	const location = useLocation();
	let history = useHistory();
	const { search } = location;
	const { id } = params;
	const mySubString = id.substring(
		id.indexOf("=") + 1,
		id.lastIndexOf("&")
	);
	localStorage.setItem('mySubString', mySubString);
	const index = id.indexOf('&amount=');
	const strIn = id.substr(index).replace("&amount=", "");
	const amount = strIn ? Number(strIn) : 100;
	const fields = useCardFields();
	const [errors, setErrors] = useState(false);
	const [isActive, setIsActive] = useState(false);
	const [customerGid, setCustomerGid] = useState();
	const config = {
		headers: {
			'x-api-key': mySubString,
		}
	};
	useEffect(() => {
		if (search) {
			getPaymentLinkDataWithSearchValue();
		} else {
			sendGetRequest();
		}
	}, [search]);

	const getPaymentLinkDataWithSearchValue = async () => {
		const params = new URLSearchParams(search);
		if (!params.get('ps') || !params.get('secret')) {
			history.push('/sp-failed');
			return;
		}
		try {
			const paymentHeader = {
				headers: {
					'x-api-key': localStorage.getItem('mySubString'),
				}
			};
			const paymentSessionGid = localStorage.getItem('paymentGid');
			const { data: { entity } } = await axios.get(`https://staging-backend.swirepay.com/v1/payment-session/${paymentSessionGid}`, paymentHeader);
			const redirectStatus = entity && entity.status;
			if (redirectStatus === 'SUCCEEDED') {
				localStorage.removeItem(paymentSessionGid);
				history.push('/sp-success');
			} else {
				history.push('/sp-failed');
			}
		} catch (reason) {
			history.push('/sp-failed');
		}
	};

	const sendGetRequest = async () => {
		try {
			const { data: { entity } } = await axios.get('https://staging-backend.swirepay.com/v1/customer?name.EQ=Muthu&email.EQ=testaccountowner-stag%2B789%40swirepay.com&phoneNumber.EQ=%2B919845789562', config)
			const response = entity.content;
			if (response.length > 0) {
				setCustomerGid(response[0].gid);
			} else {
				const customerObject = {
					email: 'shaik@omegaitr.com',
					name: 'Shaik',
					phoneNumber: '+919848965789' || null,
				};
				const { data: { entity: { gid } } } = await axios.post('https://staging-backend.swirepay.com/v1/customer', customerObject, config);
				setCustomerGid(gid);
			}
		} catch (error) {
			console.log(error);
			history.push('/sp-failed');
		}
	};


	const makePayment = async () => {
		const errors = validateForm(fields);
		const name = (fields[0] && fields[0].input && fields[0].input.state && fields[0].input.state.value);
		const cardNum = (fields[1] && fields[1].input && fields[1].input.state && (fields[1].input.state.value).replace(/ /g, ""));
		const expiry = (fields[2] && fields[2].input && fields[2].input.state && fields[2].input.state.value);
		const cvvNum = (fields[3] && fields[3].input && fields[3].input.state && fields[3].input.state.value);
		const month = expiry && expiry.substring(0, 2);
		const year = expiry && expiry.substring(3);
		const payload = {
			card: { cvv: cvvNum, number: cardNum, expiryMonth: month, expiryYear: year, name: name }, type: "CARD", customerGid, saved: isActive,
		};
		setErrors(errors);
		if (!errors.length) {
			try {
				const { data: { entity } } = await axios.post(`https://staging-backend.swirepay.com/v1/payment-method`, payload, config);
				const gid = entity.gid;
				const currencyCode = (entity.card && entity.card.currency && entity.card.currency.name);
				const receiptEmail = (entity.card && entity.card.customer && entity.card.customer.email);;
				const receiptSms = (entity.card && entity.card.customer && entity.card.customer.phoneNumber);;
				const postData = {
					amount,
					captureMethod: "AUTOMATIC",
					confirmMethod: "AUTOMATIC",
					currencyCode,
					description: "Test",
					paymentMethodGid: gid,
					paymentMethodType: ["CARD"],
					receiptEmail: receiptEmail || null,
					receiptSms: receiptSms || null,
					statementDescriptor: "IND Test"
				};
				if (gid) {
					try {
						const { data: { entity } } = await axios.post(`https://staging-backend.swirepay.com/v1/payment-session`, postData, config);
						const paymentStatus = entity && entity.status;
						const paymentGid = entity && entity.gid;
						const nextActionUrl = entity && entity.nextActionUrl;
						localStorage.setItem('paymentGid', paymentGid);
						if (paymentStatus === 'SUCCEEDED') {
							history.push('/sp-success');
						} else if (paymentStatus === 'REQUIRE_ACTION') {
							if (nextActionUrl) {
								history.push(nextActionUrl);
								return;
							} else {
								history.push('/sp-failed');
							}
						} else {
							history.push('/sp-failed');
						}
					} catch (error) {
						console.log(error);
						history.push('/sp-failed');
					}
				} else {
					history.push('/sp-failed');
				}

			} catch (error) {
				console.log(error);
				history.push('/sp-failed');
			}
		}
	};

	useEffect(() => {
		return () => {
			fields.forEach(field => field.input.state.reset(""));
			setErrors(false);
		}
	}, [params]);

	const checkChange = (e) => {
		setIsActive(e.detail.checked);
	}

	return (
		<IonPage className={styles.signupPage}>
			<IonHeader>
				<IonToolbar>

					<IonButtons slot="start">
						<IonButton className="custom-button">
							<BackArrow />
						</IonButton>
					</IonButtons>

					<IonButtons slot="end">
						<IonButton className="custom-button">
							<Close />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonGrid className="ion-padding">
					<IonRow>
						<IonCol size="12" className={styles.headingText}>
							<h5>Select Payment Method</h5>
							<p><Card /> Card</p>
							<h6>Debit card, Credit card and Corporate credit card are supported</h6>
						</IonCol>
					</IonRow>

					<IonRow>
						<IonCol size="12">
							{fields.map(field => {
								return <CustomField field={field} errors={errors} />;
							})}
							<div class="ion-text-start" style={{ paddingBottom: '10px' }}>
								<IonCheckbox onIonChange={(e) => checkChange(e)}  checked={isActive} slot="start" style={{ border: '2px solid #000' }} /> <span>Save this Card</span>
							</div>
							<IonCheckbox onIonChange={(e) => checkChange(e)} slot="start" checked={isActive} />
							<h4>We don't store CVV, You can remove all the saved card later.</h4>
							<div class="ion-text-center">
								<Cards />
							</div>
							<IonButton className="custom-button" expand="block" onClick={makePayment}>PAY</IonButton>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default Checkout;