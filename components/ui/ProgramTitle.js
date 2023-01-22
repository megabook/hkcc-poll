const ProgramTitle = (props) => {
  const { title, date, status } = props;

  const style = (status) => {
    let classes;
    if (status == "Active") {
      classes == "bg-success badge";
    } else {
      classes == "bg-secondary badge";
    }

    return classes;
  };

  return (
    <>
      <div className="text-center bg-danger text-white py-3 mb-3 shadow-sm">
        <h1>{title}</h1>
        <div className="container">
          <div className="d-flex justify-content-end py-5">
            {status && <span className={style}>{status}</span>}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramTitle;
