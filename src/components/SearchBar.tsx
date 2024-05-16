// @ts-nocheck
import SearchIcon from "../assets/search.svg";

import { UserContext } from "../App";

import { useState, useContext } from "react";

function SearchBar({ handleSearchResults }) {
  const { user, token } = useContext(UserContext);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    setInputValue(e.currentTarget.value);
    if (e.currentTarget.value.trim() != "")
      searchUsers(e.currentTarget.value);
    else {
      handleSearchResults([]);
    }
  }

  async function searchUsers(keyword: string) {
    try {
      const response = await fetch(`https://chathub-backend-v3lv.onrender.com/users/search?keyword=${keyword}`, {
        method: "GET",
        headers : { "Content-Type": "application/json",
                    "Authorization": token,
        }
      });

      const content = await response.json();
      const filteredContent = content.filter((u) => u._id !== user._id);
      console.log(filteredContent);
      handleSearchResults(filteredContent);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex justify-between gap-1 p-2 h-12 w-96 phone:w-80 bg-neutral-800 rounded">
      <input onChange={handleChange} value={inputValue} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder="Search users..." className="p-2 grow bg-transparent outline-none text-white group"></input>
      <img src={SearchIcon} className={`w-7 invert ${isFocused && inputValue ? "opacity-85" : "opacity-50"} hover:opacity-85 hover:cursor-pointer`}></img>
    </div>
  )
}

export default SearchBar;
