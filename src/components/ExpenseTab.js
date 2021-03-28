import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';


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
    return (
        <tr>
            <td>
                {(new Date(exp.timestamp.seconds * 1000)).toLocaleString()}
            </td>
            <td>
                {exp.reason}
            </td>
            <td>
                {exp.amount}
            </td>
            <td>
                <button onClick={props.onDelete} value={exp.id}>x</button>
                <button onClick={props.onEdit} value={exp.id}>e</button>
            </td>
        </tr>

    )
}