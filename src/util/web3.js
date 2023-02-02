import Web3 from "web3";

if (location.protocol === "http:" && process.env.NODE_ENV === "production") {
  location.replace(
    `https:${location.href.substring(location.protocol.length)}`
  );
}

// Web3 - класс, который мы импортировали с библиотекой web3
export function checkAndInstantiateWeb3() {
  try {
    return new Web3(window.ethereum);
  } catch (e) {
    console.error(e);
    return null;
  }
}
