import abconsole from '../assets/abconsole.svg';
import abdesktop from '../assets/abcdesktop.svg';
import '../styles/topLeft.css';

// Small branding component shown in the upper-left corner of the console.
// Displays two logos depending on screen size.
export default function TopLeft() {
    return (
        <div className="upper-left">
            {/* First logo: abconsole, shown by default */}
            <img 
              id="abconsole" 
              alt="abconsole-icon" 
              src={abconsole} 
            />

            {/* Second logo: abcdesktop, shown on smaller screens */}
            <img 
              id="abcdesktop" 
              alt="abcdesktop-icon" 
              src={abdesktop} 
            />
        </div>
    );
}
