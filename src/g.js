import React, { useState } from "react";
import "./App.css";
import db from './firebase.js';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const App = () => {
  const [numRows, setNumRows] = useState(0);
  const [numCols, setNumCols] = useState(0);
  const [marks, setMarks] = useState([]);
  const [loadedData, setLoadedData] = useState(false);
  const [loadedMarks, setLoadedMarks] = useState([]);

  const handleRowChange = (event) => {
    const numRows = parseInt(event.target.value);
    setNumRows(numRows);
    setMarks(
      new Array(numRows).fill([]).map(() => new Array(numCols).fill(""))
    );
    setLoadedData(false);
  };

  const handleReset = () => {
    setMarks(new Array(numRows).fill([]).map(() => new Array(numCols).fill(""))); 
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

  const handleMarkChange = (rowIndex, colIndex, value) => {
    const newMarks = [...marks];
    newMarks[rowIndex][colIndex] = value;
    setMarks(newMarks);
    console.log(marks);
  };

//   db.collection("cities").doc("LA").set({
//     name: "Los Angeles",
//     state: "CA",
//     country: "USA"
// })
// .then(() => {
//     console.log("Document successfully written!");
// })
// .catch((error) => {
//     console.error("Error writing document: ", error);
// });
  const handleSave = (e) => {
    const dataToSave = {
      marks,
    };
  
    // db.collection("marks").add(dataToSave)
    //   .then(() => {
    //     setMarks(new Array(numRows).fill([]).map(() => new Array(numCols).fill("")));
    //     alert("Marks data saved to Firestore.");
    //   })
    //   .catch(error => {
    //     console.error("Error saving data:", error);
    //   });
      // Add the data to the Firestore collection "marks"
      const docRef = addDoc(collection(db, "marks"), {
        message: dataToSave,
        timestamp: serverTimestamp(),
      });
  };
  
  
  const handleLoadData = () => {
    db.collection("marks").get()
      .then(querySnapshot => {
        const loadedData = [];
        querySnapshot.forEach(doc => {
          loadedData.push(doc.data());
        });
        setLoadedMarks(loadedData);
        setLoadedData(true);
      })
      .catch(error => {
        console.error("Error loading data:", error);
      });
  };
  

  return (
    <div className="container">
      <div>
        <div>
          <label>Number of Rows (Subjects): </label>
          <input className="parameters" type="number" value={numRows} onChange={handleRowChange} />
          <br />
          <label>Number of Columns (Students): </label>
          <input className="parameters" type="number" value={numCols} onChange={handleColChange} />
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
        <button onClick={handleLoadData}>Store Data</button>
        <button onClick={handleReset}>Reset</button>
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
      </div>
    </div>
  );
};

export default App;
