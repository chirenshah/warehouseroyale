import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
// import data from "./data.json";
import "./temp.css";
import { useState, useEffect } from "react";
import { getPerformanceData } from "../../../Database/firestore";
import { useParams } from "react-router-dom";

export const PerformanceMetric = () => {
    const [data, dataSet] = useState([]);
    let { right, wrong } = useParams();
    right = parseInt(right);
    wrong = parseInt(wrong);
    useEffect(() => {
        getPerformanceData().then((val) => {
            // setActiveoffers(val);
            // let actualLogs = val.data()["Logs"];
            dataSet(formatData(val));
        });
    }, []);

    const formatData = (data) => {
        let temp = [];
        let scores = data["Score"];
        let emailIds = Object.keys(scores);

        for (let itr = 0; itr < emailIds.length; itr++) {
            // console.log(scores[emailIds]["right"]);

            temp.push({
                id: itr,
                name: emailIds[itr].split("@")[0],
                team: "",
                percentage:
                    (scores[emailIds[itr]]["right"] /
                        (scores[emailIds[itr]]["right"] +
                            scores[emailIds[itr]]["wrong"])) *
                    100,
            });
        }

        temp.push({
            id: emailIds.length,
            name: window.localStorage.admin.split("@")[0],
            team: "",
            percentage: (right / (right + wrong)) * 100,
        });
        return temp;
    };

    return (
        <div className="score-cards score-cards-container">
            {data.map((elm) => (
                <div key={elm.id} className="card">
                    <CircularProgressbar
                        className="progress"
                        value={elm.percentage}
                        // text={`${elm.percentage}%`}
                        styles={buildStyles({
                            strokeLinecap: "round",
                            textSize: "1.7rem",
                            pathTransitionDuration: 0.5,
                            //   pathColor: `lightgreen`,
                            pathColor: `#3e98c7`,
                            trailColor: "lightgrey",
                        })}
                    />
                    <div className="person">
                        <span>{elm.name}</span>
                        <br />
                        <span>
                            Score : <i>{elm.percentage.toFixed(2)} %</i>
                        </span>
                        {/* <span>
              Team <i>{elm.team}</i>
            </span> */}
                    </div>
                </div>
            ))}
        </div>
    );
};
