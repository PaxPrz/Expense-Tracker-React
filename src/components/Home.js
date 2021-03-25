import ExpenseDone from './ExpenseDone';


export default function Home(props){
    console.log("PROPS: ", props);
    return (
        <div>
            <div>
                <button onClick={props.onSignOut}>SignOut</button>
            </div>
            <div>
                <h1>Welcome to Dashboard</h1>
                <ExpenseDone myFirestore={props.myFirestore} authUser={props.authUser} />
            </div>
        </div>
    )
}