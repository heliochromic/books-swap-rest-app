const RequestToMe = ({ request }) => {

    console.log(request)
    return (
        <div className="card">
            <div className="card-header">
                Request {request.requestID}
            </div>
            <div className="card-body">
                <h5 className="card-title">Request Details</h5>
                <p className="card-text">
                    Sender Book ID: {request.sender_book ? request.sender_book.title : "N/A"} |
                    Receiver Book ID: {request.receiver_book ? request.receiver_book.title : "N/A"}
                </p>
            </div>
        </div>
    );
};

export default RequestToMe;
