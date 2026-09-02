import React from 'react';

function Hero() {
    return (
         <section className="container-fluid" id="supportHero">
            <div className=" p-4 "  id="supportWrapper">
              <h4 >Support Portal</h4>
              <a href="">Track Tickets</a>
               
            </div>
             <div className="row p-4 "  >
              <div className="col-6 p-4 "> 
                <h1 className="fs-3">Search for an answer or browse help topics to create a ticket</h1>
                <input placeholder="E.g. : how do i activate F&O, why is my order getting rejected."/><br/>
                <ol>
                  <li><a href="">Track opening Account</a></li>
                  <li> <a href="">Track segment activation </a></li>
                  <li><a href="">Intraday margins</a></li>
                  <li><a href="">Kite user manual</a></li>
                  
                </ol>
                
              </div>
              
               <div className="col-6 p-4 ">
                 <h1 className="fs-3">Featured</h1>
                 <ol>
                <li><a href="">Current takeovers and delisting - Janauary 2024</a></li>
                <li><a href="">Latest Intraday leverages- MIS & CO</a></li>
                 </ol>
                  </div>
            </div>
        </section>
    );
}

export default Hero;