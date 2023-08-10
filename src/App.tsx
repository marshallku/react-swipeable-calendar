import { Calendar } from "./components";

function App() {
    return (
        <Calendar
            date={new Date()}
            onMonthChange={(date) => {
                console.log(`Month changed: ${date}`);
            }}
        />
    );
}

export default App;
