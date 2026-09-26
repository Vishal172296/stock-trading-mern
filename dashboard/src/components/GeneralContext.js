import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";
import StockChartModal from "./StockChartModal";
import AiInsightsModal from "./AiInsightsModal";

const GeneralContext = React.createContext({
  openBuyWindow: (stock) => {},
  closeBuyWindow: () => {},
  openSellWindow: (stock) => {},
  closeSellWindow: () => {},
  openStockChart: (stock) => {},
  closeStockChart: () => {},
  openAiAnalysis: (stock) => {},
  closeAiAnalysis: () => {},
  triggerRefresh: () => {},
  portfolioVersion: 0,
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [portfolioVersion, setPortfolioVersion] = useState(0);

  const handleOpenBuyWindow = (stock) => {
    setSelectedStock(stock);
    setIsBuyWindowOpen(true);
    setIsSellWindowOpen(false);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
  };

  const handleOpenSellWindow = (stock) => {
    setSelectedStock(stock);
    setIsSellWindowOpen(true);
    setIsBuyWindowOpen(false);
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);
  };

  const handleOpenStockChart = (stock) => {
    setSelectedStock(stock);
    setIsChartOpen(true);
  };

  const handleCloseStockChart = () => {
    setIsChartOpen(false);
  };

  const handleOpenAiAnalysis = (stock) => {
    setSelectedStock(stock);
    setIsAiModalOpen(true);
  };

  const handleCloseAiAnalysis = () => {
    setIsAiModalOpen(false);
  };

  const triggerRefresh = () => {
    setPortfolioVersion((prev) => prev + 1);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,
        openStockChart: handleOpenStockChart,
        closeStockChart: handleCloseStockChart,
        openAiAnalysis: handleOpenAiAnalysis,
        closeAiAnalysis: handleCloseAiAnalysis,
        triggerRefresh,
        portfolioVersion,
      }}
    >
      {props.children}

      {isBuyWindowOpen && <BuyActionWindow uid={selectedStock} />}
      {isSellWindowOpen && <SellActionWindow uid={selectedStock} />}
      {isChartOpen && (
        <StockChartModal
          stock={selectedStock}
          onClose={handleCloseStockChart}
        />
      )}
      {isAiModalOpen && (
        <AiInsightsModal
          stock={selectedStock}
          onClose={handleCloseAiAnalysis}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
