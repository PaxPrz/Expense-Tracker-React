import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import ReasonInput from './ReasonInput';
var uuid = require('uuid');


export default function ExpenseDoneForm(props) {

    const [ reason, setReason ] = useState(props.reason || '');
    const [ amount, setAmount ] = useState(props.amount || 0);
    const [ timestamp, setTimestamp ] = useState(props.timestamp || new Date());

    const fetchData = props.fetchData;
    const expense_done_collection = props.expense_done_collection;
    const user = props.user;

    const today_date = new Date();


    const changeAmount = ({ target }) => {
        setAmount(target.value);
    }

    const changeTimestamp = ({ target }) => {
        setTimestamp(target.value);
    }


    const validateFormData = () => {
        let errors = {};
        let formIsValid = true;

        if (!reason) {
            formIsValid = false;
            errors["reason"] = "Cannot be empty";
        }

        if (amount < 0){
            formIsValid = false;
            errors["amount"] = "Cannot be negative";
        }

        return {
            formIsValid: formIsValid,
            errors: errors
        }
    }

    const clearForm = () => {
        setReason('');
        setAmount(0);
    }

    const formSubmit = (e) => {
        e.preventDefault();
        const { formIsValid, errors } = validateFormData();
        if (!formIsValid) {
            for (const key in errors) {
                alert(`${key}: ${errors[key]}`);
            }
            return;
        }
        expense_done_collection
        .doc(uuid.v4())
        .set({
            user_id: user.uid,
            reason: reason,
            amount: amount,
            timestamp: timestamp,
            added_on: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(() => {
            alert("Writing successful!");
            clearForm();
            fetchData();
        }).catch(err => {
            alert("Error: "+ err.message);
        });
    }

    return (
        <div>
            <form onSubmit={formSubmit} >
                <div id="expense-done-add" className="flex-container">
                    <div style={{ width: 200 }}>
                        <DateTimePickerComponent placeholder="Expense Done on:" value={timestamp} onChange={changeTimestamp} max={today_date} />
                    </div>
                        <ReasonInput value={reason} setReason={setReason} />
                        <input type="number" value={amount} onChange={changeAmount} style={{width: 80}} />
                        <button type="submit" >Add</button>
                </div>
            </form>
        </div>
    )
}