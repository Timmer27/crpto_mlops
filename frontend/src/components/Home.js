import React from 'react';
import styles from '../css/Home.module.css';
import Header from './Header';

function Home() {
  return (
    <div className={styles.home}>
      <Header />
      <div className="d-flex justify-content-center">
        {/* <BotList /> */}
      </div>
      <hr />
      {/* <img alt="Freqtrade logo" src="../assets/freqtrade-logo.png" width="450px" className="my-5" /> */}
      <div title="Freqtrade logo" className={`${styles.logoSvg} my-5 mx-auto`}></div>
      <div>
        <h1>Welcome to the Freqtrade UI</h1>
      </div>
      <div>This page allows you to control your trading bot.</div>
      <br />
      <p>
        If you need any help, please refer to the{' '}
        <a href="https://www.freqtrade.io/en/latest/">Freqtrade Documentation</a>.
      </p>
      <p>Have fun - <i>wishes you the Freqtrade team</i></p>
    </div>
  );
}

export default Home;
