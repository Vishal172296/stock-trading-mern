import React from 'react';
import Hero from './Hero';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import Universe from './Universe';
import Navbar from '../Navbar';
import Footer from '../Footer';

function ProductPage() {
    return (
        <>
        <Hero/>
        <LeftSection imageURL="media/images/kite.png" productName="Kite" productDescription="Our ultra fast trading platform with streaming market data,advanced charts, an elegant UI,and more. Enjoy the Kite experience seemlessly on your Android  and iOS devices." tryDemo=""
         learnmore=""
        googlePlay="" 
        appStore=""/>
        <RightSection imageURL="media/images/console.png" productName="Console" productDescription=" The central dashboard for your Zerodha account. View your holdings, positions, P&L, and more. Enjoy the Coin experience seemlessly on your Android  and iOS devices."
         learnmore=" "/>
        <LeftSection imageURL="media/images/products-coin.png" productName="Coin" productDescription="Our ultra fast trading platform with streaming market data,advanced charts, an elegant UI,and more. Enjoy the Coin experience seemlessly on your Android  and iOS devices." tryDemo=""
         learnmore=""
        googlePlay="" 
        appStore=""/>
        <RightSection
        imageURL="media/images/products-kiteconnect.png" productName="Kite Connect API" 
        productDescription=" Build powerful trading platforms and applications with our REST-like API. Enjoy the Kite Connect experience seemlessly on your Android  and iOS devices."
         learnmore=" "/>
        <LeftSection imageURL="media/images/varsity.png" productName="Varsity mobile" productDescription="Our intuitive and powerful mobile app for learning and practicing trading strategies." tryDemo=""
         learnmore=""
        googlePlay="" 
        appStore=""/>
        <p className="text-center text-muted mt-5">Want to know more about our technology stack? Check out Zerodha.techblog.</p>
        <Universe/>
        </>
    );
}

export default ProductPage;