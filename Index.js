import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [iceCreamPrice, setIceCreamPrice] = useState(undefined);
  const [newIceCreamPrice, setNewIceCreamPrice] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // Accounts now exposed
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
    } catch (error) {
      console.error(error);
    }
  };

  const getATMContract = () => {
    if (ethWallet) {
      const provider = new ethers.providers.Web3Provider(ethWallet);
      const signer = provider.getSigner();
      const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
      setATM(atmContract);
    }
  };

  const getBalance = async () => {
    if (atm && account) {
      const balance = await atm.getBalance();
      setBalance(balance.toNumber());
    }
  };

  const getIceCreamPrice = async () => {
    if (atm) {
      const price = await atm.getIceCreamPrice();
      setIceCreamPrice(price.toNumber());
    }
  };

  const setIceCreamPriceHandler = async () => {
    if (atm && newIceCreamPrice && account) {
      try {
        const tx = await atm.setIceCreamPrice(ethers.utils.parseUnits(newIceCreamPrice, "wei"));
        await tx.wait();
        getIceCreamPrice();
        setNewIceCreamPrice("");
      } catch (error) {
        console.error("Error setting ice cream price:", error);
      }
    }
  };

  const buyIceCream = async () => {
    if (atm && account) {
      try {
        const tx = await atm.buyIceCream();
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Error buying ice cream:", error);
      }
    }
  };

  const deposit = async () => {
    if (atm && account) {
      try {
        const tx = await atm.deposit({ value: ethers.utils.parseEther("1") });
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Error depositing ETH:", error);
      }
    }
  };

  const withdraw = async () => {
    if (atm && account) {
      try {
        const tx = await atm.withdraw(ethers.utils.parseEther("1"));
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Error withdrawing ETH:", error);
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this application.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Connect MetaMask</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    if (iceCreamPrice === undefined) {
      getIceCreamPrice();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <p>Ice Cream Price: {iceCreamPrice}</p>
        <input
          type="text"
          placeholder="Set new ice cream price in wei"
          value={newIceCreamPrice}
          onChange={(e) => setNewIceCreamPrice(e.target.value)}
        />
        <button onClick={setIceCreamPriceHandler}>Set Ice Cream Price</button>
        <button onClick={buyIceCream}>Buy Ice Cream</button>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (ethWallet) {
      getATMContract();
    }
  }, [ethWallet]);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Devyanshika's Ice Cream Parlor!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
