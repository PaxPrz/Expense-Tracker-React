import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';

var uuid = require("uuid");


export default function ExpenseDone(props) {

    const user = props.authUser;
    const firestore = props.myFirestore;

    const expense_done_collection = firestore.collection('expenses_done');
    
    const [ reason, setReason ] = useState('');
    const [ amount, setAmount ] = useState(0);
    const [ timestamp, setTimestamp ] = useState(new Date());
    const [ expenseList, setExpenseList ] = useState([]);

    useEffect(() => {
        expense_done_collection
        .orderBy('timestamp')
        .where('user_id', '==', user.uid)
        .get()
        .then(expense_list => {
            setExpenseList(expense_list.docs.map(doc => doc.data()));
        })
        .catch(err => {
            alert(err.message);
        });
    }, []);

    const changeReason = ({ target }) => {
        setReason(target.value);
    }

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
        }).catch(err => {
            alert("Error: "+ err.message);
        });
    }

    // const query = expense_done_collection.orderBy('timestamp');//.where('user_id', '==', user.uid);
    // console.log(query);
    // const [messages] = useCollectionData(query, {idField: 'id'});
    // console.log(messages);

    return (
        <div>
            <p>Expense Done Here</p>
            {
                expenseList.map(
                    (exp, i) => <li key={i}>{(new Date(exp.timestamp.seconds * 1000)).toLocaleString()}: {exp.reason}: {exp.amount}</li>
                )
            }
            <form onSubmit={formSubmit}>
                <input type="text" value={reason} onChange={changeReason} />
                <input type="number" value={amount} onChange={changeAmount} />
                <DateTimePickerComponent placeholder="Expense Done on:" value={timestamp} onChange={changeTimestamp} max={new Date()}></DateTimePickerComponent>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}