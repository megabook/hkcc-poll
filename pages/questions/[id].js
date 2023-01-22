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
} from "firebase/firestore";

import AddQuestion from "@/components/questions/AddQuestion";
import QuestionList from "@/components/questions/QuestionList";
import ProgramTitle from "@/components/ui/programTitle";

const QuestionScreen = () => {
  const [mode, setMode] = useState("read");
  const [editQ, setEditQ] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [poll, setPoll] = useState(null);
  const [pollId, setPollId] = useState(null);

  const router = useRouter();
  // const poll_id = "150";

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
      const docSnap = await getDoc(docRef).then((docRef) =>
        setPoll(docRef.data())
      );
    };
    fetchPoll().catch(console.error);
  }, [router.isReady]);

  return (
    <div>
      <ProgramTitle
        title={poll ? poll.program_title : ""}
        status={poll ? poll.poll_status : ""}
      />
      <div className="container">
        <div className="d-flex justify-content-end mb-3">
          <div className="btn-group">
            <Link href={"/poll/" + pollId} legacyBehavior>
              <a className="btn btn-outline-secondary">Start Poll</a>
            </Link>
            <Link href={"/result/" + pollId} legacyBehavior>
              <a className="btn btn-outline-secondary">Result</a>
            </Link>
          </div>

          <div className="btn-group">
            <button
              onClick={() => setMode("add")}
              className="btn btn-outline-secondary"
            >
              + New Question
            </button>

            {mode != "read" && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setMode("read")}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {mode != "read" && (
          <AddQuestion
            poll_id={pollId}
            setMode={setMode}
            mode={mode}
            setEditQ={setEditQ}
            editQ={editQ}
          />
        )}
        <QuestionList
          poll_id={pollId}
          setMode={setMode}
          mode={mode}
          setEditQ={setEditQ}
          editQ={editQ}
          questions={questions}
        />
      </div>
    </div>
  );
};

export default QuestionScreen;
