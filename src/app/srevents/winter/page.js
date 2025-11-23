'use client'

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function FormPage() {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    cdl: "",
    pr: "",
    camera: "",
    infoCamera: "",
    partecipanti: "",
    pullman: "",
    infoPullman: "",
    gruppo: "",
    infoGruppo: "",
    convenzione: "",
    noleggio: [],
    infoNoleggio: "",
    universita: "",
    infoExtra: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, multiple, options } = e.target;
    if (multiple) {
      const values = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, noleggio: [...formData.noleggio, value] });
    } else {
      setFormData({
        ...formData,
        noleggio: formData.noleggio.filter((item) => item !== value),
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome) newErrors.nome = "Campo obbligatorio";
    if (!formData.cognome) newErrors.cognome = "Campo obbligatorio";
    if (!formData.email) newErrors.email = "Campo obbligatorio";
    if (!formData.telefono) newErrors.telefono = "Campo obbligatorio";
    if (!formData.cdl) newErrors.cdl = "Campo obbligatorio";
    if (!formData.pr) newErrors.pr = "Campo obbligatorio";
    if (!formData.camera) newErrors.camera = "Campo obbligatorio";
    if (!formData.partecipanti) newErrors.partecipanti = "Campo obbligatorio";
    if (!formData.pullman) newErrors.pullman = "Campo obbligatorio";
    if (!formData.gruppo) newErrors.gruppo = "Campo obbligatorio";
    if (!formData.convenzione) newErrors.convenzione = "Campo obbligatorio";
    if (formData.noleggio.length === 0) newErrors.noleggio = "Seleziona almeno una voce";
    if (!formData.universita) newErrors.universita = "Campo obbligatorio";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setSuccess(false);

    try {
      await addDoc(collection(db, "srevents_courmayeur_2025"), {
        ...formData,
        createdAt: Timestamp.now(),
      });
      setSuccess(true);
      setFormData({
        nome: "",
        cognome: "",
        email: "",
        telefono: "",
        cdl: "",
        pr: "",
        camera: "",
        infoCamera: "",
        partecipanti: "",
        pullman: "",
        infoPullman: "",
        gruppo: "",
        infoGruppo: "",
        convenzione: "",
        noleggio: [],
        infoNoleggio: "",
        universita: "",
        infoExtra: "",
      });
      setErrors({});
    } catch (err) {
      console.error("Errore durante il salvataggio:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
  <main className="h-screen flex items-center justify-center px-6 relative overflow-hidden bg-gradient-to-b from-slate-900 via-black to-slate-950">
    <div className="absolute inset-0">
      <div className="absolute w-[600px] h-[600px] bg-green-500/20 rounded-full blur-3xl top-0 left-0 animate-pulse" />
      <div className="absolute w-[500px] h-[500px] bg-red-500/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse" />
    </div>

    {/* neve più realistica */}
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-90 animate-snow"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${5 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>

    {/* montagne background */}
    <div className="absolute bottom-0 left-0 w-full h-56">
      <svg
        className="absolute bottom-0 w-full h-full text-slate-800"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,160L80,149.3C160,139,320,117,480,133.3C640,149,800,203,960,213.3C1120,224,1280,192,1360,176L1440,160L1440,320L0,320Z"></path>
      </svg>
    </div>

    {/* montagne foreground con neve */}
    <div className="absolute bottom-0 left-0 w-full h-64">
      <svg
        className="absolute bottom-0 w-full h-full text-slate-600"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,256L60,224C120,192,240,128,360,122.7C480,117,600,171,720,186.7C840,203,960,181,1080,186.7C1200,192,1320,224,1380,240L1440,256L1440,320L0,320Z"></path>
      </svg>
    </div>

    <div className="absolute bottom-0 left-0 w-full h-3 rounded-t-3xl bg-white/70 blur-sm" />
      <div className="relative w-full max-w-2xl bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-white overflow-y-auto max-h-screen h-[80vh]">
      <div className="absolute -top-2 left-0 w-full h-3 rounded-t-3xl bg-white/70 blur-sm" />

       <div className="flex items-center gap-4 mx-auto w-[fit-content] mb-4">

        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/logos%2Flogosrevents.jpg?alt=media&token=a71acccc-fdf4-4d7c-a791-9079575bd98f"
            alt="Logo Courmayeur"
            className="w-full h-full object-cover"
          />
        </div>

        <p className="ml-4">X</p>

        <div className="w-30 h-30 rounded-full overflow-hidden shadow-lg">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cleope-80cdc.firebasestorage.app/o/logos%2Flogohu.png?alt=media&token=75b1e739-4993-4143-a8cd-4a2cec8c536a" 
            alt="Logo Courmayeur"
            className="w-full h-full object-cover"
          />
        </div>

       </div>
        <h1 className="text-xl text-center mb-6">
          <strong>🎄 COURMAYEUR</strong> <span className="italic">2025 </span>🎄
        </h1>

        <div className="text-center mb-8">
          <p className="mt-3 text-neutral-200 leading-relaxed">
            We're thrilled to announce the <span className="text-white font-semibold">December Holidays 2025</span>  
            <br />
            <span className="text-green-400 font-bold">December 12th – 14th</span>
          </p>
          <p className="">
             Join us in Courmayeur for an <br></br><span className="text-white font-semibold">unforgettable weekend!</span> ❄️
          </p>
        </div>


        <p></p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dati base */}
          <Input name="nome" placeholder="Name" value={formData.nome} onChange={handleChange} error={errors.nome} />
          <Input name="cognome" placeholder="Surname" value={formData.cognome} onChange={handleChange} error={errors.cognome} />
          <Input name="email" type="email" placeholder="E-mail" value={formData.email} onChange={handleChange} error={errors.email} />
          <Input name="telefono" type="tel" placeholder="Phone Number" value={formData.telefono} onChange={handleChange} error={errors.telefono} />
          <Select name="universita" label="University of affiliation" value={formData.universita} onChange={handleChange} options={["San Raffaele","Humanitas"]} error={errors.universita} />
          <Input name="cdl" placeholder="Degree course of belonging" value={formData.cdl} onChange={handleChange} error={errors.cdl} />

          {/* Chi ti porta */}
          <Input name="pr" placeholder="Who's bringing you here? (Name and Surname of PR/Representative)" value={formData.pr} onChange={handleChange} error={errors.pr} />

          {/* Camera */}
          <Select name="camera" label="Select room" value={formData.camera} onChange={handleChange} options={["Double","Triple","Quadruple","Quintuple","I don't know yet"]} error={errors.camera} />
          <Textarea name="infoCamera" placeholder="Any additional information (per room)" value={formData.infoCamera} onChange={handleChange} />

          <Textarea name="partecipanti" placeholder="Names and surnames of all room participants" value={formData.partecipanti} onChange={handleChange} error={errors.partecipanti} />

          {/* Pullman */}
          <Select name="pullman" label="Will you take the bus?" value={formData.pullman} onChange={handleChange} options={["Si","No"]} error={errors.pullman} />
          <Textarea name="infoPullman" placeholder="Any additional information (for buses)" value={formData.infoPullman} onChange={handleChange} />

          {/* Gruppo */}
          <Select name="gruppo" label="Select your group" value={formData.gruppo} onChange={handleChange} options={["Ski (full day)","Blended (half day)","No Ski (other activities)"]} error={errors.gruppo} />
          <Textarea name="infoGruppo" placeholder="Any additional information (per group)" value={formData.infoGruppo} onChange={handleChange} />

          {/* Noleggio */}
          <Select name="convenzione" label="Will you use the agreement to rent?" value={formData.convenzione} onChange={handleChange} options={["Yes","No"]} error={errors.convenzione} />

          <div>
            <label className="block text-sm text-neutral-300 mb-2">What do you rent?</label>
            <div className="space-y-2">
              {["Skis and poles", "Boots", "Snowboard"].map((item, i) => (
                <label key={i} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={item}
                    checked={formData.noleggio.includes(item)}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-400 text-blue-500 focus:ring-blue-500"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            {errors.noleggio && <p className="text-red-400 text-sm mt-1">{errors.noleggio}</p>}
          </div>
          <Textarea name="infoNoleggio" placeholder="Any additional information (for rental)" value={formData.infoNoleggio} onChange={handleChange} />

          <Textarea name="infoExtra" placeholder="Any additional information" value={formData.infoExtra} onChange={handleChange} />

          {/* Bottone */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl 
                      bg-white hover:bg-red-700 hover:text-white cursor-pointer
                      transition font-semibold text-red-700 shadow-md disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>

        </form>

        {success && (
          <p className="text-green-400 text-center mt-4">✨ Registration complete! See you in Courma.</p>
        )}
      </div>
    </main>
  );
}

/* ---- COMPONENTI DI SUPPORTO ---- */
function Input({ name, type = "text", placeholder, value, onChange, error }) {
  return (
    <div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-neutral-400 focus:outline-none ${
          error ? "border-2 border-red-500" : "focus:ring-2 focus:ring-blue-500"
        }`}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

function Textarea({ name, placeholder, value, onChange, error }) {
  return (
    <div>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={3}
        className={`w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-neutral-400 focus:outline-none ${
          error ? "border-2 border-red-500" : "focus:ring-2 focus:ring-blue-500"
        }`}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

function Select({ name, label, value, onChange, options, error }) {
  return (
    <div>
      {label && <label className="block text-sm text-neutral-300 mb-1">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-neutral-400 focus:outline-none ${
          error ? "border-2 border-red-500" : "focus:ring-2 focus:ring-blue-500"
        }`}
      >
        <option value="">Select...</option>
        {options.map((opt, i) => (
          <option key={i} value={opt} className="bg-neutral-900 text-white">
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

