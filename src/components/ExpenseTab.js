import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { useState } from 'react';
import ReasonInput from './ReasonInput';


function ExpenseEdit(props) {
    return (
        <form>
            <DateTimePickerComponent value={props.timestamp}></DateTimePickerComponent>
            <input type="text" value={props.reason} />
            <input type="number" value={props.amount} />
        </form>
    )
}


export default function ExpenseTab(props) {
    const exp = props.expense;
    const expense_done_collection = props.expense_done_collection;
    const fetchData = props.fetchData;

    const [ editMode, setEditMode ] = useState(false);
    const [ reason, setReason ] = useState(exp.reason);
    const [ amount, setAmount ] = useState(exp.amount);
    const [ timestamp, setTimestamp ] = useState(new Date(exp.timestamp.seconds * 1000));

    var oldReason = exp.reason;
    var oldAmount = exp.amount;
    var oldTimestamp = new Date(exp.timestamp.seconds * 1000);

    const setOld = () => {
        setReason(oldReason);
        setAmount(oldAmount);
        setTimestamp(oldTimestamp);
    }

    const cancelEdit = () => {
        setOld();
        setEditMode(false);
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

    const updateExpense = () => {
        const {formIsValid, errors} = validateFormData();
        if (!formIsValid){
            for (const key in errors) {
                alert("Error: "+errors[key]);
            }
            return;
        }
        expense_done_collection
        .doc(exp.id)
        .update({
            timestamp: timestamp,
            reason: reason,
            amount: amount,
        }).then(() => {
            alert("Update Successful!");
            fetchData();
        }).catch(err => {
            alert("Cannot Edit: "+ err.message);
        });
        setEditMode(false);
    }

    return (
        <tr>
            <td>
                {editMode ?
                <DateTimePickerComponent value={props.timestamp} max={new Date()} value={timestamp} onChange={({target}) => setTimestamp(target.value)} />:
                timestamp.toLocaleString()}
            </td>
            <td>
                {editMode ?
                <ReasonInput value={reason} setReason={setReason} /> :
                reason}
            </td>
            <td>
                {editMode ?
                <input type="number" value={amount} onChange={({target}) => setAmount(target.value)} style={{width: 60}}/> :
                amount}
            </td>
            <td>{editMode ?
                <div>
                    <button onClick={updateExpense}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                </div>:
                <div>
                    <button onClick={props.onDelete} value={exp.id}>Delete</button>
                    <button onClick={() => setEditMode(true)} value={exp.id}>Edit</button> 
                </div>
                }
            </td>
        </tr>

    )
}