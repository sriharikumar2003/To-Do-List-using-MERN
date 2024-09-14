import { useState, useEffect } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);
    const apiUrl = "http://localhost:3001";

    // Editing usage only
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");





    const handleDel = (id) =>{
        if(window.confirm('Are you sure wanna delete this ?')){
            fetch(apiUrl + '/todos/'+id, {
                method : "DELETE"
            })
            .then(()=>{
                const newTodo = todos.filter((item)=>item._id !== id)
                setTodos(newTodo);
            })
        }
    }
    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = (id) => {
        if (editTitle.trim() !== "" && editDescription.trim() !== "") {
            fetch(apiUrl + "/todos/" + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: editTitle, description: editDescription }),
            })
                .then((res) => {
                    if (res.ok) {
                        const updatedTodos = todos.map((item) => {
                            if (item._id === id) {
                                return {
                                    ...item,
                                    title: editTitle,
                                    description: editDescription,
                                };
                            }
                            return item;
                        });
                        setTodos(updatedTodos);
                        setMessage("Item updated Successfully");
                        setTimeout(() => {
                            setMessage("");
                        }, 3000);
                        setEditId(-1); // Reset edit mode
                    } else {
                        setError("Unable to connect, sorry bro");
                        setTimeout(() => {
                            setError("");
                        }, 3000);
                    }
                })
                .catch(() => {
                    setError("Network error or server not reachable");
                    setTimeout(() => {
                        setError("");
                    }, 3000);
                });
        }
    };

    const handleSubmit = () => {
        if (title.trim() !== "" && description.trim() !== "") {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json(); // Parse the response
                    } else {
                        throw new Error("Unable to connect, sorry bro");
                    }
                })
                .then((newTodo) => {
                    setTodos([...todos, newTodo]); // Add new item to the list
                    setTitle(""); // Clear input
                    setDescription("");
                    setMessage("Item added successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                })
                .catch(() => {
                    setError("Network error or server not reachable");
                    setTimeout(() => {
                        setError("");
                    }, 3000);
                });
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            });
    };

    const handleCancel = () => {
        setEditId(-1);
        setEditTitle(""); // Clear edit input fields
        setEditDescription("");
    };

    return (
        <>
            <div className="row p-3 bg-success text">
                <h1>To-do List using MERN</h1>
            </div>
            <div className="row">
                <h3>Add Item</h3>
                {message && <p className="text-success ">{message}</p>}
                <div className="form-group d-flex gap-2">
                    <input
                        className="form-control"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        type="text"
                        placeholder="Enter title"
                    ></input>
                    <input
                        className="form-control"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        type="text"
                        placeholder="Description"
                    ></input>
                    <button className="btn btn-dark" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
                {error && <p className="text-danger">{error}</p>}
                <div className="row mt-3">
                    <h3>Tasks List</h3>
                    <ul className="list-group">
                        {todos.map((item) => (
                            <li
                                key={item._id}
                                className="list-group-item d-flex justify-content-between align-items-center my-2"
                            >
                                <div className="d-flex flex-column">
                                    {editId === -1 || editId !== item._id ? (
                                        <>
                                            <span className="fw-bold">{item.title}</span>
                                            <span>{item.description}</span>
                                        </>
                                    ) : (
                                        <div>
                                            <div className="form-group d-flex gap-2">
                                                <input
                                                    className="form-control"
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    value={editTitle}
                                                    type="text"
                                                    placeholder="Enter title"
                                                ></input>
                                                <input
                                                    className="form-control"
                                                    onChange={(e) =>
                                                        setEditDescription(e.target.value)
                                                    }
                                                    value={editDescription}
                                                    type="text"
                                                    placeholder="Description"
                                                ></input>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex gap-2">
                                    {editId === -1 || editId !== item._id ? (
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleUpdate(item._id)}
                                        >
                                            Update
                                        </button>
                                    )}
                                    {editId === -1 ? (
                                        <button className="btn btn-danger" onClick={()=>handleDel(item._id)}>Delete</button>
                                    ) : (
                                        <button className="btn btn-danger" onClick={handleCancel}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
