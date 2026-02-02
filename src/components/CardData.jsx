import React from "react";
import "../styles/CardData.css";
import SelfText from "./SelfText";
import BillingTable from "./BillingTable";

function CardData({ imageUrl }) {
  const userId = Number(localStorage.getItem("user_id"));
  return (
    <div>
      <div className="main-box">
          <div className="imageBox">
          {imageUrl ? (
              <img src={imageUrl} alt="preview" />
          ) : (
              <span className="placeholder">No image</span>
          )}
          </div>
          <SelfText user_id = {userId}/>
      </div>
      <div className="billing-area">
        <BillingTable user_id = {userId}/>
      </div>
    </div>
  );
}

export default CardData;
