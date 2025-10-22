// // frontend/src/utils/bookLookup.js
// import axios from "axios";

// /**
//  * Lookup book info by ISBN/barcode from Open Library API
//  */
// export const fetchBookInfoByBarcode = async (barcode) => {
//   try {
//     const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${barcode}&jscmd=data&format=json`;
//     const { data } = await axios.get(url);

//     const bookData = data[`ISBN:${barcode}`];
//     if (!bookData) return null;

//     return {
//       title: bookData.title || "",
//       author:
//         bookData.authors && bookData.authors.length
//           ? bookData.authors.map((a) => a.name).join(", ")
//           : "",
//       cover: bookData.cover?.medium || "",
//     };
//   } catch (err) {
//     console.error("OpenLibrary lookup error:", err);
//     return null;
//   }
// };


// frontend/src/utils/bookLookup.js
import axios from "axios";

export const fetchBookInfoByBarcode = async (barcode) => {
  try {
    const res = await axios.get(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${barcode}&format=json&jscmd=data`
    );

    const bookData = res.data[`ISBN:${barcode}`];
    if (!bookData) return null;

    return {
      title: bookData.title || "",
      author: bookData.authors ? bookData.authors[0]?.name : "",
    };
  } catch (err) {
    console.error("Error fetching from Open Library:", err);
    return null;
  }
};
