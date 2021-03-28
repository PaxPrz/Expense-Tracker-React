

export default function ReasonInput(props) {

    const changeReason = ({ target }) => {
        props.setReason(target.value);
    }

    return (
        <input type="text" value={props.value} onChange={changeReason} />
    )
}