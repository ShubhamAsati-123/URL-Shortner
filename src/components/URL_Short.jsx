import { useState } from "react";
import { db } from "../config/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaRegCopy } from "react-icons/fa";
import { toast } from "react-toastify";

const URL_Short = () => {
  const [originalURL, setOriginalURL] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [isURLAlreadyExists, setIsURLAlreadyExists] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const urlCollection = collection(db, "urls_shortner");

  const validateForm = () => {
    // Initialize an object to store validation errors
    const errors = {};

    // URL validation
    if (!originalURL.trim()) {
      errors.originalURL = "URL is required";
    }

    // Check if there are any errors
    if (Object.keys(errors).length === 0) {
      return { isValid: true, errors: {} };
    } else {
      return { isValid: false, errors };
    }
  };

  const generateShortURL = async (e) => {
    e.preventDefault();

    const { isValid, errors } = validateForm();

    if (!isValid) {
      setIsURLAlreadyExists(false);
      alert(
        "Please fix the following errors:\n" + Object.values(errors).join("\n")
      );
      return;
    }

    const querySnapshot = await getDocs(urlCollection);
    const existingURLs = querySnapshot.docs.map((doc) => doc.data());

    const isURLAlreadyExists = existingURLs.some(
      (url) => url.originalURL === originalURL
    );

    if (isURLAlreadyExists) {
      setIsURLAlreadyExists(true);
      return;
    }

    // In a real implementation, you would use a proper URL shortening algorithm.
    // For simplicity, we will use a random string as a short URL.
    const short = generateRandomString(6);
    setShortURL(short);

    const newURL = {
      originalURL,
      shortURL: short,
    };

    await addDoc(urlCollection, newURL);

    setOriginalURL("");
    setIsURLAlreadyExists(false);
    setIsCopied(false); // Reset the copied state
  };

  const generateRandomString = (length) => {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const handleCopyToClipboard = () => {
    setIsCopied(true);
    toast.success("Copied to clipboard", {
      position: "bottom-right",
    });
  };

  return (
    <div className="flex justify-center items-center my-8">
      <div className="bg-gray-600 bg-opacity-30 p-8 rounded-3xl text-white">
        <h2 className="text-5xl text-gray-200 text-center font-miso">
          URL Shortener
        </h2>
        <div className="flex flex-col gap-5">
          <form
            onSubmit={generateShortURL}
            className="flex flex-col gap-5 my-10 mx-5"
          >
            <label htmlFor="originalURL">Original URL</label>
            <input
              className="text-base text-black py-1 pl-2 rounded-md"
              type="text"
              placeholder="Original URL"
              value={originalURL}
              onChange={(e) => setOriginalURL(e.target.value)}
            />
            <button
              type="submit"
              className="mt-5 px-5 py-2 bg-gray-400 bg-opacity-[0.4] uppercase rounded-lg hover:bg-red-500"
            >
              Generate Short URL
            </button>
          </form>
        </div>
        {isURLAlreadyExists && (
          <p className="text-red-600 text-center mt-2">
            URL already exists in the database.
          </p>
        )}
        {shortURL && (
          <div className="text-center mt-2 flex justify-center items-center">
            <div className="flex gap-2 items-center justify-center flex-col lg:flex-row">
              Short URL:{" "}
              <div className="flex gap-2 mt-1">
                <div className="border-2  px-2 py-1 rounded-md">
                  {window.location.href}
                  {shortURL}
                </div>
                <CopyToClipboard
                  text={window.location.href + shortURL}
                  onCopy={handleCopyToClipboard}
                >
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer">
                    <FaRegCopy />
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default URL_Short;
