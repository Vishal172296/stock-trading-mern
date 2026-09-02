import React from 'react';

function Hero() {
    return (
        <div className="container ">
           
             <div className="row p-5 mt-5 border-bottom text-center">
                <h1>Pricing</h1>
                <h3 className="text-muted mt-3 fs-5">Free equity investments and flat rs.20 intraday and F&O trades.</h3></div>
                <div className="row p-5 mt-5">
             <div className="col-4 p-4">
                    <img src="media/images/free-direct.svg"/>
                    <h1 className="fs-3">Free equity delivery</h1>
                    <p className="text-muted">Enjoy free equity delivery with no hidden charges.</p>
                </div>
                <div className="col-4 p-4">
                    <img src="media/images/other-trades.svg"/>
                    <h1 className="fs-3">Intraday and F&O</h1>
                    <p className="text-muted">Flat ₹20 per trade for intraday and F&O options.</p>
                </div>
                <div className="col-4 p-5">
                    <img src="media/images/free-direct.svg"/>   
                    <h1 className="fs-3">Free direct MF</h1>   
                    <p className="text-muted">All direct mutual funds with no hidden charges.</p>
                </div>
            </div>
        </div>

    );
}

export default Hero;