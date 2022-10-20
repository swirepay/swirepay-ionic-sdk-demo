import { useState } from "react";

export const useFormInput = (initialValue = "") => {

	const [value, setValue] = useState(initialValue);

	const handleChange = async e => {

		if (e.currentTarget.type === 'momth') {
			var code = e.keyCode;
			var allowedKeys = [8];
			if (allowedKeys.indexOf(code) !== -1) {
				return;
			}

			e.target.value = e.target.value.replace(
				/^([1-9]\/|[2-9])$/g, '0$1/'
			).replace(
				/^(0[1-9]|1[0-2])$/g, '$1/'
			).replace(
				/^1([3-9])$/g, '01/$1'
			).replace(
				/^0\/|0+$/g, '0'
			).replace(
				/[^\d|^\/]*/g, ''
			).replace(
				/\/\//g, '/'
			);
			const tempValue = await e.currentTarget.value;
			setValue(tempValue);
		} else if (e.currentTarget.type === 'card') {
			e.target.value = e.target.value.replace(/[^\d ]/g, '');
			const tempValue = await e.currentTarget.value;
				setValue(tempValue);
			// 
			// if (e.target.value.length < 19) {
			// 	e.target.value = e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1');
			// 	const tempValue = await e.currentTarget.value;
			// 	setValue(tempValue);
			// }

		} else {
			const tempValue = await e.currentTarget.value;
			setValue(tempValue);

		}
	}

	return {

		value,
		reset: (newValue) => setValue(newValue),
		onIonChange: handleChange,
		onKeyUp: handleChange
	};
}

export const validateForm = fields => {

	let errors = [];

	fields.forEach(field => {

		if (field.required) {

			const fieldValue = field.input.state.value;
			const cardValue = (field.input.state.value).replace(/ /g, "");

			const amexCard = /^(?:3[47][0-9]{13})$/;
			const visaCard = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
			const masterCard = /^(?:5[1-5][0-9]{14})$/;
			const corpMasterCard = /^(?:2[1-5][0-9]{14})$/;
			const discoverCard = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
			const dinnersCard = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
			const jcbCard = /^(?:(?:2131|1800|35\d{3})\d{11})$/;

			if (field.id === "cardNumber" && (cardValue === "" || (!cardValue.match(visaCard)))) {

				if (cardValue.match(amexCard)) {
					return;
				} else if (cardValue.match(masterCard)) {
					return;
				} else if (cardValue.match(discoverCard)) {
					return;
				} else if (cardValue.match(dinnersCard)) {
					return;
				} else if (cardValue.match(jcbCard)) {
					return;
				} else if (cardValue.match(corpMasterCard)) {
					return;
				} else {
					const error = {

						id: field.id,
						message: `Please check your ${field.id}`,
					};

					errors.push(error);
				}
			} else if (fieldValue === "" && field.id === "expiry") {

				const error = {

					id: field.id,
					message: `Please check your ${field.id}`,
				};

				errors.push(error);
			} else if ((fieldValue === "" || fieldValue.length < 3 || fieldValue.length > 4) && field.id === "cvv") {
				const error = {

					id: field.id,
					message: `Please check your ${field.id}`,
				};

				errors.push(error);
			} else if (fieldValue === "" && field.id === "name") {
				const error = {

					id: field.id,
					message: `Please check your ${field.id}`,
				};

				errors.push(error);
			}
		}
	});

	return errors;
}