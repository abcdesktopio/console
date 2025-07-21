import abconsole from '../assets/abconsole.svg'
import abdesktop from '../assets/abcdesktop.svg'

export default function TopLeft() {
    return (
        <div className="upper-left">
            <img id="abconsole" alt="console-icon" src={abconsole}/>
            <img id="abcdesktop" alt="console-icon" src={abdesktop}/>
        </div>
    )
}