import React, { useEffect, useState } from "react";
import "./App.css";
import db from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { query, onSnapshot, orderBy } from "firebase/firestore";

const App = () => {
  const [numRows, setNumRows] = useState(0);
  const [numCols, setNumCols] = useState(0);
  const [marks, setMarks] = useState([]);
  const [loadedData, setLoadedData] = useState(false);
  const [loadedMarks, setLoadedMarks] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "marks"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleRowChange = (event) => {
    const numRows = parseInt(event.target.value);
    setNumRows(numRows);
    setMarks(
      new Array(numRows).fill([]).map(() => new Array(numCols).fill(""))
    );
    setLoadedData(false);
  };

  const handleReset = () => {
    setMarks(
      new Array(numRows).fill([]).map(() => new Array(numCols).fill(""))
    );
    setLoadedMarks([]);
    setLoadedData(false);
    setNumRows(0);
    setNumCols(0);
  };

  const handleColChange = (event) => {
    const numCols = parseInt(event.target.value);
    setNumCols(numCols);
    setMarks(
      new Array(numRows).fill([]).map(() => new Array(numCols).fill(""))
    );
    setLoadedData(false);
  };

  // const handleMarkChange = (subject, index, value) => {
  //   setMarks(prevMarks => {
  //     const newMarks = { ...prevMarks };
  //     newMarks[subject][index] = value;
  //     return newMarks;
  //   });
  // };

  const handleMarkChange = (rowIndex, colIndex, value) => {
    // const newMarks = [...marks];
    // newMarks[rowIndex][colIndex] = value;
    // setMarks(newMarks);
    // console.log(marks);
    setMarks((prevMarks) => {
      const newMarks = { ...prevMarks };
      newMarks[rowIndex][colIndex] = value;
      return newMarks;
    });
  };

  const handleSave = async () => {
    try {
      const docRef = await addDoc(collection(db, "marks"), {
        marks: marks,
        timestamp: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="container">
      <div>
        <div>
          <label>Number of Rows (Subjects): </label>
          <input
            className="parameters"
            type="number"
            value={numRows}
            onChange={handleRowChange}
          />
          <br />
          <label>Number of Columns (Students): </label>
          <input
            className="parameters"
            type="number"
            value={numCols}
            onChange={handleColChange}
          />
        </div>
        <table>
          <thead>
            <tr>
              {numCols && <th>Subject</th>}

              {Array.from({ length: numCols }, (_, index) => (
                <th key={index}>Student {index + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: numRows }, (_, rowIndex) => (
              <tr key={rowIndex}>
                <td>Subject {rowIndex + 1}</td>
                {Array.from({ length: numCols }, (_, colIndex) => (
                  <td key={colIndex}>
                    <input
                      type="text"
                      value={marks[rowIndex][colIndex]}
                      onChange={(e) =>
                        handleMarkChange(rowIndex, colIndex, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleReset}>Reset</button>
        {/* <button onClick={getTable}>getData</button> */}
        {loadedData && (
          <div className="loaded-data">
            <h2>Stored Data</h2>
            {loadedMarks.map((subjectMarks, rowIndex) => (
              <div key={rowIndex}>
                <h3>Subject {rowIndex + 1}</h3>
                {subjectMarks.map((studentMark, colIndex) => (
                  <p key={colIndex}>
                    Student {colIndex + 1}: {studentMark ? studentMark : "-"}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
        <>
          {posts.map((items) => (
            <div key={items.id}>
              {/* <div>{items.data.marks}</div> */}
              <div className="inner">
                {Object.values(items.data.marks).map((studentId, i) => (
                  <div key={studentId}>
                    <div>
                      SUBJECT:{i + 1}
                      <div className="subinner">
                        {studentId.toString().split(",").join(",")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {console.log(posts, "idhi")}
            </div>
          ))}
        </>
      </div>
    </div>
  );
};

export default App;
