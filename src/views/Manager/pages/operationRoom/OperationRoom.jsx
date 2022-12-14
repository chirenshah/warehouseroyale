// Css
import { Link, useNavigate } from "react-router-dom";
import "./OperationRoom.css";

export default function OperationRoom() {
    let nav = useNavigate();
    return <Link to="/game">click</Link>;
}
