import Link from "next/link";

const QuestionList = (props) => {
  const { questions, answers } = props;

  const questionReplied = (question_id) => {
    const selected = answers.filter((item) => item.question_id === question_id);
    return selected;
  };

  return (
    <>
      {questions.map((question, i) => {
        const userAnswers = questionReplied(question.question_id);

        const totalAnswers = userAnswers.length;
        return (
          <div className="card mb-3 p-3" key={i}>
            <div className="row">
              <div className="col-10">
                {/* <span className="badge bg-danger">
                  {question.question_order}
                </span> */}
                <h5>{question.question_title}</h5>
                <h6>{question.question_subtitle}</h6>
                <p className="d-flex justify-content-end text-muted">Total response: {totalAnswers}</p>
              </div>
            </div>


            <ul className="list-group">
              {question.options.map((opt, key) => {
                const selectedQty = userAnswers.filter(
                  (item) => Number(item.answer) === key
                ).length;
                const percentage = (selectedQty / totalAnswers) * 100;
                let color
                if(question.answer == key) {
                  color = "progress-bar progress-bar-striped bg-success"
                } else {
                  color = "progress-bar progress-bar-striped bg-warning"
                }


                return (
                  <li className="list-group-item" key={key}>
                    <div className="row">
                      <div className="col-6">
                        {opt}
                        {question.answer == key && (
                          <small className="badge bg-success ml-5">
                            Answer
                          </small>
                        )}
                      </div>
                      <div className="col-6">
                        <div className="progress">
                          <div
                            className={color}
                            role="progressbar"
                            style={{ width: `${percentage}%` }}
                            aria-valuenow={percentage}
                          >
                            {selectedQty}
                            {selectedQty != 0 && <> ({percentage}%) </>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
};

export default QuestionList;
