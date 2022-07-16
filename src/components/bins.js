import "../style/bin.css"

function Bins(props){
    return(
        <div className="bin_body">
            <div className="bin_dropdown">
            </div>
            <div className="bin_identifier">
                <div className="circle">{props.label}</div>
            </div>
        </div>
    )
}

export default Bins;