import { IonButton, IonCheckbox, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonToolbar } from '@ionic/react';
import styles from './pages/Swirepay.module.scss';

import Failed from './icons/failed';
import Close from './icons/close';

const ErrorPage = () => {
	return (
		<IonPage className={styles.signupPage}>
			<IonHeader>
				<IonToolbar>

					<IonButtons slot="start">
						<IonButton className="custom-button">
							Payment Failed
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
							<h2>Sorry</h2>
							<h3 style={{marginBottom: '20px'}}>Payment Failed</h3>
                            <Failed />
                            <h5>Due to some unknown issues your payment is failed.</h5>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default ErrorPage;