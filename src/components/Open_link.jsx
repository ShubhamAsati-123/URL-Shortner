import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { getDocs, query, where, collection } from "firebase/firestore";

const Open_link = () => {
  const { short } = useParams();
  const [originalURL, setOriginalURL] = useState("Loading..."); // Initial loading state
  const urlCollection = collection(db, "urls_shortner");

  useEffect(() => {
    const fetchData = async () => {
      const q = query(urlCollection, where("shortURL", "==", short));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        setOriginalURL(data.originalURL);

        // Redirect to the original URL
        window.location.href = data.originalURL;
      } else {
        setOriginalURL("URL not found");
      }
    };

    fetchData();
  }, [short]);

  return (
    <div>
      <h1>Original URL</h1>
      <p>{originalURL}</p>
    </div>
  );
};

export default Open_link;
