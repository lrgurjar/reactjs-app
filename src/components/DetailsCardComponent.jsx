function DetailsCardComponent({ email, sn, userN }) {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <h5 className="card-title">
          {sn}. {userN}
        </h5>
        <p className="card-text">{email}</p>
      </div>
    </div>
  );
}

export default DetailsCardComponent;
