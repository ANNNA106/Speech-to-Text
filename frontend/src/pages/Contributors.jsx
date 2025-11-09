// frontend/src/pages/Contributors.jsx
import React from "react";

function Contributors() {
  const group = {
    name: "Design in Loop",
    prof: "Prof - Amar Behra",
    members: [
      { roll: "220191 ", name: "Anya Rajan" },
      { roll: "220136 ", name: "Ananya Baghel" },
      { roll: "221038 ", name: "Shriya Garg" },
       { roll: "220497 ", name: "Kanika Chaturvedi" },
      { roll: "220995 ", name: "Shah Divit" },
    ],
  };

  return (
    <section className="contributors-page">
      <div className="card">
        <h1>Contributors</h1>
        <p className="muted">Done for: <strong>{group.prof}</strong></p>

        <div className="group-card">
          <h3 className="group-name">{group.name}</h3>

          <ul className="member-list">
            {group.members.map((m) => (
              <li key={m.roll} className="member-item">
                <strong className="member-roll">{m.roll}</strong>
                <span className="member-name">{m.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Contributors;
