import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

//firebase
import { db } from "firebases";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import SingleQuestion from "@/components/poll/Question";
import ProgramTitle from "@/components/ui/programTitle";

const updateQStatus = async (poll_id, question_id) => {
  event.stopPropagation();
  event.preventDefault();
  console.log(question_id);
  try {
    const docRef = doc(db, "hkcc_polling", poll_id, "questions", question_id);
    await updateDoc(docRef, {
      isOpen: true,
    });
    console.log("updated");
  } catch (err) {
    console.log("failed");

    console.log(err);
  }
};

const updatePollStatus = async (poll_id, status) => {
  event.stopPropagation();
  event.preventDefault();
  try {
    const docRef = doc(db, "hkcc_polling", poll_id, question_id);
    await updateDoc(docRef, {
      poll_status: status,
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

const PollScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [poll, setPoll] = useState(null);

  const [isStartedPoll, setIsStartedPoll] = useState(false);
  const [curQuestion, setCurQuestion] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [pollId, setPollId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const poll_id = router.query.id + "";

    setPollId(poll_id);
    const q = query(
      collection(db, "hkcc_polling", poll_id, "questions"),
      where("poll_id", "==", poll_id)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allQuestions = [];
      // console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        allQuestions.push(doc.data());
      });
      setQuestions(allQuestions);
    });

    const fetchPoll = async () => {
      const docRef = doc(db, "hkcc_polling", poll_id);

      const docSnap = onSnapshot(doc(db, "hkcc_polling", poll_id), (doc) => {
        setPoll(doc.data());
      });
    };

    fetchPoll().catch(console.error);
  }, [router.isReady]);

  const startPoll = () => {
    const q = questions.find((item) => item.question_order === 1);
    if (q == undefined) {
      setErrMsg("something went wrong");
    } else {
      updatePollStatus(pollId, "Active", q.question_id);
      updateQStatus(pollId, q.question_id);
      setCurQuestion(q);
    }

    setIsStartedPoll(true);
  };

  const endPoll = (status) => {
    if (updatePollStatus(pollId, status) == true) {
      router.push("/questions/" + pollId);
    }
  };

  return (
    <div>
      <ProgramTitle
        title={poll ? poll.program_title : ""}
        status={poll ? poll.poll_status : ""}
      />
      <div className="container mt-1">
        <div className="d-flex justify-content-end align-items-center">
          <div className="btn-group">
            <Link href={"/questions/" + pollId} legacyBehavior>
              <a className="btn btn-outline-secondary">Back</a>
            </Link>

            <button
              className="btn btn-outline-secondary"
              onClick={() => endPoll("End")}
            >
              End Polling
            </button>
          </div>
        </div>
      </div>

      <div className="container p-3">
        {isStartedPoll == false ? (
          <>
            <div className="d-flex justify-content-center mt-5">
              <button
                className="btn btn-lg btn-danger p-5"
                onClick={() => startPoll()}
              >
                <h1>Start Polling</h1>
              </button>

              {errMsg && <h6>{errMsg}</h6>}
            </div>
          </>
        ) : (
          <>
            <SingleQuestion
              question={curQuestion}
              setCurQuestion={setCurQuestion}
              poll_id={pollId}
              duration={poll.time_per_question}
              allQuestions={questions}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PollScreen;
