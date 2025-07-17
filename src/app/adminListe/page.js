'use client'

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminListe() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [authenticated, setAuthenticated] = useState(true);
  const [error, setError] = useState("");

  const [selectedPR, setSelectedPR] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

  // Load events after auth
  useEffect(() => {
    if (!authenticated) return;

    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        setError("");
        const snapshot = await getDocs(collection(db, "events"));
        const eventsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsList);
      } catch (err) {
        setError("Failed to load events.");
        console.error(err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [authenticated]);

  // Load attendees when event selected
  useEffect(() => {
    if (!selectedEventId) {
      setAttendees([]);
      setSelectedPR("All");
      return;
    }

    const fetchAttendees = async () => {
      try {
        setLoadingAttendees(true);
        setError("");
        const snapshot = await getDocs(collection(db, "events", selectedEventId, "attendees"));
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAttendees(list);
        setSelectedPR("All");
      } catch (err) {
        setError("Failed to load attendees.");
        console.error(err);
      } finally {
        setLoadingAttendees(false);
      }
    };

    fetchAttendees();
  }, [selectedEventId]);

  if (!authenticated) {
    return (
      <main className="p-12 text-white min-h-screen bg-black flex items-center justify-center">
        <p>Unauthorized</p>
      </main>
    );
  }

  return (
    <main className="p-8 min-h-screen bg-black text-white max-w-5xl mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-8 text-center mt-10">🎟️ Admin Panel - Event Lists</h1>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded mb-4">{error}</div>
      )}

      <div className="mb-8">
        <label htmlFor="eventSelect" className="block mb-2 font-semibold text-lg">
          Select Event:
        </label>
        {loadingEvents ? (
          <p>Loading events...</p>
        ) : (
          <select
  id="eventSelect"
  className="w-full px-4 py-2 rounded bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
  value={selectedEventId}
  onChange={e => setSelectedEventId(e.target.value)}
>

            <option value="">-- Select an event --</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.title || ev.id}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedEventId && (
        <>
            <div className="mb-4">
            <label htmlFor="searchInput" className="block mb-2 font-medium">
                Search by name:
            </label>
            <input
                id="searchInput"
                type="text"
                placeholder="Type first or last name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>

            <EventDetails
            attendees={attendees}
            loading={loadingAttendees}
            selectedPR={selectedPR}
            setSelectedPR={setSelectedPR}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            />
        </>
        )}

    </main>
  );
}

function EventDetails({ attendees, loading, selectedPR, setSelectedPR, searchTerm }) {
  // Raggruppa per PR
  const groupedByPR = attendees.reduce((acc, att) => {
    const pr = att.pr || "No PR";
    if (!acc[pr]) acc[pr] = [];
    acc[pr].push(att);
    return acc;
  }, {});

  const allPRs = ["All", ...Object.keys(groupedByPR)];

  // Filtro PR
  let filteredAttendees =
    selectedPR === "All" ? attendees : groupedByPR[selectedPR] || [];

  // Filtro ricerca nome (firstName o lastName, case insensitive)
  if (searchTerm.trim() !== "") {
    const lowerSearch = searchTerm.toLowerCase();
    filteredAttendees = filteredAttendees.filter(
      (a) =>
        (a.firstName && a.firstName.toLowerCase().includes(lowerSearch)) ||
        (a.lastName && a.lastName.toLowerCase().includes(lowerSearch))
    );
  }

  return (
    <section className="bg-neutral-900 p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Attendees List</h2>

      <label htmlFor="prSelect" className="block mb-2 font-medium">
        Filter by PR:
      </label>
      <select
        id="prSelect"
        className="text-black py-2 rounded mb-6 text-white"
        value={selectedPR}
        onChange={e => setSelectedPR(e.target.value)}
      >
        {allPRs.map(pr => (
          <option key={pr} value={pr}>
            {pr}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading attendees...</p>
      ) : filteredAttendees.length === 0 ? (
        <p className="italic text-gray-400">No attendees found.</p>
      ) : (
        <Accordion title={`Showing ${filteredAttendees.length} attendees`}>
          <ul className="space-y-2 max-h-96 overflow-auto">
            {filteredAttendees.map((a, i) => (
              <li
                key={a.id || i}
                className="border-b border-neutral-700 py-2"
                title={`Email: ${a.email}\nPhone: ${a.phone || "N/A"}`}
              >
                <span className="font-semibold">
                  {a.firstName} {a.lastName}
                </span>{" "}
                — {a.phone} — PR: {a.pr || "N/A"}
              </li>
            ))}
          </ul>
        </Accordion>
      )}
    </section>
  );
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-4">
      <button
        className="w-full flex justify-between items-center bg-neutral-800 px-4 py-3 rounded-md text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="mt-2 p-4 bg-neutral-800 rounded-md">{children}</div>}
    </div>
  );
}
