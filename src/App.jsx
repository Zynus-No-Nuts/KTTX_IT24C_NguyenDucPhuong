import { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Go to supermarket", status: "In-progress" },
    { id: 2, text: "Do my homework", status: "Done" },
    { id: 3, text: "Play game", status: "In-progress" },
  ]);

  const [filter, setFilter] = useState("All");
  const [searchKey, setSearchKey] = useState("");
  const [modalType, setModalType] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleOpenModal = (type, todo = null) => {
    setModalType(type);
    setSelectedTodo(todo);
    setError("");
    if (type === "update" && todo) {
      setInputValue(todo.text);
    } else {
      setInputValue("");
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedTodo(null);
    setInputValue("");
  };

  const executeAction = () => {
    if (modalType === "create") {
      // YÊU CẦU 3: Kiểm tra input trống
      if (!inputValue.trim()) {
        setError("Please enter todo name!!"); // Sẽ kích hoạt bôi đỏ CSS qua class
        return;
      }

      // YÊU CẦU 4: Tạo todo mới ở DƯỚI CÙNG của list và tắt dialog
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        status: "In-progress",
      };
      setTodos([...todos, newTodo]); // Spread operator giúp thêm vào cuối mảng
      handleCloseModal(); // YÊU CẦU 5: Tắt dialog
    } else if (modalType === "update") {
      if (!inputValue.trim()) {
        setError("Please enter todo name!!");
        return;
      }
      setTodos(
        todos.map((t) =>
          t.id === selectedTodo.id ? { ...t, text: inputValue } : t,
        ),
      );
      handleCloseModal();
    } else if (modalType === "delete") {
      setTodos(todos.filter((t) => t.id !== selectedTodo.id));
      handleCloseModal();
    }
  };
  const toggleStatus = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Done" ? "In-progress" : "Done" }
          : t,
      ),
    );
  };

  const filteredData = todos.filter((t) => {
    const isMatchedSearch = t.text
      .toLowerCase()
      .includes(searchKey.toLowerCase());
    const isMatchedFilter = filter === "All" || t.status === filter;
    return isMatchedSearch && isMatchedFilter;
  });

  return (
    <div className="container">
      <div className="todo-card">
        <h1 className="title">TODO</h1>
        <div className="search-group">
          <input
            placeholder="Input search key"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button
            className="btn-create-main"
            onClick={() => handleOpenModal("create")}
          >
            Create
          </button>
        </div>

        <div className="filter">
          {["All", "Done", "In-progress"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ... các phần Search và Filter giữ nguyên ... */}

        <ul className="todo-list">
          {/* YÊU CẦU 1 & 2: Kiểm tra nếu có dữ liệu thì map, nếu không thì hiện thông báo */}
          {filteredData.length > 0 ? (
            filteredData.map((todo) => (
              <li key={todo.id}>
                <span
                  className={`text-todo ${todo.status === "Done" ? "completed" : ""}`}
                  onClick={() => toggleStatus(todo.id)}
                >
                  {todo.text}
                </span>
                <div className="actions">
                  <button
                    className="btn-del"
                    onClick={() => handleOpenModal("delete", todo)}
                  >
                    🗑
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => handleOpenModal("update", todo)}
                  >
                    📝
                  </button>
                </div>
              </li>
            ))
          ) : (
            // Hiển thị message khi không tìm thấy kết quả phù hợp
            <div className="no-result">No search found</div>
          )}
        </ul>
      </div>

      {/* --- MODAL SYSTEM - Đặt ở cuối cùng --- */}
      {modalType && (
        <div className="overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              {modalType === "create"
                ? "Create New"
                : modalType === "update"
                  ? "Update"
                  : "Delete"}
            </h3>

            {modalType !== "delete" ? (
              <>
                <input
                  // YÊU CẦU 3: Bôi đỏ input khi có lỗi (dùng class input-error)
                  className={error ? "input-error" : ""}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (e.target.value) setError(""); // Xóa lỗi khi bắt đầu nhập
                  }}
                  // YÊU CẦU 2: Tự động đặt con trỏ chuột khi mở
                  autoFocus
                  placeholder="Enter todo..."
                />
                {/* YÊU CẦU 3: Hiển thị message lỗi */}
                {error && <p className="error-text">{error}</p>}
              </>
            ) : (
              <p>Are you sure?</p>
            )}

            <div className="modal-footer">
              <button className="btn-confirm" onClick={executeAction}>
                Confirm
              </button>
              {/* YÊU CẦU 5: Nút close/cancel tắt dialog */}
              <button className="btn-cancel" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
