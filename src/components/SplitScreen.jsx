import '../assets/styles/SplitScreen.css';

export default function SplitScreen({ leftComponent, rightComponent, orientation = 'horizontal' } = {}) {
    return (
        <div className={`split-screen ${orientation}`}>
            <div className="left-pane">
                {leftComponent}
            </div>
            <div className="right-pane">
                {rightComponent}
            </div>
        </div>
    );
}