import React from 'react';

function Team() {
    return (
        <div className="container">
            <div className="row p-3 mt-5 mb-5 border-top">
                <h1 className="text-center">
                    People</h1>
            </div>
             <div className="row p-3 text-muted" style={{lineHeight: "1.8", fontsize: "1.2em"}}>
             <div className="col-6 p-3 text-center">
               <img src="media/images/VISHAL.png" style={{ borderRadius:"100%" , width: "50%"}}/>
               <h4 className="mt-4">Vishal Kumar</h4>
               <h6>(Software Developer)</h6>
             </div>
             <div className="col-6 p-3">
               <p>I'm Vishal Kumar, a final year engineering student.I have been passionate about technology and finance since my early years.</p>
               <p>I created Zerodha website to provide a platform for people to learn about investing and trading in the stock market. My goal is to make investing accessible to everyone, regardless of their background or experience level.</p>

<p>People across the world can use Zerodha to learn about investing and trading, and I hope to empower them to take control of their financial future.</p>
            </div>
        </div>
        </div>
    );
}

export default Team;