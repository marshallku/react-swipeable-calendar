import { Calendar } from "./components";

function App() {
    return (
        <Calendar
            date={new Date()}
            onMonthChange={(date) => {
                console.log(`Month changed: ${date}`);
            }}
            content={
                <div>
                    <h2>What a piece of work is a man!</h2>
                    <p>What a piece of work is a man!</p>
                    <p>How noble in reason!</p>
                    <p>How infinite in faculty!</p>
                    <p>in form, in moving, how express and admirable!</p>
                    <p>in action how like an angel!</p>
                    <p>in apprehension how like a god!</p>
                    <p>the beauty of the world!</p>
                    <p>the paragon of animals!</p>
                    <p>And yet to me, what is this quintessence of dust?</p>
                    <p>man delights not me; no, nor woman neither,</p>
                    <p>though, by your smiling, you seem to say so.</p>
                    <h2>Sonnet 116</h2>
                    <p>Let me not to the marriage of true minds</p>
                    <p>Admit impediments; love is not love</p>
                    <p>Which alters when it alteration finds,</p>
                    <p>Or bends with the remover to remove.</p>
                    <p>O no, it is an ever-fixed mark</p>
                    <p>That looks on tempests and is never shaken;</p>
                    <p>It is the star to every wand'ring bark,</p>
                    <p>Whose worth's unknown, although his height be taken.</p>
                    <p>Love's not Time's fool, though rosy lips and cheeks</p>
                    <p>Within his bending sickle's compass come;</p>
                    <p>Love alters not with his brief hours and weeks,</p>
                    <p>But bears it out even to the edge of doom.</p>
                    <p>If this be error and upon me proved,</p>
                    <p>I never writ, nor no man ever loved.</p>
                </div>
            }
        />
    );
}

export default App;
