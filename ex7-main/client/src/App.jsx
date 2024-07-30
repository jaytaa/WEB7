import React, { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editItemId, setEditItemId] = useState(null);
  const [editItemName, setEditItemName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("https://ex7-server.vercel.app/api/data");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddItem = async () => {
    if (newItem.trim() === "") {
      alert("Item name cannot be empty");
      return;
    }

    try {
      const response = await fetch("https://ex7-server.vercel.app/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newItem }),
      });
      const result = await response.json();
      setData([...data, result]);
      setNewItem("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleEditItem = async () => {
    if (editItemName.trim() === "") {
      alert("Item name cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `https://ex7-server.vercel.app/api/data/${editItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editItemName }),
        }
      );
      const result = await response.json();
      setData(data.map((item) => (item.id === editItemId ? result : item)));
      setEditItemId(null);
      setEditItemName("");
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await fetch(`https://ex7-server.vercel.app/api/data/${id}`, {
        method: "DELETE",
      });
      setData(data.filter((item) => item.id !== id));
      if (editItemId === id) {
        setEditItemId(null);
        setEditItemName("");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Current Tasks</h1>
        <ul className="space-y-4">
          {data.map((item) => (
            <li
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <span className="text-lg">{item.name}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className={`py-1 px-3 rounded text-white ${
                    editItemId === item.id
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                  disabled={editItemId === item.id}
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setEditItemId(item.id);
                    setEditItemName(item.name);
                  }}
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">Add New Item</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="flex-1 border border-gray-300 p-2 rounded-lg"
              placeholder="Enter item name"
            />
            <button
              onClick={handleAddItem}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>
        </div>
        {editItemId && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-2">Edit Item</h2>
            <div className="flex space-x-4">
              <input
                type="text"
                value={editItemName}
                onChange={(e) => setEditItemName(e.target.value)}
                className="flex-1 border border-gray-300 p-2 rounded-lg"
                placeholder="Edit item name"
              />
              <button
                onClick={handleEditItem}
                className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
