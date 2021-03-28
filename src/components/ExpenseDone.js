import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import ExpenseTab from './ExpenseTab';
import { AuthContext } from 'firebase-react-hooks';
import ExpenseDoneForm from './ExpenseDoneForm';
import CurrentTime from './CurrentTime';

var uuid = require("uuid");


export default function ExpenseDone(props) {

    const user = props.authUser;
    const firestore = props.myFirestore;

    const expense_done_collection = firestore.collection('expenses_done');

    const [ expenseList, setExpenseList ] = useState([]);
    const [ total, setTotal ] = useState(0);

    const fetchData = () => {
        expense_done_collection
        .orderBy('timestamp')
        .where('user_id', '==', user.uid)
        .get()
        .then(expense_list => {
            let exp_list = expense_list.docs.map(doc => ({id: doc.id, ...(doc.data())}));
            setTotal(exp_list.reduce((t, b) => t + parseInt(b.amount), 0));
            setExpenseList(exp_list);
        })
        .catch(err => {
            alert(err.message);
        });
    }

    useEffect(() => {
        fetchData();
    }, []);

    const deleteThis = ({ target }) => {
        expense_done_collection
        .doc(target.value)
        .delete()
        .then(() => {
            alert("Delete successful!!");
            fetchData();
        })
        .catch(err => {
            alert("Cannot delete: "+ err.message);
        });
    }

    const editThis = ({ target }) => {
        expense_done_collection
        .doc(target.value)
        .update({

        }).then(() => {
            alert("Update Successful!");
            fetchData();
        }).catch(err => {
            alert("Cannot Edit: "+ err.message);
        });
    }

    return (
        <div>
            <p>Expense Done Here</p>
            <table style={{marginLeft: 'auto', marginRight: 'auto'}}>
                <thead>
                    <tr>
                        <td>Timestamp</td>
                        <td>Reason</td>
                        <td>Amount</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {
                        expenseList.map(
                            (exp) => <ExpenseTab expense={exp} onDelete={deleteThis} onEdit={editThis} />
                        )
                    }
                    <tr>
                        <td>
                            <CurrentTime />
                        </td>
                        <td>
                            TOTAL
                        </td>
                        <td>
                            {total}
                        </td>
                    </tr>
                </tbody>
            </table>
            <ExpenseDoneForm user={user} expense_done_collection={expense_done_collection} fetchData={fetchData} />
        </div>
    )
}


// ExpenseDone.propTypes = {
//     authUser: PropTypes.element.isRequired,
//     myFirestore: PropTypes.element.isRequired,
// }