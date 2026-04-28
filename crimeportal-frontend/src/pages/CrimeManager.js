
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function CrimeManager({ onRefresh }) {
  const API = "http://127.0.0.1:8001";
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    City: "",
    Crime_Description: "",
    Crime_Domain: "",
    Weapon_Used: "",
    Victim_Age: "",
    Victim_Gender: "",
    Case_Closed: "No",
  });

  const loadRecords = async () => {
    const res = await fetch(`${API}/crimes`);
    const data = await res.json();
    setRecords(data);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      City: "",
      Crime_Description: "",
      Crime_Domain: "",
      Weapon_Used: "",
      Victim_Age: "",
      Victim_Gender: "",
      Case_Closed: "No",
    });
  };

  // ADD
  const handleAdd = async () => {
    await fetch(`${API}/crimes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    loadRecords();
    if (onRefresh) onRefresh();
    resetForm();
  };

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`${API}/crimes/${id}`, {
      method: "DELETE",
    });

    loadRecords();
    if (onRefresh) onRefresh();
  };

  // EDIT
  const handleEdit = (row) => {
    setEditId(row.Report_Number || row["Report Number"]);
    setForm({
      City: row.City,
      Crime_Description: row.Crime_Description,
      Crime_Domain: row.Crime_Domain,
      Weapon_Used: row.Weapon_Used,
      Victim_Age: row.Victim_Age,
      Victim_Gender: row.Victim_Gender,
      Case_Closed: row.Case_Closed,
    });
  };

  return (
    <div className="glass-card p-4">

      <h3 className="mb-3">Crime Record Management</h3>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    columnGap: "20px",
    rowGap: "20px",
    marginBottom: "20px"
  }}
>
        <input
        
          placeholder="City"
          value={form.City}
          onChange={(e) =>
            handleChange("City", e.target.value)
          }
        />

        <input
        
          placeholder="Crime Type"
          value={form.Crime_Description}
          onChange={(e) =>
            handleChange("Crime_Description", e.target.value)
          }
        />

        <input
        
          placeholder="Crime Domain"
          value={form.Crime_Domain}
          onChange={(e) =>
            handleChange("Crime_Domain", e.target.value)
          }
        />
          
        <input
          placeholder="Weapon"
          value={form.Weapon_Used}
          onChange={(e) =>
            handleChange("Weapon_Used", e.target.value)
          }
        />

        <input
          placeholder="Victim Age"
          value={form.Victim_Age}
          onChange={(e) =>
            handleChange("Victim_Age", e.target.value)
          }
        />

        <input
          placeholder="Gender"
          value={form.Victim_Gender}
          onChange={(e) =>
            handleChange("Victim_Gender", e.target.value)
          }
        />

      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "15px", alignItems: "center",justifyContent: "center" }}>
        {editId ? (
          <button className="btn btn-warning" style={{ width: "220px" }} >
            Update Disabled 
          </button> 
        ) : (
          <button
            className="btn btn-success"
            style={{ width: "220px" }}
            onClick={handleAdd}
          >
            Add Record
          </button>

          
    )}
    
      <button
          className="btn btn-secondary"
          style={{ width: "220px" }}
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>

      </div>

      <hr />

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>City</th>
            <th>Crime</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {records.slice(0, 15).map((r, i) => (
            <tr key={i}>
              <td>{r.Report_Number || r["Report Number"]}</td>
              <td>{r.City}</td>
              <td>{r.Crime_Description}</td>
              <td>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  className="btn btn-sm btn-primary "
                  onClick={() => handleEdit(r)}
                >
                  Edit
                </button>
              
              
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() =>
                    handleDelete(r.Report_Number || r["Report Number"])
                  }
                >
                  Delete
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}