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

import ProgramTitle from "@/components/ui/programTitle";
import QuestionList from "@/components/result/QuestionList";

const ResultScreen = () => {
  const [pollId, setPollId] = useState(null);
  const [poll, setPoll] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

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
      querySnapshot.forEach((doc) => {
        allQuestions.push(doc.data());
      });
      setQuestions(allQuestions);
    });

    const qUserAnsers = query(
      collection(db, "/polling_user_answer", poll_id, "user_answer"),
      where("poll_id", "==", poll_id)
    );

    const unsub = onSnapshot(qUserAnsers, (querySnapshot) => {
      const allAnswers = [];
      querySnapshot.forEach((doc) => {
        allAnswers.push(doc.data());
      });
      setAnswers(allAnswers);
    });

    const fetchPoll = async () => {
      const docRef = doc(db, "hkcc_polling", poll_id);
      const docSnap = onSnapshot(doc(db, "hkcc_polling", poll_id), (doc) => {
        setPoll(doc.data());
      });
    };

    fetchPoll().catch(console.error);
  }, [router.isReady]);

  console.log(answers);

  return (
    <>
      <ProgramTitle
        title={poll ? poll.program_title : ""}
        status={poll ? poll.poll_status : ""}
      />
      <div className="container">
        <div className="d-flex justify-content-end mb-3">
          <Link href={"/questions/" + pollId} legacyBehavior>
            <a className="btn btn-outline-secondary">Back </a>
          </Link>
        </div>
        <QuestionList questions={questions} answers={answers} />
      </div>
    </>
  );
};

export default ResultScreen;
