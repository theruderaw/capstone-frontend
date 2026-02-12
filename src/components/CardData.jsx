import React from "react";
import { useNavigate } from "react-router-dom";
import SelfText from "./SelfText";
import BillingTable from "./BillingTable";

function CardData({ imageUrl ,user_id}) {
  const userId = user_id;
  const navigate = useNavigate()
  return (
    <div className="page-container">
      <div className="content-width">
        <div className="main-box">
          <div className="imageBox">
            {imageUrl ? (
              <img src={imageUrl} alt="preview" />
            ) : (
              <span className="placeholder">No image</span>
            )}
          </div>

          <SelfText user_id={userId} />
        </div>

        <div className="billing-area">
          <BillingTable user_id={userId} onMoreClick={()=>navigate('/reports')} showMoreButton={true}/>
        </div>
      </div>
    </div>
  );
}

export default CardData;
