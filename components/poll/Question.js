import { useRouter } from "next/router";
import { useState } from "react";
import moment from "moment";

import { db } from "firebases";
import { updateDoc, doc } from "firebase/firestore";
import Timer from "./Timer";

const updateQStatus = async (poll_id, question, status) => {
  event.stopPropagation();
  event.preventDefault();
  try {
    const docRef = doc(
      db,
      "hkcc_polling",
      poll_id,
      "questions",
      question.question_id
    );
    await updateDoc(docRef, {
      isOpen: status,
    });
    console.log("updated");
  } catch (err) {
    console.log("failed");
    console.log(err);
  }
};

const updatePollStatus = async (poll_id, status,question_id) => {
  event.stopPropagation();
  event.preventDefault();
  try {
    const docRef = doc(db, "hkcc_polling", poll_id);
    await updateDoc(docRef, {
      poll_status: status,
    });
    console.log("updated");
    return true;
  } catch (err) {
    console.log("failed");
    console.log(err);
    return false;
  }
};

const updateNextQStatus = async (poll_id,question_id) => {
  event.stopPropagation();
  event.preventDefault();
  try {
    const docRef = doc(db, "hkcc_polling", poll_id);
    await updateDoc(docRef, {
      current_question: question_id,
    });
    console.log("updated");
    return true;
  } catch (err) {
    console.log("failed");
    console.log(err);
    return false;
  }
};

const Question = (props) => {
  const { question, poll_id, duration, allQuestions, setCurQuestion } = props;
  const [isStarted, setIsStarted] = useState(false);
  const router = useRouter();

  const startQ = () => {
    event.stopPropagation();
    event.preventDefault();
    const startTime = moment().format("YYYY-MM-DD hh:mm:ss");
    const endTime = moment(startTime)
      .add(duration, "s")
      .format("YYYY-MM-DD hh:mm:ss");
    updateQStatus(poll_id, question, true);

    setIsStarted(true);
  };

  const startTime = moment().format("YYYY-MM-DD hh:mm:ss");
  const endTime = moment(startTime)
    .add(duration, "s")
    .format("YYYY-MM-DD hh:mm:ss");

  const nextQuestion = () => {
    updateQStatus(poll_id, question, false);
    const nextOrder = question.question_order + 1;
    const nextQuestion = allQuestions.find(
      (quest) => quest.question_order === nextOrder
    );
    setCurQuestion(nextQuestion);
    updateQStatus(poll_id, nextQuestion, true);
    console.log(nextQuestion.question_id)
    updateNextQStatus(poll_id,nextQuestion.question_id)
    setIsStarted(false);
  };

  return (
    <>
      <div className="card border-0 shadow p-5">
        <h3>{question.question_title}</h3>
        <h5>{question.question_subtitle}</h5>
        <div className="row">
          <div className="col-lg-10 col-12">
            <ul className="list-group">
              {question.options.map((opt, key) => (
                <h5 className="list-group-item" key={key}>
                  {opt}
                </h5>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-12">
            <div className="d-flex justify-content-center align-items-center flex-direction-column">
              {isStarted == false ? (
                <>
                  <div>
                    <div className="text-center">
                      <h1 className="text-danger">{duration}</h1>
                      <span className="text-muted text-uppercase">Second</span>
                    </div>

                    <div className="d-flex justify-content-center my-5">
                      <button
                        className="btn btn-lg btn-danger px-5 py-2"
                        onClick={() => startQ()}
                      >
                        Start Timer
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {question.question_order != allQuestions.length ? (
                    <div>
                      <Timer duration={duration} />
                      <div className="d-flex justify-content-center my-5">
                        <button
                          className="btn btn-lg btn-danger px-5 py-2"
                          onClick={() => nextQuestion()}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="d-flex justify-content-center my-5">
                        <button
                          className="btn btn-lg btn-secondary px-5 py-2"
                          onClick={() => endPoll()}
                        >
                          End Polling
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Question;
