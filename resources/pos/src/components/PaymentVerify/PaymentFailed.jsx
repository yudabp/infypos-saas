import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import paymentFailed from "../../assets/images/paymentFailed.png";
import { getFormattedMessage } from "../../shared/sharedMethod";

const PaymentFailed = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get("status");

    const [redirectSeconds, setRedirectSeconds] = useState(
        JSON.parse(localStorage.getItem("redirectSeconds")) || 10
    );

    useEffect(() => {
        if (status === null || status === "" || JSON.parse(status) !== false) {
            navigate("/manage-subscription");
        }
    }, []);

    useEffect(() => {
        let redirectInterval;
        if (redirectSeconds >= 0) {
            localStorage.setItem(
                "redirectSeconds",
                JSON.stringify(redirectSeconds)
            );
            redirectInterval = setInterval(() => {
                setRedirectSeconds((prev) => prev - 1);
            }, 1000);
        } else {
            redirectInterval && clearInterval(redirectInterval);
            localStorage.removeItem("redirectSeconds");
            navigate("/user/manage-subscription");
        }

        return () => redirectInterval && clearInterval(redirectInterval);
    }, [redirectSeconds]);

    return (
        <div className="d-flex align-items-center justify-content-center h-100 bg-white">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div>
                            <div>
                                <div className="text-center">
                                    <img
                                        src={paymentFailed} alt="paymentFailed"
                                        className="img-fluid"
                                    />
                                    <h1>
                                        {getFormattedMessage(
                                            "payment-unsuccessul.title"
                                        )}
                                    </h1>
                                    <Link
                                        to={"/manage-subscription"}
                                        onClick={() =>
                                            localStorage.removeItem(
                                                "redirectSeconds"
                                            )
                                        }
                                        className="btn btn-danger"
                                    >
                                        <span>
                                            {getFormattedMessage(
                                                "try-again.title"
                                            )}
                                        </span>
                                    </Link>
                                    <p className="mt-3 text-muted">
                                        {getFormattedMessage(
                                            "redirect-dashboard-message.title"
                                        )}{" "}
                                        {redirectSeconds}{" "}
                                        {getFormattedMessage("seconds.title")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
