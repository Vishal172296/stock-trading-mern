import React from 'react';

function Brokerage() {
    return (
         <div className="container ">
           
             
                <div className="row p-5 mt-5 border-top"> 
             <div className="col-8 p-4">
                <a href="" style={{textDecoration: "none"}}>
                <h3 className="fs-5 text-center">Brokerage Calculator</h3>
                <ul style={{textAlign: "left", lineHeight: "2.5"}} className="text-muted">
                    <li>MTF Interest: 0.04% per day (₹40 per lakh) on the funded amount. The interest is applied from T+1 day until the day MTF stocks are sold.</li>
<li>MTF Brokerage: 0.3% or Rs. 20/executed order, whichever is lower.</li>
<li>MTF pledge charge: ₹15 + GST per pledge and unpledge request per ISIN.</li>
<li>For a non-PIS account, 0.5% or ₹50 per executed order for equity and F&O (whichever is lower).</li>
<li>For a PIS account, 0.5% or ₹200 per executed order for equity (whichever is lower).</li>
<li>₹500 + GST as yearly account maintenance charges (AMC) charges.</li>
                </ul></a>
                </div>
                <div className="col-4 p-4">
                    <a href="" style={{textDecoration: "none"}}>
                <h3 className="fs-5">List of charges</h3></a>
                </div>
            </div>
        </div>

    );
}

export default Brokerage;