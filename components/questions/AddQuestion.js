import { useState } from "react";

import { db } from "firebases";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

const addQuestion = async (poll_id, data) => {
  event.stopPropagation();
  event.preventDefault();
  try {
    await setDoc(
      doc(db, "hkcc_polling", poll_id, "questions", data.question_id),
      {
        question_id: data.question_id,
        question_order: Number(data.question_order),
        question_title: data.question_title,
        question_subtitle: data.question_subtitle
          ? data.question_subtitle
          : null,
        options: data.options,
        answer: data.answer,
        poll_id: poll_id,
        isOpen: false,
      }
    );
    alert("added");
  } catch (err) {
    alert(err);
    console.log(err);
  }
};

const AddQuestion = (props) => {
  const { poll_id, setMode, mode, setEditQ, editQ } = props;
  const [formData, setFormData] = useState(
    mode == "edit"
      ? editQ
      : {
          options: ["", "", "", "", ""],
        }
  );

  function handleChange(e) {
    e.preventDefault();
    setFormData((state) => ({ ...state, [e.target.name]: e.target.value }));
  }

  function handleOptionChange(e, i) {
    e.preventDefault();
    let newOptions = [];
    formData.options.map((opt, index) => {
      let newOpt;
      index == i ? (newOpt = e.target.value) : (newOpt = opt);
      newOptions.push(newOpt);
    });
    setFormData({ ...formData, options: newOptions });
  }

  function setAnser(e, i) {
    e.preventDefault();
    setFormData({ ...formData, answer: i });
  }

  function delOption(e, i) {
    e.preventDefault();
    let newOptions = [];
    formData.options.map((item, index) => {
      if (index != i) {
        newOptions.push(item);
      }
    });
    setFormData({ ...formData, options: newOptions });
  }

  function onSubmit(e) {
    e.preventDefault();
    addQuestion(poll_id, formData);
    setFormData({
      options: ["", "", "", "", ""],
    });
    setMode('new')
  }

  return (
    <div>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="card mb-3">
          <div className="card-header">
            {mode == "edit" ? "Edit" : "New"} Question
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="title">Question ID</label>
                  <input
                    type="text"
                    name="question_id"
                    placeholder=""
                    className="form-control"
                    value={formData.question_id}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="question_order">Question Order</label>
                  <input
                    id="question_order"
                    type="number"
                    min={1}
                    name="question_order"
                    className="form-control"
                    value={formData.question_order}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="mb-3">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="question_title"
                    placeholder="Question Title"
                    className="form-control"
                    value={formData.question_title}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="mb-3">
                  <label htmlFor="subtitle">Subtitle</label>
                  <input
                    id="subtitle"
                    type="text"
                    name="question_subtitle"
                    placeholder="Question Subtitle"
                    className="form-control"
                    value={formData.subtitle}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="mb-3">
                  <label htmlFor="subtitle">Options</label>

                  {formData.options.map((opt, i) => (
                    <div className="input-group mb-1" key={i}>
                      <span className="input-group-text" id="basic-addon1">
                        {i + 1}
                      </span>
                      <input
                        id={i}
                        type="text"
                        name="option"
                        value={opt}
                        placeholder="Option..."
                        className="form-control"
                        onChange={(e) => handleOptionChange(e, i)}
                      />

                      {formData.answer == i ? (
                        <button
                          className="btn btn-success mx-1"
                          disabled
                          // onClick={(e) => setAnser(e, i)}
                        >
                          Answer
                        </button>
                      ) : (
                        <button
                          className="btn btn-danger mx-1"
                          onClick={(e) => setAnser(e, i)}
                        >
                          Set as Answer
                        </button>
                      )}

                      <button
                        className="btn btn-secondary"
                        onClick={(e) => delOption(e, i)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card-footer d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddQuestion;
