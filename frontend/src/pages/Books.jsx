import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function BooksPage() {
  const [books, setBooks] = useState([]);

  // Dummy fetch simulation
  useEffect(() => {
    const fetchBooks = async () => {
      // Replace this with a real API call later
      const dummyBooks = [
        {
          id: 1,
          title: "Atomic Habits",
          author: "James Clear",
          cover: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=500&q=80",
        },
        {
          id: 3,
          title: "The Psychology of Money",
          author: "Morgan Housel",
          cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
        },
      ];
      setBooks(dummyBooks);
    };
    fetchBooks();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-25">
        <h1 className="text-3xl font-bold mb-10 text-center">Available Books</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white/10 border border-white/20 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm hover:scale-[1.03] transition-transform"
            >
              <img src={book.cover} alt={book.title} className="w-full h-60 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{book.title}</h3>
                <p className="text-white/70 text-sm">by {book.author}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-16 text-center text-white/80 text-[25px] font-medium">
          📚 More books are coming soon. Stay tuned!
        </p>
      </div>
    </>
  );
}