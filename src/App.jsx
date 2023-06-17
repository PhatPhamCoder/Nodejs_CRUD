import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import instance from "./axiosConfig";
// import axios from "axios";
function App() {
  const [account, setAccount] = useState();
  const [password, setPassword] = useState();

  instance.setLocalStorage = async (token, userId, refreshToken) => {
    window.localStorage.setItem("accessToken", token);
    window.localStorage.setItem("ID", userId);
    window.localStorage.setItem("refreshToken", refreshToken);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const {
      data: { accessToken, userId, refreshToken },
      result,
    } = await login();
    // console.log("check data Login", data);
    if (result === true) {
      await instance.setLocalStorage(accessToken, userId, refreshToken);
    }
  };

  async function login() {
    const dataLogin = {
      account: account,
      password: password,
    };
    return (await instance.post(`/login`, dataLogin)).data;
  }

  async function getUsers() {
    // return (await instance.get("/getall?limit=10")).data;
    return (await instance.get("/getbyid/14")).data;
  }

  const handleGetList = async (e) => {
    e.preventDefault();
    const { data } = await getUsers();
    console.log(data);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="max-h-screen flex items-center justify-center">
        <form className="my-5 border p-5 w-[400px] rounded-lg">
          <h2 className="text-center font-bold text-2xl text-red-500">
            Đăng nhập tài khoản
          </h2>
          <div className="flex flex-col my-3">
            <label className="mb-3">Tài khoản</label>
            <input
              type="text"
              placeholder="Nhập tên tài khoản"
              className="outline-none p-2 outline-blue-600 rounded-lg hover:outline-teal-400"
              onChange={(e) => setAccount(e.target.value)}
            />
          </div>
          <div className="flex flex-col my-3">
            <label className="mb-3">Mật khẩu</label>
            <input
              type="text"
              placeholder="Nhập mật khẩu"
              className="outline-none p-2 outline-blue-600 rounded-lg hover:outline-teal-400"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-100 flex">
            <button
              className="rounded-xl p-2 mx-auto w-[100px] text-xl bg-teal-300 hover:bg-red-500 text-white text-center font-bold"
              onClick={(e) => handleLogin(e)}
            >
              Login
            </button>
            <button
              className="rounded-xl p-2 mx-auto w-[100px] text-xl hover:bg-teal-300 bg-red-500 text-white text-center font-bold"
              onClick={(e) => handleGetList(e)}
            >
              Get List
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
