import { IonButton, IonCheckbox, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonToolbar } from '@ionic/react';
import styles from './pages/Swirepay.module.scss';

import Success from './icons/success';
import Close from './icons/close';

const SuccessPage = () => {
	return (
		<IonPage className={styles.signupPage}>
			<IonHeader>
				<IonToolbar>

					<IonButtons slot="start">
						<IonButton className="custom-button">
							Payment Successful
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
				<IonGrid className="ion-padding ion-text-center">
					<IonRow>
						<IonCol size="12" className={styles.headingText}>
							<h2>Thanks</h2>
							<h3 style={{marginBottom: '20px'}}>Payment Successful</h3>
                            <Success />
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default SuccessPage;