import { useDrop } from "react-dnd";
import { BsTrash } from "react-icons/bs";
import { binUpdate } from "../Database/firestore";

export function Trash({ updateSelected, setSku_data }) {
    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: "sku",
            drop: (item) => {
                binUpdate(
                    item["parent"],
                    "Trash",
                    item["id"],
                    setSku_data,
                    item["expiretime"]
                );
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }),
        []
    );
    return (
        <div
            ref={drop}
            onClick={() => {
                updateSelected("Trash");
            }}
        >
            <BsTrash
                fontSize={100}
                style={{
                    color: isOver ? "red" : "black",
                }}
                className="trashCan"
            ></BsTrash>
        </div>
    );
}
