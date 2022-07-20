import "../style/bin.css"

function Bins(props){
    return(
        <div className="bin_body">
            <div className="bin_dropdown">
            </div>
            <div className="bin_identifier">
                <div className="circle"><p>{props.label}</p></div>
            </div>
        </div>
    )
}

export default Bins;