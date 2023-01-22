import { useState, useEffect } from "react";

//firebase
import { db } from "firebases";
import { doc, collection, query, where, onSnapshot } from "firebase/firestore";

const QuestionList = (props) => {
  const { poll_id, setMode, mode, setEditQ, editQ, questions } = props;

  const setEdit = (question) => {
    setEditQ(question);
    setMode("edit");
  };

  return (
    <div>
      <h5>Questions</h5>
      {questions.map((question, i) => {
        const status = question.isOpen;

        return (
          <div className="card mb-3 p-3" key={i}>
            <div className="row">
              <div className="col-10">
                <span className="badge bg-danger">
                  {question.question_order}
                </span>
                <h6>{question.question_title}</h6>
                <p>{question.question_subtitle}</p>
                
              </div>
              <div className="col-2 d-flex justify-content-end align-items-start">
                {mode == "read" && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setEdit(question)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            <ul className="list-group">
              
              {question.options.map((opt, key) => (
                <li className="list-group-item" key={key}>
                  <span className="mr-5">{opt}</span>
                  {question.answer == key && <small className="badge bg-success ml-5">Answer</small> }
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionList;
